"use client";

import { useState, useCallback } from "react";

import ScriptInput from "@/components/ScriptInput";
import Teleprompter from "@/components/Teleprompter";
import ProcessingScreen from "@/components/ProcessingScreen";
import ResultsView from "@/components/ResultsView";

import { AppState, ScriptData, RecordingResult } from "@/types";
// Change: Import the updated service function
import { processRecordingWithBackend } from "@/services/geminiService";

export default function PracticePage() {
  const [state, setState] = useState<AppState>(AppState.SETUP);
  const [script, setScript] = useState<ScriptData | null>(null);
  const [result, setResult] = useState<RecordingResult | null>(null);

  const startRecording = (data: ScriptData) => {
    setScript(data);
    setState(AppState.RECORDING);
  };

  const finishRecording = async (videoBlob: Blob) => {
    setState(AppState.PROCESSING);

    try {
      // Change: Use the new backend-ready service call
      // This will send the video to your Java server
      const analysisResult = await processRecordingWithBackend(
        videoBlob, 
        script?.text ?? ""
      );

      setResult(analysisResult);
      setState(AppState.RESULTS);
    } catch (error) {
      console.error("Recording failed:", error);
      alert("Failed to process video. Make sure your Java backend is running!");
      setState(AppState.SETUP); // Fallback to setup on error
    }
  };

  const resetApp = useCallback(() => {
    if (result?.videoUrl) {
      URL.revokeObjectURL(result.videoUrl);
    }
    setResult(null);
    setScript(null);
    setState(AppState.SETUP);
  }, [result]);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {state === AppState.SETUP && <ScriptInput onStart={startRecording} />}

      {state === AppState.RECORDING && script && (
        <Teleprompter
          script={script}
          onFinished={finishRecording}
          onCancel={resetApp}
        />
      )}

      {state === AppState.PROCESSING && <ProcessingScreen />}

      {state === AppState.RESULTS && result && (
        <ResultsView result={result} onReset={resetApp} />
      )}
    </main>
  );
}