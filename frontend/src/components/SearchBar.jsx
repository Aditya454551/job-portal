import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";

const SearchBar = () => {
  const { setSearchQuery } = useContext(AppContext);

  const [input, setInput] = useState("");

  // ================= DEBOUNCE =================
  useEffect(() => {
    const delay = setTimeout(() => {
      setSearchQuery(input);
    }, 400);

    return () => clearTimeout(delay);
  }, [input, setSearchQuery]);

  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search jobs or companies..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="
          w-full rounded-xl border border-gray-300
          bg-white px-4 py-3
          text-gray-800
          outline-none transition-all duration-300
          placeholder:text-gray-400
          focus:border-blue-500 focus:ring-2 focus:ring-blue-400

          dark:border-gray-700
          dark:bg-gray-900
          dark:text-white
          dark:placeholder:text-gray-500
        "
      />
    </div>
  );
};

export default SearchBar;
