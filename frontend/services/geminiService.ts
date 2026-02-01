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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Backend failed to process recording');
    }

    const data = await response.json();
    console.log("Backend Response:", data);

    // Mapping the Java Response to our Frontend RecordingResult type
    return {
      id: data.id, 
      videoBlob: videoBlob,
      videoUrl: URL.createObjectURL(videoBlob),
      transcript: data.transcript,
      originalScript: originalScript,
      aiFeedback: data.feedback,
      timestamp: data.createdAt || Date.now(),
    };
  } catch (error) {
    console.error("Frontend Service Error:", error);
    throw error;
  }
};