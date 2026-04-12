const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// PROTECT
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      const err = new Error("Not authorized, no token");
      err.statusCode = 401;
      return next(err);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 401;
      return next(err);
    }

    req.user = user;

    next();
  } catch (error) {
    const err = new Error("Not authorized, token failed");
    err.statusCode = 401;
    next(err);
  }
};

// ROLE AUTH
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      const err = new Error("Not authorized");
      err.statusCode = 401;
      return next(err);
    }

    if (!roles.includes(req.user.role)) {
      const err = new Error(`Role (${req.user.role}) not allowed`);
      err.statusCode = 403;
      return next(err);
    }

    next();
  };
};

module.exports = { protect, authorizeRoles };