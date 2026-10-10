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
  GetRiderDeliveryOrders,
  RiderAcceptOrder,
  RiderUpdateDeliveryStatus,
} from "../controllers/order.controller.js";

const router = express.Router();

// Order Creation & Queries
router.post("/create", AuthProtect, CreateOrder);
router.get("/my-orders", AuthProtect, GetCustomerOrders);
router.get("/track/:orderId", AuthProtect, GetOrderTracking);
router.get("/:orderId", AuthProtect, GetOrderById);

// Order Actions & Status Updates
router.patch("/cancel/:orderId", AuthProtect, CancelOrder);
router.patch("/rate/:orderId", AuthProtect, RateOrder);
router.patch("/status/:orderId", AuthProtect, UpdateOrderStatus);
router.patch("/simulate-status/:orderId", AuthProtect, UpdateOrderStatusForDemo);

// Rider Delivery Management
router.get("/rider/orders", AuthProtect, GetRiderDeliveryOrders);
router.patch("/rider/accept/:orderId", AuthProtect, RiderAcceptOrder);
router.patch("/rider/status/:orderId", AuthProtect, RiderUpdateDeliveryStatus);

export default router;