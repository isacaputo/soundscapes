import React from "react";
import { AudioProvider } from "./contexts/audio";
import { PlaybackProvider } from "./contexts/playback";
import { AppContent } from "./components/AppContent";

// Main App component with providers
export default function App() {
  return (
    <AudioProvider>
      <PlaybackProvider>
        <AppContent />
      </PlaybackProvider>
    </AudioProvider>
  );
}
