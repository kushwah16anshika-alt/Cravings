import express from "express";

import {
  ContactUsForm,
  // FeedbackForm,
  GetRestaurants,
  GetRestaurantDetails,
} from "../controllers/public.controller.js";

const router = express.Router();

// Contact Us
router.post("/Contactus", ContactUsForm);

// // Feedback
// router.post("/feedback", FeedbackForm);

// Get All Restaurants
router.get("/restaurants", GetRestaurants);

router.get("/restaurant-detail/:restaurantId", GetRestaurantDetails);

export default router;
