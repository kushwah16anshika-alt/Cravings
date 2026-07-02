import express from "express";
import { ContactUsForm } from "../controllers/public.controller.js";

const router = express.Router();

router.post("/Contactus", ContactUsForm);


export default router;