// import express from "express";
// import {
//   ContactUsForm,
//   FeedbackForm,
// } from "../controllers/public.controller.js";

// const router = express.Router();

// router.post("/Contactus", ContactUsForm);


// router.post("/feedback", FeedbackForm);


// export default router;

import express from "express";

import {
  ContactUsForm,
  FeedbackForm,
  GetRestaurants,
} from "../controllers/public.controller.js";

const router = express.Router();


// Contact Us
router.post("/Contactus", ContactUsForm);


// Feedback
router.post("/feedback", FeedbackForm);


// Get All Restaurants
router.get("/restaurants", GetRestaurants);


export default router;