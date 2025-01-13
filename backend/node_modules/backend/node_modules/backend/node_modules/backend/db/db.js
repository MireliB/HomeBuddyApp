const mongoose = require("mongoose");


// const jwtSecret = crypto.randomBytes(64).toString("base64");

const initMongo = async () => {
  const mongoUrl =
    "mongodb+srv://mireloosh2:XQDNm8EZK39RzoE9@home-buddy.vjsju.mongodb.net/";

  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Mongoose connection error:", error.message);
    process.exit(1); 
  }

  const db = mongoose.connection;
  db.on("connected", () => console.log("Mongoose connected to the database"));
  db.on("error", (err) => console.error("Mongoose connection error:", err));
  db.on("disconnected", () => console.log("Mongoose disconnected"));
};

module.exports = initMongo;
