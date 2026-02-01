'use client';

import React from 'react';
import { HistoryEntry } from '../types';
import { Calendar, Play, Clock, ChevronRight, Award } from 'lucide-react';

interface HistoryScreenProps {
  entries: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onBack: () => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ entries, onSelect, onBack }) => {
  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Clock className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white leading-tight">Version History</h2>
            <p className="text-slate-400 text-sm">Review and compare your past performances</p>
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {entries.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-700/50 rounded-2xl">
            <p className="text-slate-500">No practice sessions found yet.</p>
            <button 
              onClick={onBack}
              className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-bold"
            >
              Start your first session →
            </button>
          </div>
        ) : (
          entries.map((entry) => (
            <button
              key={entry.id}
              onClick={() => onSelect(entry)}
              className="w-full flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all group"
            >
              <div className="flex items-center gap-4">
                {/* Score Circle */}
                <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center group-hover:border-indigo-500/50 transition-colors">
                  <span className="text-[10px] font-bold text-slate-500 uppercase leading-none mb-1">Score</span>
                  <span className="text-sm font-bold text-indigo-400">{entry.result.score}</span>
                </div>
                
                <div className="text-left">
                  <h4 className="text-white font-semibold group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {entry.settings?.context || "General Practice"}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-slate-700" />
                    <span className="italic text-indigo-400/70">{entry.settings?.tone || "Standard"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end text-[10px] text-slate-500 mr-2">
                  <span className="font-bold uppercase tracking-wider">Filler words</span>
                  <span className="text-slate-300 font-medium">{entry.result.fillerWordCount || 0}</span>
                </div>
                <div className="p-2 rounded-full bg-slate-900 border border-slate-700 group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all">
                  <Play className="w-4 h-4 text-white fill-current" />
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryScreen;