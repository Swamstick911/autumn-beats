import React from "react";
import Landing from "./pages/Landing";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HowToPlay from "./pages/HowToPlay";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* <Route path="/game" element={<Game />} /> */}
        <Route path="/howtoplay" element={<HowToPlay />} />
      </Routes>
    </Router>
  );
};

export default App;
