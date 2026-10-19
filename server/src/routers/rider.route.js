import express from "express";

import {
  riderUpdateProfile,
  getRiderProfile,
  updateRiderLocation,
} from "../controllers/rider.controller.js";

import { RiderAuthProtect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/update-profile",
  RiderAuthProtect,
  riderUpdateProfile
);

router.get(
  "/get-profile",
  RiderAuthProtect,
  getRiderProfile
);

router.patch(
  "/location",
  RiderAuthProtect,
  updateRiderLocation
);

router.post(
  "/update-location",
  RiderAuthProtect,
  updateRiderLocation
);

export default router;