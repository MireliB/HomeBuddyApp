const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roomType: { type: String, required: true },
  devices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Device" }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});
const RoomModel =  mongoose.model("Room", roomSchema);

module.exports = RoomModel; 
