const mongoose = require("mongoose");
const dns = require("node:dns");

// Use public DNS resolvers for MongoDB Atlas SRV lookups.
dns.setServers(["1.1.1.1", "8.8.8.8"]);

let connectionPromise;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (connectionPromise) return connectionPromise;
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured");

  mongoose.set("strictQuery", true);
  // Concurrent cold-start requests share one connection attempt. A failed
  // attempt is cleared so a later request can retry without restarting Node.
  connectionPromise = mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  try {
    return await connectionPromise;
  } finally {
    connectionPromise = undefined;
  }
};

module.exports = connectDB;
