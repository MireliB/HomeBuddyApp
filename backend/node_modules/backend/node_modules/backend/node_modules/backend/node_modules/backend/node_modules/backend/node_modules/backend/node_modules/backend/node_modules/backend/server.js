const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/user.route");
const roomRoutes = require("./routes/room.route");
const deviceRoutes = require("./routes/device.route");

const initMongo = require("./db/db");

const app = express();
const PORT = 4000;

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

app.use("/",authRoutes);
app.use("/", roomRoutes);
app.use("/", deviceRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
