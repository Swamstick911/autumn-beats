import React from "react";
import Landing from "./pages/Landing";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HowToPlay from "./pages/HowToPlay";
import Game from "./pages/Game";
import SongSelection from "./pages/SongSelection";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/songselection" element={<SongSelection />} />
        <Route path="/game" element={<Game />} />
        <Route path="/howtoplay" element={<HowToPlay />} />
      </Routes>
    </Router>
  );
};

export default App;