import React, { useContext } from "react";

import { AppContext } from "../context/AppContext";

const DarkModeToggle = () => {
  const { darkMode, setDarkMode } = useContext(AppContext);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="border px-4 py-2 rounded-xl"
    >
      {darkMode ? "☀ Light" : "🌙 Dark"}
    </button>
  );
};

export default DarkModeToggle;
