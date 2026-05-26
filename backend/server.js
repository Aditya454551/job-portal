import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import "./config/cloudinary.js";

import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import { clerkMiddleware } from "@clerk/express";

const app = express();

// ✅ Connect DB
connectDB();

// ✅ Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://job-portal-alpha-lyart.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());

// ✅ 🔥 VERY IMPORTANT: Clerk middleware BEFORE routes
app.use(clerkMiddleware());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API Working 🚀");
});

// ✅ Routes
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);

// ✅ Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});