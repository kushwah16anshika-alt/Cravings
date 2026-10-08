import express from "express";
import { AuthProtect } from "../middlewares/auth.middleware.js";
import {
  CreateOrder,
  GetOrderTracking,
  UpdateOrderStatusForDemo,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/create", AuthProtect, CreateOrder);
router.get("/track/:orderId", AuthProtect, GetOrderTracking);
router.patch("/simulate-status/:orderId", AuthProtect, UpdateOrderStatusForDemo);

export default router;