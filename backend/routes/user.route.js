const express = require("express");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");
const UserModel = require("../models/User");
require("dotenv").config();

const router = express.Router();

// const jwtSecret = "secret";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      role,
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

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "8h" });
    res.json({ token,role: user.role, username: user.username });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
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

module.exports = router;
