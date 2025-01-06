const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const Room = require("./models/Room.model");

const authenticate = require("../authenticate/authenticate.auth");

router.post("/room", authenticate, async (req, res) => {
  const { roomName, roomType } = req.body;
  const userId = req.userId;

  if (!roomName || !roomType) {
    return res.status(400).json({ message: "Name and room type are required" });
  }
  try {
    const newRoom = new Room({ name: roomName, roomType, user: userId });

    await newRoom.save();

    res.json(newRoom);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/rooms", authenticate, async (req, res) => {
  const userId = req.userId;
  try {
    const rooms = await Room.find({ user: userId }).populate("devices");

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/room/:id", authenticate, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("devices");

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/room/:id", authenticate, async (req, res) => {
  try {
    await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json({ message: "Room updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/room/:id", authenticate, async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);

    if (!deletedRoom) {
      return res.status(404).send({ error: "Room not found" });
    }
    res.status(200).send({ message: "Room deleted successfully" });
    res.json({ message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
