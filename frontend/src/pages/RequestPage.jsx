import React from "react";
import RequestForm from "../features/request/components/RequestForm";

const RequestPage = () => {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <RequestForm />
      </div>
    </div>
  );
};

export default RequestPage;
