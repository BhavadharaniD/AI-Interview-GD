import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FeedbackReport from "./pages/FeedbackReport";
import Analytics from "./pages/Analytics";
import LiveSession from "./pages/LiveSession";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/feedback" element={<FeedbackReport />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/livesession" element={<LiveSession/>}/>
      </Routes>
    </Router>
  );
}

export default App;
