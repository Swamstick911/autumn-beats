// src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import { themes } from "../data/themes";
import { useTheme } from "../context/ThemeContext";

const lanes = ["left", "down", "up", "right"];

const Settings = ({ settings = {}, setSettings = () => {} }) => {
  const { theme, setTheme } = useTheme();
  const [volume, setVolume] = useState(settings.volume ?? 1);
  const [difficulty, setDifficulty] = useState(settings.difficulty ?? "Medium");
  const [arrowSpeed, setArrowSpeed] = useState(settings.arrowSpeed ?? 9);
  const [selectedTheme, setSelectedTheme] = useState(
    Object.keys(themes).find((t) => themes[t].name === theme.name) || "Autumn"
  );
  const [controls, setControls] = useState(settings.controls ?? {
    left: "ArrowLeft",
    down: "ArrowDown",
    up: "ArrowUp",
    right: "ArrowRight",
  });

  // Update settings whenever values change
  useEffect(() => {
    setSettings({ volume, difficulty, arrowSpeed, controls, theme: themes[selectedTheme] });
    setTheme(themes[selectedTheme]);
  }, [volume, difficulty, arrowSpeed, controls, selectedTheme]);

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.gradient} flex flex-col items-center p-8 ${theme.textColor}`}>
      <h1 className="text-4xl font-bold mb-8">Settings</h1>

      {/* Volume */}
      <div className="w-full max-w-md mb-6">
        <label className="block mb-2 font-semibold">Volume: {Math.round(volume * 100)}%</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-2 rounded-lg accent-yellow-400"
        />
      </div>

      {/* Difficulty */}
      <div className="w-full max-w-md mb-6">
        <label className="block mb-2 font-semibold">Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full p-2 rounded-lg bg-gray-800 text-white"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Arrow Speed */}
      <div className="w-full max-w-md mb-6">
        <label className="block mb-2 font-semibold">Arrow Speed: {arrowSpeed}</label>
        <input
          type="range"
          min={4}
          max={20}
          step={1}
          value={arrowSpeed}
          onChange={(e) => setArrowSpeed(parseInt(e.target.value))}
          className="w-full h-2 rounded-lg accent-yellow-400"
        />
      </div>

      {/* Theme Selection */}
      <div className="w-full max-w-md mb-6">
        <label className="block mb-2 font-semibold">Theme</label>
        <select
          value={selectedTheme}
          onChange={(e) => setSelectedTheme(e.target.value)}
          className="w-full p-2 rounded-lg bg-gray-800 text-white"
        >
          {Object.keys(themes).map((key) => (
            <option key={key} value={key}>
              {themes[key].name}
            </option>
          ))}
        </select>
      </div>

      {/* Control Remapping */}
      <div className="w-full max-w-md mb-6">
        <label className="block mb-2 font-semibold">Controls</label>
        <div className="grid grid-cols-2 gap-4">
          {lanes.map((lane) => (
            <div key={lane} className="flex flex-col items-center">
              <label className="mb-1">{lane.toUpperCase()}</label>
              <input
                type="text"
                value={controls[lane]}
                onKeyDown={(e) => {
                  e.preventDefault();
                  setControls((prev) => ({ ...prev, [lane]: e.key }));
                }}
                readOnly
                className="w-24 text-center rounded-lg bg-gray-800 text-white p-1 cursor-pointer"
              />
              <small className="text-xs opacity-70">Press a key</small>
            </div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="mt-6 px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:scale-105 transition"
      >
        Back
      </button>
    </div>
  );
};

export default Settings;