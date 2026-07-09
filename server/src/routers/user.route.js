import express from "express";
import multer from "multer";
import { EditUserProfile } from "../controllers/user.controller.js";
import { AuthProtect } from "../middlewares/auth.middleware.js";

const Upload = multer();
const router = express.Router();

// Use the correct middleware name and controller
router.put(
  "/edit-profile",
  AuthProtect,
  Upload.single("photo"),
  EditUserProfile
);

export default router;
