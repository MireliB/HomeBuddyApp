const express = require("express");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/User");

const router = express.Router();

const jwtSecret = "secret";

router.post("/signUp", async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required" });
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
    });
  
    await newUser.save();
    res.status(201).json({message: `User registered successfully ${username}`});
    
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email) {
    return res.status(400).json({ message: "Email and username are required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const userQuery = email ? { email } : username ? { username } : null;
    if (!userQuery) {
      return res.status(400).json({ message: "Email or username is required" });
    }

    const user = await UserModel.findOne(userQuery);
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: `Incorrect password` });
    }
    const token = jwt.sign({ id: user._id, role : user.role }, jwtSecret, { expiresIn: "2h" });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
