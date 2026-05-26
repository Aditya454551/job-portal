import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import kconvert from "k-convert";

import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const { applyForJob, toggleSaveJob, savedJobs } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  // =====================================================
  // SAFE DATA
  // =====================================================
  const title = job?.title || "No Title";

  const companyName = job?.companyId?.name || "Unknown Company";

  // FIXED COMPANY LOGO
  const companyImage = job?.companyId?.image || assets.company_icon;

  const location = job?.location || "Remote";

  const level = job?.level || "Not Specified";

  const salary = job?.salary || 0;

  // =====================================================
  // SAVED JOB CHECK
  // =====================================================
  const isSaved = savedJobs?.some((savedJob) => savedJob._id === job._id);

  // =====================================================
  // CLEAN DESCRIPTION
  // =====================================================
  const cleanDescription = DOMPurify.sanitize(job?.description || "", {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  })
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const shortDescription =
    cleanDescription.length > 120
      ? cleanDescription.slice(0, 120) + "..."
      : cleanDescription;

  // =====================================================
  // NAVIGATE
  // =====================================================
  const handleNavigate = () => {
    navigate(`/apply-job/${job._id}`);
    window.scrollTo(0, 0);
  };

  // =====================================================
  // APPLY JOB
  // =====================================================
  const handleApply = async () => {
    if (loading || applied) return;

    setLoading(true);

    try {
      const success = await applyForJob(job._id);

      if (success !== false) {
        setApplied(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SAVE JOB
  // =====================================================
  const handleSaveJob = async () => {
    if (!toggleSaveJob) return;

    await toggleSaveJob(job._id);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="
        group relative flex flex-col justify-between
        overflow-hidden rounded-3xl
        border border-gray-200/70
        bg-white/90
        p-6
        shadow-lg
        backdrop-blur-xl
        transition-all duration-500
        hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]
        dark:border-gray-700
        dark:bg-gray-800/90
      "
    >
      {/* BACKGROUND EFFECT */}
      <div
        className="
          absolute inset-0 opacity-0
          transition duration-500
          group-hover:opacity-100
          bg-gradient-to-r
          from-blue-500/5
          to-purple-500/5
        "
      ></div>

      {/* MAIN CONTENT */}
      <div className="relative z-10">
        {/* TOP SECTION */}
        <div className="flex items-start gap-4">
          {/* COMPANY LOGO */}
          <div
            className="
              flex h-16 w-16 items-center justify-center
              overflow-hidden rounded-2xl
              border border-gray-200
              bg-white shadow-sm
              dark:border-gray-700
              dark:bg-gray-900
            "
          >
            <img
              src={companyImage}
              alt={companyName}
              onError={(e) => {
                e.target.src =
                  assets.default_company_icon || "/company-logo.png";
              }}
              className="
                h-full w-full object-cover
                transition-transform duration-300
                group-hover:scale-105
              "
            />
          </div>

          {/* TITLE + COMPANY */}
          <div className="flex-1">
            <h3
              className="
    text-lg font-bold
    text-gray-800 dark:text-white
    leading-7
    break-words
  "
            >
              {title}
            </h3>

            <p
              className="
                mt-1 text-sm
                text-gray-500
                dark:text-gray-300
              "
            >
              {companyName}
            </p>
          </div>
        </div>

        {/* TAGS */}
        <div className="mt-5 flex flex-wrap gap-2">
          <span
            className="
              rounded-full bg-blue-100
              px-3 py-1
              text-xs font-semibold
              text-blue-700
            "
          >
            📍 {location}
          </span>

          <span
            className="
              rounded-full bg-green-100
              px-3 py-1
              text-xs font-semibold
              text-green-700
            "
          >
            💼 {level}
          </span>

          <span
            className="
              rounded-full bg-purple-100
              px-3 py-1
              text-xs font-semibold
              text-purple-700
            "
          >
            💰 ₹ {kconvert.convertTo(salary)}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p
          className="
            mt-5 min-h-[80px]
            text-sm leading-7
            text-gray-600
            line-clamp-3
            dark:text-gray-300
          "
        >
          {shortDescription || "No description available"}
        </p>
      </div>

      {/* BUTTONS */}
      <div className="relative z-10 mt-6 flex flex-wrap gap-3">
        {/* APPLY */}
        <button
          onClick={handleApply}
          disabled={loading || applied}
          className={`
            rounded-xl px-5 py-2.5
            text-sm font-semibold text-white
            transition-all duration-300

            ${
              applied
                ? "bg-green-500"
                : loading
                  ? "cursor-not-allowed bg-gray-400"
                  : `
                    bg-gradient-to-r
                    from-blue-600 to-indigo-700
                    hover:scale-105
                    hover:shadow-xl
                  `
            }
          `}
        >
          {applied ? "Applied ✅" : loading ? "Applying..." : "Apply Now"}
        </button>

        {/* DETAILS */}
        <button
          onClick={handleNavigate}
          className="
            rounded-xl border border-gray-300
            px-5 py-2.5
            text-sm font-semibold
            transition-all duration-300
            hover:bg-gray-100
            hover:scale-105
            dark:border-gray-600
            dark:text-white
            dark:hover:bg-gray-700
          "
        >
          Learn More
        </button>

        {/* SAVE */}
        <button
          onClick={handleSaveJob}
          className={`
            rounded-xl px-5 py-2.5
            text-sm font-semibold
            transition-all duration-300
            hover:scale-105

            ${
              isSaved
                ? `
                  bg-yellow-400
                  text-black
                  shadow-md
                `
                : `
                  border border-gray-300
                  hover:bg-gray-100
                  dark:border-gray-600
                  dark:text-white
                  dark:hover:bg-gray-700
                `
            }
          `}
        >
          {isSaved ? "Saved ⭐" : "Save"}
        </button>
      </div>
    </motion.div>
  );
};

export default JobCard;
