import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./routes/home";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/resume" element={<Home />} />
        {/* The portfolio is now a single page; keep the old /about link working. */}
        <Route path="/resume/about" element={<Navigate to="/resume" replace />} />
        <Route path="*" element={<Navigate to="/resume" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
