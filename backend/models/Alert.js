const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  message: String,
  type: {
    type: String,
    enum: ["create", "update", "delete"],
    default: "update",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
  },
});

const AlertModel = mongoose.model("Alert", alertSchema);

module.exports = AlertModel;
