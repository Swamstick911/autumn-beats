/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    keyframes: {
  fall: {
    "0%": { transform: "translateX(0px) translateY(0vh) rotate(0deg)" },
    "25%": { transform: "translateX(50px) translateY(25vh) rotate(90deg)" },
    "50%": { transform: "translateX(-50px) translateY(50vh) rotate(180deg)" },
    "75%": { transform: "translateX(50px) translateY(75vh) rotate(270deg)" },
    "100%": { transform: "translateX(0px) translateY(100vh) rotate(360deg)" },
  },
},
animation: {
  fall: "fall linear infinite",
},

  },
},
}