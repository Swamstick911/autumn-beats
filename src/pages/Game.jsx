import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Arrow from "../components/Arrow";
import { useTheme } from "../context/ThemeContext";

const lanes = ["left", "down", "up", "right"];
const laneKeys = {
  ArrowLeft: "left",
  ArrowDown: "down",
  ArrowUp: "up",
  ArrowRight: "right",
  a: "left",
  s: "down",
  w: "up",
  d: "right",
};

const levels = [
  { name: "Easy", spawnRate: 700, speed: 6, hitWindow: 60 },
  { name: "Medium", spawnRate: 500, speed: 9, hitWindow: 45 },
  { name: "Hard", spawnRate: 350, speed: 12, hitWindow: 30 },
];

const songs = [
  { id: 1, name: "Autumn Beats", src: "/music/autumn.mp3" },
  { id: 2, name: "Night Drive", src: "/music/night-drive.mp3" },
];

const Game = () => {
  const location = useLocation();
  const { theme } = useTheme();

  const params = new URLSearchParams(location.search);
  const songId = parseInt(params.get("song"));
  const levelIndex = parseInt(params.get("level")) || 0;

  const song = songs.find((s) => s.id === songId) || songs[0];
  const currentLevel = levels[levelIndex];

  const [arrows, setArrows] = useState([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [accuracy, setAccuracy] = useState(100);
  const [totalHits, setTotalHits] = useState(0);
  const [perfectHits, setPerfectHits] = useState(0);
  const [goodHits, setGoodHits] = useState(0);
  const [missHits, setMissHits] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [countdownActive, setCountdownActive] = useState(false);

  const audioRef = useRef(null);
  const spawnIntervalRef = useRef(null);
  const moveIntervalRef = useRef(null);

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setArrows([]);
    setFeedback("");
    setAccuracy(100);
    setPerfectHits(0);
    setGoodHits(0);
    setMissHits(0);
    setTotalHits(0);
    setGameOver(false);
    setPaused(false);

    setCountdown(3);
    setCountdownActive(true);
  };

  useEffect(() => {
    if (!countdownActive) return;

    if (countdown === 0) {
      setCountdownActive(false);
      // Start audio and arrow intervals
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      spawnArrows();
      moveArrows();

      audioRef.current.onended = () => {
        clearInterval(spawnIntervalRef.current);
        clearInterval(moveIntervalRef.current);
        setGameOver(true);
      };
      return;
    }

    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, countdownActive]);

  const spawnArrows = () => {
    spawnIntervalRef.current = setInterval(() => {
      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      const id = Date.now();
      setArrows((prev) => [...prev, { id, lane, y: -60, hit: false }]);
    }, currentLevel.spawnRate);
  };

  const moveArrows = () => {
    moveIntervalRef.current = setInterval(() => {
      setArrows((prev) =>
        prev
          .map((a) => ({ ...a, y: a.y + currentLevel.speed }))
          .filter((a) => a.y < window.innerHeight + 50)
      );
    }, 30);
  };

  const pauseGame = () => {
    if (paused || countdownActive) return;
    setPaused(true);
    clearInterval(spawnIntervalRef.current);
    clearInterval(moveIntervalRef.current);
    audioRef.current.pause();
  };

  const resumeGame = () => {
    if (!paused) return;
    setPaused(false);
    audioRef.current.play();
    spawnArrows();
    moveArrows();
  };

  const handleKey = (e) => {
    if (paused || countdownActive) return;
    const lane = laneKeys[e.key];
    if (!lane || gameOver) return;

    const activeArrow = arrows.find((a) => a.lane === lane && !a.hit);

    if (!activeArrow) {
      setFeedback("Miss!");
      setMissHits((m) => m + 1);
      setCombo(0);
      setTotalHits((t) => t + 1);
      setTimeout(() => setFeedback(""), 400);
      return;
    }

    const diff = Math.abs(activeArrow.y - (window.innerHeight - 250));
    let hitType = null;

    if (diff < currentLevel.hitWindow / 2) hitType = "perfect";
    else if (diff < currentLevel.hitWindow) hitType = "good";

    if (hitType) {
      setArrows((prev) =>
        prev.map((a) =>
          a.id === activeArrow.id ? { ...a, hit: true, y: window.innerHeight + 300 } : a
        )
      );

      if (hitType === "perfect") {
        setScore((s) => s + 300);
        setPerfectHits((p) => p + 1);
        setFeedback("Perfect!");
      } else {
        setScore((s) => s + 200);
        setGoodHits((g) => g + 1);
        setFeedback("Good!");
      }

      setCombo((c) => {
        const newCombo = c + 1;
        setMaxCombo((max) => Math.max(max, newCombo));
        return newCombo;
      });
    } else {
      setFeedback("Miss!");
      setMissHits((m) => m + 1);
      setCombo(0);
    }

    setTotalHits((t) => t + 1);
    setTimeout(() => setFeedback(""), 400);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [arrows, gameOver, paused, countdownActive]);

  useEffect(() => {
    const total = perfectHits + goodHits + missHits;
    if (total === 0) return;
    const acc = ((perfectHits + 0.7 * goodHits) / total) * 100;
    setAccuracy(acc.toFixed(1));
  }, [perfectHits, goodHits, missHits]);

  return (
    <div className={`relative w-full h-screen bg-gradient-to-b ${theme.gradient} ${theme.textColor} overflow-hidden transition-colors duration-500`}>
      {/* Start Button */}
      {!countdownActive && !gameOver && arrows.length === 0 && (
        <button
          onClick={startGame}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-br from-[#638603] to-[#81C91C] hover:scale-110 transition text-white"
        >
          Start Game
        </button>
      )}

      {/* Countdown Overlay */}
      {countdownActive && (
        <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-white drop-shadow-lg z-50">
          {countdown}
        </div>
      )}

      {/* Score & Combo */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-2xl font-bold">
        Score: {score}
      </div>
      <div className="absolute top-14 left-1/2 -translate-x-1/2 text-lg font-semibold text-yellow-300">
        Combo: {combo > 0 ? `${combo}x` : ""}
      </div>

      {/* Feedback */}
      <div className={`absolute top-24 left-1/2 -translate-x-1/2 text-4xl font-extrabold drop-shadow-lg ${
        feedback === "Perfect!" ? "text-green-400" :
        feedback === "Good!" ? "text-blue-400" : "text-red-400"
      }`}>
        {feedback}
      </div>

      {/* Target Arrows */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-20">
        {lanes.map((lane) => (
          <div key={lane} className="relative w-16 h-16 flex justify-center items-center border-2 border-gray-700 rounded-xl bg-gray-800 bg-opacity-40">
            <Arrow lane={lane} staticArrow />
          </div>
        ))}
      </div>

      {/* Falling Arrows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-20">
        {lanes.map((lane) => (
          <div key={lane} className="relative w-16 h-full flex flex-col items-center">
            {arrows.filter(a => a.lane === lane).map(arrow => (
              <div key={arrow.id} className="absolute" style={{
                top: `${arrow.y}px`,
                opacity: arrow.hit ? 0.3 : 1,
                transition: "top 0.03s linear"
              }}>
                <Arrow lane={arrow.lane} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Results Screen */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Results</h2>
          <p>Score: {score}</p>
          <p>Max Combo: {maxCombo}</p>
          <p>Accuracy: {accuracy}%</p>
          <p>Perfect: {perfectHits} | Good: {goodHits} | Miss: {missHits}</p>
          <button onClick={startGame} className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold">
            Retry
          </button>
        </div>
      )}

      <audio ref={audioRef} src={song.src} preload="auto" />

      {/* Pause Button */}
      {!gameOver && !countdownActive && (
        <button onClick={paused ? resumeGame : pauseGame} className="absolute top-6 right-6 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-semibold text-black z-50">
          {paused ? "Resume" : "Pause"}
        </button>
      )}

      {/* Pause Overlay */}
      {paused && !gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white text-center z-40">
          <h2 className="text-4xl font-bold mb-6">Paused</h2>
          <button onClick={resumeGame} className="mb-4 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold">
            Resume
          </button>
          <button onClick={startGame} className="mb-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;