import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  TrendingUp,
  Flame,
  Award,
  Target,
  Zap,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  const navigate = useNavigate();

  const performanceData = [
    { session: "1", fluency: 65, confidence: 60 },
    { session: "2", fluency: 68, confidence: 65 },
    { session: "3", fluency: 72, confidence: 70 },
    { session: "4", fluency: 75, confidence: 73 },
    { session: "5", fluency: 78, confidence: 78 },
    { session: "6", fluency: 82, confidence: 80 },
    { session: "7", fluency: 85, confidence: 85 },
  ];

  const topicsData = [
    { topic: "Technical Skills", score: 85, color: "from-[#ff66ff] to-[#b266ff]" },
    { topic: "Communication", score: 78, color: "from-[#b266ff] to-[#7f00ff]" },
    { topic: "Problem Solving", score: 72, color: "from-[#7f00ff] to-[#b266ff]" },
    { topic: "Leadership", score: 65, color: "from-[#b266ff] to-[#ff66ff]" },
    { topic: "Teamwork", score: 88, color: "from-[#ff66ff] to-[#b266ff]" },
    { topic: "Critical Thinking", score: 70, color: "from-[#b266ff] to-[#7f00ff]" },
  ];

  const badges = [
    { icon: Flame, title: "7 Day Streak", description: "Practiced 7 days in a row", earned: true },
    { icon: Target, title: "Sharpshooter", description: "Scored 90+ in 5 sessions", earned: true },
    { icon: Zap, title: "Quick Learner", description: "Improved 20% in one week", earned: true },
    { icon: Star, title: "Perfectionist", description: "Achieved 100% fluency", earned: false },
    { icon: Award, title: "Interview Master", description: "Completed 50 sessions", earned: false },
    { icon: TrendingUp, title: "Rising Star", description: "Top 10% improvement", earned: true },
  ];

  const handleExport = () => {
    const data = {
      performanceData,
      topicsData,
      badges: badges.filter((b) => b.earned),
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics-report.json";
    a.click();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="border-b border-[#ff66ff]/20 bg-[#240046]/90 backdrop-blur-md shadow-[0_0_20px_#ff66ff20]">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ff66ff] to-[#7f00ff] bg-clip-text text-transparent">
            AI Interview Coach
          </h1>
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-[#ff66ff] to-[#b266ff] hover:opacity-90 shadow-[0_0_10px_#ff66ff80] text-white font-semibold"
          >
            Back to Dashboard
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-10 space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#ff66ff]/20 pb-3">
          <div>
            <h2 className="text-3xl font-bold text-white">Progress Tracker</h2>
            <p className="text-white/70">Track your improvement over time</p>
          </div>
          <Button
            onClick={handleExport}
            className="bg-gradient-to-r from-[#ff66ff] to-[#7f00ff] hover:opacity-90 text-white shadow-[0_0_10px_#ff66ff80]"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Analytics
          </Button>
        </div>

        {/* Charts */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Fluency Chart */}
          <Card className="bg-[#240046] border border-[#ff66ff]/20 rounded-2xl shadow-[0_0_25px_#ff66ff20]">
            <CardHeader>
              <CardTitle className="text-white">Fluency Progress</CardTitle>
              <CardDescription className="text-white/70">Your fluency score over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={performanceData}>
                  <defs>
                    <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff66ff" />
                      <stop offset="100%" stopColor="#7f00ff" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3b006b" />
                  <XAxis dataKey="session" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip contentStyle={{ backgroundColor: "#240046", color: "#fff" }} />
                  <Line type="monotone" dataKey="fluency" stroke="url(#pinkGradient)" strokeWidth={3} dot={{ fill: "#ff66ff" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Confidence Chart */}
          <Card className="bg-[#240046] border border-[#ff66ff]/20 rounded-2xl shadow-[0_0_25px_#ff66ff20]">
            <CardHeader>
              <CardTitle className="text-white">Confidence Progress</CardTitle>
              <CardDescription className="text-white/70">Your confidence score over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={performanceData}>
                  <defs>
                    <linearGradient id="gradientPurple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#b266ff" />
                      <stop offset="100%" stopColor="#7f00ff" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3b006b" />
                  <XAxis dataKey="session" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip contentStyle={{ backgroundColor: "#240046", color: "#fff" }} />
                  <Bar dataKey="confidence" fill="url(#gradientPurple)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Practice Streak */}
        <Card className="bg-[#240046] border border-[#ff66ff]/20 rounded-2xl shadow-[0_0_25px_#ff66ff20]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Flame className="h-6 w-6 text-[#ff66ff]" />
              Practice Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-5">
            <div className="text-6xl font-bold text-[#ff66ff]">7</div>
            <div>
              <p className="text-xl font-semibold text-white">Days Continuous Practice</p>
              <p className="text-white/70">Keep it up! You're on fire! 🔥</p>
            </div>
          </CardContent>
        </Card>

        {/* Topic-wise Performance */}
        <Card className="bg-[#240046] border border-[#ff66ff]/20 rounded-2xl shadow-[0_0_25px_#ff66ff20]">
          <CardHeader>
            <CardTitle className="text-white">Topic-wise Performance</CardTitle>
            <CardDescription className="text-white/70">
              See your strengths and areas for improvement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {topicsData.map((topic, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl bg-gradient-to-r ${topic.color} hover:scale-105 transition-transform cursor-pointer shadow-[0_0_15px_#ff66ff40]`}
                >
                  <p className="text-sm font-medium text-white/90">{topic.topic}</p>
                  <p className="text-3xl font-bold text-white mt-2">{topic.score}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card className="bg-[#240046] border border-[#ff66ff]/20 rounded-2xl shadow-[0_0_25px_#ff66ff20]">
          <CardHeader>
            <CardTitle className="text-white">Badges & Achievements</CardTitle>
            <CardDescription className="text-white/70">
              Your earned accomplishments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    badge.earned
                      ? "bg-gradient-to-r from-[#ff66ff]/10 to-[#7f00ff]/10 border-[#ff66ff]/40"
                      : "bg-[#240046]/60 border-purple-900 opacity-50"
                  } hover:scale-105 transition-transform cursor-pointer`}
                >
                  <badge.icon
                    className={`h-8 w-8 mb-2 ${
                      badge.earned ? "text-[#ff66ff]" : "text-gray-500"
                    }`}
                  />
                  <p className="font-semibold text-white">{badge.title}</p>
                  <p className="text-sm text-white/70 mt-1">{badge.description}</p>
                  {badge.earned && (
                    <p className="text-xs text-[#ff66ff] mt-2">✓ Earned</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
