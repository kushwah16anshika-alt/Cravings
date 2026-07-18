import express from "express";
import multer from "multer";
import {
  RestaurantUpdateProfile,
  RestaurantGetData,
  toggleRestaurantStatus,
} from "../controllers/restaurant.controller.js";
import { RestaurantAuthProtect } from "../middlewares/auth.middleware.js";

const upload = multer();
const router = express.Router();

router.post(
  "/update-profile",
  RestaurantAuthProtect,
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "restaurantImage",
      maxCount: 10,
    },
  ]),
  RestaurantUpdateProfile,
);

router.get(
  "/get-resturant-data",
  RestaurantAuthProtect,
  RestaurantGetData
);


router.patch(
  "/toggle-status",
  RestaurantAuthProtect,
  toggleRestaurantStatus
);

export default router;