import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user.js";

// Verify user token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decode JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      // Check account approval
      if (req.user && req.user.status !== "approved" && req.user.role !== "admin") {
        res.status(403);
        throw new Error("Your account is not approved yet.");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Check admin role
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
};

// Check specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403);
      throw new Error(`Role ${req.user.role} is not authorized to access this route`);
    }
  };
};

// Check staff permissions
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (req.user && (req.user.role === "admin" || req.user.permissions.includes(permission))) {
      next();
    } else {
      res.status(403);
      throw new Error("You do not have permission to perform this action");
    }
  };
};

export { protect, admin, authorize, checkPermission };
