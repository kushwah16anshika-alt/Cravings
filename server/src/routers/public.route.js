import express from "express";

import {
  ContactUsForm,
  FeedbackForm,
  GetAllRestaurants,
  GetRestaurantDetails,
} from "../controllers/public.controller.js";

const router = express.Router();

// Contact Us
router.post("/contact-us", ContactUsForm);

// Feedback
router.post("/feedback", FeedbackForm);

// Get All Restaurants
router.get("/restaurants", GetAllRestaurants);

// Get Restaurant Details
router.get("/restaurant-detail/:restaurantId", GetRestaurantDetails);

export default router;