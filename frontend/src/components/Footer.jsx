import React from "react";
import { Link } from "react-router-dom";

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";

import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer
      className="
        relative mt-20 overflow-hidden
        border-t border-gray-200/60
        bg-white/80 backdrop-blur-xl
        dark:border-gray-700/50
        dark:bg-gray-950/90
      "
    >
      {/* TOP GLOW */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -top-20 left-20 h-72 w-72 rounded-full bg-blue-300 blur-3xl dark:bg-blue-900"></div>

        <div className="absolute right-10 bottom-0 h-72 w-72 rounded-full bg-purple-300 blur-3xl dark:bg-purple-900"></div>
      </div>

      <div className="relative container mx-auto px-6 py-14 2xl:px-20">
        {/* MAIN GRID */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3">
              <img src={assets.logo} alt="logo" className="h-10 rounded-xl" />

              <h1 className="text-2xl font-bold text-blue-600">InsiderJobs</h1>
            </div>

            <p className="mt-5 text-sm leading-7 text-gray-600 dark:text-gray-300">
              Find your dream career with thousands of verified job
              opportunities from top companies around the world.
            </p>

            {/* SOCIALS */}
            <div className="mt-6 flex items-center gap-3">
              {[
                {
                  icon: <FaFacebookF />,
                  link: "#",
                },
                {
                  icon: <FaTwitter />,
                  link: "#",
                },
                {
                  icon: <FaInstagram />,
                  link: "#",
                },
                {
                  icon: <FaGithub />,
                  link: "#",
                },
                {
                  icon: <FaLinkedinIn />,
                  link: "#",
                },
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  className="
                    flex h-10 w-10 items-center justify-center
                    rounded-xl border border-gray-200
                    bg-white text-gray-700
                    shadow-sm transition-all duration-300

                    hover:-translate-y-1
                    hover:border-blue-500
                    hover:bg-blue-600
                    hover:text-white

                    dark:border-gray-700
                    dark:bg-gray-900
                    dark:text-gray-300
                  "
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white">
              Quick Links
            </h3>

            <div className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Find Jobs", path: "/" },
                { name: "Saved Jobs", path: "/saved-jobs" },
                { name: "Applications", path: "/applications" },
              ].map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="
                    block text-gray-600 transition-all duration-300
                    hover:translate-x-1 hover:text-blue-600
                    dark:text-gray-300
                  "
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* RECRUITER */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white">
              Recruiters
            </h3>

            <div className="space-y-3">
              {[
                "Post Jobs",
                "Manage Jobs",
                "View Applications",
                "Recruiter Dashboard",
              ].map((item, index) => (
                <p
                  key={index}
                  className="
                    cursor-pointer text-gray-600
                    transition-all duration-300

                    hover:translate-x-1
                    hover:text-blue-600

                    dark:text-gray-300
                  "
                >
                  {item}
                </p>
              ))}
            </div>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white">
              Stay Updated
            </h3>

            <p className="mb-5 text-sm leading-7 text-gray-600 dark:text-gray-300">
              Subscribe to get latest jobs and career updates.
            </p>

            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="
                  rounded-xl border border-gray-300
                  bg-white px-4 py-3
                  outline-none transition-all duration-300

                  focus:border-blue-500
                  focus:ring-2 focus:ring-blue-200

                  dark:border-gray-700
                  dark:bg-gray-900
                  dark:text-white
                "
              />

              <button
                className="
                  rounded-xl bg-gradient-to-r
                  from-blue-600 to-indigo-700
                  px-5 py-3 font-medium text-white
                  transition-all duration-300

                  hover:scale-[1.02]
                  hover:shadow-xl
                "
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div
          className="
            mt-14 flex flex-col items-center justify-between
            gap-5 border-t border-gray-200/70 pt-6

            dark:border-gray-700/60
            md:flex-row
          "
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2026 InsiderJobs. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <p className="cursor-pointer hover:text-blue-600">Privacy Policy</p>

            <p className="cursor-pointer hover:text-blue-600">
              Terms of Service
            </p>

            <p className="cursor-pointer hover:text-blue-600">Contact</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
