import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const RecruiterLayout = () => {
  const location = useLocation();

  const navLinks = [
    {
      name: "Dashboard",
      path: "/recruiter/dashboard",
    },
    {
      name: "Add Job",
      path: "/recruiter/add-job",
    },
    {
      name: "Manage Jobs",
      path: "/recruiter/manage-jobs",
    },
    {
      name: "Applications",
      path: "/recruiter/applications",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r hidden lg:block">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-blue-600">Recruiter Panel</h2>
        </div>

        <div className="p-4 space-y-2">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 rounded-xl transition ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default RecruiterLayout;
