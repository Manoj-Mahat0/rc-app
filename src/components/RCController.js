import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  StopCircle,
  Gamepad2,
  GaugeCircle,
  Mic,
  MicOff,
} from 'lucide-react';

const RCController = () => {
  const [status, setStatus] = useState("Idle");
  const [mode, setMode] = useState("manual");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // ✅ Send command to API
  const sendCommand = useCallback(async (cmd, isVoice = false) => {
    const commandToSend = isVoice ? `voice:${cmd}` : cmd;
    setStatus(`Sending: ${commandToSend}`);
    try {
      const res = await fetch("https://rc-api-self.vercel.app/control", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ cmd: commandToSend }),
      });

      const data = await res.json();
      console.log(data.message);

      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }

      setStatus(`✅ ${commandToSend.toUpperCase()} sent`);
    } catch (err) {
      console.error(err);
      setStatus("❌ Command Failed");
    }
  }, []);

  // Load mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("rc-mode");
    if (savedMode) setMode(savedMode);
  }, []);

  // Voice recognition setup and handling
  useEffect(() => {
    localStorage.setItem("rc-mode", mode);

    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;

    if (!recognitionRef.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript.trim().toLowerCase();
        console.log("Heard:", transcript);

        // Send voice command in "voice:<text>" format
        sendCommand(transcript, true);
      };

      recognition.onerror = (e) => {
        console.error("Speech recognition error:", e.error);
        setStatus("🎤 Error: " + e.error);
      };

      recognitionRef.current = recognition;
    }

    if (mode === "voice") {
      recognitionRef.current?.start();
      setListening(true);
      setStatus("🎤 Listening...");
    } else {
      recognitionRef.current?.stop();
      setListening(false);
      setStatus("Idle");
    }
  }, [mode, sendCommand]);

  // Keyboard support
  useEffect(() => {
    if (mode === "manual") {
      const handleKeyDown = (e) => {
        if (e.key === "ArrowUp") sendCommand("forward");
        if (e.key === "ArrowDown") sendCommand("backward");
        if (e.key === "ArrowLeft") sendCommand("left");
        if (e.key === "ArrowRight") sendCommand("right");
        if (e.key === " ") sendCommand("stop");
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [mode, sendCommand]);

  // Fetch current state from API every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("https://rc-api-self.vercel.app/state");
        const data = await res.json();
        setStatus(`📡 Current: ${data.status}`);
      } catch {
        setStatus("⚠️ Failed to fetch state");
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const buttonBase =
    "w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 text-white text-3xl flex items-center justify-center rounded-full shadow-xl transform active:scale-90 transition-all duration-200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f2937] via-[#111827] to-[#0f172a] text-white px-4 py-8 sm:px-6 lg:px-12 flex flex-col items-center">
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 flex items-center gap-3 text-indigo-400">
        <Gamepad2 className="w-8 h-8" />
        RC Game Controller
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setMode("manual")}
          className={`px-4 py-2 rounded-full font-semibold transition ${
            mode === "manual"
              ? "bg-indigo-500 text-white"
              : "bg-white text-black"
          }`}
        >
          Manual Mode
        </button>
        <button
          onClick={() => setMode("voice")}
          className={`px-4 py-2 rounded-full font-semibold transition ${
            mode === "voice"
              ? "bg-indigo-500 text-white"
              : "bg-white text-black"
          }`}
        >
          <Mic className="inline-block w-4 h-4 mr-1" />
          Voice Mode
        </button>
      </div>

      {/* Manual Controls */}
      {mode === "manual" && (
        <>
          <div className="grid grid-cols-3 gap-6 mb-10">
            <div></div>
            <button
              onClick={() => sendCommand("forward")}
              className={`${buttonBase} bg-green-600 hover:bg-green-700`}
            >
              <ArrowUp className="w-8 h-8" />
            </button>
            <div></div>

            <button
              onClick={() => sendCommand("left")}
              className={`${buttonBase} bg-blue-600 hover:bg-blue-700`}
            >
              <ArrowLeft className="w-8 h-8" />
            </button>
            <button
              onClick={() => sendCommand("stop")}
              className={`${buttonBase} bg-red-600 hover:bg-red-700`}
            >
              <StopCircle className="w-8 h-8" />
            </button>
            <button
              onClick={() => sendCommand("right")}
              className={`${buttonBase} bg-blue-600 hover:bg-blue-700`}
            >
              <ArrowRight className="w-8 h-8" />
            </button>

            <div></div>
            <button
              onClick={() => sendCommand("backward")}
              className={`${buttonBase} bg-yellow-500 hover:bg-yellow-600`}
            >
              <ArrowDown className="w-8 h-8" />
            </button>
            <div></div>
          </div>

          {/* Speed Selector */}
          <div className="flex flex-col sm:flex-row gap-3 items-center mb-6">
            <div className="flex items-center gap-2">
              <GaugeCircle className="text-indigo-300" />
              <span className="text-sm text-gray-300">Speed:</span>
            </div>
            <select
              onChange={(e) => sendCommand(`speed-${e.target.value}`)}
              className="px-4 py-2 rounded bg-white text-black border border-gray-300"
            >
              <option value="slow">🐢 Slow</option>
              <option value="medium">🚗 Medium</option>
              <option value="fast">🚀 Fast</option>
            </select>
          </div>
        </>
      )}

      {/* Voice Mode UI */}
      {mode === "voice" && (
        <div className="mt-10 text-center space-y-6">
          {listening ? (
            <Mic className="w-14 h-14 mx-auto text-pink-400 animate-pulse" />
          ) : (
            <MicOff className="w-14 h-14 mx-auto text-gray-500" />
          )}
          <p className="text-lg text-gray-200">Speak any command like:</p>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>🗣️ "Go forward"</li>
            <li>🗣️ "Turn left"</li>
            <li>🗣️ "Stop the bot"</li>
            <li>🗣️ "Move right", "Reverse", etc.</li>
          </ul>
        </div>
      )}

      <p className="mt-6 text-sm text-gray-300 italic">Status: {status}</p>
    </div>
  );
};

export default RCController;
