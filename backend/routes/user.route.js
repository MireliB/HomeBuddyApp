const express = require("express");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authenticate = require("../middleware/authenticate");

const UserModel = require("../models/User");
const DeviceModel = require("../models/Device");
const RoomModel = require("../models/Room");
const AlertModel = require("../models/Alert");

require("dotenv").config();

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const managerEmail = process.env.MANAGER_EMAIL; 
router.post("/signUp", async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already taken" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let finalRole = role; 

    if(email === managerEmail ){
      finalRole = "manager";
    }

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      role: finalRole,
    });

    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email) {
    return res.status(400).json({ message: "Email and username are required" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const userQuery = email ? { email } : username ? { username } : null;
    if (!userQuery) {
      return res.status(404).json({ message: `user ${username} not found` });
    }

    const user = await UserModel.findOne(userQuery);
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    if(user.email === managerEmail && user.role !== "manager"){
      user.role = "manager"; 
      await user.save();
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "8h" });
    res.json({ token,role: user.role, username: user.username });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/google-auth", async (req, res) => {
  const { email, username } = req.body;

  if (!email || !username) {
    return res.status(400).json({ message: "Missing email or username" });
  }

  try {
    let user = await UserModel.findOne({ email });

    if (!user) {
      const isManager = email === process.env.MANAGER_EMAIL;

      user = new UserModel({
        email,
        username,
        password: "",
        role: isManager ? "manager" : "user",
      });

      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/manager", (req, res)=>{
  res.json({message: "Welcome Manager"});
})

router.get("/admin", authenticate,  (req, res)=>{
  res.json({message: "Welcome Admin"});
})

router.get("/user",authenticate, (req, res)=>{
  res.json({message: "Welcome User"});
})

router.get("/system-statistics",authenticate, async (req, res) => {
  try{
    const user = await UserModel.findById(req.userId); 
    if(!user) return res.status(404).json({ message: "User not found" });

    if(user.role !== "manager" && user.email !== managerEmail) {
      return res.status(403).json({ message: "Access denied. Manager Only" });
    }
    const totalUsers = await UserModel.countDocuments();
    const activeDevices = await DeviceModel.countDocuments({status:"ON"});
    const totalRooms = await RoomModel.countDocuments();
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const alertsToday = await AlertModel.countDocuments({createdAt: {$gte: today}});

    res.json({totalUsers, activeDevices, totalRooms, alertsToday});
  }catch(err){
    console.error("Error fetching system statistics:", err);
    res.status(500).json({ message: "Server error", error: err.message });
    
  }
})

module.exports = router;
