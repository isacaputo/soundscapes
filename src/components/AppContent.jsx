import React from "react";
import "./AppContent.css";

// Import new components
import {
  Header,
  MainSequenceSection,
  BackgroundSequenceSection,
  ControlsSection,
} from "./index";

export const AppContent = () => {
  return (
    <div className="board">
      <Header />

      <MainSequenceSection />

      <BackgroundSequenceSection />

      <ControlsSection />
    </div>
  );
};
