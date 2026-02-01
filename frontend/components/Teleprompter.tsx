'use client'; // Required for browser APIs and hooks

import React, { useRef, useEffect, useState } from 'react';
import { ScriptData } from '@/types'; // Updated to use your path alias

interface TeleprompterProps {
  script: ScriptData;
  onFinished: (videoBlob: Blob) => void;
  onCancel: () => void;
}

const Teleprompter: React.FC<TeleprompterProps> = ({ script, onFinished, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [offset, setOffset] = useState(400); // Start offset to put text in middle initially

  useEffect(() => {
    let stream: MediaStream;

    const startCamera = async () => {
      try {
        // Standard Web API for camera access
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720 }, 
          audio: true 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Camera and Microphone access are required for the teleprompter.");
        onCancel();
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onCancel]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => {
        setOffset((prev) => {
          const newOffset = prev - (script.scrollSpeed * 0.5);
          // Auto-stop when scrolling finishes
          if (scrollContainerRef.current && Math.abs(newOffset) > scrollContainerRef.current.scrollHeight + 500) {
            stopRecording();
            return newOffset;
          }
          return newOffset;
        });
      }, 16); // ~60fps smooth scrolling
    }
    return () => clearInterval(interval);
  }, [isRecording, script.scrollSpeed]);

  const startCountdown = () => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          initiateRecording();
          return null;
        }
        return prev !== null ? prev - 1 : null;
      });
    }, 1000);
  };

  const initiateRecording = () => {
    if (!videoRef.current?.srcObject) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      onFinished(blob);
    };

    mediaRecorderRef.current = recorder;
    chunksRef.current = [];
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col overflow-hidden">
      {/* Background Video - Scaled -1 to mirror the user */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
      />

      {/* Script Overlay Layer */}
      <div className="relative z-10 flex-1 flex flex-col items-center pointer-events-none">
        {/* Mirror Line (Visual Guide for the eye) */}
        <div className="absolute top-1/2 left-0 right-0 h-24 border-y border-white/20 bg-black/30 -translate-y-1/2" />
        
        <div 
          className="w-full max-w-4xl px-8 text-center"
          style={{ transform: `translateY(${offset}px)` }}
          ref={scrollContainerRef}
        >
          <p 
            className="font-bold leading-relaxed text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            style={{ fontSize: `${script.fontSize}px` }}
          >
            {script.text}
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center items-center gap-6 pointer-events-auto">
        {!isRecording && countdown === null && (
          <button
            onClick={startCountdown}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 shadow-xl transition-transform active:scale-95"
          >
            <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
            Rec Start
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center gap-2 shadow-xl transition-transform active:scale-95"
          >
            <div className="w-4 h-4 bg-red-600" />
            Stop
          </button>
        )}

        <button
          onClick={onCancel}
          className="bg-gray-800/80 hover:bg-gray-700 text-white px-8 py-4 rounded-full font-bold shadow-xl transition-transform active:scale-95"
        >
          Exit
        </button>
      </div>

      {/* Full-screen Countdown Overlay */}
      {countdown !== null && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <span className="text-9xl font-black text-white animate-ping">{countdown}</span>
        </div>
      )}
    </div>
  );
};

export default Teleprompter;