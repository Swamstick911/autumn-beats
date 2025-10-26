import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Arrow from "../components/Arrow";

const lanes = ["left", "down", "up", "right"];
const laneKeys = {
  ArrowLeft: "left",
  ArrowDown: "down",
  ArrowUp: "up",
  ArrowRight: "right",
};

const levels = [
  { name: "Easy", spawnRate: 700, speed: 6, hitWindow: 50 },
  { name: "Medium", spawnRate: 500, speed: 9, hitWindow: 40 },
  { name: "Hard", spawnRate: 350, speed: 12, hitWindow: 30 },
];

const songs = [
  { id: 1, name: "Autumn Beats", src: "/music/autumn.mp3" },
  { id: 2, name: "Night Drive", src: "/music/night-drive.mp3" },
];

const Game = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const songId = parseInt(params.get("song"));
  const levelIndex = parseInt(params.get("level")) || 0;

  const song = songs.find((s) => s.id === songId) || songs[0];
  const currentLevel = levels[levelIndex];

  const [arrows, setArrows] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const audioRef = useRef(null);
  const spawnIntervalRef = useRef(null);
  const moveIntervalRef = useRef(null);

  const startGame = () => {
    setScore(0);
    setArrows([]);
    setFeedback("");

    // play song
    audioRef.current.currentTime = 0;
    audioRef.current.play();

    // spawn arrows
    spawnIntervalRef.current = setInterval(() => {
      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      const id = Date.now();
      setArrows((prev) => [...prev, { id, lane, y: -60, hit: false }]);
    }, currentLevel.spawnRate);

    // move arrows downward
    moveIntervalRef.current = setInterval(() => {
      setArrows((prev) =>
        prev
          .map((a) => ({ ...a, y: a.y + currentLevel.speed }))
          .filter((a) => a.y < window.innerHeight + 50)
      );
    }, 30);

    audioRef.current.onended = () => {
      clearInterval(spawnIntervalRef.current);
      clearInterval(moveIntervalRef.current);
    };
  };

  useEffect(() => {
    const handleKey = (e) => {
      const lane = laneKeys[e.key];
      if (!lane) return;

      let hit = false;
      setArrows((prev) =>
        prev.map((arrow) => {
          if (arrow.lane === lane && !arrow.hit) {
            const diff = Math.abs(arrow.y - (window.innerHeight - 250));
            if (diff < currentLevel.hitWindow) {
              hit = true;
              setScore((s) => s + 100);
              setFeedback("Perfect!");
              setTimeout(() => setFeedback(""), 400);
              return { ...arrow, hit: true, y: window.innerHeight + 300 };
            }
          }
          return arrow;
        })
      );

      if (!hit) {
        setFeedback("Miss!");
        setTimeout(() => setFeedback(""), 400);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [arrows, currentLevel]);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-orange-500 to-yellow-400 overflow-hidden">
      <button
        onClick={startGame}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-br from-[#638603] to-[#81C91C] hover:scale-110 transition"
      >
        Start Game
      </button>

      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white text-2xl font-bold">
        Score: {score}
      </div>
      <div className="absolute top-16 left-1/2 -translate-x-1/2 text-3xl font-extrabold text-violet-900 drop-shadow-lg">
        {feedback}
      </div>

      {/* Target arrows */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-20">
        {lanes.map((lane) => (
          <div
            key={lane}
            className="relative w-16 h-16 flex justify-center items-center border-2 border-gray-700 rounded-xl bg-gray-800 bg-opacity-40"
          >
            <Arrow lane={lane} staticArrow />
          </div>
        ))}
      </div>

      {/* Falling arrows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-20">
        {lanes.map((lane) => (
          <div
            key={lane}
            className="relative w-16 h-full flex flex-col items-center"
          >
            {arrows
              .filter((arrow) => arrow.lane === lane)
              .map((arrow) => (
                <div
                  key={arrow.id}
                  className="absolute"
                  style={{
                    top: `${arrow.y}px`,
                    opacity: arrow.hit ? 0.3 : 1,
                    transition: "top 0.03s linear",
                  }}
                >
                  <Arrow lane={arrow.lane} />
                </div>
              ))}
          </div>
        ))}
      </div>

      <audio ref={audioRef} src={song.src} preload="auto" />
    </div>
  );
};

export default Game;