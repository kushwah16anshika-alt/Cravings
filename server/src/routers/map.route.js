import express from "express";
import {
  getMapConfig,
  geocodeAddress,
  reverseGeocode,
  calculateDeliveryRoute,
} from "../controllers/map.controller.js";

const router = express.Router();

// Configuration status (indicates OpenStreetMap & Geoapify availability)
router.get("/config", getMapConfig);

// Search and autocomplete addresses
router.get("/geocode", geocodeAddress);

// Reverse geocode latitude and longitude to address
router.get("/reverse-geocode", reverseGeocode);

// Calculate route between restaurant and delivery location
router.get("/route", calculateDeliveryRoute);
router.post("/route", calculateDeliveryRoute);

export default router;
