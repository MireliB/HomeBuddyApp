const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();

const authRoutes = require("./routes/user.route");
const roomRoutes = require("./routes/room.route");
const deviceRoutes = require("./routes/device.route");
const adminRoutes = require('./routes/adminVerify.route');
const initMongo = require("./db/db");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

initMongo();

app.use("/", adminRoutes);
app.use("/",authRoutes);
app.use("/", roomRoutes);
app.use("/", deviceRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
