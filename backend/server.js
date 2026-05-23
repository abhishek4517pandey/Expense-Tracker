import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { initializeCronJobs } from "./services/cronJobs.js";

import expenseRoutes from "./routes/expenseRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import splitRoutes from "./routes/splitRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

connectDB();

app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/split-expenses", splitRoutes);
app.use("/api/emails", emailRoutes);

app.use(express.static(path.join(__dirname, "../Frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Mode: ${process.env.NODE_ENV || "development"}`);

    try {
      initializeCronJobs();
    } catch (err) {
      console.warn("Cron jobs error:", err.message);
    }
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Stop any other backend process using this port or set PORT to a different value.`
      );
    } else {
      console.error("Server error:", err);
    }
    process.exit(1);
  });
}

export default app;