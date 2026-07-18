import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { genToken, genOTPToken } from "../utils/auth.service.js";
import OTP from "../models/otp.model.js";
import { sendOTPEmail } from "../utils/email.service.js";

export const RegisterUser = async (req, res, next) => {
  try {
    const { fullName, email, password, phone, gender, dob, userType } =
      req.body;

    if (
      !fullName ||
      !email ||
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

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("Email already registred");
      error.statusCode = 409;
      return next(error);
    }

    const photoURL = `https://placehold.co/600x400?text=${fullName
      .charAt(0)
      .toUpperCase()}`;

    const photo = {
      url: photoURL,
      publicId: null,
    };

    const SALT = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, SALT);

    await User.create({
      fullName,
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
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("All fields Required");
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const error = new Error("Email not registred");
      error.statusCode = 404;
      return next(error);
    }

    const isVerified = await bcrypt.compare(password, existingUser.password);

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
    res.clearCookie("Oreo", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Logout Successfully",
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const SendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      const error = new Error("Email is required");
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const error = new Error("Email not registered");
      error.statusCode = 404;
      return next(error);
    }

    if (existingUser.lastPasswordChange) {
      const hoursSinceLastChange =
        (new Date() - new Date(existingUser.lastPasswordChange)) /
        (1000 * 60 * 60);

      if (hoursSinceLastChange < 24) {
        const error = new Error(
          "You can only change your password once every 24 hours"
        );
        error.statusCode = 400;
        return next(error);
      }
    }

    const newOTP = (Math.floor(Math.random() * 1000000) + 100000)
      .toString()
      .slice(0, 6);

    const hashedOTP = await bcrypt.hash(newOTP, 10);

    const existingOTP = await OTP.findOne({ email });

    if (existingOTP) {
      await existingOTP.deleteOne();
    }

    await OTP.create({
      email,
      otp: hashedOTP,
    });

    await sendOTPEmail(email, newOTP, existingUser.fullName);

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

    const isVerified = await bcrypt.compare(otp, existingOTP.otp);

    if (!isVerified) {
      const error = new Error("Invalid OTP");
      error.statusCode = 401;
      return next(error);
    }

    await existingOTP.deleteOne();

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const error = new Error("Email not registered");
      error.statusCode = 404;
      return next(error);
    }

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
    currentUser.lastPasswordChange = new Date();

    await currentUser.save();

    res.status(200).json({
      message: "Password Changed Successfully",
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

