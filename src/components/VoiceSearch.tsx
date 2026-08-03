"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, X } from "lucide-react";

interface VoiceSearchProps {
  onResult: (query: string) => void;
}

export default function VoiceSearch({ onResult }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);

      if (finalTranscript) {
        onResult(finalTranscript);
        setIsListening(false);
        setShowModal(false);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [onResult]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
      setShowModal(true);
    }
  };

  if (!supported) return null;

  return (
    <>
      <button
        type="button"
        onClick={toggleListening}
        className={`p-2 rounded-lg transition-colors ${
          isListening
            ? "bg-red-100 dark:bg-red-900/30 text-red-500 animate-pulse"
            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
        }`}
        title="Voice search"
      >
        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setIsListening(false);
                recognitionRef.current?.stop();
              }}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div
                className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? "bg-red-100 dark:bg-red-900/30 scale-110"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                {isListening ? (
                  <div className="relative">
                    <Mic className="w-10 h-10 text-red-500" />
                    <div className="absolute inset-0 w-10 h-10 border-4 border-red-500 rounded-full animate-ping opacity-20" />
                  </div>
                ) : (
                  <Mic className="w-10 h-10 text-gray-400" />
                )}
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-2">
              {isListening ? "Listening..." : "Voice Search"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              {isListening
                ? "Speak now to search for news"
                : "Click the microphone to start"}
            </p>

            {transcript && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                  &quot;{transcript}&quot;
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setIsListening(false);
                  recognitionRef.current?.stop();
                }}
                className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={toggleListening}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-colors ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isListening ? "Stop" : "Start Listening"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
