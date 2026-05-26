import React, { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { AppContext } from "../context/AppContext";

const ForgotPassword = () => {
  const { backendUrl } = useContext(AppContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Enter email");
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/company/forgot-password`,
        { email },
      );

      if (data.success) {
        toast.success("Reset link sent");

        navigate("/reset-password");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
        >
          <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>

          <p className="text-gray-500 mb-6">
            Enter your email to receive reset link
          </p>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 mb-5 outline-none"
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default ForgotPassword;
