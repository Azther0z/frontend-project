// Disposable demo: a real local MongoDB process; data is removed on shutdown.
const { MongoMemoryServer } = require("mongodb-memory-server");
const { randomBytes } = require("node:crypto");
const mongoose = require("mongoose");

async function main() {
  const database = await MongoMemoryServer.create();
  process.env.MONGO_URI = database.getUri("equipment-rental-demo");
  process.env.JWT_SECRET = randomBytes(32).toString("hex");
  process.env.JWT_EXPIRE = "1d";
  process.env.JWT_COOKIE_EXPIRE = "1";
  process.env.NODE_ENV = "development";
  process.env.HOST = "127.0.0.1";

  const { server } = require("../server");
  let closing = false;
  async function close() {
    if (closing) return;
    closing = true;
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    await mongoose.disconnect();
    await database.stop();
  }
  process.once("SIGINT", () => close().then(() => process.exit(0)));
  process.once("SIGTERM", () => close().then(() => process.exit(0)));

  await mongoose.connection.asPromise();
  const User = require("../models/User");
  const Equipment = require("../models/Equipment");
  const [member, , , tripod] = await Promise.all([
    User.create({ name: "Demo Member", email: "member@example.com", tel: "0800000001", role: "member", password: "DemoPass123!" }),
    User.create({ name: "Demo Admin", email: "admin@example.com", tel: "0800000002", role: "admin", password: "DemoPass123!" }),
    Equipment.create({ name: "Camera", category: "Photography", description: "Digital camera with a lens and carrying case.", quantity: 3, rentalRate: 100 }),
    Equipment.create({ name: "Tripod", category: "Photography", description: "Adjustable tripod for cameras.", quantity: 2, rentalRate: 50 }),
  ]);
  const startDate = new Date();
  startDate.setUTCHours(0, 0, 0, 0);
  const returnDate = new Date(startDate);
  returnDate.setUTCDate(returnDate.getUTCDate() + 2);
  await require("../models/Rental").create({ equipment: tripod.id, user: member.id, quantity: 1, startDate, returnDate });
  console.log("Demo ready. member@example.com / admin@example.com; password: DemoPass123!");
  console.log("This database is temporary. Stop the process to remove its data.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
