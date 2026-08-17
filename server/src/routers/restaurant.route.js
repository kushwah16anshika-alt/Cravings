// import express from "express";
// import multer from "multer";
// import {
//   RestaurantUpdateProfile,
//   RestaurantGetData,
//   toggleRestaurantStatus,
// } from "../controllers/restaurant.controller.js";
// import { RestaurantAuthProtect } from "../middlewares/auth.middleware.js";

// const upload = multer();
// const router = express.Router();

// router.post(
//   "/update-profile",
//   RestaurantAuthProtect,
//   upload.fields([
//     {
//       name: "coverImage",
//       maxCount: 1,
//     },
//     {
//       name: "restaurantImage",
//       maxCount: 10,
//     },
//   ]),
//   RestaurantUpdateProfile,
// );

// router.get(
//   "/get-resturant-data",
//   RestaurantAuthProtect,
//   RestaurantGetData
// );


// router.patch(
//   "/toggle-status",
//   RestaurantAuthProtect,
//   toggleRestaurantStatus
// );

// export default router;

import express from "express";
import multer from "multer";

import {
  RestaurantUpdateProfile,
  RestaurantGetData,
  getRestaurantProfile,
  toggleRestaurantStatus,
  RestaurantUpdateInfo,
  RestaurantUpdateLegalInfo,
  RestaurantAddMenuItem,
  RestaurantMenuItems,
  RestaurantUpdateMenuItem,
  RestaurantUpdateMenuItemStatus,
  RestaurantToggleMenuItemControl,
  RestaurantDeleteMenuItem,
} from "../controllers/restaurant.controller.js";

import { RestaurantAuthProtect } from "../middlewares/auth.middleware.js";

const upload = multer();
const router = express.Router();


// Restaurant Profile
router.post(
  "/update-profile",
  RestaurantAuthProtect,
  upload.fields([
  {
    name: "displayPic",
    maxCount: 1,
  },
  {
    name: "coverImage",
    maxCount: 1,
  },
  {
    name: "restaurantImage",
    maxCount: 10,
  },
]),
  RestaurantUpdateProfile
);

router.get(
  "/get-resturant-data",
  RestaurantAuthProtect,
  RestaurantGetData
);

router.get(
  "/profile",
  RestaurantAuthProtect,
  getRestaurantProfile
);

router.put(
  "/update-restaurant-info",
  RestaurantAuthProtect,
  RestaurantUpdateInfo
);

router.put(
  "/update-legal-info",
  RestaurantAuthProtect,
  RestaurantUpdateLegalInfo
);

router.patch(
  "/toggle-status",
  RestaurantAuthProtect,
  toggleRestaurantStatus
);


// Menu Routes
router.get(
  "/menu-items",
  RestaurantAuthProtect,
  RestaurantMenuItems
);

router.post(
  "/add-menu-item",
  RestaurantAuthProtect,
  upload.single("itemImage"),
  RestaurantAddMenuItem
);

router.put(
  "/menu-item/:itemId",
  RestaurantAuthProtect,
  upload.single("itemImage"),
  RestaurantUpdateMenuItem
);

router.patch(
  "/menu-item/:itemId/status",
  RestaurantAuthProtect,
  RestaurantUpdateMenuItemStatus
);

router.patch(
  "/menu-item/:itemId/control",
  RestaurantAuthProtect,
  RestaurantToggleMenuItemControl
);

router.delete(
  "/menu-item/:itemId",
  RestaurantAuthProtect,
  RestaurantDeleteMenuItem
);

export default router;