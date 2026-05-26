import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";

import { useAuth, useUser } from "@clerk/clerk-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Applications = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const {
    backendUrl,
    userData,
    userApplications,
    fetchUserData,
    fetchUserApplications,
  } = useContext(AppContext);

  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);

  const [resumeFile, setResumeFile] = useState(null);

  const [uploading, setUploading] = useState(false);

  // ==========================================
  // LOAD DATA
  // ==========================================
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!user) return;

        const token = await getToken();

        if (!token) return;

        await fetchUserData(token);

        await fetchUserApplications(token);
      } catch (error) {
        console.log(error);

        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // ==========================================
  // UPLOAD RESUME
  // ==========================================
  const handleResumeUpload = async () => {
    try {
      if (!resumeFile) {
        return toast.error("Please select resume");
      }

      setUploading(true);

      const token = await getToken();

      const formData = new FormData();

      formData.append("resume", resumeFile);

      const { data } = await axios.post(
        `${backendUrl}/api/users/update-resume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // SUCCESS
      if (data.success) {
        toast.success("Resume uploaded successfully");

        await fetchUserData(token);

        setResumeFile(null);

        setIsEditing(false);
      }

      // FAILED
      else {
        toast.error(data.message || "Upload failed");
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================
  const getStatusStyle = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-600";

      case "Rejected":
        return "bg-red-100 text-red-600";

      default:
        return "bg-yellow-100 text-yellow-600";
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center">
          <Loading />
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 transition-colors duration-300">
        <div className="container 2xl:px-20 mx-auto px-4">
          {/* ========================================== */}
          {/* RESUME SECTION */}
          {/* ========================================== */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Your Resume
                </h2>

                <p className="text-gray-500 dark:text-gray-300 mt-2">
                  Upload your latest resume for recruiters
                </p>
              </div>

              {/* NO RESUME / EDIT MODE */}
              {isEditing || !userData?.resume ? (
                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer">
                    <div className="flex items-center gap-3 bg-blue-50 dark:bg-gray-700 px-4 py-3 rounded-xl border border-blue-200 dark:border-gray-600">
                      <img
                        src={assets.profile_upload_icon}
                        alt="upload"
                        className="w-6 h-6"
                      />

                      <span className="text-sm text-gray-700 dark:text-white">
                        {resumeFile ? resumeFile.name : "Select Resume"}
                      </span>
                    </div>

                    <input
                      type="file"
                      hidden
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                    />
                  </label>

                  <button
                    onClick={handleResumeUpload}
                    disabled={uploading}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl transition"
                  >
                    {uploading ? "Uploading..." : "Save Resume"}
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <a
                    href={userData.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
                  >
                    View Resume
                  </a>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="border border-gray-300 dark:border-gray-600 px-5 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Edit Resume
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ========================================== */}
          {/* APPLICATIONS */}
          {/* ========================================== */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* HEADER */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Your Applications
              </h2>

              <p className="text-gray-500 dark:text-gray-300 mt-2">
                Track all jobs you applied for
              </p>
            </div>

            {/* EMPTY */}
            {userApplications.length === 0 ? (
              <div className="p-10 text-center">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                  No Applications Yet
                </h3>

                <p className="text-gray-500 dark:text-gray-300 mt-2">
                  Start applying for jobs to see them here
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="text-left py-4 px-4">Company</th>

                      <th className="text-left py-4 px-4 hidden md:table-cell">
                        Job Title
                      </th>

                      <th className="text-left py-4 px-4 hidden md:table-cell">
                        Location
                      </th>

                      <th className="text-left py-4 px-4 hidden md:table-cell">
                        Date
                      </th>

                      <th className="text-left py-4 px-4">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {userApplications.map((app) => (
                      <tr
                        key={app._id}
                        className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        {/* COMPANY */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={app.companyId?.image}
                              alt="company"
                              className="w-10 h-10 rounded-full object-cover"
                            />

                            <span className="font-medium">
                              {app.companyId?.name}
                            </span>
                          </div>
                        </td>

                        {/* JOB */}
                        <td className="py-4 px-4 hidden md:table-cell">
                          {app.jobId?.title}
                        </td>

                        {/* LOCATION */}
                        <td className="py-4 px-4 hidden md:table-cell">
                          {app.jobId?.location}
                        </td>

                        {/* DATE */}
                        <td className="py-4 px-4 hidden md:table-cell">
                          {moment(app.date).format("ll")}
                        </td>

                        {/* STATUS */}
                        <td className="py-4 px-4">
                          <span
                            className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                              app.status,
                            )}`}
                          >
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Applications;
