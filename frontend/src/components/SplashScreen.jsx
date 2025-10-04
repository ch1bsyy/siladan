import React, { useEffect } from "react";
import { animate } from "animejs";
import logo from "../assets/logo-siladan.png";

const SplashScreen = () => {
  useEffect(() => {
    const timeline = animate.timeline({
      easing: "easeOutExpo",
      duration: 1500,
    });

    timeline
      .add({
        targets: "#splash-logo",
        opacity: [0, 1],
        scale: [0.8, 1],
        translateY: [20, 0],
      })
      .add(
        {
          targets: "#splash-text-wrapper > span",
          opacity: [0, 1],
          translateY: [20, 0],
          delay: animate.stagger(100),
        },
        "-=1000"
      ); // start text animation 1000ms before logo animation finish;
  }, []);

  const text = "Sistem Layanan dan Aduan TI Pemerintah";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center bg-white dark:bg-gray-900">
      <div className="text-center">
        {/* Logo */}
        <img
          id="splash-logo"
          src={logo}
          alt="SILADAN Logo"
          className="w-24 h-24 mx-auto mb-4 opacity-0"
        />

        {/* Text */}
        <div id="splash-text-wrapper" className="mt-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-wider">
            SILADAN
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {text.split(" ").map((word, index) => (
              <span key={index} className="inline-block opacity-0">
                {word}&nbsp;
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
