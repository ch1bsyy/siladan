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
    </div>
  );
};

export default HomePage;
