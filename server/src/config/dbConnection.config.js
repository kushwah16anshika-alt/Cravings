import mongoose from "mongoose";

const connectDB = async () => {
  // Support standard naming variations (MONGO_DB_URI, MONGODB_URI, MONGO_URI)
  const rawUri =
    process.env.MONGO_DB_URI ||
    process.env.MONGODB_URI ||
    process.env.MONGO_URI;

  const mongoURI = typeof rawUri === "string" ? rawUri.trim() : "";

  if (!mongoURI) {
    console.error(
      "❌ FATAL: MongoDB connection URI is missing! Please configure MONGO_DB_URI (or MONGODB_URI) in your environment variables."
    );
    process.exit(1);
  }

  // Prevent accidental localhost connection in production deployments (e.g. Render)
  const isLocalhost =
    mongoURI.includes("localhost") ||
    mongoURI.includes("127.0.0.1") ||
    mongoURI.includes("::1");

  if (process.env.NODE_ENV === "production" && isLocalhost) {
    console.error(
      "❌ FATAL: Detected localhost MongoDB URI in production! Cloud hosts (like Render) do not run a local MongoDB instance. Please configure your remote MongoDB Atlas connection string in Render's Environment settings (MONGO_DB_URI)."
    );
    process.exit(1);
  }

  // Log connection target securely without exposing password/credentials
  const sanitizedTarget = mongoURI.replace(
    /\/\/([^:]+):([^@]+)@/,
    "//$1:****@"
  );
  console.log(`📡 Connecting to MongoDB target: ${sanitizedTarget}`);

  try {
    const conn = await mongoose.connect(mongoURI);

    console.log("✅ MongoDB connected successfully");
    console.log("DB host:", conn.connection.host);
    console.log("DB name:", conn.connection.name);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;