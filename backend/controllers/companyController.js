import bcrypt from "bcrypt";

import Company from "../models/Company.js";
import Job from "../models/Job.js";
import JobApplication from "../models/jobApplications.js";

import generateToken from "../utils/generateToken.js";

import { transporter } from "../config/mail.js";

// ==============================
// REGISTER COMPANY
// ==============================
export const registerCompany = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingCompany = await Company.findOne({ email });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "Company already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await Company.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Company registered successfully",
      company,
      token: generateToken(company._id),
    });
  } catch (error) {
    console.log("registerCompany:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==============================
// LOGIN COMPANY
// ==============================
export const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    const company = await Company.findOne({ email });

    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      company.password,
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      company,
      token: generateToken(company._id),
    });
  } catch (error) {
    console.log("loginCompany:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==============================
// GET COMPANY DATA
// ==============================
export const getCompanyData = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      company: req.company,
    });
  } catch (error) {
    console.log("getCompanyData:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==============================
// POST JOB
// ==============================
export const postJob = async (req, res) => {
  try {
    const title = req.body.title?.trim();
    const description = req.body.description?.trim();
    const location = req.body.location?.trim();
    const salary = Number(req.body.salary);
    const level = req.body.level?.trim();
    const category = req.body.category?.trim();

    if (
      !title ||
      !description ||
      !location ||
      !salary ||
      !level ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const job = await Job.create({
      title,
      description,
      location,
      salary,
      level,
      category,
      companyId: req.company._id,
      visible: true,
      date: Date.now(),
    });

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job,
    });
  } catch (error) {
    console.log("postJob:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==============================
// GET COMPANY APPLICATIONS
// ==============================
export const getCompanyApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({
      companyId: req.company._id,
    })
      .populate("userId", "name email image resume")
      .populate("jobId", "title location")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.log("getCompanyApplications:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==============================
// UPDATE APPLICATION STATUS
// ==============================
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (
      !["Pending", "Accepted", "Rejected"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const application = await JobApplication.findById(id)
      .populate("userId", "name email")
      .populate("jobId", "title");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    application.status = status;

    await application.save();

    // EMAIL
    if (application.userId?.email) {
      await transporter.sendMail({
        to: application.userId.email,
        subject: `Application ${status}`,
        html: `
          <h2>Application Update</h2>

          <p>Hello ${application.userId.name},</p>

          <p>
            Your application for
            <b>${application.jobId.title}</b>
            has been marked as
            <b>${status}</b>.
          </p>

          <p>Thank you.</p>
        `,
      });
    }

    res.status(200).json({
      success: true,
      message: `Application ${status}`,
    });
  } catch (error) {
    console.log(
      "updateApplicationStatus:",
      error.message,
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==============================
// GET COMPANY JOBS
// ==============================
export const getCompanyPostedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      companyId: req.company._id,
    }).sort({ date: -1 });

    const jobsData = await Promise.all(
      jobs.map(async (job) => {
        const applicants =
          await JobApplication.countDocuments({
            jobId: job._id,
          });

        return {
          ...job.toObject(),
          applicants,
        };
      }),
    );

    res.status(200).json({
      success: true,
      jobsData,
    });
  } catch (error) {
    console.log(
      "getCompanyPostedJobs:",
      error.message,
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================================
// UPDATE JOB
// ======================================================
export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const {
      title,
      description,
      location,
      salary,
      category,
      level,
    } = req.body;

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        title,
        description,
        location,
        salary,
        category,
        level,
      },
      { new: true },
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.log("updateJob error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==============================
// DELETE JOB
// ==============================
export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (
      job.companyId.toString() !==
      req.company._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Job.findByIdAndDelete(jobId);

    await JobApplication.deleteMany({
      jobId,
    });

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.log("deleteJob:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==============================
// TOGGLE VISIBILITY
// ==============================
export const changeVisibility = async (req, res) => {
  try {
    const { id } = req.body;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (
      job.companyId.toString() !==
      req.company._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    job.visible = !job.visible;

    await job.save();

    res.status(200).json({
      success: true,
      message: "Visibility updated",
      job,
    });
  } catch (error) {
    console.log("changeVisibility:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};