import express from "express";
import { AuthProtect } from "../middlewares/auth.middleware.js";
import {
  CreateOrder,
  GetOrderById,
  GetCustomerOrders,
  GetOrderTracking,
  CancelOrder,
  RateOrder,
  UpdateOrderStatus,
  UpdateOrderStatusForDemo,
} from "../controllers/order.controller.js";

const router = express.Router();

// Order Creation & Queries
router.post("/create", AuthProtect, CreateOrder);
router.get("/my-orders", AuthProtect, GetCustomerOrders);
router.get("/track/:orderId", AuthProtect, GetOrderTracking);
router.get("/:orderId", AuthProtect, GetOrderById);

// Order Actions & Status Updates
router.patch("/cancel/:orderId", AuthProtect, CancelOrder);
router.post("/cancel/:orderId", AuthProtect, CancelOrder);
router.patch("/rate/:orderId", AuthProtect, RateOrder);
router.patch("/status/:orderId", AuthProtect, UpdateOrderStatus);
router.patch("/simulate-status/:orderId", AuthProtect, UpdateOrderStatusForDemo);

export default router;