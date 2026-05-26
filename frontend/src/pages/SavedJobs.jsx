import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import JobCard from "../components/JobCard";

const SavedJobs = () => {
  const { savedJobs } = useContext(AppContext);

  return (
    <div className="container 2xl:px-20 mx-auto py-10 px-4 text-gray-900 dark:text-white">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Saved Jobs
        </h1>

        <p className="text-gray-500 dark:text-gray-300 mt-2">
          Manage your bookmarked jobs
        </p>
      </div>

      {/* Empty State */}
      {savedJobs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700">No Saved Jobs</h2>

          <p className="text-gray-500 dark:text-gray-300 mt-2">
            Save jobs to view them later.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
