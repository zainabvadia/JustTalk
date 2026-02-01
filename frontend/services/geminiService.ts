import { RecordingResult } from '@/types';

/**
 * Sends the recorded video and the script to the Java Backend.
 * The Java backend will handle the Gemini AI logic and PostgreSQL storage.
 */
export const processRecordingWithBackend = async (
  videoBlob: Blob, 
  originalScript: string
): Promise<RecordingResult> => {
  const formData = new FormData();
  // 'video' matches the @RequestParam("video") in your Java Controller
  formData.append('video', videoBlob, `recording-${Date.now()}.webm`);
  formData.append('script', originalScript);

  console.log(formData)

  try {
    // Replace this URL with your Java server address (usually port 8080)
    const response = await fetch('http://localhost:8080/api/sessions/analyze', {
      method: 'POST',
      body: formData,
      // Note: Do NOT set Content-Type header manually when sending FormData; 
      // the browser will set it automatically with the correct boundary.
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Backend failed to process recording');
    }

    console.log("Backend Response:", data);

    // reformat JSON AI feedback
    const feedback = JSON.stringify({
      "Fluency": data.feedbackJson.accuracyScore || 0,
      "Non-Lexical Fillers": data.feedbackJson.nonLexicalFillers || 0,
      "Summary": data.feedbackJson.summary
    }, null, 2); 

    const lines = [
      `Fluency: ${parseFloat((data.feedbackJson.accuracyScore ?? 0).toFixed(1))} | `,
      `Non-Lexical Fillers: ${data.feedbackJson.nonLexicalFillers ?? ""} | `,
      `Lexical Fillers: ${data.feedbackJson.lexicalCount ?? ""} | `,
      `Summary: ${data.feedbackJson.summary ?? ""}`
    ];

    const joinLines = lines.join("\n"); // each key-value on a new line

    return {
      id: data.id, 
      videoBlob: videoBlob,
      videoUrl: data.link,
      transcript: data.actualTranscript,
      originalScript: originalScript,
      aiFeedback: joinLines,
      timestamp: data.createdAt || Date.now(),
    };
  } catch (error) {
    console.error("Frontend Service Error:", error);
    throw error;
  }
};