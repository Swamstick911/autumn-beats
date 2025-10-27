import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import leaf from "../assets/leaf.png";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const NUM_LEAVES = 10;

const Landing = () => {
  const { theme } = useTheme();
  const leavesRef = useRef([]);
  const gsapRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    gsapRefs.current.forEach((anim) => anim.kill());
    gsapRefs.current = [];

    leavesRef.current.forEach((leafEl) => {
      const anim = gsap.fromTo(
        leafEl,
        {
          x: Math.random() * window.innerWidth,
          y: -50,
          rotation: Math.random() * 360,
        },
        {
          y: window.innerHeight + 50,
          x: `+=${Math.random() * 100 - 50}`,
          rotation: "+=" + (Math.random() * 360),
          duration: Math.random() * 6 + 4,
          repeat: -1,
          ease: "none",
          delay: Math.random() * 5,
        }
      );
      gsapRefs.current.push(anim);
    });

    return () => {
      gsapRefs.current.forEach((anim) => anim.kill());
    };
  }, [theme]);

  return (
    <div className={`relative min-h-screen bg-gradient-to-b ${theme.gradient} ${theme.textColor} overflow-hidden`}>
      {/* Leaves */}
      {[...Array(NUM_LEAVES)].map((_, i) => (
        <img
          key={i}
          ref={(el) => (leavesRef.current[i] = el)}
          src={leaf}
          alt="leaf"
          className="absolute w-10 z-0 pointer-events-none"
        />
      ))}

      {/* Titles and Buttons */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10">
        <h1 className="text-6xl font-extrabold drop-shadow-xl mb-4">Autumn Beats</h1>
        <p className="text-xl italic mb-8">Enter into the world of rhythm!</p>
        <div className="flex gap-6">
          <button
            onClick={() => navigate("/songselection")}
            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-br from-[#638603] to-[#81C91C] text-white hover:scale-110 transition"
          >
            Enter the game
          </button>
          <button
            onClick={() => navigate("/howtoplay")}
            className="px-6 py-3 rounded-xl bg-transparent border-2 border-[#81C91C] hover:scale-110 transition"
          >
            How to Play?
          </button>
        </div>
        <button
          onClick={() => navigate("/settings")}
          className="px-6 py-3 rounded-xl backdrop-blur-md border-2 hover:scale-110 transition bg-transparent border-black mt-3"
        >
          Settings
        </button>
      </div>
    </div>
  );
};

export default Landing;