import React, { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { AppContext } from "../context/AppContext";

const EditJob = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { backendUrl, companyToken } = useContext(AppContext);

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");

  // ==========================================
  // FETCH JOB
  // ==========================================
  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);

      if (data.success) {
        const job = data.job;

        setTitle(job.title);
        setDescription(job.description);
        setLocation(job.location);
        setSalary(job.salary);
        setCategory(job.category);
        setLevel(job.level);
      }
    } catch {
      toast.error("Failed to load job");
    }
  };

  // ==========================================
  // UPDATE JOB
  // ==========================================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axios.put(
        `${backendUrl}/api/company/update-job/${id}`,
        {
          title,
          description,
          location,
          salary,
          category,
          level,
        },
        {
          headers: {
            token: companyToken,
          },
        },
      );

      if (data.success) {
        toast.success("Job updated");

        navigate("/manage-jobs");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container 2xl:px-20 mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Edit Job</h1>
          </div>

          <form
            onSubmit={handleUpdate}
            className="bg-white p-8 rounded-2xl shadow"
          >
            {/* TITLE */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">Job Title</label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            {/* LOCATION */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">Location</label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            {/* CATEGORY + LEVEL */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 font-medium">Category</label>

                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Level</label>

                <input
                  type="text"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>
            </div>

            {/* SALARY */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">Salary</label>

              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mb-8">
              <label className="block mb-2 font-medium">Description</label>

              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
              />
            </div>

            <button
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
            >
              {loading ? "Updating..." : "Update Job"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EditJob;
