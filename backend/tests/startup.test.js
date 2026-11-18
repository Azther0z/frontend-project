const { test } = require("node:test");
const assert = require("node:assert/strict");
const { once } = require("node:events");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

test("API requests wait for MongoDB and recover after a failed connection", async () => {
  const database = await MongoMemoryServer.create();
  process.env.MONGO_URI = database.getUri("startup-test");
  process.env.PORT = "0";
  process.env.HOST = "127.0.0.1";
  process.env.NODE_ENV = "test";
  let attempts = 0;
  const originalConnect = mongoose.connect;
  mongoose.connect = function (...args) {
    attempts += 1;
    return originalConnect.apply(this, args);
  };

  const entry = require("../server");
  const { server } = entry;
  try {
    assert.equal(typeof entry, "function", "Vercel receives a callable Express entry point");
    if (!server.listening) await once(server, "listening");
    const origin = `http://127.0.0.1:${server.address().port}`;
    const responses = await Promise.all(Array.from({ length: 4 }, () =>
      fetch(`${origin}/api/v1/equipment`)));
    for (const response of responses) {
      assert.equal(response.status, 200);
      assert.deepEqual((await response.json()).data, []);
    }
    assert.equal(attempts, 1, "concurrent requests reuse the startup connection");

    await mongoose.disconnect();
    const realUri = process.env.MONGO_URI;
    // Force a rejected connection without spending ten seconds on a timeout.
    process.env.MONGO_URI = "invalid://unavailable";
    const unavailable = await fetch(`${origin}/api/v1/equipment`);
    assert.equal(unavailable.status, 503);
    assert.deepEqual(await unavailable.json(), {
      success: false,
      error: "Database unavailable. Please try again later.",
    });
    assert.equal((await fetch(`${origin}/health`)).status, 200);

    process.env.MONGO_URI = realUri;
    const recovered = await fetch(`${origin}/api/v1/equipment`);
    assert.equal(recovered.status, 200);
    assert.deepEqual((await recovered.json()).data, []);
    assert.equal(attempts, 3, "a later request retries after connection failure");
  } finally {
    mongoose.connect = originalConnect;
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    await mongoose.disconnect();
    await database.stop();
  }
});
