const jwt = require("jsonwebtoken");

require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET || "secret";

if (!jwtSecret) {
  throw new Error(
    "Missing JWT_SECRET in environment variables. Server shutting down."
  );
}
const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.id;
    
    next();
  } catch (error) {
    let errorMessage = "Invalid token";
    if (error.name === "TokenExpiredError") {
      errorMessage = "Token expired";
    } else if (error.name === "JsonWebTokenError") {
      errorMessage = "Invalid token signature";
    }
    return res.status(401).json({ message: errorMessage });
  }
};

module.exports = authenticate;
