import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { genToken, genOTPToken } from "../utils/auth.service.js";
import OTP from "../models/otp.model.js";
import { sendOTPEmail } from "../utils/email.service.js";

export const RegisterUser = async (req, res, next) => {
  try {
    const rawFullname = req.body.fullname || req.body.fullName;
    const rawEmail = req.body.email;
    const { password, phone, gender, dob } = req.body;
    let userType = req.body.userType || "user";
    if (userType === "customer") userType = "user";

    if (
      !rawFullname ||
      !rawEmail ||
      !password ||
      !phone ||
      !gender ||
      !dob ||
      !userType
    ) {
      const error = new Error("All fields Required");
      error.statusCode = 400;
      return next(error);
    }

    const email = rawEmail.toLowerCase().trim();
    const fullname = rawFullname.trim();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("Email already registred");
      error.statusCode = 409;
      return next(error);
    }

    const photoURL = `https://placehold.co/600x400?text=${fullname
      .charAt(0)
      .toUpperCase()}`;

    const photo = {
      url: photoURL,
      publicId: null,
    };

    const SALT = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, SALT);

    await User.create({
      fullname,
      email,
      password: hashedPassword,
      phone,
      gender,
      dob,
      photo,
      userType,
    });

    res.status(201).json({
      message: "User Created Successfully",
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const LoginUser = async (req, res, next) => {
  try {
    const rawEmail = req.body.email;
    const { password } = req.body;

    if (!rawEmail || !password) {
      const error = new Error("All fields Required");
      error.statusCode = 400;
      return next(error);
    }

    const email = rawEmail.toLowerCase().trim();
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const error = new Error("Email not registred");
      error.statusCode = 404;
      return next(error);
    }

    const isVerified = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isVerified) {
      const error = new Error("Incorrect Password");
      error.statusCode = 401;
      return next(error);
    }

    await genToken(existingUser, res);

    res.status(200).json({
      message: "Welcome Back",
      data: existingUser,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const LogoutUser = async (req, res, next) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("Oreo", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    res.status(200).json({
      message: "Logout Sucessfully",
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const SendOtp = async (req, res, next) => {
  try {
    const rawEmail = req.body.email;

    if (!rawEmail) {
      const error = new Error("Email is required");
      error.statusCode = 400;
      return next(error);
    }

    const email = rawEmail.toLowerCase().trim();
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const error = new Error("Email not registered");
      error.statusCode = 404;
      return next(error);
    }

    // Generate OTP
    const newOTP = (
      Math.floor(Math.random() * 1000000) + 100000
    )
      .toString()
      .slice(0, 6);

    // Hash OTP
    const hashedOTP = await bcrypt.hash(newOTP, 10);

    // Delete old OTP if exists
    const existingOTP = await OTP.findOne({ email });

    if (existingOTP) {
      await existingOTP.deleteOne();
    }

    // Save new OTP
    await OTP.create({
      email,
      otp: hashedOTP,
    });

    // Send OTP through email
    const recipientName = existingUser.fullname || existingUser.fullName || "User";
    await sendOTPEmail(email, newOTP, recipientName);

    res.status(200).json({
      message: `OTP sent on '${email}'`,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const VerifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      const error = new Error("Email and OTP required");
      error.statusCode = 400;
      return next(error);
    }

    const existingOTP = await OTP.findOne({ email });

    if (!existingOTP) {
      const error = new Error("OTP Expired");
      error.statusCode = 401;
      return next(error);
    }

    const isVerified = await bcrypt.compare(
      otp,
      existingOTP.otp
    );

    if (!isVerified) {
      const error = new Error("Invalid OTP");
      error.statusCode = 401;
      return next(error);
    }

    // Delete OTP after successful verification
    await existingOTP.deleteOne();

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const error = new Error("Email not registered");
      error.statusCode = 404;
      return next(error);
    }

    // Generate token for password reset
    await genOTPToken(existingUser, res);

    res.status(200).json({
      message: "OTP verified. Create Your New Password Now",
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const ResetPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      const error = new Error("New Password Required");
      error.statusCode = 400;
      return next(error);
    }

    const currentUser = req.user;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    currentUser.password = hashedPassword;

    await currentUser.save();

    res.status(200).json({
      message: "Password Changed",
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};