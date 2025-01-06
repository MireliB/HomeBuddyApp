const express = require("express");
const cors = require("cors");
const authenticate = require("./authenticate/authenticate.auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const User = require("./models/User");
const Device = require("./models/Device");
const Room = require("./models/Room");

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

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

const jwtSecret = process.env.JWT_SECRET || "secret";

// Routes
app.post("/signUp", async (req, res) => {
  const { email, password } = req.body;
  console.log("signUp request body:", req.body);
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("login request body:", req.body);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "8h" });
    res.json({ token });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/room", authenticate, async (req, res) => {
  console.log("Add room request body:", req.body);

  const { name: roomName, roomType, devices = [] } = req.body;
  const userId = req.userId;
  if (!roomName || !roomType) {
    return res.status(400).json({ message: "Name and room type are required" });
  }
  try {
    const existingRoom = await Room.findOne({ name: roomName, user: userId });
    if (existingRoom) {
      return res
        .status(400)
        .json({ message: "Room with this name already exists" });
    }

    const newRoom = new Room({ name: roomName, roomType, user: userId });

    if (devices.length > 0) {
      for (let deviceId of devices) {
        const device = await Device.findById(deviceId);
        if (device && !newRoom.devices.includes(device._id)) {
          newRoom.devices.push(device._id);
          await device.updateOne({ room: newRoom._id });
        }
      }
    }

    await newRoom.save();
    res.json(newRoom);
  } catch (err) {
    console.error("Error adding room:", err);

    res.status(500).json({ message: "Server error", err: err.message });
  }
});

app.get("/rooms", authenticate, async (req, res) => {
  const userId = req.userId;
  try {
    const rooms = await Room.find({ user: userId }).populate("devices");
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/room/:id", authenticate, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("devices");
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/room/:id", authenticate, async (req, res) => {
  const { name, roomType, devices } = req.body;
  try {
    const updateRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { name, roomType, devices },
      {
        new: true,
      }
    );
    if (!updateRoom) {
      res.status(404).json({ message: "Room not found" });
    }
    res.json(updateRoom);
  } catch (error) {
    console.error("Error updating room: ", error);

    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/room/:id", authenticate, async (req, res) => {
  const roomId = req.params.id;
  try {
    const room = await Room.findById(roomId).populate("devices");
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    await Device.deleteMany({ _id: { $in: room.devices } });

    await Room.findByIdAndDelete(roomId);

    res.json({
      message: "Room and associated devices deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting room" });
  }
});

app.post("/device", authenticate, async (req, res) => {
  const { name, status, room } = req.body;
  const userId = req.userId;

  try {
    let existingDevice = await Device.findOne({ name, user: userId });

    if (existingDevice) {
      return res.status(400).json({ message: "Device name already exist" });
    }

    const newDevice = new Device({ name, status, room, user: userId });
    await newDevice.save();

    const associatedRoom = await Room.findById(room);
    if (associatedRoom) {
      if (!associatedRoom.devices.includes(newDevice._id)) {
        associatedRoom.devices.push(newDevice._id);
        await associatedRoom.save();
      }
    }

    res.json(newDevice);
  } catch (error) {
    console.error("Error adding device:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/devices", authenticate, async (req, res) => {
  const userId = req.userId;
  try {
    const devices = await Device.find({ user: userId });
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/device/:id", authenticate, async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    res.json(device);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/device/:id", authenticate, async (req, res) => {
  try {
    const updatedDevice = await Device.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedDevice);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/device/:id", authenticate, async (req, res) => {
  try {
    await Device.findByIdAndDelete(req.params.id);
    res.json({ message: "Device deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
