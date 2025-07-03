import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/home";
import "./index.css";
import About from "./routes/about";
function App() {
  return (
      <Routes>
        <Route path="/resume" element={<Home />} />
        <Route path="/resume/about" element={<About />} />
        {/* 다른 경로가 있으면 여기에 추가 */}
      </Routes>
  );
}

export default App;
