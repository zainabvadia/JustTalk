'use client'; // Required for hooks in Next.js App Router

import React, { useState } from 'react';
import { ScriptData } from '@/types'; // Updated to use your path alias

interface ScriptInputProps {
  onStart: (data: ScriptData) => void;
}

const ScriptInput: React.FC<ScriptInputProps> = ({ onStart }) => {
  const [text, setText] = useState('');
  const [scrollSpeed, setScrollSpeed] = useState(5);
  const [fontSize, setFontSize] = useState(32);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onStart({ text, scrollSpeed, fontSize });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-2xl shadow-2xl mt-10 border border-gray-700">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-indigo-400">
        {/* Note: Ensure FontAwesome is loaded in your layout.tsx or use an icon library like lucide-react */}
        <span className="opacity-80">📜</span> 
        Teleprompter Setup
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Your Script</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your script here..."
            className="w-full h-64 bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Scroll Speed Control */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex justify-between">
              Scroll Speed <span>{scrollSpeed}</span>
            </label>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Slower</span>
              <span>Faster</span>
            </div>
          </div>

          {/* Font Size Control */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex justify-between">
              Font Size <span>{fontSize}px</span>
            </label>
            <input
              type="range"
              min="16"
              max="64"
              step="2"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-lg group shadow-lg shadow-indigo-500/20"
        >
          <span className="group-hover:animate-pulse">📹</span>
          Start Recording Mode
        </button>
      </form>
    </div>
  );
};

export default ScriptInput;