import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

import { AppContext } from "../context/AppContext";

const ManageJobs = () => {
  const navigate = useNavigate();

  const { backendUrl, companyToken } = useContext(AppContext);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===================================================
  // FETCH JOBS
  // ===================================================
  const fetchJobs = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${backendUrl}/api/company/list-jobs`, {
        headers: {
          token: companyToken,
        },
      });

      if (data.success) {
        setJobs(data.jobsData || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // DELETE JOB
  // ===================================================
  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?",
    );

    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/company/delete-job/${jobId}`,
        {
          headers: {
            token: companyToken,
          },
        },
      );

      if (data.success) {
        toast.success(data.message);

        setJobs((prev) => prev.filter((job) => job._id !== jobId));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error("Delete failed");
    }
  };

  // ===================================================
  // TOGGLE VISIBILITY
  // ===================================================
  const toggleVisibility = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-visibility`,
        { id },
        {
          headers: {
            token: companyToken,
          },
        },
      );

      if (data.success) {
        setJobs((prev) =>
          prev.map((job) =>
            job._id === id ? { ...job, visible: !job.visible } : job,
          ),
        );

        toast.success("Visibility updated");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error("Update failed");
    }
  };

  // ===================================================
  // LOAD JOBS
  // ===================================================
  useEffect(() => {
    if (companyToken) {
      fetchJobs();
    }
  }, [companyToken]);

  // ===================================================
  // LOADING
  // ===================================================
  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
          <Loading />
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 transition-colors duration-300 dark:from-gray-900 dark:to-black">
        <div className="container mx-auto px-4 2xl:px-20">
          {/* ===================================================
              HEADER
          =================================================== */}
          <div className="mb-10 flex flex-col gap-6 rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-lg backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/80 md:flex-row md:items-center md:justify-between">
            {/* LEFT */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Manage Jobs
              </h1>

              <p className="mt-2 text-gray-500 dark:text-gray-300">
                Manage all your posted jobs easily
              </p>
            </div>

            {/* RIGHT */}
            <button
              onClick={() => navigate("/add-job")}
              className="
                inline-flex items-center justify-center
                rounded-2xl
                bg-gradient-to-r from-blue-600 to-indigo-700
                px-6 py-3
                text-sm font-semibold text-white
                shadow-lg
                transition-all duration-300

                hover:scale-105
                hover:shadow-2xl
              "
            >
              + Add New Job
            </button>
          </div>

          {/* ===================================================
              EMPTY STATE
          =================================================== */}
          {jobs.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-16 text-center shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-2xl font-bold text-gray-700 dark:text-white">
                No Jobs Posted
              </h2>

              <p className="mt-3 text-gray-500 dark:text-gray-300">
                Start posting jobs to attract top candidates.
              </p>

              <button
                onClick={() => navigate("/add-job")}
                className="
                  mt-6 rounded-2xl
                  bg-blue-600 px-6 py-3
                  font-medium text-white
                  transition-all duration-300

                  hover:bg-blue-700
                  hover:shadow-lg
                "
              >
                Post First Job
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
              {/* ===================================================
                  TABLE
              =================================================== */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  {/* TABLE HEADER */}
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr className="text-left text-sm uppercase tracking-wide text-gray-600 dark:text-gray-200">
                      <th className="px-5 py-5">#</th>
                      <th className="px-5 py-5">Job Title</th>
                      <th className="px-5 py-5">Location</th>
                      <th className="px-5 py-5">Applicants</th>
                      <th className="px-5 py-5">Posted</th>
                      <th className="px-5 py-5">Status</th>
                      <th className="px-5 py-5 text-center">Actions</th>
                    </tr>
                  </thead>

                  {/* TABLE BODY */}
                  <tbody>
                    {jobs.map((job, index) => (
                      <tr
                        key={job._id}
                        className="
                          border-t border-gray-200
                          transition-all duration-300

                          hover:bg-gray-50

                          dark:border-gray-700
                          dark:hover:bg-gray-700
                        "
                      >
                        {/* INDEX */}
                        <td className="px-5 py-5 text-gray-700 dark:text-gray-200">
                          {index + 1}
                        </td>

                        {/* TITLE */}
                        <td className="px-5 py-5">
                          <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white">
                              {job.title}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                              {job.category}
                            </p>
                          </div>
                        </td>

                        {/* LOCATION */}
                        <td className="px-5 py-5 text-gray-700 dark:text-gray-200">
                          {job.location}
                        </td>

                        {/* APPLICANTS */}
                        <td className="px-5 py-5">
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                            {job.applicants || 0}
                          </span>
                        </td>

                        {/* DATE */}
                        <td className="px-5 py-5 text-gray-700 dark:text-gray-200">
                          {moment(job.date).format("ll")}
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-5">
                          <label className="inline-flex cursor-pointer items-center">
                            <input
                              type="checkbox"
                              checked={job.visible}
                              onChange={() => toggleVisibility(job._id)}
                              className="peer sr-only"
                            />

                            <div
                              className="
                                relative h-6 w-11 rounded-full
                                bg-gray-300 transition-all

                                peer-checked:bg-green-500
                              "
                            >
                              <div
                                className="
                                  absolute left-[2px] top-[2px]
                                  h-5 w-5 rounded-full bg-white
                                  transition-all

                                  peer-checked:translate-x-full
                                "
                              ></div>
                            </div>
                          </label>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-5 py-5">
                          <div className="flex flex-wrap items-center justify-center gap-3">
                            {/* APPLICANTS */}
                            <button
                              onClick={() => navigate("/view-applications")}
                              className="
                                rounded-xl
                                bg-blue-600
                                px-4 py-2
                                text-sm font-medium text-white
                                transition-all duration-300

                                hover:bg-blue-700
                                hover:shadow-lg
                              "
                            >
                              Applicants
                            </button>

                            {/* EDIT */}
                            <button
                              onClick={() => navigate(`/edit-job/${job._id}`)}
                              className="
                                rounded-xl border border-blue-300
                                px-4 py-2
                                text-sm font-medium text-blue-600
                                transition-all duration-300

                                hover:bg-blue-50
                              "
                            >
                              Edit
                            </button>

                            {/* DELETE */}
                            <button
                              onClick={() => handleDeleteJob(job._id)}
                              className="
                                rounded-xl border border-red-300
                                px-4 py-2
                                text-sm font-medium text-red-500
                                transition-all duration-300

                                hover:bg-red-50
                              "
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ManageJobs;
