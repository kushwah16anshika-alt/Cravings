import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Helper to extract JWT token from cookies or Authorization header
const extractToken = (req, cookieName = "Oreo") => {
  return (
    req.cookies?.[cookieName] ||
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null)
  );
};

// Normal Authentication (Customer / Any User)
export const AuthProtect = async (req, res, next) => {
  try {
    const token = extractToken(req, "Oreo");

    if (!token) {
      const error = new Error("Session Expired");
      error.statusCode = 401;
      return next(error);
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const verifiedUser = await User.findById(decode.id);

    if (!verifiedUser) {
      const error = new Error("Session Expired");
      error.statusCode = 401;
      return next(error);
    }

    req.user = verifiedUser;
    next();
  } catch (error) {
    console.log("AuthProtect error:", error.message);
    const authError = new Error("Session Expired");
    authError.statusCode = 401;
    next(authError);
  }
};

// Forgot Password OTP Authentication
export const OTPAuthProtect = async (req, res, next) => {
  try {
    const token = extractToken(req, "kitkat");

    if (!token) {
      const error = new Error("Session Expired");
      error.statusCode = 401;
      return next(error);
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const verifiedUser = await User.findById(decode.id);

    if (!verifiedUser) {
      const error = new Error("Session Expired");
      error.statusCode = 401;
      return next(error);
    }

    req.user = verifiedUser;
    next();
  } catch (error) {
    console.log("OTPAuthProtect error:", error.message);
    const authError = new Error("Session Expired");
    authError.statusCode = 401;
    next(authError);
  }
};

// Restaurant Authentication
export const RestaurantAuthProtect = async (req, res, next) => {
  try {
    const token = extractToken(req, "Oreo");

    if (!token) {
      const error = new Error("Session Expired");
      error.statusCode = 401;
      return next(error);
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const verifiedUser = await User.findById(decode.id);

    if (!verifiedUser) {
      const error = new Error("Session Expired");
      error.statusCode = 401;
      return next(error);
    }

    if (verifiedUser.userType !== "restaurant") {
      const error = new Error("Unauthorized Access");
      error.statusCode = 403;
      return next(error);
    }

    req.user = verifiedUser;
    next();
  } catch (error) {
    console.log("RestaurantAuthProtect error:", error.message);
    const authError = new Error("Invalid or expired token");
    authError.statusCode = 401;
    next(authError);
  }
};

// Rider Authentication
export const RiderAuthProtect = async (req, res, next) => {
  try {
    const token = extractToken(req, "Oreo");

    if (!token) {
      const error = new Error("Rider authentication required");
      error.statusCode = 401;
      return next(error);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    if (user.userType !== "rider") {
      const error = new Error("Access denied. Rider only.");
      error.statusCode = 403;
      return next(error);
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("RiderAuthProtect error:", error.message);
    const authError = new Error("Invalid or expired token");
    authError.statusCode = 401;
    next(authError);
  }
};

// Admin Authentication
export const AdminAuthProtect = async (req, res, next) => {
  try {
    const token = extractToken(req, "Oreo");

    if (!token) {
      const error = new Error("Admin authentication required");
      error.statusCode = 401;
      return next(error);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    if (user.userType !== "admin") {
      const error = new Error("Access denied. Admin only.");
      error.statusCode = 403;
      return next(error);
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Admin auth error:", error.message);
    const authError = new Error("Invalid or expired token");
    authError.statusCode = 401;
    next(authError);
  }
};