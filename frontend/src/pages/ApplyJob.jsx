import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";

import { AppContext } from "../context/AppContext";
import JobCard from "../components/JobCard";

const ApplyJob = () => {
  const { id } = useParams();

  const { jobs, applyForJob, savedJobs, toggleSaveJob, userApplications } =
    useContext(AppContext);

  const [job, setJob] = useState(null);

  // ==============================
  // FIND JOB
  // ==============================
  useEffect(() => {
    const foundJob = jobs.find((item) => item._id === id);

    if (foundJob) {
      setJob(foundJob);
    }
  }, [id, jobs]);

  // ==============================
  // CHECK APPLIED
  // ==============================
  const isApplied = useMemo(() => {
    return userApplications.some(
      (application) => application.jobId?._id === id,
    );
  }, [userApplications, id]);

  // ==============================
  // CHECK SAVED
  // ==============================
  const isSaved = useMemo(() => {
    return savedJobs.some((savedJob) => savedJob._id === id);
  }, [savedJobs, id]);

  // ==============================
  // SIMILAR JOBS
  // ==============================
  const similarJobs = useMemo(() => {
    if (!job) return [];

    return jobs
      .filter((item) => item._id !== job._id && item.category === job.category)
      .slice(0, 3);
  }, [jobs, job]);

  // ==============================
  // LOADING
  // ==============================
  if (!job) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-semibold">Loading job...</h2>
      </div>
    );
  }

  // ==============================
  // CLEAN DESCRIPTION
  // ==============================
  const cleanDescription = DOMPurify.sanitize(job.description || "");

  return (
    <div className="container 2xl:px-20 mx-auto px-4 py-10">
      {/* ============================== */}
      {/* TOP SECTION */}
      {/* ============================== */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* ============================== */}
        {/* LEFT */}
        {/* ============================== */}
        <div className="lg:col-span-2">
          {/* Job Header */}
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <div className="flex items-center gap-5">
              <img
                src={job.companyId?.image}
                alt=""
                className="w-16 h-16 rounded-xl border object-cover"
              />

              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {job.title}
                </h1>

                <p className="text-gray-500 mt-1">{job.companyId?.name}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mt-6">
              <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm">
                {job.location}
              </span>

              <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm">
                {job.level}
              </span>

              <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm">
                ₹ {job.salary}
              </span>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>

              <div
                className="text-gray-600 leading-7 space-y-4"
                dangerouslySetInnerHTML={{
                  __html: cleanDescription,
                }}
              />
            </div>
          </div>

          {/* ============================== */}
          {/* COMPANY DETAILS */}
          {/* ============================== */}
          <div className="bg-white rounded-2xl shadow-sm border p-8 mt-8">
            <h2 className="text-2xl font-semibold mb-5">Company Details</h2>

            <div className="flex items-center gap-5">
              <img
                src={job.companyId?.image}
                alt=""
                className="w-20 h-20 rounded-xl border"
              />

              <div>
                <h3 className="text-xl font-semibold">{job.companyId?.name}</h3>

                <p className="text-gray-500 mt-1">
                  Hiring for amazing opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================== */}
        {/* RIGHT */}
        {/* ============================== */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-800">Apply Now</h2>

            <p className="text-gray-500 mt-2">Join this opportunity today.</p>

            {/* Apply Button */}
            <button
              disabled={isApplied}
              onClick={() => applyForJob(job._id)}
              className={`w-full mt-6 py-3 rounded-xl text-white font-medium transition ${
                isApplied ? "bg-green-500" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isApplied ? "Already Applied ✅" : "Apply Job"}
            </button>

            {/* Save Button */}
            <button
              onClick={() => toggleSaveJob(job._id)}
              className={`w-full mt-4 py-3 rounded-xl border font-medium transition ${
                isSaved ? "bg-gray-900 text-white" : "hover:bg-gray-100"
              }`}
            >
              {isSaved ? "Saved ✓" : "Save Job"}
            </button>

            {/* Job Info */}
            <div className="mt-8 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Location</span>

                <span className="font-medium">{job.location}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Level</span>

                <span className="font-medium">{job.level}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Salary</span>

                <span className="font-medium">₹ {job.salary}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================== */}
      {/* SIMILAR JOBS */}
      {/* ============================== */}
      {similarJobs.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Similar Jobs</h2>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {similarJobs.map((item) => (
              <JobCard key={item._id} job={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyJob;
