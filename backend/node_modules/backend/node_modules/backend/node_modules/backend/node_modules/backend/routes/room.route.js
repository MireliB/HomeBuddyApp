const express = require("express");

const authenticate = require("../authenticate/authenticate.auth");
const RoomModel = require("../models/Room");
const DeviceModel = require("../models/Device");

const router = express.Router();

router.post("/room", authenticate, async (req, res) => {
  console.log("Add room request body:", req.body);

  const { name: roomName, roomType, devices = [] } = req.body;
  const userId = req.userId;
  if (!roomName || !roomType) {
    return res.status(400).json({ message: "Name and room type are required" });
  }
  try {
    const existingRoom = await RoomModel.findOne({ name: roomName, user: userId });
    if (existingRoom) {
      return res
        .status(400)
        .json({ message: "Room with this name already exists" });
    }

    const newRoom = new RoomModel({ name: roomName, roomType, user: userId });

    if (devices.length > 0) {
      for (let deviceId of devices) {
        const device = await DeviceModel.findById(deviceId);
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

router.get("/rooms", authenticate, async (req, res) => {
  const userId = req.userId;
  try {
    const rooms = await RoomModel.find({ user: userId }).populate("devices");
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/room/:id", authenticate, async (req, res) => {
  try {
    const room = await RoomModel.findById(req.params.id).populate("devices");
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/room/:id", authenticate, async (req, res) => {
  const { name, roomType, devices } = req.body;
  try {
    const updateRoom = await RoomModel.findByIdAndUpdate(
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

router.delete("/room/:id", authenticate, async (req, res) => {
  const roomId = req.params.id;
  try {
    const room = await RoomModel.findById(roomId).populate("devices");
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    await DeviceModel.deleteMany({ _id: { $in: room.devices } });

    await RoomModel.findByIdAndDelete(roomId);

    res.json({
      message: "Room and associated devices deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting room" });
  }
});


module.exports = router;
