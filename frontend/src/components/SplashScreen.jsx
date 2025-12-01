/* eslint-disable no-unused-vars */
// SplashScreen.jsx
import React from "react";
import { motion } from "motion/react";
import Logo from "../assets/images/logo-siladan.png";

function SplashScreen() {
  return (
    <div className="relative flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 overflow-hidden">
      <div className="flex flex-col items-center text-center space-y-6 z-10">
        {/* Logo */}
        <motion.img
          src={Logo}
          alt="Siladan Logo"
          className="w-45 h-45 md:w-56 md:h-56 object-contain drop-shadow-2xl"
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            duration: 1.2,
            easing: "ease-out",
          }}
        />

        {/* App Name */}
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-white tracking-wide drop-shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.7,
            easing: "ease-out",
          }}
        >
          SILADAN
        </motion.h1>

        {/* Description */}
        <motion.p
          className="px-6 md:px-0 text-base md:text-lg text-gray-200 max-w-xl leading-relaxed"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: 1.2,
            easing: "ease-out",
          }}
        >
          Portal layanan resmi untuk pengaduan aset dan permintaan layanan
          pemerintahan dengan sistem pemantauan real-time.
        </motion.p>
      </div>

      {/* Soft glow animation behind the logo */}
      <motion.div
        className="absolute w-72 h-72 bg-indigo-500/30 blur-3xl rounded-full"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [0.9, 1.2, 0.9],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "mirror",
          easing: "ease-in-out",
        }}
      />
    </div>
  );
}

export default SplashScreen;
