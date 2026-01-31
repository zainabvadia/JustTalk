'use client';

import React from 'react';
import { RecordingResult } from '@/types';

interface ResultsViewProps {
  result: RecordingResult;
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset }) => {
  // Helper for formatting date
  const dateString = new Date(result.timestamp).toLocaleDateString();
  const timeString = new Date(result.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const handleDownloadVideo = () => {
    const a = document.createElement('a');
    a.href = result.videoUrl;
    a.download = `recording-${result.id}.webm`;
    a.click();
  };

  const handleExportAnalysis = () => {
    const content = `TRANSCRIPT:\n${result.transcript}\n\nAI FEEDBACK:\n${result.aiFeedback}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-${result.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 mt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-bold text-white">Analysis Results</h2>
          <p className="text-gray-400 mt-1">
            {dateString} at {timeString}
          </p>
        </div>
        <button
          onClick={onReset}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-indigo-500/20"
        >
          New Recording
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Video & Original Script */}
        <div className="xl:col-span-5 space-y-6">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
            <video
              src={result.videoUrl}
              controls
              className="w-full h-full"
            />
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <h3 className="text-lg font-bold mb-3 text-indigo-400 flex items-center gap-2">
              <span>📄</span> Original Script
            </h3>
            <div className="max-h-40 overflow-y-auto text-gray-300 text-sm italic pr-2 custom-scrollbar">
              "{result.originalScript}"
            </div>
          </div>
        </div>

        {/* Right Column: AI Feedback & Transcript */}
        <div className="xl:col-span-7 space-y-6">
          {/* AI Coaching Feedback */}
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-emerald-400 flex items-center gap-3">
              <span>✨</span> AI Performance Coaching
            </h3>
            <div className="text-emerald-50/90 leading-relaxed max-w-none">
              {result.aiFeedback}
            </div>
          </div>

          {/* Transcript */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl flex flex-col min-h-[300px]">
            <h3 className="text-xl font-bold mb-4 text-indigo-400 flex items-center gap-3">
              <span>💬</span> Automatic Transcript
            </h3>
            
            <div className="flex-1 bg-gray-900 p-5 rounded-xl border border-gray-700 overflow-y-auto max-h-[400px] custom-scrollbar">
              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                {result.transcript}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleDownloadVideo}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-sm"
              >
                Download Video
              </button>
              <button
                onClick={handleExportAnalysis}
                className="flex-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-sm"
              >
                Export Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;