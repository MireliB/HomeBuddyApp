const express = require("express");

const router = express.Router();

const authenticate = require("../authenticate/authenticate.auth");

const RoomModel = require("../models/Room");
const DeviceModel = require("../models/Device");

router.post("/device", authenticate, async (req, res) => {
  const { name, status, room } = req.body;
  const userId = req.userId;

  if (!name || !status || !room) {
    return res.status(400).json({ message: "Name, status, and room are required" });
  }

  try {
    const newDevice = new DeviceModel({ name, status, room, user: userId });
    await newDevice.save();

    const associatedRoom = await RoomModel.findById(room);
    if (associatedRoom) {
      associatedRoom.devices.push(newDevice._id);
      await associatedRoom.save();
    }

    res.json(newDevice);
  } catch (error) {
    console.error("Error adding device:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/devices", authenticate, async (req, res) => {
  const userId = req.userId;
  try {
    const devices = await DeviceModel.find({ user: userId });
    res.json(devices);
  } catch (err) {
    console.error("Error fetching devices:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/device/:id", authenticate, async (req, res) => {
  try {
    const device = await DeviceModel.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }
    res.json(device);
  } catch (error) {
    console.error("Error fetching device:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/device/:id", authenticate, async (req, res) => {
  try {
    const updatedDevice = await DeviceModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedDevice) {
      return res.status(404).json({ message: "Device not found" });
    }
    res.json(updatedDevice);
  } catch (error) {
    console.error("Error updating device:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/device/:id", authenticate, async (req, res) => {
  try {
    const deletedDevice = await DeviceModel.findByIdAndDelete(req.params.id);
    if (!deletedDevice) {
      return res.status(404).json({ message: "Device not found" });
    }
    res.json({ message: "Device deleted" });
  } catch (error) {
    console.error("Error deleting device:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;