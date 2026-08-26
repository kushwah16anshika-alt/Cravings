import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/order.model.js";
import Customer from "../models/customer.model.js";

// Lazily create Razorpay instance
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
};

// ─── Helper: find a customer's order safely ─────────────────────────────────
const getCustomerOrder = async (userId, orderId) => {
  const customer = await Customer.findOne({ customerId: userId });
  const customerIds = [userId];
  if (customer?._id) {
    customerIds.push(customer._id);
  }
  return Order.findOne({ _id: orderId, customerId: { $in: customerIds } });
};

// ─── POST /payment/create-order ──────────────────────────────────────────────
export const CreateRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      const err = new Error("orderId is required");
      err.statusCode = 400;
      return next(err);
    }

    const order = await getCustomerOrder(req.user._id, orderId);
    if (!order) {
      const err = new Error("Order not found");
      err.statusCode = 404;
      return next(err);
    }

    if (order.paymentDetails?.paymentStatus === "completed") {
      const err = new Error("Payment already completed for this order");
      err.statusCode = 400;
      return next(err);
    }

    const razorpay = getRazorpayInstance();
    const amountInPaise = Math.round((order.billDetails?.finalAmount || 0) * 100);

    // If Razorpay API credentials are not configured in .env, provide demo order fallback
    if (!razorpay) {
      const demoOrderId = `rzp_demo_${order._id}_${Date.now()}`;
      order.paymentDetails.razorpayOrderId = demoOrderId;
      await order.save();

      return res.status(200).json({
        message: "Demo order created (Razorpay keys not configured in server/.env)",
        data: {
          key: "rzp_test_demo",
          razorpayOrderId: demoOrderId,
          amount: amountInPaise,
          currency: "INR",
          appOrderId: order._id,
          isDemo: true,
        },
      });
    }

    // Razorpay expects amount in paise
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${order._id}`,
      notes: { appOrderId: String(order._id) },
    });

    order.paymentDetails.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.status(200).json({
      message: "Razorpay order created",
      data: {
        key: process.env.RAZORPAY_KEY_ID,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        appOrderId: order._id,
        isDemo: false,
      },
    });
  } catch (error) {
    console.error("CreateRazorpayOrder error:", error);
    next(error);
  }
};

// ─── POST /payment/verify ────────────────────────────────────────────────────
export const VerifyRazorpayPayment = async (req, res, next) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!orderId) {
      const err = new Error("Order ID is required");
      err.statusCode = 400;
      return next(err);
    }

    const order = await getCustomerOrder(req.user._id, orderId);
    if (!order) {
      const err = new Error("Order not found");
      err.statusCode = 404;
      return next(err);
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // In demo mode or when secret is not set, verify directly
    const isDemoOrder =
      !key_secret ||
      (razorpay_order_id && razorpay_order_id.startsWith("rzp_demo_")) ||
      razorpay_signature === "demo_signature";

    if (!isDemoOrder) {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        const err = new Error("All payment verification fields are required");
        err.statusCode = 400;
        return next(err);
      }

      const expectedSignature = crypto
        .createHmac("sha256", key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        order.paymentDetails.paymentStatus = "failed";
        order.orderStatus = "failed";
        await order.save();

        const err = new Error("Payment signature verification failed");
        err.statusCode = 400;
        return next(err);
      }
    }

    // Payment is verified
    order.paymentDetails.paymentStatus = "completed";
    order.paymentDetails.razorpayOrderId = razorpay_order_id || `demo_${Date.now()}`;
    order.paymentDetails.razorpayPaymentId = razorpay_payment_id || `pay_demo_${Date.now()}`;
    order.paymentDetails.razorpaySignature = razorpay_signature || "demo_signature";
    order.paymentDetails.paidAt = new Date();
    order.orderStatus = "accepted";
    await order.save();

    return res.status(200).json({
      message: "Payment verified and order successful",
      data: order,
    });
  } catch (error) {
    console.error("VerifyRazorpayPayment error:", error);
    next(error);
  }
};