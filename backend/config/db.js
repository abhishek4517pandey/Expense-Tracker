import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error && error.message ? error.message : error);
    // Do not exit the process here so the server can still start and surface errors via /api/health.
    // Render (or other hosts) will keep the process alive and we can debug connection issues from logs.
  }
};

export default connectDB;