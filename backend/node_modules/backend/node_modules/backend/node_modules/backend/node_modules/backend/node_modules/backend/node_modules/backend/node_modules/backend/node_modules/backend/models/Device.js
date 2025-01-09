const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  status: { type: String, required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required:true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const DeviceModel = mongoose.model("Device", deviceSchema);

module.exports = DeviceModel;