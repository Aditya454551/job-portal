import Job from "../models/Job.js";
import JobApplication from "../models/jobApplications.js";
import User from "../models/User.js";

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

import { transporter } from "../config/mail.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

// ======================================================
// SYNC USER
// ======================================================
export const syncUser = async (req, res) => {
  try {
    const { userId } = req.auth();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const clerkUser = await clerkClient.users.getUser(userId);

    const userData = {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      image: clerkUser.imageUrl,
      name: clerkUser.firstName || "User",
    };

    const user = await User.findOneAndUpdate(
      { clerkId: userData.clerkId },
      userData,
      {
        new: true,
        upsert: true,
      },
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("syncUser error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================================
// GET USER DATA
// ======================================================
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("getUserData:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================================
// APPLY FOR JOB
// ======================================================
export const applyForJob = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const job = await Job.findById(jobId).populate("companyId");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check existing application
    const existingApplication = await JobApplication.findOne({
      userId: user._id,
      jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "Already applied for this job",
      });
    }

    // Create application
    const application = await JobApplication.create({
      userId: user._id,
      companyId: job.companyId._id,
      jobId,
      status: "Pending",
      date: Date.now(),
    });

    // Send email
    if (user.email) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Job Application Submitted",
          html: `
            <div style="font-family:sans-serif;">
              <h2>Application Submitted ✅</h2>

              <p>Hello ${user.name},</p>

              <p>
                You successfully applied for
                <strong>${job.title}</strong>
              </p>

              <p>
                Company:
                <strong>${job.companyId?.name}</strong>
              </p>

              <br />

              <p>Best of luck 🚀</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.log("Email Error:", emailError.message);
      }
    }

    res.status(200).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("applyForJob:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================================
// GET USER APPLICATIONS
// ======================================================
export const getUserJobApplications = async (req, res) => {
  try {
    const { userId } = req.auth();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const applications = await JobApplication.find({
      userId: user._id,
    })
      .populate("companyId", "name image email")
      .populate("jobId", "title location salary category level")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("getUserJobApplications:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================================
// UPDATE USER RESUME
// ======================================================
export const updateUserResume = async (req, res) => {
  try {
    const { userId } = req.auth();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: "resumes",
    });

    user.resume = result.secure_url;

    await user.save();

    // Delete local file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resume: user.resume,
    });
  } catch (error) {
    console.error("updateUserResume:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================================
// SAVE / UNSAVE JOB
// ======================================================
export const saveJob = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isSaved = user.savedJobs.some(
      (id) => id.toString() === jobId,
    );

    // UNSAVE
    if (isSaved) {
      user.savedJobs = user.savedJobs.filter(
        (id) => id.toString() !== jobId,
      );

      await user.save();

      return res.status(200).json({
        success: true,
        saved: false,
        message: "Job removed from saved jobs",
      });
    }

    // SAVE
    user.savedJobs.push(jobId);

    await user.save();

    res.status(200).json({
      success: true,
      saved: true,
      message: "Job saved successfully",
    });
  } catch (error) {
    console.error("saveJob:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================================
// GET SAVED JOBS
// ======================================================
export const getSavedJobs = async (req, res) => {
  try {
    const { userId } = req.auth();

    const user = await User.findOne({ clerkId: userId }).populate({
      path: "savedJobs",
      populate: {
        path: "companyId",
        select: "name image",
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    console.error("getSavedJobs:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};