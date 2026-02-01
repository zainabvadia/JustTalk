// frontend/types/index.ts

export enum AppState {
  SETUP = 'SETUP',
  RECORDING = 'RECORDING',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS',
  HISTORY = 'HISTORY' // Added this
}

export interface ScriptData {
  text: string;
  scrollSpeed: number; 
  fontSize: number;    
}

export interface RecordingResult {
  id: string;               
  videoBlob: Blob;
  videoUrl: string;
  transcript: string;
  originalScript: string;
  aiFeedback: string;       
  timestamp: number;        
  score?: number;           // Adding score as it's often used in history lists
  fillerWordCount?: number; // Adding this for the "Session History" display
}

// THE MISSING PIECE:
export interface HistoryEntry {
  id: string;
  timestamp: number;
  settings: ScriptData;    // This reuses your existing ScriptData type
  result: RecordingResult; // This reuses your existing RecordingResult type
}

export interface TranscriptionResponse {
  text: string;
  confidence: number;
}
export interface ScriptData {
  text: string;
  scrollSpeed: number; 
  fontSize: number;
  context?: string; // Add this
  tone?: string;    // Add this (optional, but useful for history)
}