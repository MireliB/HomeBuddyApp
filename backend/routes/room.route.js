const express = require("express");

const RoomModel = require("../models/Room");
const DeviceModel = require("../models/Device");

const authenticate = require("../middleware/authenticate");

const router = express.Router();

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
    await newRoom.save();
    
    if (devices.length > 0) {
      const validDevices = await DeviceModel.find({_id: {$in: devices}});

      if(validDevices.length !== devices.length){
        return res.status(400).json({message: "Some devices were not found"});
      }

      newRoom.devices = validDevices.map(device => device.id);
      await Promise.all(
        validDevices.map((device) => device.updateOne({ room: newRoom._id }))
      );
    }
    
    await newRoom.save();
    res.json(newRoom);
  } catch (err) {
    res.status(500).json({ message: "Error adding room:", err: err.message });
  }
});

router.get("/rooms", authenticate, async (req, res) => {
  const userId = req.userId;
  try {
    const rooms = await RoomModel.find({ user: userId }).populate("devices");
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/room/:id", authenticate, async (req, res) => {
  try {
    const room = await RoomModel.findById(req.params.id).populate("devices");
    
    if(!room){
      return res.status(404).json({message: "Room not found"});
    }
    
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(updateRoom);
  } catch (error) {
    res.status(500).json({ message: "Error updating room: ", error });
  }
});

router.delete("/room/:id", authenticate, async (req, res) => {
  const roomId = req.params.id;
  
  try {
    const room = await RoomModel.findById(roomId).populate("devices");
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    await DeviceModel.updateMany(
      { _id: { $in: room.devices } },
      { $unset: { room: "" } }
    );
    // await DeviceModel.deleteMany({ _id: { $in: room.devices } });

    await RoomModel.findByIdAndDelete(roomId);

    res.json({
      message: "Room deleted successfully, devices unlinked.",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting room: ", error });
  }
});

module.exports = router;
