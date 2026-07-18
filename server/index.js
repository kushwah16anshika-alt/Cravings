// import dotenv from "dotenv";
// dotenv.config();

// import cloudinary from "./src/config/cloudinary.config.js";
// import express from "express";
// import connectDB from "./src/config/dbConnection.config.js";
// import AuthRouter from "./src/routers/auth.route.js";
// import PublicRouter from "./src/routers/public.route.js";
// import UserRouter from "./src/models/user.model.js";
// import RestaurantRouter from "./src/routers/restaurant.route.js"; 

// import morgan from "morgan";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// const app = express();

// // CORS Configuration
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   }),
// );

// // Middlewares
// app.use(express.json());

// app.use(cookieParser());

// app.use(morgan("dev"));

// // Routes

// app.use("/auth", AuthRouter);

// app.use("/public", PublicRouter);

// app.use("/user", UserRouter);

// app.use("/restaurant", RestaurantRouter);

// // Default API

// app.get("/", (req, res) => {
//   console.log("Default Get API Hit");

//   res.json({
//     message: "Welcome to my Cravings Project",
//   });
// });

// // Default Error Handler

// app.use((err, req, res, next) => {
//   const ErrMessage = err.message || "Internal Server Error";

//   const ErrStausCode = err.statusCode || 500;

//   res.status(ErrStausCode).json({
//     message: ErrMessage,
//   });
// });

// // Server

// const port = process.env.PORT || 5000;

// app.listen(port, async () => {
//   console.log("Server Started on port:", port);

//   await connectDB();

//   try {
//     const result = await cloudinary.api.ping();

//     console.log("Cloudinary Connected:");

//     console.log(result);
//   } catch (error) {
//     console.log(error.message);

//     process.exit(1);
//   }
// });


import dotenv from "dotenv";
dotenv.config();

import cloudinary from "./src/config/cloudinary.config.js";
import express from "express";
import connectDB from "./src/config/dbConnection.config.js";

import AuthRouter from "./src/routers/auth.route.js";
import PublicRouter from "./src/routers/public.route.js";
import UserRouter from "./src/models/user.model.js";
import RestaurantRouter from "./src/routers/restaurant.route.js";

import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/auth", AuthRouter);
app.use("/public", PublicRouter);
app.use("/user", UserRouter);
app.use("/restaurant", RestaurantRouter);

// Default API
app.get("/", (req, res) => {
  console.log("Default Get API Hit");

  res.json({
    message: "Welcome to my Cravings Project",
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
const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log("Server Started on port:", port);

  connectDB(); // Same as the updated code

  try {
    const result = await cloudinary.api.ping();

    console.log("Cloudinary Connected :");
    console.log(result);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
});