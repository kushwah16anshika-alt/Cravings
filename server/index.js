import dotenv from "dotenv";
dotenv.config();
import connectDB from "../server/src/config/dbConnection.config.js";
import express from "express";
const app = express();

// Default API
app.get("/", (req, res) => {
  console.log("Default Get API Hit");
  res.json({ message: "Welcome to my first backend Project" });
});
 //Default Error Handler

app.use((err, req, res, next) => {
  const ErrMessage = err.message || "Internal Server Error";
  const ErrStausCode = err.statusCode || 500;

  res.status(ErrStausCode).json({ message: ErrMessage });
});


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server Started on port:", port);

  // Database Connection
  connectDB();
});