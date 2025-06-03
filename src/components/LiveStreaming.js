import React, { useEffect, useRef, useState } from "react";
import { Video, PlayCircle, PauseCircle } from "lucide-react";

const LiveStreaming = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
        })
        .catch((err) => {
          console.error("Webcam access denied:", err);
        });
    }
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      id="live"
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-center px-4 py-10"
    >
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold flex items-center justify-center gap-3 text-pink-500">
          <Video className="w-8 h-8" /> Live Streaming
        </h1>
        <p className="text-gray-300 text-sm mt-2">Webcam stream with player UI</p>
      </div>

      {/* Video player container */}
      <div className="relative w-full max-w-3xl aspect-video border-4 border-pink-500 rounded-xl overflow-hidden shadow-lg group">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Overlay Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition"
        >
          {isPlaying ? (
            <PauseCircle className="w-14 h-14 text-white" />
          ) : (
            <PlayCircle className="w-14 h-14 text-white" />
          )}
        </button>
      </div>
    </div>
  );
};

export default LiveStreaming;
