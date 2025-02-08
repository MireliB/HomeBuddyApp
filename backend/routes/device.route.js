const express = require("express");

const router = express.Router();

const RoomModel = require("../models/Room");
const DeviceModel = require("../models/Device");

const authenticate = require("../middleware/authenticate");

router.post("/device", authenticate, async (req, res) => {
  const { name, status, room } = req.body;
  const userId = req.userId;

  try {
    const associatedRoom = await RoomModel.findOne({ _id: room, user: userId });

    if (!associatedRoom) {
      return res.status(403).json({ message: "Access denied to this room" });
    }

    const newDevice = new DeviceModel({ name, status, room, user: userId });
    await newDevice.save();

    associatedRoom.devices.push(newDevice._id);
    await associatedRoom.save();

    res.status(201).json(newDevice);

  } catch (error) {
    console.error("Error adding device:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/devices", authenticate, async (req, res) => {
  const userId = req.userId;
  try {
    const devices = await DeviceModel.find({ user: userId });
    res.json(devices);
  } catch (err) {
    console.error("Error fetching devices:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

router.get("/device/:id", authenticate, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid device ID format" });
    }

    const device = await DeviceModel.findOne({
      _id: req.params.id,
      user: req.userId,
    });
    if (!device) {
      return res
        .status(404)
        .json({ message: "Device not found or access denied" });
    }
    res.json(device);
  } catch (error) {
    console.error("Error fetching device:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/device/:id", authenticate, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid device ID format" });
    }

    const updatedDevice = await DeviceModel.findByIdAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );

    if (!updatedDevice) {
      return res
        .status(404)
        .json({ message: "Device not found or access denied" });
    }

    res.json(updatedDevice);
  } catch (error) {
    console.error("Error updating device:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/device/:id", authenticate, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid device ID format" });
    }

    const device = await DeviceModel.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!device) {
      return res
        .status(404)
        .json({ message: "Device not found or access denied" });
    }

    await RoomModel.updateOne(
      { _id: device.room },
      { $pull: { devices: device._id } }
    );

    res.json({ message: "Device deleted and unlinked from room" });
  } catch (error) {
    console.error("Error deleting device:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
