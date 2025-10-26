import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { songs } from "../data/songs";

const levels = ["Easy", "Medium", "Hard"];

const SongSelection = () => {
  const navigate = useNavigate();
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(0);

  const handleStart = () => {
    if (!selectedSong) return;
    navigate("/game", { state: { song: selectedSong, levelIndex: selectedLevel } });
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-orange-500 to-yellow-400 flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl mb-8 font-bold top-7">Select a Song</h1>

      <div className="flex gap-8 mb-8">
        {songs.map((song) => (
          <div
            key={song.id}
            className={`p-4 rounded-lg cursor-pointer border-2 hover:scale-110 transition ${
              selectedSong?.id === song.id ? "border-yellow-400" : "border-white"
            }`}
            onClick={() => setSelectedSong(song)}
          >
            <p className="text-xl font-semibold">{song.name}</p>
          </div>
        ))}
      </div>

      {selectedSong && (
        <div className="flex gap-4 mb-4">
          {levels.map((lvl, i) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(i)}
              className={`px-3 py-1 rounded ${
                selectedLevel === i ? "bg-yellow-400 text-black" : "bg-gray-700"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      )}

      {selectedSong && (
        <button
          onClick={handleStart}
          className="mt-6 px-6 py-3 rounded-xl bg-green-500 hover:scale-110 transition"
        >
          Start Game
        </button>
      )}
    </div>
  );
};

export default SongSelection;