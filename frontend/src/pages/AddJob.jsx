import React, { useContext, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { AppContext } from "../context/AppContext";
import { jobCategories } from "../assets/assets";

const AddJob = () => {
  const navigate = useNavigate();

  const { backendUrl, companyToken } = useContext(AppContext);

  // ==========================================
  // STATES
  // ==========================================
  const [jobData, setJobData] = useState({
    title: "",
    location: "",
    category: "",
    level: "",
    salary: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================
  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // HANDLE SUBMIT
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, location, category, level, salary, description } = jobData;

    if (!title || !location || !category || !level || !salary || !description) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/company/post-job`,
        jobData,
        {
          headers: {
            token: companyToken,
          },
        },
      );

      if (data.success) {
        toast.success("Job posted successfully");

        navigate("/manage-jobs");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-10 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 2xl:px-20">
          {/* HEADER */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Post New Job
            </h1>

            <p className="mt-2 text-gray-500 dark:text-gray-300">
              Create a new job opening for your company
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="
              rounded-3xl border border-gray-200
              bg-white p-8 shadow-sm
              dark:border-gray-700
              dark:bg-gray-800
            "
          >
            {/* JOB TITLE */}
            <div className="mb-6">
              <label className="mb-2 block font-medium dark:text-white">
                Job Title
              </label>

              <input
                type="text"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                placeholder="Senior React Developer"
                className="
                  w-full rounded-xl border
                  px-4 py-3 outline-none
                  focus:ring-2 focus:ring-blue-500
                  dark:border-gray-600
                  dark:bg-gray-900
                  dark:text-white
                "
              />
            </div>

            {/* LOCATION */}
            <div className="mb-6">
              <label className="mb-2 block font-medium dark:text-white">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={jobData.location}
                onChange={handleChange}
                placeholder="Bangalore, India"
                className="
                  w-full rounded-xl border
                  px-4 py-3 outline-none
                  focus:ring-2 focus:ring-blue-500
                  dark:border-gray-600
                  dark:bg-gray-900
                  dark:text-white
                "
              />
            </div>

            {/* CATEGORY + LEVEL */}
            <div className="mb-6 grid gap-6 md:grid-cols-2">
              {/* CATEGORY */}
              <div>
                <label className="mb-2 block font-medium dark:text-white">
                  Category
                </label>

                <select
                  name="category"
                  value={jobData.category}
                  onChange={handleChange}
                  className="
                    w-full rounded-xl border
                    px-4 py-3 outline-none
                    focus:ring-2 focus:ring-blue-500
                    dark:border-gray-600
                    dark:bg-gray-900
                    dark:text-white
                  "
                >
                  <option value="">Select Category</option>

                  {jobCategories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* EXPERIENCE LEVEL */}
              <div>
                <label className="mb-2 block font-medium dark:text-white">
                  Experience Level
                </label>

                <select
                  name="level"
                  value={jobData.level}
                  onChange={handleChange}
                  className="
                    w-full rounded-xl border
                    px-4 py-3 outline-none
                    focus:ring-2 focus:ring-blue-500
                    dark:border-gray-600
                    dark:bg-gray-900
                    dark:text-white
                  "
                >
                  <option value="">Select Level</option>

                  <option value="Internship">Internship</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Junior Level">Junior Level</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior Level">Senior Level</option>
                  <option value="Lead">Lead</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
            </div>

            {/* SALARY */}
            <div className="mb-6">
              <label className="mb-2 block font-medium dark:text-white">
                Salary
              </label>

              <input
                type="number"
                name="salary"
                value={jobData.salary}
                onChange={handleChange}
                placeholder="50000"
                className="
                  w-full rounded-xl border
                  px-4 py-3 outline-none
                  focus:ring-2 focus:ring-blue-500
                  dark:border-gray-600
                  dark:bg-gray-900
                  dark:text-white
                "
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mb-8">
              <label className="mb-2 block font-medium dark:text-white">
                Job Description
              </label>

              <div className="overflow-hidden rounded-xl bg-white dark:bg-gray-900">
                <ReactQuill
                  theme="snow"
                  value={jobData.description}
                  onChange={(value) =>
                    setJobData({
                      ...jobData,
                      description: value,
                    })
                  }
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`
                rounded-xl px-8 py-3
                font-medium text-white
                transition-all duration-300

                ${
                  loading
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
                }
              `}
            >
              {loading ? "Publishing Job..." : "Publish Job"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AddJob;
