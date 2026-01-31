"use client";

import { useState, useCallback } from "react";

import ScriptInput from "@/components/ScriptInput";
import Teleprompter from "@/components/Teleprompter";
import ProcessingScreen from "@/components/ProcessingScreen";
import ResultsView from "@/components/ResultsView";

import { AppState, ScriptData, RecordingResult } from "@/types";
import { transcribeAudio } from "@/services/geminiService";

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

    const transcript = await transcribeAudio(videoBlob);

    setResult({
      videoBlob,
      videoUrl: URL.createObjectURL(videoBlob),
      transcript,
      originalScript: script?.text ?? "",
    });

    setState(AppState.RESULTS);
  };

  const resetApp = useCallback(() => {
    if (result?.videoUrl) URL.revokeObjectURL(result.videoUrl);
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
