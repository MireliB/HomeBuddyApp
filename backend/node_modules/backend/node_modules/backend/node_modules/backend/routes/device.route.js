const express = require("express");

const router = express.Router();

const Device = require("../models/Device.model");
const Room = require("../models/Room.model");

const authenticate = require("../authenticate/authenticate.auth");

router.post("/device", authenticate, async (req, res) => {
  const { name, status, room } = req.body;
  const userId = req.userId;

  try {
    const newDevice = new Device({ name, status, room, user: userId });

    await newDevice.save();

    const associatedRoom = await Room.findById(room);
    associatedRoom.devices.push(newDevice._id);

    await associatedRoom.save();

    res.json(newDevice);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/devices", authenticate, async (req, res) => {
  const userId = req.userId;
  try {
    const devices = await Device.find({ user: userId });

    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/device/:id", authenticate, async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    res.json(device);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/device/:id", authenticate, async (req, res) => {
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

router.delete("/device/:id", authenticate, async (req, res) => {
  try {
    await Device.findByIdAndDelete(req.params.id);
    res.json({ message: "Device deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
