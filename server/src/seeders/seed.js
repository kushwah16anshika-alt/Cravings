import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/dbConnection.config.js";
import adminSeed from "./admin.seed.js";
import userSeed from "./user.seed.js";

const seed = async () => {
  try {
  await connectDB();

  await adminSeed();
  await userSeed();

  console.log("✅ Seeding completed successfully.");
  process.exit(0);
} catch (error) {
  console.log(error.message);
  process.exit(1);
}
};

seed();