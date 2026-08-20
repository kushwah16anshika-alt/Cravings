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

    if (verifiedUser.userType !== "restaurant") {
      const error = new Error("Unauthorized Access");
      error.statusCode = 403;
      return next(error);
    }

    req.user = verifiedUser;
    next();

  } catch (error) {
    console.log(error.message);
    next(error);
  }
};