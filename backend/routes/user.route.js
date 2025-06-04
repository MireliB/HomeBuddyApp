const express = require("express");

const crypto = require("crypto");
const nodemailer = require("nodemailer");
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
      isActive: true,
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

  if (!email || !username ) {
    return res.status(400).json({ message: "Missing Email and Usesername" });
  }

  try {
    let user = await UserModel.findOne({ email });

    if (!user) {
      const isManager = email === process.env.MANAGER_EMAIL;

      user = new UserModel({
        email,
        username,
        role: isManager ? "manager" : "user",
        authProvider: "google",
        isActive: true,
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

router.post("/forgot-password", async (req, res)=>{
  const {email} = req.body;
  try{
    const user = await UserModel.findOne({email});
    if(!user) return res.status(404).json({message: "User not found"});

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token; 
    user.resetTokenExpiration = Date.now() + 3600000; 
    await user.save();

    // doesnt work - sends a server error - need to be fixed
    
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    const link = `http://localhost:3000/reset-password/${token}`;
    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click <a href="${link}">here</a> to reset your password.</p>`,
    });

    res.json({message: "Password reset link sent to your email"});

  }catch(err){
    res.status(500).json({message: "Server error", error: err.message});
  }
})

// doesnt work - need to fix with the forgot-password
router.post("/reset-password/:token", async (req, res)=>{
  const {token} = req.params;
  const {password} = req.body;

  try{
    const user = await UserModel.findOne({
      resetToken: token,
      resetTokenExpiration: {$gt: Date.now()}
    });

    if(!user) return res.status(404).json({message: "Invalid or expired token"});

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined; 
    user.resetTokenExpiration = undefined; 
    
    await user.save();

    res.json({message: "Password reset successfully"});

  }catch(err){
    res.status(500).json({message: "Server error", error: err.message});
  }
})

// system stats get router
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

// alerts get router
router.get("/alerts", authenticate, async (req, res) =>  {
  try{
    const userId = req.userId;

    const userDevices = await DeviceModel.find({user: userId}).select("_id");

    const deviceIds = userDevices.map((device)=> device._id); 
    const alerts = await AlertModel.find({deviceId: {$in: deviceIds}}).populate("deviceId", "name status").sort({createdAt: -1}).limit(10);

    const formattedAlerts = alerts.map(alert =>({
      id: alert._id, 
      message: alert.message, 
      createdAt: alert.createdAt,
      type: alert.type,
      severity: alert.deviceId?.status === 'OFF' ? "red" : "orange", 
      deviceName: alert.deviceId?.name, 
    }));

    res.json(formattedAlerts); 

  }catch(err){
    console.error("Error fetching alerts:", err);
    res.status(500).json({ message: "Server error", error: err.message });
    
  }
})

// clients get router
router.get("/clients", authenticate, async(req, res)=>{
  try{
    const user = await UserModel.find().select("_id username email role createdAt");
    res.json(user);

  }catch(err){
    console.error("Error fetching clients:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
})

router.get("/clients/statistics", authenticate, async(req, res)=>{
  try{
    const totalUsers = await UserModel.countDocuments();
    const newUsers = await UserModel.countDocuments({createdAt: {
      $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }});

    const activeUsers = await UserModel.countDocuments({isActive: true});
    const inactiveUsers = await UserModel.countDocuments({isActive: false});
    const canceledUsers = await UserModel.countDocuments({role: "canceled", isActive: false});

    res.json({
      totalUsers,
      newUsers,
      activeUsers,
      inactiveUsers,
      canceledUsers,
    })
  }catch(err){
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/clients/:id", authenticate, async (req, res)=>{
  const {id} = req.params; 
  const {username, email, role, isActive} = req.body;

  try{
    const updatedClient = await UserModel.findByIdAndUpdate(
      id, 
      {  username, email, role, isActive},
      {  new: true}
    );

    if(!updatedClient){
      return res.status(404).json({message: "Client not found" }); 
    }
    res.json(updatedClient);

  }catch(err){
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/clients/:id", authenticate, async (req, res)=>{
  const {id} = req.params; 

  try{
    const deletedClient = await UserModel.findByIdAndDelete( id);
    if(!deletedClient) {
      return res.status(404).status({message: "Client not found"});
    }
    res.json({message: "Client deleted successfully"});

  }catch(err){
    res.status(500).json({message: "Server error", error: err.message});
  }
})

module.exports = router;
