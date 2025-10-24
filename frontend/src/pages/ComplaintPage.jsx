import React from "react";
import ComplaintForm from "../features/complaint/components/ComplaintForm";

const ComplaintPage = () => {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ComplaintForm />
      </div>
    </div>
  );
};

export default ComplaintPage;
