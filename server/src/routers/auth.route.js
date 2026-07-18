import express from "express";

import {
  RegisterUser,
  LoginUser,
  LogoutUser,
  SendOtp,
  VerifyOtp,
  ResetPassword,
} from "../controllers/auth.controller.js";

import { OTPAuthProtect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", RegisterUser);

router.post("/login", LoginUser);

router.get("/logout", LogoutUser);

// Forgot Password

router.post("/send-otp", SendOtp);

router.post("/verify-otp", VerifyOtp);

router.post(
  "/reset-password",
  OTPAuthProtect,
  ResetPassword
);

export default router;
