import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useClerk, useUser, UserButton } from "@clerk/clerk-react";

import {
  Menu,
  X,
  Moon,
  Sun,
  LayoutDashboard,
  BriefcaseBusiness,
} from "lucide-react";

import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();

  const { openSignIn } = useClerk();
  const { user } = useUser();

  const {
    setShowRecruiterLogin,
    companyToken,
    setCompanyToken,
    setCompanyData,
    darkMode,
    setDarkMode,
  } = useContext(AppContext);

  const [mobileMenu, setMobileMenu] = useState(false);

  // ================= LOGOUT =================
  const handleRecruiterLogout = () => {
    setCompanyToken("");
    setCompanyData(null);

    localStorage.removeItem("companyToken");
    localStorage.removeItem("companyData");

    navigate("/");
  };

  // ================= ACTIVE LINK =================
  const navClass = ({ isActive }) =>
    `
      relative font-medium transition-all duration-300
      ${
        isActive
          ? "text-blue-600"
          : "text-gray-700 hover:text-blue-600 dark:text-gray-200"
      }
    `;

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className="
          fixed top-0 left-0 z-50 w-full
          border-b border-gray-200/50
          bg-white/80 backdrop-blur-xl
          dark:border-gray-700/50
          dark:bg-gray-900/80
          shadow-sm
        "
      >
        <div
          className="
            mx-auto flex h-20 max-w-7xl
            items-center justify-between
            px-5 lg:px-8
          "
        >
          {/* ================= LOGO ================= */}
          <div
            onClick={() => navigate("/")}
            className="flex cursor-pointer items-center gap-3"
          >
            <img src={assets.logo} alt="logo" className="h-8 object-contain" />

            <h1 className="text-2xl font-extrabold tracking-tight text-blue-600">
              JobConnect
            </h1>
          </div>

          {/* ================= DESKTOP MENU ================= */}
          <div className="hidden items-center gap-8 lg:flex">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>

            {user && (
              <>
                <NavLink to="/applications" className={navClass}>
                  Applications
                </NavLink>

                <NavLink to="/saved-jobs" className={navClass}>
                  Saved Jobs
                </NavLink>
              </>
            )}

            {companyToken && (
              <>
                <NavLink to="/recruiter-dashboard" className={navClass}>
                  Dashboard
                </NavLink>

                <NavLink to="/manage-jobs" className={navClass}>
                  Manage Jobs
                </NavLink>
              </>
            )}
          </div>

          {/* ================= RIGHT ================= */}
          <div className="hidden items-center gap-4 lg:flex">
            {/* DARK MODE */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="
                rounded-xl border border-gray-200
                p-2 transition-all duration-300
                hover:bg-gray-100
                dark:border-gray-700
                dark:hover:bg-gray-800
              "
            >
              {darkMode ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {/* RECRUITER */}
            {!companyToken ? (
              <button
                onClick={() => setShowRecruiterLogin(true)}
                className="
                  rounded-xl
                  bg-blue-600 px-5 py-2.5
                  font-medium text-white
                  transition-all duration-300
                  hover:bg-blue-700
                "
              >
                Recruiter Login
              </button>
            ) : (
              <button
                onClick={handleRecruiterLogout}
                className="
                  rounded-xl
                  border border-red-200
                  px-5 py-2.5
                  font-medium text-red-500
                  transition-all duration-300
                  hover:bg-red-50
                "
              >
                Recruiter Logout
              </button>
            )}

            {/* USER */}
            {user ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <button
                onClick={() => openSignIn()}
                className="
                  rounded-xl
                  bg-gray-900 px-5 py-2.5
                  font-medium text-white
                  transition-all duration-300
                  hover:bg-black
                  dark:bg-white
                  dark:text-black
                "
              >
                Sign In
              </button>
            )}
          </div>

          {/* ================= MOBILE BUTTON ================= */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="lg:hidden"
          >
            {mobileMenu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {mobileMenu && (
          <div
            className="
              border-t border-gray-200
              bg-white px-5 py-5
              dark:border-gray-700
              dark:bg-gray-900
              lg:hidden
            "
          >
            <div className="flex flex-col gap-5">
              <Link to="/" onClick={() => setMobileMenu(false)}>
                Home
              </Link>

              {user && (
                <>
                  <Link to="/applications" onClick={() => setMobileMenu(false)}>
                    Applications
                  </Link>

                  <Link to="/saved-jobs" onClick={() => setMobileMenu(false)}>
                    Saved Jobs
                  </Link>
                </>
              )}

              {companyToken && (
                <>
                  <Link
                    to="/recruiter-dashboard"
                    onClick={() => setMobileMenu(false)}
                    className="flex items-center gap-2"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>

                  <Link
                    to="/manage-jobs"
                    onClick={() => setMobileMenu(false)}
                    className="flex items-center gap-2"
                  >
                    <BriefcaseBusiness size={18} />
                    Manage Jobs
                  </Link>
                </>
              )}

              {/* DARK MODE */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-left"
              >
                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </button>

              {/* RECRUITER */}
              {!companyToken ? (
                <button
                  onClick={() => {
                    setShowRecruiterLogin(true);
                    setMobileMenu(false);
                  }}
                  className="text-left font-medium text-blue-600"
                >
                  Recruiter Login
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleRecruiterLogout();
                    setMobileMenu(false);
                  }}
                  className="text-left font-medium text-red-500"
                >
                  Recruiter Logout
                </button>
              )}

              {/* USER */}
              {!user ? (
                <button
                  onClick={() => {
                    openSignIn();
                    setMobileMenu(false);
                  }}
                  className="text-left font-medium text-gray-900 dark:text-white"
                >
                  Sign In
                </button>
              ) : (
                <div className="pt-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ================= NAVBAR SPACER ================= */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;
