const mongoose = require("mongoose");

const initMongo = () => {
mongoose
  .connect("mongodb://localhost:27017/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

};
// const initMongo = () => {
//   const mongoUrl =
//     "mongodb+srv://mireloosh2:csIGc5lcsaop3VCh@cluster0.qbs1p.mongodb.net/smart-home-rooms";

//   try {
//     mongoose.connect(mongoUrl, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("MongoDB connected successfully");
//   } catch (error) {
//     console.log("Mongoose error: ", error);
//   }
//   const db = mongoose.connection;
//   db.on("error", console.error.bind(console, "MongoDB Error connections"));
// };

module.exports = initMongo;
