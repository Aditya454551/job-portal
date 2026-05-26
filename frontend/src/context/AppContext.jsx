import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  // ==========================================
  // ENV
  // ==========================================
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ==========================================
  // CLERK
  // ==========================================
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  // ==========================================
  // STATES
  // ==========================================
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  const [companyApplications, setCompanyApplications] = useState([]);

  // SEARCH FILTER
  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });

  const [isSearched, setIsSearched] = useState(false);

  // UI
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  // DARK MODE
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true",
  );

  // COMPANY AUTH
  const [companyToken, setCompanyToken] = useState(
    localStorage.getItem("companyToken") || "",
  );

  const [companyData, setCompanyData] = useState(
    JSON.parse(localStorage.getItem("companyData")) || null,
  );

  // ==========================================
  // DARK MODE
  // ==========================================
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // ==========================================
  // GET AUTH TOKEN
  // ==========================================
  const getAuthToken = async () => {
    try {
      return await getToken();
    } catch {
      return null;
    }
  };

  // ==========================================
  // FETCH JOBS
  // ==========================================
  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);

      const { data } = await axios.get(`${backendUrl}/api/jobs`);

      if (data.success) {
        setJobs(data.jobs.reverse());
      }
    } catch {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoadingJobs(false);
    }
  };

  // ==========================================
  // APPLY JOB
  // ==========================================
  const applyForJob = async (jobId) => {
    try {
      const token = await getAuthToken();

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`,
        { jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        toast.success(data.message);

        fetchUserApplications(token);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed");
    }
  };

  // ==========================================
  // FETCH USER APPLICATIONS
  // ==========================================
  const fetchUserApplications = async (token) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/users/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUserApplications(data.applications);
      }
    } catch {
      toast.error("Failed to fetch applications");
    }
  };

  // ==========================================
  // FETCH SAVED JOBS
  // ==========================================
  const fetchSavedJobs = async (passedToken) => {
    try {
      const token = passedToken || (await getAuthToken());

      if (!token) return;

      const { data } = await axios.get(`${backendUrl}/api/users/saved-jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setSavedJobs(data.savedJobs);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // ==========================================
  // TOGGLE SAVE JOB
  // ==========================================
  const toggleSaveJob = async (jobId) => {
    try {
      const token = await getAuthToken();

      if (!token) {
        toast.error("Please login first");
        return false;
      }

      const { data } = await axios.post(
        `${backendUrl}/api/users/save-job`,
        { jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        toast.success(data.message);

        fetchSavedJobs(token);

        return true;
      }

      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save job");

      return false;
    }
  };

  // ==========================================
  // FETCH USER DATA
  // ==========================================
  const fetchUserData = async (token) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/users/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUserData(data.user);
      }
    } catch {
      toast.error("Failed to fetch user data");
    }
  };

  // ==========================================
  // FETCH COMPANY DATA
  // ==========================================
  const fetchCompanyData = async () => {
    try {
      if (!companyToken) return;

      const { data } = await axios.get(`${backendUrl}/api/company/company`, {
        headers: {
          token: companyToken,
        },
      });

      if (data.success) {
        setCompanyData(data.company);

        localStorage.setItem("companyData", JSON.stringify(data.company));
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed to fetch company data");
    }
  };

  // ==========================================
  // FETCH COMPANY APPLICATIONS
  // ==========================================
  const fetchCompanyApplications = async () => {
    try {
      if (!companyToken) return;

      const { data } = await axios.get(
        `${backendUrl}/api/company/applications`,
        {
          headers: {
            token: companyToken,
          },
        },
      );

      if (data.success) {
        setCompanyApplications(data.applications);
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed to fetch company applications");
    }
  };

  // ==========================================
  // LOAD JOBS
  // ==========================================
  useEffect(() => {
    fetchJobs();
  }, []);

  // ==========================================
  // LOAD USER DATA
  // ==========================================
  useEffect(() => {
    const loadUserData = async () => {
      if (!isLoaded || !user) return;

      const token = await getAuthToken();

      if (!token) return;

      fetchUserData(token);
      fetchUserApplications(token);
      fetchSavedJobs(token);
    };

    loadUserData();
  }, [user, isLoaded]);

  // ==========================================
  // LOAD COMPANY DATA
  // ==========================================
  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  // ==========================================
  // STORE COMPANY TOKEN
  // ==========================================
  useEffect(() => {
    if (companyToken) {
      localStorage.setItem("companyToken", companyToken);
    } else {
      localStorage.removeItem("companyToken");
      localStorage.removeItem("companyData");
    }
  }, [companyToken]);

  // ==========================================
  // CONTEXT VALUE
  // ==========================================
  const value = {
    backendUrl,

    jobs,
    setJobs,

    loadingJobs,
    fetchJobs,

    userData,
    setUserData,
    fetchUserData,

    userApplications,
    fetchUserApplications,

    savedJobs,
    fetchSavedJobs,

    searchFilter,
    setSearchFilter,

    isSearched,
    setIsSearched,

    applyForJob,
    toggleSaveJob,

    companyToken,
    setCompanyToken,

    companyData,
    setCompanyData,
    fetchCompanyData,

    companyApplications,
    setCompanyApplications,
    fetchCompanyApplications,

    showRecruiterLogin,
    setShowRecruiterLogin,

    darkMode,
    setDarkMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
