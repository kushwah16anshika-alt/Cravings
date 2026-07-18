import express from "express";
import {
  ContactUsForm,
  FeedbackForm,
} from "../controllers/public.controller.js";

const router = express.Router();

router.post("/Contactus", ContactUsForm);


router.post("/feedback", FeedbackForm);

export default router;