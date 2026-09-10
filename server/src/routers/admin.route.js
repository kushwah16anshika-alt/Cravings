import express from "express";
import {
  getAdminStats,
  getAllAdminOrders,
  updateAdminOrderStatus,
  getAllAdminRestaurants,
  toggleAdminRestaurantStatus,
  getAllAdminUsers,
  getAdminFeedbackAndInquiries,
} from "../controllers/admin.controller.js";
import { AdminAuthProtect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All Admin routes require AdminAuthProtect
router.use(AdminAuthProtect);

// Overview & Analytics
router.get("/stats", getAdminStats);

// Orders Management
router.get("/orders", getAllAdminOrders);
router.patch("/orders/:orderId/status", updateAdminOrderStatus);

// Restaurants Management
router.get("/restaurants", getAllAdminRestaurants);
router.patch("/restaurants/:restaurantId/toggle-status", toggleAdminRestaurantStatus);

// Users & Riders Directory
router.get("/users", getAllAdminUsers);

// Feedback & Contact Support Inquiries
router.get("/feedbacks", getAdminFeedbackAndInquiries);

export default router;