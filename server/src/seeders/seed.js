import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/dbConnection.config.js";
import adminSeed from "./admin.seed.js";
import userSeed from "./user.seed.js";
import restaurantSeed from "./restaurant.seed.js";

const seed = async () => {
  try {
    await connectDB();

    await adminSeed();
    await userSeed();
    await restaurantSeed();

    console.log("🚀 All Seeding Completed Successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();