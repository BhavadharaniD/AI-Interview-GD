import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FeedbackReport from "./pages/FeedbackReport";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/feedback" element={<FeedbackReport />} />
      </Routes>
    </Router>
  );
}

export default App;
