import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, ArrowLeft, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FeedbackReport = () => {
  const navigate = useNavigate();

  const scores = [
    { label: "Fluency", value: 78 },
    { label: "Confidence", value: 82 },
    { label: "Grammar", value: 85 },
    { label: "Vocabulary", value: 75 },
  ];

  const transcript = [
    { speaker: "AI", text: "Tell me about yourself.", highlight: false },
    { speaker: "User", text: "I am a software engineer with 3 years of experience...", highlight: true },
    { speaker: "AI", text: "What are your biggest strengths?", highlight: false },
    { speaker: "User", text: "Um, I think, like, problem solving and, uh, teamwork.", highlight: false },
  ];

  const recommendations = [
    "Reduce filler words like 'um' and 'uh' - detected 12 instances",
    "Practice speaking at a steadier pace - you rushed through some answers",
    "Great job maintaining eye contact and confident tone!",
    "Try to elaborate more on technical questions",
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <nav className="border-b border-[#240046]/50 bg-[#240046]/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-xl font-semibold text-[#ff00ff]">
            Session Feedback Report
          </h1>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Title + Button */}
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Performance Analysis</h2>
            <Button className="bg-gradient-to-r from-[#ff00ff] to-[#8000ff] text-white hover:opacity-90">
              <Download className="h-5 w-5 mr-2" />
              Download Report
            </Button>
          </div>

          {/* Scores */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {scores.map((score, index) => (
              <Card
                key={index}
                className="bg-[#240046]/80 border-none rounded-2xl shadow-md"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white">{score.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <span className="text-3xl font-bold text-white">{score.value}%</span>
                    <Progress
                      value={score.value}
                      className="h-2 bg-[#1a1a1a] [&>div]:bg-gradient-to-r [&>div]:from-[#ff00ff] [&>div]:to-[#8000ff]"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Session Details */}
          <Card className="bg-[#240046]/80 border-none rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="text-white">Session Details</CardTitle>
              <CardDescription className="text-gray-300">
                Additional metrics from your practice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-xl bg-[#1a0029]">
                  <p className="text-sm text-gray-300">Speech Speed</p>
                  <p className="text-2xl font-bold mt-1 text-white">142 WPM</p>
                </div>
                <div className="p-4 rounded-xl bg-[#1a0029]">
                  <p className="text-sm text-gray-300">Session Duration</p>
                  <p className="text-2xl font-bold mt-1 text-white">12:34</p>
                </div>
                <div className="p-4 rounded-xl bg-[#1a0029]">
                  <p className="text-sm text-gray-300">Filler Words</p>
                  <p className="text-2xl font-bold mt-1 text-white">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transcript */}
          <Card className="bg-[#240046]/80 border-none rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="text-white">Transcript Review</CardTitle>
              <CardDescription className="text-gray-300">
                Full conversation with highlights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {transcript.map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl ${
                      item.highlight
                        ? "bg-[#8000ff]/30 border border-[#ff00ff]/50"
                        : "bg-[#1a0029] border border-[#240046]/40"
                    }`}
                  >
                    <p className="text-sm font-semibold mb-1 text-[#ff66ff]">{item.speaker}</p>
                    <p className="text-gray-100">{item.text}</p>
                    {item.highlight && (
                      <p className="text-xs text-[#ff66ff] mt-2">✓ Good response</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-[#240046]/80 border-none rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="text-white">AI Recommendations</CardTitle>
              <CardDescription className="text-gray-300">
                Tips to improve your next session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recommendations.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[#1a0029] border border-[#240046]/40"
                  >
                    <span className="text-[#ff66ff] font-bold">{index + 1}.</span>
                    <span className="text-gray-200">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Buttons */}
         <div className="flex items-center justify-center gap-4 pt-6">
  <Button
    onClick={() => navigate("/dashboard")}
    className="relative px-6 py-3 text-lg font-medium text-white 
               bg-gradient-to-r from-[#7b2ff7] to-[#f107a3] 
               rounded-xl shadow-md transition-all duration-300 
               hover:scale-105 hover:shadow-[#f107a3]/50"
  >
    <ArrowLeft className="h-5 w-5 mr-2" />
    Back to Dashboard
  </Button>
  <Button
              size="lg"
              onClick={() => navigate("/voice-session")}
              className="bg-gradient-to-r from-[#ff00ff] to-[#8000ff] hover:opacity-90 text-white"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackReport;
