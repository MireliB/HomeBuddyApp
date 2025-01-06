const mongoose = require("mongoose");

const initMongo = () => {
  const mongoUrl =
    "mongodb+srv://mireloosh2:csIGc5lcsaop3VCh@cluster0.qbs1p.mongodb.net/smart-home-rooms";

  try {
    mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Mongoose error: ", error);
  }
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB Error connections"));
};

module.exports = initMongo;
