const mongoose =require("mongoose");

const HistoryLogSchema = new mongoose.Schema({
    entityType: {type: String, enum: ["Room", "Device"], required: true},
    entityId: {type: mongoose.Schema.Types.ObjectId, required: false},
    entityName: {type: String, required: true}, 
    changeType: {type: String, enum: ["Create", "Update", "Delete"], required: true},
    changeBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    timestamp: {type: Date, default: Date.now},
})

module.exports = mongoose.model("HistoryLog", HistoryLogSchema);