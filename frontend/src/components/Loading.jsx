/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "motion/react";

const Loading = ({ message }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60"
      aria-labelledby="loading-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* Outer Circle */}
        <motion.div
          className="absolute w-20 h-20 rounded-full border-4 border-t-transparent border-[#429EBD]"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
          }}
        />

        {/* Center Circle (reverse) */}
        <motion.div
          className="absolute w-14 h-14 rounded-full border-4 border-t-transparent border-[#F7AD19]"
          animate={{ rotate: -360 }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "linear",
          }}
        />

        {/* Inner Circle */}
        <motion.div
          className="absolute w-8 h-8 rounded-full border-4 border-t-transparent border-[#9FE7F5]"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        />
      </div>

      {message && (
        <p
          id="loading-title"
          className="mt-4 text-lg font-medium text-white px-3 text-center max-w-3xl"
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Loading;
