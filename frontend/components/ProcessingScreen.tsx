'use client';

import React, { useState, useEffect } from 'react';

const messages = [
  "Analyzing visual cues...",
  "Gemini is transcribing your voice...",
  "Syncing audio with the script...",
  "Polishing the final result...",
  "Almost there..."
];

const ProcessingScreen: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 p-6 text-center">
      {/* Animated Spinner */}
      <div className="mb-8 h-24 w-24">
        <div className="h-full w-full animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500"></div>
      </div>
      
      {/* Heading & Pulse Message */}
      <h2 className="mb-4 text-3xl font-bold text-white">AI Magic in Progress</h2>
      <p className="min-h-[1.5em] animate-pulse text-xl text-indigo-400">
        {messages[messageIndex]}
      </p>
      
      {/* Progress Bar */}
      <div className="mt-12 h-2 w-full max-w-xs overflow-hidden rounded-full bg-gray-800">
        <div className="h-full w-full origin-left bg-indigo-500 animate-progress"></div>
      </div>

      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 bg-indigo-500/10 blur-[100px]"></div>
    </div>
  );
};

export default ProcessingScreen;