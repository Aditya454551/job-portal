import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

import { AppContext } from "../context/AppContext";

const ViewApplications = () => {
  // ==============================
  // CONTEXT
  // ==============================
  const { backendUrl, companyToken } = useContext(AppContext);

  // ==============================
  // STATE
  // ==============================
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==============================
  // FETCH APPLICATIONS
  // ==============================
  const fetchApplications = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/company/applications`,
        {
          headers: {
            token: companyToken,
          },
        },
      );

      if (data.success) {
        setApplications(data.applications.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);

      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // UPDATE STATUS
  // ==============================
  const updateApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-status`,
        {
          id,
          status,
        },
        {
          headers: {
            token: companyToken,
          },
        },
      );

      if (data.success) {
        toast.success(data.message);

        fetchApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);

      toast.error("Failed to update application");
    }
  };

  // ==============================
  // LOAD APPLICATIONS
  // ==============================
  useEffect(() => {
    if (companyToken) {
      fetchApplications();
    }
  }, [companyToken]);

  // ==============================
  // LOADING STATE
  // ==============================
  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex justify-center items-center">
          <Loading />
        </div>

        <Footer />
      </>
    );
  }

  // ==============================
  // EMPTY STATE
  // ==============================
  if (applications.length === 0) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex flex-col justify-center items-center px-4">
          <h2 className="text-3xl font-bold text-gray-700">
            No Applications Found
          </h2>

          <p className="text-gray-500 mt-3 text-center">
            Applications will appear here once candidates apply.
          </p>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container 2xl:px-20 mx-auto px-4">
          {/* ============================== */}
          {/* HEADER */}
          {/* ============================== */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Job Applications
            </h1>

            <p className="text-gray-500 mt-2">
              Manage all candidate applications
            </p>
          </div>

          {/* ============================== */}
          {/* TABLE */}
          {/* ============================== */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">
                      Candidate
                    </th>

                    <th className="text-left px-6 py-4 font-semibold text-gray-700">
                      Job Title
                    </th>

                    <th className="text-left px-6 py-4 font-semibold text-gray-700">
                      Location
                    </th>

                    <th className="text-left px-6 py-4 font-semibold text-gray-700">
                      Resume
                    </th>

                    <th className="text-left px-6 py-4 font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="text-center px-6 py-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {applications
                    .filter((app) => app.userId && app.jobId)
                    .map((app) => (
                      <tr
                        key={app._id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        {/* USER */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={app.userId.image}
                              alt={app.userId.name}
                              className="w-12 h-12 rounded-full object-cover border"
                            />

                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {app.userId.name}
                              </h3>

                              <p className="text-sm text-gray-500">
                                {app.userId.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* JOB */}
                        <td className="px-6 py-5">
                          <p className="font-medium text-gray-700">
                            {app.jobId.title}
                          </p>
                        </td>

                        {/* LOCATION */}
                        <td className="px-6 py-5">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                            {app.jobId.location}
                          </span>
                        </td>

                        {/* RESUME */}
                        <td className="px-6 py-5">
                          {app.userId.resume ? (
                            <a
                              href={app.userId.resume}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:text-blue-700 font-medium underline"
                            >
                              View Resume
                            </a>
                          ) : (
                            <span className="text-gray-400">No Resume</span>
                          )}
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-5">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              app.status === "Accepted"
                                ? "bg-green-100 text-green-700"
                                : app.status === "Rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-5">
                          {app.status === "Pending" ? (
                            <div className="flex justify-center gap-3">
                              <button
                                onClick={() =>
                                  updateApplicationStatus(app._id, "Accepted")
                                }
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                              >
                                Accept
                              </button>

                              <button
                                onClick={() =>
                                  updateApplicationStatus(app._id, "Rejected")
                                }
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <div className="text-center text-gray-400 font-medium">
                              Completed
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ViewApplications;
