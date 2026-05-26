import React, { useContext, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { AppContext } from "../context/AppContext";

const RecruiterDashboard = () => {
  const {
    jobs,
    fetchJobs,
    companyData,
    companyApplications,
    fetchCompanyApplications,
    deleteJob,
  } = useContext(AppContext);

  // ==============================
  // LOAD DATA
  // ==============================
  useEffect(() => {
    fetchJobs();
    fetchCompanyApplications();
  }, []);

  // ==============================
  // FILTER COMPANY JOBS
  // ==============================
  const myJobs = useMemo(() => {
    return jobs.filter((job) => job.companyId?._id === companyData?._id);
  }, [jobs, companyData]);

  // ==============================
  // STATS
  // ==============================
  const stats = {
    totalJobs: myJobs.length,

    totalApplications: companyApplications.length,

    pendingApplications: companyApplications.filter(
      (app) => app.status === "Pending",
    ).length,

    acceptedApplications: companyApplications.filter(
      (app) => app.status === "Accepted",
    ).length,
  };

  // ==============================
  // DELETE JOB
  // ==============================
  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?",
    );

    if (!confirmDelete) return;

    await deleteJob(jobId);

    fetchJobs();
  };

  // ==============================
  // COMMON CARD STYLE
  // ==============================
  const cardStyle =
    "bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6";

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 transition-colors duration-300">
        <div className="container 2xl:px-20 mx-auto px-4">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Recruiter Dashboard
              </h1>

              <p className="text-gray-500 dark:text-gray-300 mt-2">
                Welcome back{" "}
                <span className="font-semibold text-blue-600">
                  {companyData?.name || "Recruiter"}
                </span>
              </p>
            </div>

            <Link
              to="/add-job"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition"
            >
              + Post New Job
            </Link>
          </div>

          {/* STATS */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            <div className={cardStyle}>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Total Jobs
              </p>

              <h2 className="text-3xl font-bold mt-2 text-blue-600">
                {stats.totalJobs}
              </h2>
            </div>

            <div className={cardStyle}>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Applications
              </p>

              <h2 className="text-3xl font-bold mt-2 text-purple-600">
                {stats.totalApplications}
              </h2>
            </div>

            <div className={cardStyle}>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Pending
              </p>

              <h2 className="text-3xl font-bold mt-2 text-yellow-500">
                {stats.pendingApplications}
              </h2>
            </div>

            <div className={cardStyle}>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Accepted
              </p>

              <h2 className="text-3xl font-bold mt-2 text-green-500">
                {stats.acceptedApplications}
              </h2>
            </div>
          </div>

          {/* JOB LIST */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* JOB LIST HEADER */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  Your Jobs
                </h2>

                <p className="text-gray-500 dark:text-gray-300 mt-1">
                  Manage all posted jobs
                </p>
              </div>

              <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium">
                {myJobs.length} Jobs
              </span>
            </div>

            {/* EMPTY STATE */}
            {myJobs.length === 0 ? (
              <div className="p-10 text-center">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-white">
                  No Jobs Posted
                </h3>

                <p className="text-gray-500 dark:text-gray-300 mt-2">
                  Start by posting your first job.
                </p>

                <Link
                  to="/add-job"
                  className="inline-block mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
                >
                  Post Job
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {myJobs.map((job) => (
                  <div
                    key={job._id}
                    className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    {/* LEFT */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {job.title}
                      </h3>

                      <div className="flex flex-wrap gap-3 mt-3">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {job.location}
                        </span>

                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          {job.level}
                        </span>

                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                          ₹ {job.salary}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            job.visible
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {job.visible ? "Visible" : "Hidden"}
                        </span>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to="/view-applications"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
                      >
                        Applicants
                      </Link>

                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="border border-red-300 text-red-500 hover:bg-red-50 px-5 py-2 rounded-xl transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RecruiterDashboard;
