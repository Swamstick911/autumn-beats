import React, { forwardRef } from "react";
import { FaArrowLeft, FaArrowDown, FaArrowUp, FaArrowRight } from "react-icons/fa";

const Arrow = forwardRef(({ lane, staticArrow = false }, ref) => {
  const iconMap = {
    left: <FaArrowLeft />,
    down: <FaArrowDown />,
    up: <FaArrowUp />,
    right: <FaArrowRight />,
  };

  const colorMap = {
    left: "#3b82f6", // blue
    down: "#8d09bd", // purpel
    up: "#22c55e",   // green
    right: "#ef4444", // red
  };

  return (
    <div
      ref={ref}
      style={{
        fontSize: staticArrow ? "40px" : "48px",
        color: colorMap[lane],
        opacity: staticArrow ? 0.6 : 1,
        filter: "drop-shadow(0 0 10px rgba(255,255,255,0.6))",
        userSelect: "none",
      }}
    >
      {iconMap[lane]}
    </div>
  );
});

export default Arrow;