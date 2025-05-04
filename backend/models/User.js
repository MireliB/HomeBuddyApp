const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  email: { type: String, required: true, unique: true},
  password: { type: String, required: false},
  authProvider: {type: String, enum: ["local", "google"], default: "local"}, 
  role: {type: String, required: true, enum: ["admin", "manager", "user"], default:"user"},
  resetToken: { type: String}, 
  resetTokenExpiration:{type: Date},
},
{
  timestamps: true
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
