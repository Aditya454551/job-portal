import express from "express";

import {
  syncUser,
  applyForJob,
  getUserData,
  getUserJobApplications,
  updateUserResume,
  saveJob,
  getSavedJobs,
} from "../controllers/userController.js";

import upload from "../config/multer.js";
import protectUser from "../middleware/protectUser.js";

const router = express.Router();

// ==============================
// USER ROUTES
// ==============================

// Sync Clerk user to MongoDB
router.get("/sync", protectUser, syncUser);

// Get logged in user data
router.get("/user", protectUser, getUserData);

// Apply for a job
router.post("/apply", protectUser, applyForJob);

// Get applied jobs
router.get(
  "/applications",
  protectUser,
  getUserJobApplications,
);

// Upload resume
router.post(
  "/update-resume",
  protectUser,
  upload.single("resume"),
  updateUserResume,
);

// ==============================
// SAVED JOBS
// ==============================

// Save / Unsave job
router.post(
  "/save-job",
  protectUser,
  saveJob,
);

// Get all saved jobs
router.get(
  "/saved-jobs",
  protectUser,
  getSavedJobs,
);

export default router;