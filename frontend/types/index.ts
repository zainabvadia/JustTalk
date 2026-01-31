// frontend/types/index.ts

/**
 * Defines the different "screens" or stages of the application.
 */
export enum AppState {
  SETUP = 'SETUP',
  RECORDING = 'RECORDING',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS'
}

/**
 * Data gathered from the ScriptInput component to configure the Teleprompter.
 */
export interface ScriptData {
  text: string;
  scrollSpeed: number; // 1-10
  fontSize: number;    // in px
}

/**
 * The final payload generated after recording and AI processing.
 */
export interface RecordingResult {
  videoBlob: Blob;
  videoUrl: string;
  transcript: string;
  originalScript: string;
  feedback?: string; // Optional: In case Gemini provides performance notes
}

/**
 * Helper type for Gemini service responses.
 */
export interface TranscriptionResponse {
  text: string;
  confidence: number;
}