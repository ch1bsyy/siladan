import React, { useState, useRef } from "react";
import HeroSection from "../features/help/components/HeroSection";
import FAQSection from "../features/help/components/FAQSection";
import KnowledgeBaseGrid from "../features/help/components/KnowledgeBaseGrid";
import FloatingHelpButton from "../features/help/components/FloatingHelpButton";

const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const resultsRef = useRef(null);

  const handleScrollToResults = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-800">
      {/* Hero & Search */}
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleScrollToResults}
      />

      <div ref={resultsRef} className="scroll-mt-20">
        {/* FAQ Accordion */}
        <FAQSection searchQuery={searchQuery} />
        {/* Knowledge Base Categories & Popular Articles */}
        <KnowledgeBaseGrid searchQuery={searchQuery} />
      </div>

      {/* Floating Action Button */}
      <FloatingHelpButton />
    </div>
  );
};

export default HelpCenterPage;
