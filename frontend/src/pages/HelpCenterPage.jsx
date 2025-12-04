import React, { useState } from "react";

import HeroSection from "../features/help/components/HeroSection";
import FAQSection from "../features/help/components/FAQSection";
import KnowledgeBaseGrid from "../features/help/components/KnowledgeBaseGrid";
import FloatingHelpButton from "../features/help/components/FloatingHelpButton";

const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  // Note:`searchQuery` can be pass to komponen FAQ and KnowledgeBase

  return (
    <div className="min-h-screen bg-white dark:bg-slate-800">
      {/* 1. Hero & Search */}
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* 2. FAQ Accordion */}
      <FAQSection />

      {/* 3. Knowledge Base Categories & Popular Articles */}
      <KnowledgeBaseGrid />

      {/* 5. Floating Action Button */}
      <FloatingHelpButton />
    </div>
  );
};

export default HelpCenterPage;
