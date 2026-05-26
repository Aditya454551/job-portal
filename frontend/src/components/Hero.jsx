import React, { useContext, useRef } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext);

  const titleRef = useRef(null);
  const locationRef = useRef(null);

  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });

    setIsSearched(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="2xl:px-20 mx-auto my-10 px-4">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e1b4b] via-[#4c1d95] to-[#be185d] py-16 text-white shadow-2xl">
        {/* Background circles */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 h-72 w-72 rounded-full bg-purple-300"></div>
          <div className="absolute bottom-10 right-20 h-96 w-96 rounded-full bg-blue-300"></div>
        </div>

        <div className="relative z-10 text-center">
          <h2 className="mb-4 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            Discover Your{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Dream Career
            </span>{" "}
            Opportunity
          </h2>

          <p className="mx-auto mb-8 max-w-2xl px-5 text-lg text-gray-200">
            Explore over{" "}
            <span className="font-semibold text-yellow-300">20,000+</span>{" "}
            curated job openings. Your next career breakthrough starts here.
          </p>

          {/* Search Box */}
          <div className="mx-auto flex max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900 md:flex-row">
            {/* Title Input */}
            <div className="flex flex-1 items-center border-b border-gray-200 px-4 py-4 dark:border-gray-700 md:border-b-0 md:border-r">
              <img
                src={assets.search_icon}
                alt="search"
                className="mr-3 h-5 w-5 opacity-70"
              />

              <input
                type="text"
                ref={titleRef}
                onKeyDown={handleKeyPress}
                placeholder="Job title, skills, or company"
                className="w-full bg-transparent text-gray-700 outline-none placeholder:text-gray-400 dark:text-white"
              />
            </div>

            {/* Location Input */}
            <div className="flex flex-1 items-center border-b border-gray-200 px-4 py-4 dark:border-gray-700 md:border-b-0 md:border-r">
              <img
                src={assets.location_icon}
                alt="location"
                className="mr-3 h-5 w-5 opacity-70"
              />

              <input
                type="text"
                ref={locationRef}
                onKeyDown={handleKeyPress}
                placeholder="Location or remote"
                className="w-full bg-transparent text-gray-700 outline-none placeholder:text-gray-400 dark:text-white"
              />
            </div>

            {/* Button */}
            <button
              onClick={onSearch}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-4 font-semibold text-white transition-all duration-300 hover:from-blue-700 hover:to-indigo-800"
            >
              Search Jobs
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-300">
            Try: "Frontend Developer", "Remote", "Project Manager"
          </p>
        </div>
      </div>

      {/* Trusted Companies */}
      <div className="mx-auto mt-8 rounded-3xl bg-white p-6 shadow-lg transition-colors duration-300 dark:bg-gray-900">
        <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
          Trusted by leading companies worldwide
        </p>

        <div className="grid grid-cols-2 gap-8 place-items-center md:grid-cols-3 lg:grid-cols-6">
          {[
            assets.microsoft_logo,
            assets.walmart_logo,
            assets.samsung_logo,
            assets.adobe_logo,
            assets.amazon_logo,
            assets.accenture_logo,
          ].map((logo, index) => (
            <div
              key={index}
              className="rounded-xl p-3 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <img
                src={logo}
                alt="company-logo"
                className="h-7 object-contain grayscale transition-all duration-300 hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
