import React, { useContext, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { companyData, setCompanyData, setCompanyToken } =
    useContext(AppContext);

  // ✅ Logout
  const logout = () => {
    setCompanyToken(null);
    setCompanyData(null);
    localStorage.removeItem("companyToken");
    localStorage.removeItem("companyData");
    toast.success("Logged out");
    navigate("/");
  };

  // ✅ Redirect only once
  useEffect(() => {
    if (companyData) {
      navigate("/dashboard/manage-jobs");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <img
          src={assets.logo}
          alt="logo"
          className="cursor-pointer"
          onClick={() => navigate("/")}
        />

        {companyData && (
          <div className="flex items-center gap-4">
            <p className="hidden sm:block font-medium">{companyData.name}</p>

            <div className="relative group">
              <img
                src={companyData.image}
                className="w-10 h-10 rounded-full cursor-pointer"
              />

              <div className="absolute right-0 top-12 bg-white shadow rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                <button
                  onClick={logout}
                  className="px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Layout */}
      <div className="flex">
        {/* Sidebar */}
        <div className="bg-white border-r w-60 min-h-screen">
          <NavItem
            to="/dashboard/add-job"
            icon={assets.add_icon}
            label="Add Job"
          />
          <NavItem
            to="/dashboard/manage-jobs"
            icon={assets.home_icon}
            label="Manage Jobs"
          />
          <NavItem
            to="/dashboard/view-applications"
            icon={assets.person_tick_icon}
            label="Applications"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// ✅ Reusable Nav Item
const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-6 py-3 hover:bg-gray-100 ${
        isActive ? "bg-blue-100 border-r-4 border-blue-500" : ""
      }`
    }
  >
    <img src={icon} className="w-4" />
    <span className="hidden sm:block">{label}</span>
  </NavLink>
);

export default Dashboard;
