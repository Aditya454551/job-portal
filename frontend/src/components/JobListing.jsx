import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { jobCategories, jobLocations } from "../assets/assets";
import JobCard from "./JobCard";

const JobListing = () => {
  const { jobs, searchFilter } = useContext(AppContext);

  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [sortOption, setSortOption] = useState("latest");

  const [filteredJobs, setFilteredJobs] = useState([]);

  // ================= CATEGORY FILTER =================
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  // ================= LOCATION FILTER =================
  const toggleLocation = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location],
    );
  };

  // ================= FILTER + SORT =================
  useEffect(() => {
    let filtered = [...jobs];

    // SEARCH FILTER
    if (searchFilter.title) {
      filtered = filtered.filter((job) => {
        const searchText = searchFilter.title.toLowerCase();

        return (
          job.title?.toLowerCase().includes(searchText) ||
          job.category?.toLowerCase().includes(searchText) ||
          job.companyId?.name?.toLowerCase().includes(searchText)
        );
      });
    }

    if (searchFilter.location) {
      filtered = filtered.filter((job) =>
        job.location
          ?.toLowerCase()
          .includes(searchFilter.location.toLowerCase()),
      );
    }

    // CATEGORY FILTER
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((job) =>
        selectedCategories.some((category) =>
          job.category
            ?.toLowerCase()
            .trim()
            .includes(category.toLowerCase().trim()),
        ),
      );
    }

    // LOCATION FILTER
    if (selectedLocations.length) {
      filtered = filtered.filter((job) =>
        selectedLocations.includes(job.location),
      );
    }

    // SORTING
    if (sortOption === "latest") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === "salaryHigh") {
      filtered.sort((a, b) => b.salary - a.salary);
    } else if (sortOption === "salaryLow") {
      filtered.sort((a, b) => a.salary - b.salary);
    }

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [jobs, searchFilter, selectedCategories, selectedLocations, sortOption]);

  // ================= PAGINATION =================
  const jobsPerPage = 6;

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage,
  );

  return (
    <div className="container mx-auto px-4 py-12 2xl:px-20">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* ================= SIDEBAR ================= */}
        <aside className="w-full lg:w-[290px]">
          {/* MOBILE FILTER BUTTON */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="
              mb-4 w-full rounded-2xl
              border border-gray-200
              bg-white px-5 py-3
              text-sm font-semibold
              shadow-sm transition-all duration-300

              hover:shadow-md

              dark:border-gray-700
              dark:bg-gray-900
              dark:text-white

              lg:hidden
            "
          >
            {showFilter ? "Close Filters" : "Open Filters"}
          </button>

          {/* FILTER CARD */}
          <div
            className={`
              ${showFilter ? "block" : "hidden"}

              lg:block

              sticky top-28

              rounded-3xl
              border border-gray-200/70
              bg-white/80
              p-6
              shadow-lg
              backdrop-blur-xl

              dark:border-gray-700
              dark:bg-gray-900/80
            `}
          >
            {/* FILTER HEADER */}
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Filters
              </h3>

              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedLocations([]);
                }}
                className="
                  text-sm font-medium text-blue-600
                  hover:text-blue-700
                "
              >
                Clear
              </button>
            </div>

            {/* CATEGORIES */}
            <div className="mb-8">
              <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white">
                Categories
              </h4>

              <div className="space-y-3">
                {jobCategories.map((cat, i) => (
                  <label
                    key={i}
                    className="
                      flex cursor-pointer items-center gap-3
                      rounded-xl px-3 py-2
                      transition-all duration-300

                      hover:bg-blue-50
                      dark:hover:bg-gray-800
                    "
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="
                        h-4 w-4 rounded
                        border-gray-300 text-blue-600
                        focus:ring-blue-500
                      "
                    />

                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* LOCATIONS */}
            <div>
              <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white">
                Locations
              </h4>

              <div className="space-y-3">
                {jobLocations.map((loc, i) => (
                  <label
                    key={i}
                    className="
                      flex cursor-pointer items-center gap-3
                      rounded-xl px-3 py-2
                      transition-all duration-300

                      hover:bg-blue-50
                      dark:hover:bg-gray-800
                    "
                  >
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(loc)}
                      onChange={() => toggleLocation(loc)}
                      className="
                        h-4 w-4 rounded
                        border-gray-300 text-blue-600
                        focus:ring-blue-500
                      "
                    />

                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {loc}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ================= JOB LIST ================= */}
        <section className="flex-1">
          {/* TOP BAR */}
          <div
            className="
              mb-8 flex flex-col gap-4
              rounded-3xl border border-gray-200/70
              bg-white/80 p-5
              shadow-md backdrop-blur-xl

              dark:border-gray-700
              dark:bg-gray-900/80

              md:flex-row
              md:items-center
              md:justify-between
            "
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                Latest Jobs
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Discover the newest opportunities for your career
              </p>
            </div>

            {/* SORT */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="
                rounded-2xl border border-gray-200
                bg-white px-5 py-3
                text-sm font-medium text-gray-700
                outline-none transition-all duration-300

                focus:border-blue-500
                focus:ring-4 focus:ring-blue-100

                dark:border-gray-700
                dark:bg-gray-900
                dark:text-white
              "
            >
              <option value="latest">Latest Jobs</option>
              <option value="salaryHigh">Salary: High → Low</option>
              <option value="salaryLow">Salary: Low → High</option>
            </select>
          </div>

          {/* JOB GRID */}
          {paginatedJobs.length === 0 ? (
            <div
              className="
                rounded-3xl border border-dashed border-gray-300
                bg-white/70 p-16 text-center
                shadow-sm

                dark:border-gray-700
                dark:bg-gray-900/70
              "
            >
              <h3 className="text-2xl font-bold text-gray-700 dark:text-white">
                No Jobs Found
              </h3>

              <p className="mt-3 text-gray-500 dark:text-gray-400">
                Try changing your filters or search keywords.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {paginatedJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              {/* PREV */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="
                  rounded-2xl border border-gray-200
                  bg-white px-4 py-3
                  text-sm font-medium
                  shadow-sm transition-all duration-300

                  hover:-translate-y-1
                  hover:shadow-md

                  dark:border-gray-700
                  dark:bg-gray-900
                  dark:text-white
                "
              >
                ← Prev
              </button>

              {/* PAGE NUMBERS */}
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`
                    h-11 w-11 rounded-2xl
                    text-sm font-semibold
                    transition-all duration-300

                    ${
                      currentPage === i + 1
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "border border-gray-200 bg-white text-gray-700 hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    }
                  `}
                >
                  {i + 1}
                </button>
              ))}

              {/* NEXT */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="
                  rounded-2xl border border-gray-200
                  bg-white px-4 py-3
                  text-sm font-medium
                  shadow-sm transition-all duration-300

                  hover:-translate-y-1
                  hover:shadow-md

                  dark:border-gray-700
                  dark:bg-gray-900
                  dark:text-white
                "
              >
                Next →
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default JobListing;
