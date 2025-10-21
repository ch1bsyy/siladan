import React from "react";
import HeroSection from "../features/home/components/HeroSection";
import WorkflowSection from "../features/home/components/WorkflowSection";
import ServicesSection from "../features/home/components/ServicesSection";

const HomePage = () => {
  return (
    <div>
      <HeroSection />

      <WorkflowSection />

      <ServicesSection />

      <section className="py-16 md:py-24 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#053F5C] dark:text-white">
            Section Lainnya
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
            Fitur unggulan, alur pengaduan, atau tautan ke halaman 'Tentang
            Kami'.
          </p>
          {/* <HowItWorksSection /> */}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
