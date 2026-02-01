'use client';

import React, { useState } from 'react';
import { ScriptData } from '@/types';
import { History } from 'lucide-react'; // Clean icon library
import { Scroll } from 'lucide-react';

interface ScriptInputProps {
  onStart: (data: ScriptData) => void;
  onViewHistory: () => void; // Prop to trigger the history view
}

const ScriptInput: React.FC<ScriptInputProps> = ({ onStart, onViewHistory }) => {
  const [text, setText] = useState('');
  const [scrollSpeed, setScrollSpeed] = useState(5);
  const [fontSize, setFontSize] = useState(32);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onStart({ text, scrollSpeed, fontSize });
  };

  return (
    <div className="w-full p-8 bg-[#1e293b] rounded-3xl animate-in fade-in zoom-in duration-300">
      
      {/* Header Section with Integrated History Button */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3 text-indigo-400">
         <Scroll className="w-8 h-8 text-indigo-500 opacity-80" />
          JustTalk
          </h2>

        <button 
          type="button"
          onClick={onViewHistory}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 transition-all group text-sm font-semibold"
        >
          <History className="w-4 h-4 group-hover:rotate-[-20deg] transition-transform" />
          Past Versions
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-semibold text-slate-400 mb-3 ml-1 uppercase tracking-wider">
            Your Script
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your script here..."
            className="w-full h-72 bg-[#0f172a] border border-slate-700 rounded-2xl p-6 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none shadow-inner"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Scroll Speed Control */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-400 flex justify-between px-1">
              SCROLL SPEED <span>{scrollSpeed}</span>
            </label>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-white cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
            />
            <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">
              <span>Slower</span>
              <span>Faster</span>
            </div>
          </div>

          {/* Font Size Control */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-400 flex justify-between px-1">
              FONT SIZE <span>{fontSize}px</span>
            </label>
            <input
              type="range"
              min="16"
              max="64"
              step="2"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-white cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
            />
            <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 text-xl group shadow-xl shadow-indigo-500/20 active:scale-[0.98]"
        >
          <span className="group-hover:scale-110 transition-transform">📹</span>
          Start Recording Mode
        </button>
      </form>
    </div>
  );
};

export default ScriptInput;