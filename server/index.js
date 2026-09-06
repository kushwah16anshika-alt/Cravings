import dotenv from "dotenv";

dotenv.config();

import cloudinary from "./src/config/cloudinary.config.js";
import express from "express";
import connectDB from "./src/config/dbConnection.config.js";

import AuthRouter from "./src/routers/auth.route.js";
import PublicRouter from "./src/routers/public.route.js";
import UserRouter from "./src/routers/user.route.js";
import AdminRouter from "./src/routers/admin.route.js";
import RestaurantRouter from "./src/routers/restaurant.route.js";
import CustomerRouter from "./src/routers/customer.route.js";
import RiderRouter from "./src/routers/rider.route.js";
import OrderRouter from "./src/routers/order.route.js";
import PaymentRouter from "./src/routers/payment.route.js";
import AiRouter from "./src/routers/ai.route.js";

import Restaurant from "./src/models/restaurant.model.js";
import adminSeed from "./src/seeders/admin.seed.js";
import userSeed from "./src/seeders/user.seed.js";
import restaurantSeed from "./src/seeders/restaurant.seed.js";

import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Deployment-Ready Dynamic CORS Configuration
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((url) => url.trim())
  : [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
      "http://localhost:4173",
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes("*") ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Health Check Endpoints (for Render, Railway, AWS, Vercel)
app.get(["/health", "/api/health"], (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Routes
app.use("/auth", AuthRouter);
app.use("/public", PublicRouter);
app.use("/common", UserRouter);

app.use("/admin", AdminRouter);
app.use("/restaurant", RestaurantRouter);
app.use("/customer", CustomerRouter);
app.use("/rider", RiderRouter);
app.use("/order", OrderRouter);
app.use("/payment", PaymentRouter);
app.use("/ai", AiRouter);
app.use("/public/ai", AiRouter);

// Default API
app.get("/", (req, res) => {
  res.json({
    name: "Cravings API",
    status: "running",
    version: "1.0.0",
    message: "Welcome to the Cravings Food Delivery Platform API",
  });
});

// Default Error Handler
app.use((err, req, res, next) => {
  const ErrMessage = err.message || "Internal Server Error";
  const ErrStausCode = err.statusCode || 500;

  res.status(ErrStausCode).json({
    message: ErrMessage,
  });
});

// Server
const port = process.env.PORT || 4500;

app.listen(port, async () => {
  console.log(`🚀 Cravings Server running on port ${port}`);

  await connectDB();

  // Auto-seed initial data on fresh deployment if DB is empty
  try {
    const restaurantCount = await Restaurant.countDocuments();
    if (restaurantCount === 0) {
      console.log("🌱 Fresh database detected. Auto-seeding restaurants & menus...");
      await adminSeed();
      await userSeed();
      await restaurantSeed();
      console.log("🎉 Auto-seeding completed successfully!");
    }
  } catch (seedErr) {
    console.warn("Auto-seed notice:", seedErr.message);
  }

  try {
    const result = await cloudinary.api.ping();
    console.log("☁️ Cloudinary Connected Successfully");
  } catch (error) {
    console.warn("Cloudinary Connection Warning:", error.message);
  }
});