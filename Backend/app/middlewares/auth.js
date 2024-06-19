const jwt = require("jsonwebtoken");
const User = require("../models/users");
const asyncHandler = require("express-async-handler");
require('dotenv').config();

const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization; // Correctly access the authorization header
  console.log("auth",authHeader)

  if (authHeader) {
    token = authHeader.split(" ")[1];
    console.log("Token:", token);

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log("Decoded:", decoded);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.log("No token found");
    res.status(401).json({ message: "Not authorized, no token" });
  }
});

module.exports = { protect };
