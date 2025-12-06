import mongoose from "mongoose";

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI is missing in .env");
    process.exit(1);
  }

  try {
    console.log("📌 Connecting MongoDB ...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected!");
  } catch (err) {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  }
};
