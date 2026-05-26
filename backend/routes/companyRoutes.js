import express from "express";

import {
  registerCompany,
  loginCompany,
  getCompanyData,
  postJob,
 getCompanyApplications,
  getCompanyPostedJobs,
  updateApplicationStatus,
  changeVisibility,
  deleteJob,
  updateJob,
} from "../controllers/companyController.js";

import { protectCompany } from "../middleware/authMiddleware.js";

const router = express.Router();


// ========================================
// AUTH ROUTES
// ========================================

router.post("/register", registerCompany);

router.post("/login", loginCompany);


// ========================================
// COMPANY ROUTES
// ========================================

router.get(
  "/company",
  protectCompany,
  getCompanyData
);


// ========================================
// JOB ROUTES
// ========================================

// POST NEW JOB
router.post(
  "/post-job",
  protectCompany,
  postJob
);

// GET ALL COMPANY JOBS
router.get(
  "/list-jobs",
  protectCompany,
  getCompanyPostedJobs
);

// UPDATE JOB  ✅ NEW
router.post(
  "/update-job/:id",
  protectCompany,
  updateJob
);

// DELETE JOB
router.delete(
  "/delete-job/:jobId",
  protectCompany,
  deleteJob
);

router.put(
  "/update-job/:jobId",
  protectCompany,
  updateJob,
);

// CHANGE VISIBILITY
router.post(
  "/change-visibility",
  protectCompany,
  changeVisibility
);


// ========================================
// APPLICATION ROUTES
// ========================================

// GET APPLICATIONS
router.get(
  "/applications",
  protectCompany,
  getCompanyApplications
);

// UPDATE APPLICATION STATUS
router.post(
  "/change-status",
  protectCompany,
  updateApplicationStatus
);

export default router;