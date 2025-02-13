const admin  = require("firebase-admin");
const express =require("express");
const router = express.Router();

router.post("/verify-token", async (req, res) => {
    const { token } = req.body;
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      res.json({ success: true, user: decodedToken });
    } catch (error) {
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  });


  module.exports = router;