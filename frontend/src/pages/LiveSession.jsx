import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, XCircle, Clock, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LiveSession = () => {
  const [isListening, setIsListening] = useState(false);
  const [time, setTime] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (isListening) {
      timer = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isListening]);

  const formatTime = (t) => {
    const mins = Math.floor(t / 60);
    const secs = t % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0018] to-black text-white font-[Orbitron] flex flex-col items-center justify-center px-6 py-10 space-y-10">
      
      {/* Header */}
      <h1 className="text-4xl font-bold bg-gradient-to-r from-[#ff66ff] to-[#b266ff] bg-clip-text text-transparent drop-shadow-[0_0_10px_#ff66ff80]">
        🎧 Live Session
      </h1>

      {/* Timer + Topic */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-[#ff66ff] text-xl">
          <Clock className="w-5 h-5" /> <span>{formatTime(time)}</span>
        </div>
        <p className="text-gray-400 text-sm">Topic: AI Interview Practice</p>
      </div>

      {/* Main Card */}
      <Card className="bg-[#240046]/80 border border-[#ff66ff]/30 shadow-[0_0_20px_#ff66ff20] rounded-2xl w-full max-w-lg p-6 text-center space-y-6">
        <CardHeader>
          <CardTitle className="text-2xl">Speak Now</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6">
          {/* Mic Button */}
          <div
            onClick={() => setIsListening(!isListening)}
            className={`w-24 h-24 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 ${
              isListening
                ? "bg-[#ff66ff] shadow-[0_0_30px_#ff66ff80] animate-pulse"
                : "bg-[#240046] border border-[#ff66ff]/40 hover:shadow-[0_0_20px_#ff66ff40]"
            }`}
          >
            <Mic className={`w-10 h-10 ${isListening ? "text-black" : "text-[#ff66ff]"}`} />
          </div>

          <p className="text-gray-300">
            {isListening ? "Listening... Speak now!" : "Press to start speaking"}
          </p>

          {/* Captions Area */}
          <div className="bg-[#240046]/50 border border-[#ff66ff]/20 rounded-lg p-4 w-full h-32 text-left overflow-y-auto">
            <p className="text-gray-400 italic">
              {isListening
                ? "Your speech is being transcribed in real-time..."
                : "Live captions will appear here once you start speaking."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* End Session Button */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate("/feedback")}
          size="lg"
          className="bg-[#ff66ff] text-black hover:bg-[#ff33ff] shadow-[0_0_10px_#ff66ff80] transition-all duration-300"
        >
          End Session <XCircle className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default LiveSession;
