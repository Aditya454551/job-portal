import React from "react";
import { Link } from "react-router-dom";

const MobileMenu = ({ menuOpen, setMenuOpen, companyToken }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-screen w-72 bg-white shadow-2xl z-50 transition-transform duration-300 ${
        menuOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-5 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold">Menu</h2>

        <button onClick={() => setMenuOpen(false)} className="text-2xl">
          ×
        </button>
      </div>

      <div className="flex flex-col p-5 gap-5">
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>

        <Link to="/applications" onClick={() => setMenuOpen(false)}>
          Applications
        </Link>

        <Link to="/saved-jobs" onClick={() => setMenuOpen(false)}>
          Saved Jobs
        </Link>

        {companyToken && (
          <>
            <Link to="/manage-jobs" onClick={() => setMenuOpen(false)}>
              Manage Jobs
            </Link>

            <Link to="/add-job" onClick={() => setMenuOpen(false)}>
              Add Job
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
