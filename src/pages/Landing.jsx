import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import leaf from "../assets/leaf.png";
import { useNavigate } from "react-router-dom";

const NUM_LEAVES = 10;

const Landing = () => {
  const leavesRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    leavesRef.current.forEach((leaf) => {
      gsap.fromTo(
        leaf,
        {
          x: Math.random() * window.innerWidth,
          y: -50,
          rotation: Math.random() * 360,
        },
        {
          y: window.innerHeight + 50,
          x: `+=${Math.random() * 100 - 50}`, // horizontal sway
          rotation: "+=" + (Math.random() * 360),
          duration: Math.random() * 6 + 4,
          repeat: -1,
          ease: "none",
          delay: Math.random() * 5,
        }
      );
    });
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-orange-500 via-amber-400 to-yellow-400 text-white">
      {/* Leaf Falling Animation */}
      {[...Array(NUM_LEAVES)].map((_, i) => (
        <img
          key={i}
          ref={(el) => (leavesRef.current[i] = el)}
          src={leaf}
          alt="leaf"
          className="absolute w-10 z-0"
        />
      ))}
      {/* Titles and Buttons */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10">
        <h1 className="relative text-6xl font-extrabold drop-shadow-xl mb-4 z-10 flex justify-center items-center">Autumn Beats</h1>
        <p className="relative text-xl italic mb-8 z-10 flex justify-center items-center">Enter into the world of rhythm!</p>
        <div className="flex gap-6 relative z-10 justify-center items-center">
          <button
            onClick={() => navigate("/game")} 
            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-br from-[#638603] to-[#81C91C] text-white hover:scale-110 transition">
            Enter the game
          </button>
          <button
            onClick={() => navigate("/howtoplay")} 
            className="px-6 py-3 rounded-xl bg-transparent border-2 hover:scale-110 border-[#81C91C] text-black transition">
            How to Play?
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 w-full flex justify-center z-50 pointer-events-auto">
        <p className="text-md opacity-60 text-black text-semibold">
          Want to Contribute? See our{" "}
          <a
            href="https://github.com/Swamstick911/autumn-beats"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Github
          </a>.
        </p>
      </div>
    </div>
  );
};

export default Landing;
