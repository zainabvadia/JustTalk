import { GoogleGenerativeAI } from "@google/generative-ai";
import { RecordingResult } from '@/types';

// 1. Get the API key from environment variables
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

// 2. INITIALIZE the genAI instance (This was missing!)
const genAI = new GoogleGenerativeAI(apiKey);

export const processRecordingWithBackend = async (
  videoBlob: Blob, 
  originalScript: string
): Promise<RecordingResult> => {
  const formData = new FormData();
  formData.append('video', videoBlob, `recording-${Date.now()}.webm`);
  formData.append('script', originalScript);

  try {
    // Call your Java Backend
    const response = await fetch('http://localhost:8080/api/sessions/analyze', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Backend failed');

    let finalFeedback = "";

    // Check if backend analysis succeeded
    if (data.feedbackJson && data.feedbackJson.summary) {
      const lines = [
        `Fluency: ${parseFloat((data.feedbackJson.accuracyScore ?? 0).toFixed(1))} | `,
        `Non-Lexical Fillers: ${data.feedbackJson.nonLexicalFillers ?? 0} | `,
        `Summary: ${data.feedbackJson.summary}`
      ];
      finalFeedback = lines.join("");
    } else {
      // BACKEND FAILED: Use Gemini directly as fallback
      // Now 'genAI' is defined at the top of the file
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      
      const prompt = `
        You are an expert public speaking coach. Analyze this session:
        Original Script: "${originalScript}"
        User Transcript: "${data.actualTranscript}"
        
        Provide a 2-sentence encouraging summary and score fluency from 0-100.
      `;

      const result = await model.generateContent(prompt);
      finalFeedback = result.response.text();
    }

    return {
      id: data.id, 
      videoBlob: videoBlob,
      videoUrl: data.link,
      transcript: data.actualTranscript,
      originalScript: originalScript,
      aiFeedback: finalFeedback,
      timestamp: data.createdAt || Date.now(),
    };
  } catch (error) {
    console.error("Frontend Service Error:", error);
    throw error;
  }
};