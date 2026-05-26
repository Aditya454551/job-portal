import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RecruiterChart = ({
  totalJobs,
  totalApplications,
  acceptedApplications,
}) => {
  const data = [
    {
      name: "Jobs",
      value: totalJobs,
    },
    {
      name: "Applications",
      value: totalApplications,
    },
    {
      name: "Accepted",
      value: acceptedApplications,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow border">
      <h2 className="text-2xl font-bold mb-6">Recruiter Analytics</h2>

      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="value" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RecruiterChart;
