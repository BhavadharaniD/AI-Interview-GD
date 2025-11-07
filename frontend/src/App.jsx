import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FeedbackReport from "./pages/FeedbackReport";
import Analytics from "./pages/Analytics";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/feedback" element={<FeedbackReport />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
}

export default App;
