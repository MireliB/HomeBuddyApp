require("dotenv").config();
const mongoose = require("mongoose");

const initMongo = async () => {
  try {
    const connect =  await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected successfully:, ${connect.connection.host}, ${connect.connection.name}` );
  } catch (error) {
    console.error("❌ Mongoose connection error:", error.message);
    process.exit(1); 
  }

  const db = mongoose.connection;
  db.on("connected", () => console.log("🔹 Mongoose connected to the database"));
  db.on("error", (err) => console.error("❗ Mongoose connection error:", err));
  db.on("disconnected", () => console.log("⚠️ Mongoose disconnected"));
};

module.exports = initMongo;
