const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  const secret = process.env.JWT_SECRET;

  try {
    const token = req.cookies.token; 
    if (!token) {
      return res.status(401).json({ success: false, msg: "Token not provided" });
    }
   
    let decoded;
    try {
      decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });
    } catch (err) {
      if (err.name === "TokenExpiredError") {
       
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          return res.status(401).json({ success: false, msg: "Token expired" });
        }

        try {
          const refreshDecoded = jwt.verify(refreshToken, secret, { algorithms: ["HS256"] });
          const newToken = jwt.sign({ id: refreshDecoded.id }, secret, { expiresIn: "1d" });
          await User.findByIdAndUpdate(refreshDecoded.id, { token: newToken });
     
          res.cookie("token", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, 
          });
          req.user = await User.findById(refreshDecoded.id);
          return next();

        } catch (refreshErr) {
          return res.status(401).json({ success: false, msg: "Refresh token expired or invalid" });
        }
      }

      return res.status(401).json({ success: false, msg: "Invalid token" });
    }

    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ success: false, msg: "User not found" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ success: false, msg: "Server error", error: err.message });
  }
};

module.exports = verifyToken;
