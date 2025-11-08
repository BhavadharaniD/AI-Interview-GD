import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import FeedbackReport from "./pages/FeedbackReport";
import Analytics from "./pages/Analytics";
import LiveSession from "./pages/LiveSession";
import "./App.css";

function HomeShell() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [user, setUser] = useState(null);

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSignIn = (userData) => {
    setUser(userData);
    navigateTo("dashboard");
  };

  const handleSignUp = (userData) => {
    setUser(userData);
    navigateTo("dashboard");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage navigateTo={navigateTo} />;
      case "signin":
        return <SignIn navigateTo={navigateTo} onSignIn={handleSignIn} />;
      case "signup":
        return <SignUp navigateTo={navigateTo} onSignUp={handleSignUp} />;
      case "dashboard":
        return <Dashboard navigateTo={navigateTo} user={user} />;
      default:
        return <LandingPage navigateTo={navigateTo} />;
    }
  };

  return <div className="app">{renderPage()}</div>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeShell />} />
        <Route path="/feedback" element={<FeedbackReport />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/livesession" element={<LiveSession />} />
      </Routes>
    </Router>
  );
}

export default App;
