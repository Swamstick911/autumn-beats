import React, { useRef, useEffect } from "react";
import leaf from "../assets/leaf.png";
import { gsap } from "gsap";

const NUM_LEAVES = 10;

const HowToPlay = () => {
    const leavesRef = useRef([]);

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
        <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-orange-500 via-amber-400 to-yellow-400 text-black">
            {/* Main Heading */}
            <h1 className="pt-4 font-semibold justify-center flex">How to Play?</h1>

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

            {/* Instructions */}
            <p className="text-3xl underline ml-8 mt-20">Introduction</p>
            <p className="ml-16 text-xl mt-5">Autumn Beats is a rhythm game where the serenity of falling leaves blends with rhythm. Your object is <br />
                straightforward that is to keep the music running by combo-ing them and keeping it alive</p>
            <p className="text-3xl underline ml-8 mt-10">Controls</p>
            <ul className="ml-16 text-xl list-disc mt-5">
                <li>Use Arrow Keys or A S D F to match and time the beats.</li>
                <li>Press teh corresponding key when the leaf reaches the line.</li>
                <li>For greater accuracy, time the beats and stay focused.</li>
            </ul>
            <p className="text-3xl underline ml-8 mt-10">Points and Combos</p>
            <ul className="ml-16 text-xl list-disc mt-5">
                <li><strong>Perfect Hit - </strong> On beat, max points</li>
                <li><strong>Good Hit - </strong> Slightly off earns lesser points</li>
                <li><strong>Miss - </strong> missing the beat breaks the combo</li>
                <li>Longer the streak higher the multiplier grows</li>
            </ul>
        </div>
    );
}

export default HowToPlay;