import dotenv from "dotenv";
dotenv.config();

console.log("MONGO_DB_URI =", process.env.MONGO_DB_URI);
import authRoutes from "./src/routers/auth.route.js";
import publicRoutes from "./src/routers/public.route.js";

import connectDB from "./src/config/dbConnection.config.js";

import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(morgan("dev"));

// Default API
app.get("/", (req, res) => {
  console.log("Default Get API Hit");
  res.json({ message: "Welcome to my first backend Project" });
});
app.use("/auth", authRoutes);
app.use("/public", publicRoutes);
// Error Handler
app.use((err, req, res, next) => {
  const ErrMessage = err.message || "Internal Server Error";
  const ErrStatusCode = err.statusCode || 500;

  res.status(ErrStatusCode).json({ message: ErrMessage });
});

const port = process.env.PORT || 5000;

//  START SERVER ONLY AFTER DB CONNECTS
const startServer = async () => {
  try {
    // console.log(process.env.MONGO_DB_URI);
    await connectDB();

    app.listen(port, () => {
      console.log("Server Started on port:", port);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
  }
};

startServer();