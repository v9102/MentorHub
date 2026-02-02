"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor } from "lucide-react";

export default function CallPage({ params }: { params: Promise<{ roomId: string }> }) {
  const router = useRouter();
  const [roomId, setRoomId] = useState<string>("");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  useEffect(() => {
    params.then((p) => {
      setRoomId(p.roomId);
    });
  }, [params]);

  // Call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    if (confirm("Are you sure you want to end the call?")) {
      router.push("/dashboard/student/dashboard");
    }
  };

  const toggleMic = () => setIsMicOn(!isMicOn);
  const toggleCamera = () => setIsCameraOn(!isCameraOn);
  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing);

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-white font-semibold text-lg">Video Call</h1>
          <p className="text-gray-400 text-sm">Room: {roomId}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {formatDuration(callDuration)}
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative p-6">
        {/* Mentor Video (Large) */}
        <div className="w-full h-full bg-gray-800 rounded-2xl overflow-hidden relative">
          {/* Placeholder Video */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-5xl font-bold">
                M
              </div>
              <p className="text-white text-xl font-semibold">Mentor Name</p>
              <p className="text-gray-400 text-sm">Waiting for video...</p>
            </div>
          </div>

          {/* Mentor Name Tag */}
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-2 rounded-lg">
            <p className="text-sm font-medium">Mentor Name</p>
          </div>
        </div>

        {/* Self Video (Small - Picture in Picture) */}
        <div className="absolute bottom-8 right-8 w-64 h-48 bg-gray-700 rounded-xl overflow-hidden border-2 border-gray-600 shadow-2xl">
          <div className="w-full h-full flex items-center justify-center relative">
            {isCameraOn ? (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-600 flex items-center justify-center text-white text-3xl font-bold">
                  Y
                </div>
                <p className="text-white text-sm mt-2">You</p>
              </div>
            ) : (
              <div className="text-center">
                <VideoOff className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Camera Off</p>
              </div>
            )}

            {/* Self Name Tag */}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
              You {!isMicOn && "(Muted)"}
            </div>
          </div>
        </div>

        {/* Screen Share Indicator */}
        {isScreenSharing && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            <span className="text-sm font-medium">You are sharing your screen</span>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-gray-800 px-6 py-6">
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-4">
          {/* Microphone */}
          <button
            onClick={toggleMic}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
              isMicOn
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
            title={isMicOn ? "Mute" : "Unmute"}
          >
            {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>

          {/* Camera */}
          <button
            onClick={toggleCamera}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
              isCameraOn
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
            title={isCameraOn ? "Turn off camera" : "Turn on camera"}
          >
            {isCameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
              isScreenSharing
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
            title={isScreenSharing ? "Stop sharing" : "Share screen"}
          >
            <Monitor className="w-6 h-6" />
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all duration-200 ml-4"
            title="End call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>

        {/* Control Labels */}
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-4 mt-3">
          <span className="w-14 text-center text-xs text-gray-400">
            {isMicOn ? "Mute" : "Unmute"}
          </span>
          <span className="w-14 text-center text-xs text-gray-400">
            {isCameraOn ? "Stop" : "Start"}
          </span>
          <span className="w-14 text-center text-xs text-gray-400">Share</span>
          <span className="w-14 text-center text-xs text-gray-400 ml-4">End</span>
        </div>
      </div>

      {/* Mock WebRTC Notice */}
      <div className="absolute top-20 left-6 bg-yellow-500 bg-opacity-90 text-yellow-900 px-4 py-2 rounded-lg shadow-lg max-w-sm">
        <p className="text-sm font-medium">
          🎥 Mock Video Call UI - No actual WebRTC connection
        </p>
      </div>
    </div>
  );
}
