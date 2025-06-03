import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RCController from "./components/RCController";
import LiveStreaming from "./components/LiveStreaming";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<RCController />} />
          <Route path="/live" element={<LiveStreaming />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
