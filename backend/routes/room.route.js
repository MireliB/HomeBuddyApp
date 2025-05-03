const express = require("express");

const RoomModel = require("../models/Room");
const DeviceModel = require("../models/Device");

const authenticate = require("../middleware/authenticate");
const AlertModel = require("../models/Alert");

const router = express.Router();

async function validateDevices(deviceIds) {
  if (!Array.isArray(deviceIds) || deviceIds.length === 0) {
    return [];
  }
  const validDevices = await DeviceModel.find({
    _id: { $in: deviceIds },
  }).lean();
  if (validDevices.length !== deviceIds.length) {
    throw new Error("Some devices were not found");
  }
  return validDevices;
}

router.post("/room", authenticate, async (req, res) => {
  const { name: roomName, roomType, devices = [] } = req.body;
  const userId = req.userId;

  if (!roomName || !roomType) {
    return res.status(400).json({ message: "Name and room type are required" });
  }

  try {
    const existingRoom = await RoomModel.findOne({
      name: roomName,
      user: userId,
    });
    if (existingRoom) {
      return res
        .status(400)
        .json({ message: "Room with this name already exists" });
    }

    const newRoom = new RoomModel({ name: roomName, roomType, user: userId });

    if (devices.length > 0) {
      const validDevices = await validateDevices(devices);
      newRoom.devices = validDevices.map((device) => device.id);
      await Promise.all(
        validDevices.map((device) => device.updateOne({ room: newRoom._id }))
      );
    }

    await newRoom.save();

    await AlertModel.create({
      message: `Room ${roomName} created successfully`,
      deviceId: devices.length > 0 ? devices[0] : null,
      roomId: newRoom._id,
      type: "create", 
    });

    res.json(newRoom);
  } catch (err) {
    res.status(500).json({ message: "Error adding room", error: err.message });
  }
});

router.get("/rooms", authenticate, async (req, res) => {
  try {
    const rooms = await RoomModel.find({ user: req.userId }).populate(
      "devices"
    );
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/room/:id", authenticate, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid room ID format" });
    }

    const room = await RoomModel.findOne({
      _id: req.params.id,
      user: req.userId,
    }).populate("devices");

    if (!room) {
      return res
        .status(404)
        .json({ message: "Room not found or access denied" });
    }

    res.json(room);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch room", error: error.message });
  }
});

router.put("/room/:id", authenticate, async (req, res) => {
  const { name, roomType, devices } = req.body;
  const userId = req.userId;

  if (!name || !roomType) {
    return res.status(400).json({ message: "Name and room type are required" });
  }

  try {
    const room = await RoomModel.findOne({ _id: req.params.id, user: userId });
    if (!room) {
      return res
        .status(404)
        .json({ message: "Room not found or access denied" });
    }

    room.name = name;
    room.roomType = roomType;

    if (Array.isArray(devices)) {
      const validDevices = await validateDevices(devices);
      room.devices = validDevices.map((device) => device.id);

      await DeviceModel.updateMany(
        { _id: { $in: devices } },
        { room: room._id }
      );
    } else {
      room.devices = [];
    }

    await room.save();

    await AlertModel.create({
      message: `Room ${name} updated successfully`, 
      roomId: room._id,
      type: "update", 
    })

    res.json(room);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating room", error: error.message });
  }
});

router.delete("/room/:id", authenticate, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid room ID format" });
    }

    const room = await RoomModel.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!room) {
      return res
        .status(404)
        .json({ message: "Room not found or access denied" });
    }

    await DeviceModel.updateMany(
      { _id: { $in: room.devices } },
      { $unset: { room: "" } }
    );

    await room.deleteOne();

    await AlertModel.create({
      message: `Room ${room.name} deleted successfully`, 
      roomId: room._id,
      type: "delete", 
    })
    res.json({ message: "Room deleted successfully, devices unlinked." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting room", error: error.message });
  }
});

module.exports = router;
