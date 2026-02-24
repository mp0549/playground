import React, { useState } from "react";
import { Link } from "react-router-dom";
import pokemonChoose from '../assets/photos/pokemon_i_choose_you.jpg';

export default function LoveSlider() {
  const [value, setValue] = useState(0);

  const getMessage = (val) => {
  const step = Math.floor(val / 5) * 5; // round to nearest 5%

  const messages = {
    0:  "…This is awkward 😐",
    5:  "Barely a spark 👀",
    10: "Tiny flicker? ✨",
    15: "Hmm okay I see you 😌",
    20: "Alright alright 😁",
    25: "Low but warming up 💗",
    30: "Getting there slowly 💞",
    35: "Growing feelings detected 📈",
    40: "Now we’re talking 😏",
    45: "Solid progress 💕",
    50: "Halfway to destiny ❤️‍🔥",
    55: "Oooh you like me huh 😳",
    60: "Heart rate rising 💓",
    65: "This is getting serious 😳💘",
    70: "Love levels increasing rapidly ⭐",
    75: "Almost at critical affection 🫶",
    80: "It’s getting HOT ❤️‍🔥🔥",
    85: "We’re basically canon now 😭💖",
    90: "SO CLOSE OMG 😭💗",
    95: "One more push… 👀💞",
    100:"I CHOOSE YOU, ALWAYS! ✨❤️✨"
  };

  

  return messages[step] ?? "Error? My love broke the scale 😳💗";
};


  return (
    <div className="relative min-h-screen flex items-center justify-center bg-blue-200 overflow-hidden 
                    bg-[url('/pixel-hearts.png')] bg-cover px-6">

      {/* White Pane Container (MATCHED STYLE) */}
      <div className="relative bg-white/70 backdrop-blur-md rounded-xl shadow-xl p-10 
                      flex flex-col items-center space-y-10 max-w-2xl w-full">

        {/* Back Button */}
        <Link
          to="/"
          className="absolute -top-4 left-4 px-4 py-2 rounded-lg bg-pink-300 hover:bg-pink-400 
                    text-white text-sm shadow-md transition z-20"
        >
          ← Back
        </Link>

        {/* Title */}
        <h1 className="text-5xl font-bold text-pink-700 drop-shadow-lg">
          Love Meter ❤️
        </h1>

        {/* Slider Frame */}
        <div className="w-full p-4 border-4 border-pink-400 rounded-lg bg-white shadow pixel-border">
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full accent-pink-500"
          />
        </div>

        {/* Dynamic Text */}
        <p className="text-xl font-semibold text-pink-700">
          {getMessage(value)}
        </p>

        {/* HP / Love Bar */}
        <div className="w-full border-4 border-pink-400 bg-white rounded-lg p-2 pixel-border shadow">
          <div className="w-full bg-pink-100 h-6 rounded overflow-hidden">
            <div
              className="h-full transition-all duration-300 pixel-fill-pink"
              style={{ width: `${value}%` }}
            ></div>
          </div>
        </div>

        {/* Bouncing Heart at 100 */}
        {value === 100 && (
          <img src={pokemonChoose} alt="I Choose You" className="w-80 rounded-lg shadow-lg" />
        )}
      </div>

      {/* Pixel Art Styles */}
      <style>
        {`
          .pixel-border {
            image-rendering: pixelated;
            box-shadow: 0 0 0 4px #ff77a9, 
                        0 0 0 8px #ffb6d9;
          }

          .pixel-fill-pink {
            background-image: repeating-linear-gradient(
              -45deg,
              #ff6fa8,
              #ff6fa8 4px,
              #ff9fc6 4px,
              #ff9fc6 8px
            );
            image-rendering: pixelated;
          }

        `}
      </style>
    </div>
  );
}
