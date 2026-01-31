// frontend/types/index.ts

export enum AppState {
  SETUP = 'SETUP',
  RECORDING = 'RECORDING',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS'
}

export interface ScriptData {
  text: string;
  scrollSpeed: number; 
  fontSize: number;    
}

export interface RecordingResult {
  id: string;              // Required by ResultsView for filenames
  videoBlob: Blob;
  videoUrl: string;
  transcript: string;
  originalScript: string;
  aiFeedback: string;      // Changed from 'feedback?' to 'aiFeedback' to match component
  timestamp: number;       // Required for the "Analysis Results" header
}

export interface TranscriptionResponse {
  text: string;
  confidence: number;
}