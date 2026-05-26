import React from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import JobListing from "../components/JobListing";
import AppDownload from "../components/AppDownload";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="container 2xl:px-20 mx-auto px-4 pt-8">
        <Hero />
      </section>

      {/* ================= JOB LISTING ================= */}
      <section className="container 2xl:px-20 mx-auto px-4 py-14">
        <JobListing />
      </section>

      {/* ================= APP DOWNLOAD ================= */}
      <section className="container 2xl:px-20 mx-auto px-4 py-10">
        <AppDownload />
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
};

export default Home;
