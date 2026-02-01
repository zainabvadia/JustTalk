"use client";

import { useState } from "react";
import ScriptInput from "@/components/ScriptInput"; 
import Teleprompter from "@/components/Teleprompter";
import ProcessingScreen from "@/components/ProcessingScreen";
import ResultsView from "@/components/ResultsView";
import HistoryScreen from '@/components/HistoryScreen';
import { AppState, ScriptData, RecordingResult, HistoryEntry } from "@/types";
import { processRecordingWithBackend } from "@/services/geminiService";

export default function PracticePage() {
  const [state, setState] = useState<AppState>(AppState.SETUP);
  const [script, setScript] = useState<ScriptData | null>(null);
  const [result, setResult] = useState<RecordingResult | null>(null);
  const [historyData, setHistoryData] = useState<HistoryEntry[]>([]);

  const loadHistory = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/history');
      const data = await response.json();
      setHistoryData(data);
      setState(AppState.HISTORY);
    } catch (err) {
      console.error("History fetch error", err);
      setState(AppState.HISTORY);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6">
      
      {(state === AppState.SETUP || state === AppState.HISTORY) && (
        <div className="w-full max-w-4xl bg-[#1e293b] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
          {state === AppState.SETUP ? (
            <ScriptInput 
              onStart={(data) => { setScript(data); setState(AppState.RECORDING); }} 
              onViewHistory={loadHistory} 
            />
          ) : (
            <HistoryScreen 
              entries={historyData} 
              onSelect={(entry) => { setResult(entry.result); setState(AppState.RESULTS); }}
              onBack={() => setState(AppState.SETUP)}
            />
          )}
        </div>
      )}

      {/* Operative Screens */}
      {state === AppState.RECORDING && script && (
        <Teleprompter 
           script={script} 
           onFinished={async (blob) => {
             setState(AppState.PROCESSING);
             const res = await processRecordingWithBackend(blob, script.text);
             setResult(res);
             setState(AppState.RESULTS);
           }} 
           onCancel={() => setState(AppState.SETUP)} 
        />
      )}
      
      {state === AppState.PROCESSING && <ProcessingScreen />}
      
      {state === AppState.RESULTS && result && (
        <ResultsView 
          result={result} 
          onReset={() => setState(AppState.SETUP)}
          onViewHistory={loadHistory} 
        />
      )}
    </main>
  );
}