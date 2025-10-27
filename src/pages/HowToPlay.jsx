import React, { useRef, useEffect } from "react";
import leaf from "../assets/leaf.png";
import { gsap } from "gsap";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const NUM_LEAVES = 10;

const HowToPlay = () => {
  const { theme } = useTheme();
  const leavesRef = useRef([]);
  const gsapRefs = useRef([]);

  useEffect(() => {
    // stop previous animations
    gsapRefs.current.forEach((anim) => anim.kill());
    gsapRefs.current = [];

    // animate leaves
    leavesRef.current.forEach((leafEl) => {
      const anim = gsap.fromTo(
        leafEl,
        {
          x: Math.random() * window.innerWidth,
          y: -50,
          rotation: Math.random() * 360,
          opacity: 0.8,
        },
        {
          y: window.innerHeight + 50,
          x: `+=${Math.random() * 100 - 50}`,
          rotation: "+=" + (Math.random() * 360),
          opacity: 0.8,
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
    <div className={`relative h-screen w-full overflow-hidden bg-gradient-to-br ${theme.gradient} ${theme.textColor}`}>
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

      {/* Main Content */}
      <div className="relative z-10 p-8">
        <h1 className="pt-4 font-semibold justify-center flex text-4xl mb-6">How to Play?</h1>

        <section className="mb-6">
          <h2 className="text-2xl underline mb-2">Introduction</h2>
          <p>Autumn Beats is a rhythm game where falling leaves match the rhythm. Keep the music alive by hitting beats accurately!</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl underline mb-2">Controls</h2>
          <ul className="list-disc ml-6">
            <li>Use Arrow Keys or A S D F to match and time the beats.</li>
            <li>Press the corresponding key when the leaf reaches the target line.</li>
            <li>Timing accurately increases your score multiplier.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl underline mb-2">Points and Combos</h2>
          <ul className="list-disc ml-6">
            <li><strong>Perfect Hit:</strong> On beat, max points</li>
            <li><strong>Good Hit:</strong> Slightly off, fewer points</li>
            <li><strong>Miss:</strong> Missing breaks the combo</li>
            <li>Longer streaks grow your multiplier</li>
          </ul>
        </section>
      </div>

      <button
        onClick={() => window.history.back()}
        className="mt-6 ml-6 px-6 py-3 bg-green-700 text-white font-bold rounded-xl hover:scale-105 transition"
      >
        Back
      </button>
    </div>
  );
};

export default HowToPlay;