import express from "express";
import { getMenuItems, createMenuItem } from "../controllers/menu.controller.js";
// import { AuthProtect } from "../middlewares/auth.middleware.js"; // Uncomment if authentication is required

const router = express.Router();

// Get all menu items of a restaurant
router.get("/:restaurantId", getMenuItems);

// Create a new menu item
router.post("/create", createMenuItem);

export default router;