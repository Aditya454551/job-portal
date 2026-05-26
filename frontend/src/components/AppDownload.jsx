import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const AppDownload = () => {
  return (
    <section className="container mx-auto my-24 px-4 2xl:px-20">
      <div
        className="
          relative overflow-hidden
          rounded-[40px]
          border border-white/10
          bg-gradient-to-br
          from-[#0f172a]
          via-[#1e1b4b]
          to-[#312e81]
          px-8 py-14
          shadow-[0_20px_80px_rgba(0,0,0,0.25)]

          md:px-16
          lg:px-24
        "
      >
        {/* Glow Effects */}
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"></div>

        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl"></div>

        {/* Main Content */}
        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2">
          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            {/* Badge */}
            <div
              className="
                mb-5 inline-flex items-center gap-2
                rounded-full border border-white/20
                bg-white/10 px-4 py-2
                text-sm text-blue-100
                backdrop-blur-xl
              "
            >
              🚀 New Mobile Experience
            </div>

            {/* Heading */}
            <h1
              className="
                text-center text-4xl font-extrabold
                leading-tight text-white

                md:text-left
                lg:text-5xl
              "
            >
              Download Our
              <span className="block bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                JobConnect App
              </span>
            </h1>

            {/* Description */}
            <p
              className="
                mt-6 max-w-xl text-center
                text-lg leading-8 text-gray-300

                md:text-left
              "
            >
              Apply for jobs faster, track applications, save opportunities, and
              get instant recruiter updates directly on your smartphone.
            </p>

            {/* Features */}
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                "1-Click Apply",
                "Live Notifications",
                "Save Jobs",
                "Fast Search",
              ].map((item, index) => (
                <div
                  key={index}
                  className="
                    rounded-full bg-white/10
                    px-4 py-2 text-sm
                    text-gray-200 backdrop-blur-xl
                  "
                >
                  ✨ {item}
                </div>
              ))}
            </div>

            {/* Store Buttons */}
            <div
              className="
                mt-10 flex flex-wrap
                items-center justify-center
                gap-5 md:justify-start
              "
            >
              <Link to="#">
                <motion.img
                  whileHover={{
                    scale: 1.08,
                    y: -3,
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="
                    h-14 cursor-pointer
                    rounded-xl shadow-lg
                  "
                  src={assets.play_store}
                  alt="Google Play"
                />
              </Link>

              <Link to="#">
                <motion.img
                  whileHover={{
                    scale: 1.08,
                    y: -3,
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="
                    h-14 cursor-pointer
                    rounded-xl shadow-lg
                  "
                  src={assets.app_store}
                  alt="App Store"
                />
              </Link>
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="
              relative hidden
              items-center justify-center
              lg:flex
            "
          >
            {/* Glow */}
            <div
              className="
                absolute h-80 w-80
                rounded-full bg-blue-500/20
                blur-3xl
              "
            ></div>

            {/* Image */}
            <motion.img
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="
                relative z-10
                w-full max-w-md
                object-contain
                drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]
              "
              src={assets.app_main_img}
              alt="App Preview"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
