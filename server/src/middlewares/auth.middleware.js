import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Normal Authentication
export const AuthProtect = async (req, res, next) => {
  try {
    const token = req.cookies.Oreo;

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
    console.log(error.message);
    next(error);
  }
};


// Forgot Password OTP Authentication
export const OTPAuthProtect = async (req, res, next) => {
  try {
    const token = req.cookies.kitkat;

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
    console.log(error.message);
    next(error);
  }
};


// Restaurant Authentication
export const RestaurantAuthProtect = async (req, res, next) => {
  try {
    console.log("COOKIES:", req.cookies);

    const token = req.cookies.Oreo;

    console.log("OREO TOKEN:", token);

    if (!token) {
      const error = new Error("Session Expired");
      error.statusCode = 401;
      return next(error);
    }

    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

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
    console.log("AUTH ERROR:", error.message);
    next(error);
  }
};
export const RiderAuthProtect = async (req, res, next) => {
  try {
    const token = req.cookies?.Oreo || req.cookies?.token;

    if (!token) {
      const error = new Error("Rider authentication required");
      error.statusCode = 401;
      return next(error);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check rider role
    if (user.userType !== "rider") {
      const error = new Error("Access denied. Rider only.");
      error.statusCode = 403;
      return next(error);
    }

    // Store logged-in user
    req.user = user;

    next();

  } catch (error) {
    console.log(error.message);

    const authError = new Error("Invalid or expired token");
    authError.statusCode = 401;

    next(authError);
  }
};

// Admin Authentication
export const AdminAuthProtect = async (req, res, next) => {
  try {
    const token = req.cookies?.Oreo || req.cookies?.token;

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