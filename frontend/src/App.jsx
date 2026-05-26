import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "quill/dist/quill.snow.css";

import { AppContext } from "./context/AppContext";

// ================= PAGES =================
import Home from "./pages/Home";
import ApplyJob from "./pages/ApplyJob";
import Applications from "./pages/Applications";
import SavedJobs from "./pages/SavedJobs";

import RecruiterDashboard from "./pages/RecruiterDashboard";
import AddJob from "./pages/AddJob";
import ManageJobs from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EditJob from "./pages/EditJob";

// ================= COMPONENTS =================
import RecruiterLogin from "./components/RecruiterLogin";

const ProtectedRecruiterRoute = ({ children }) => {
  const companyToken = localStorage.getItem("companyToken");

  return companyToken ? children : <Navigate to="/" replace />;
};

const App = () => {
  const { showRecruiterLogin } = useContext(AppContext);

  return (
    <div
      className="
    min-h-screen

    bg-[radial-gradient(circle_at_top_left,_#dbeafe,_transparent_35%),radial-gradient(circle_at_bottom_right,_#ede9fe,_transparent_35%)]

    dark:bg-[radial-gradient(circle_at_top_left,_#1e293b,_transparent_30%),radial-gradient(circle_at_bottom_right,_#312e81,_transparent_30%)]

    bg-gray-50
    dark:bg-gray-950

    transition-all duration-500
  "
    >
      {/* ================= TOASTER ================= */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "14px",
            padding: "14px 18px",
            fontWeight: "500",
          },
        }}
      />

      {/* ================= LOGIN MODAL ================= */}
      {showRecruiterLogin && <RecruiterLogin />}

      {/* ================= ROUTES ================= */}
      <Routes>
        {/* USER */}
        <Route path="/" element={<Home />} />

        <Route path="/apply-job/:id" element={<ApplyJob />} />

        <Route path="/applications" element={<Applications />} />

        <Route path="/saved-jobs" element={<SavedJobs />} />

        {/* PASSWORD */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        {/* JOB */}
        <Route path="/edit-job/:id" element={<EditJob />} />

        {/* RECRUITER */}
        <Route
          path="/recruiter-dashboard"
          element={
            <ProtectedRecruiterRoute>
              <RecruiterDashboard />
            </ProtectedRecruiterRoute>
          }
        />

        <Route
          path="/add-job"
          element={
            <ProtectedRecruiterRoute>
              <AddJob />
            </ProtectedRecruiterRoute>
          }
        />

        <Route
          path="/manage-jobs"
          element={
            <ProtectedRecruiterRoute>
              <ManageJobs />
            </ProtectedRecruiterRoute>
          }
        />

        <Route
          path="/view-applications"
          element={
            <ProtectedRecruiterRoute>
              <ViewApplications />
            </ProtectedRecruiterRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
