import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";


// ------------------------------------------------------------
// PHRASES — Add as many as you want
// ------------------------------------------------------------
const PHRASES = [
  
  "YEAH SAME THOUGH I LOVE YOU VOICE THE NIGHT WE WATCHED THREE IDIOTS AND YOU WERE SINGING MADE ME SO HAPPY BECAUSE YOU SINGING IS SUCH A HAPPY SOUND",
  "I LIKE BEING THE FIRST PERSON YOU TALK TO ... I LIKE BEING THE LAST TOO",
  "YOU'RE SO COMFORTABLE TO BE AROUND (AND ON, 10/10 PILLOW AND STUFFED ANIMAL)",
  "DUDE IT'S SO CUTE LIKE [YOUR LAUGH] SOUNDS LIKE MUSIC ... IT'S SUCH A PRETTY SOUND",
  "YOU LOOK SO SO SO CUTE. I WOULD CUTENESS AGGRESSION THE SHIT OUT OF YOU",
  "I THINK I STARTED LOVING YOU AS A PERSON AT DURGA PUJO",
  "YOU'RE A LOT OF THINGS BUT MOSTLY YOU'RE WHY COLLEGE STARTED TO FEEL LIKE HOME",
  "I SLEEP SO THAT I CAN SEE YOU BECAUSE I HATE TO WAIT THAT LONG",
  "DO YOU WANT TO BE THE +1 TO MY WEDDING?",
  "I WAS GOING TO SAY U DESERVE BETTER BUT NO ACTUALLY UR PERFECT FOR ME AND I'M PERFECT FOR U END OF SENTENCE WE BELONG TOGETHER",
  "I'VE LEARNED A LOT FROM YOU BECAUSE OF THAT ... MOSTLY LIKE HARRY POTTER STUFF BUT THAT'S PERFECT",
  "I LOVE WHEN YOU LOVE ME AND I LOVE THAT YOU LOVE ME"
];

// ------------------------------------------------------------
// Helpers
// -------------------------is-----------------------------------

function randomPhrase() {
  return PHRASES[Math.floor(Math.random() * PHRASES.length)];
}

function generateCipherNumbers(plaintext) {
  // Collect unique letters from the phrase
  const letters = [...new Set(
    plaintext
      .toUpperCase()
      .split("")
      .filter((ch) => /[A-Z]/.test(ch))
  )];

  // Generate numbers 1–26 and shuffle them
  const nums = Array.from({ length: 26 }, (_, i) => i + 1);
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }

  // Assign each letter the next random number
  const map = {};
  letters.forEach((letter, idx) => {
    map[letter] = nums[idx];
  });

  return map;
}


function buildPuzzleData(plaintext, cipherMap) {
  return plaintext.split("").map((ch) => {
    const up = ch.toUpperCase();
    if (/[A-Z]/.test(up)) {
      return { type: "letter", plain: up, code: cipherMap[up] };
    }
    if (ch === " ") return { type: "space" };
    return { type: "punct", char: ch };
  });
}

function moveToNextLetter(data, index) {
  for (let i = index + 1; i < data.length; i++) {
    if (data[i].type === "letter") return i;
  }
  return index;
}

function moveToPrevLetter(data, index) {
  for (let i = index - 1; i >= 0; i--) {
    if (data[i].type === "letter") return i;
  }
  return index;
}


// ------------------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------------------
export default function Cryptogram() {
  const [restartKey, setRestartKey] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const [guesses, setGuesses] = useState({}); // code → letter

  // Build puzzle on restart
  const puzzle = useMemo(() => {
    const phrase = randomPhrase();
    const cipher = generateCipherNumbers(phrase);
    return { phrase, data: buildPuzzleData(phrase, cipher) };
  }, [restartKey]);

  const { data } = puzzle;

  // SOLVED?
  const isSolved = data.every((cell) => {
    if (cell.type !== "letter") return true;
    const guess = guesses[cell.code];
    return guess && guess.toUpperCase() === cell.plain.toUpperCase();
  });

  // ------------------------------------------------------------
  // KEYBOARD INPUT SUPPORT (web keyboard)
  // ------------------------------------------------------------
  useEffect(() => {
    const handler = (e) => {
      if (activeIndex === null) return;

      if (e.key.match(/^[a-zA-Z]$/)) {
        handleGuess(e.key.toUpperCase());
      }
      if (e.key === "ArrowLeft") handleArrowLeft();
      if (e.key === "ArrowRight") handleArrowRight();
      if (e.key === "Backspace") handleBackspace();
      if (e.key === "Delete") handleDelete();
    };


    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const handleGuess = (letter) => {
    if (activeIndex == null || data[activeIndex].type !== "letter") return;

    const code = data[activeIndex].code;

    setGuesses((prev) => ({
      ...prev,
      [code]: letter.toUpperCase()
    }));

    // auto-move
    setActiveIndex(moveToNextLetter(data, activeIndex));
  };

  const handleArrowLeft = () => {
    if (activeIndex != null) setActiveIndex(moveToPrevLetter(data, activeIndex));
  };

  const handleArrowRight = () => {
    if (activeIndex != null) setActiveIndex(moveToNextLetter(data, activeIndex));
  };

  const handleDelete = () => {
    if (activeIndex == null) return;
    const code = data[activeIndex].code;
    setGuesses((prev) => ({ ...prev, [code]: "" }));
  };
  const handleBackspace = () => {
    handleDelete()
    handleArrowLeft()
  }

  const handleRestart = () => {
    setActiveIndex(null);
    setGuesses({});
    setRestartKey((x) => x + 1);
  };

  const revealRandomLetter = () => {
  // Find all cells that are letters AND not yet guessed
  const unrevealed = data.filter(
    (cell) => cell.type === "letter" && (!guesses[cell.code] || guesses[cell.code] === "")
  );

  if (unrevealed.length === 0) return; // nothing to reveal

  // Pick one at random
  const chosen = unrevealed[Math.floor(Math.random() * unrevealed.length)];

  // Reveal its actual correct letter
  setGuesses((prev) => ({
    ...prev,
    [chosen.code]: chosen.plain.toUpperCase(),
  }));

  // Optional: move focus to that revealed cell
  const index = data.findIndex(
    (c) => c.type === "letter" && c.code === chosen.code
  );
  if (index !== -1) setActiveIndex(index);
};

  // COLORS matching your existing app
  const ACTIVE_COLOR = "#e3d2ff"; // lilac
  const GROUP_COLOR = "#f7d6e6";  // pink
  const TEXT_COLOR = "#9a6573";

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-pink-100 overflow-hidden px-6">

      {/* White Pane Container (MATCHED STYLE) */}
      <div className="relative bg-white/70 backdrop-blur-md rounded-xl shadow-xl p-10 
                      flex flex-col items-center space-y-10 max-w-3xl w-full">

        {/* Back Button */}
        <Link
          to="/"
          className="absolute -top-4 left-4 px-4 py-2 rounded-lg bg-pink-300 hover:bg-pink-400 
                    text-white text-sm shadow-md transition z-20"
        >
          ← Back
        </Link>

        {/* Title */}
        <h1 className="text-4xl font-bold text-pink-700 drop-shadow-lg">
          Cryptogram
        </h1>

        {/* PUZZLE GRID */}
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
          {data.map((cell, i) => {
            if (cell.type === "space") {
              return <div key={i} style={{ width: "16px" }} />;
            }
            if (cell.type === "punct") {
              return (
                <div key={i} className="text-2xl text-pink-700 mx-1">
                  {cell.char}
                </div>
              );
            }

            const isActive = i === activeIndex;
            const guess = guesses[cell.code] || "";
            const sameGroupActive =
              activeIndex != null &&
              data[activeIndex].type === "letter" &&
              data[activeIndex].code === cell.code;

            const bg = isActive ? ACTIVE_COLOR : sameGroupActive ? GROUP_COLOR : "transparent";

            return (
              <div
                key={i}
                onClick={() => setActiveIndex(i)}
                className="flex flex-col items-center cursor-pointer px-1 py-1 rounded-md"
                style={{ background: bg, minWidth: 32 }}
              >
                {/* guessed letter */}
                <div className="h-6 text-xl text-pink-700">{guess}</div>

                {/* underline */}
                <div className="w-full h-[2px] bg-pink-700 mb-1" />

                {/* code number */}
                <div className="text-xs text-pink-700">{cell.code}</div>
              </div>
            );
          })}
        </div>

        {/* KEYBOARD */}
        <Keyboard
          onLetter={handleGuess}
          onLeft={handleArrowLeft}
          onRight={handleArrowRight}
          onBackspace={handleBackspace}
          onDelete={handleDelete}
        />
        <button
  onClick={revealRandomLetter}
  className="mt-6 px-3 py-2 bg-purple-300 hover:bg-purple-400 
             text-white text-lg rounded-xl shadow-md transition font-semibold"
>
  Reveal a Letter ✨
</button>

      </div>

      {/* SOLVED OVERLAY */}
      <AnimatePresence>
  {isSolved && (
    <motion.div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >

      {/* Confetti */}
      <Confetti
        numberOfPieces={220}
        gravity={0.25}
        recycle={false}
      />

      <motion.div
        initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl max-w-xl w-[90%] text-center marquee-border"
      >
        {/* Back */}
        <Link
          to="/"
          className="absolute -top-4 left-4 px-4 py-2 rounded-lg bg-pink-300 hover:bg-pink-400 
                     text-white text-sm shadow-md transition"
        >
          ← Back
        </Link>

        <h2 className="text-4xl font-extrabold text-pink-700 mb-6 drop-shadow-lg">
          🎉 SOLVED! 🎉
        </h2>

        {/* Display full phrase */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl font-bold text-purple-700 mb-10 leading-snug"
        >
          “{puzzle.phrase}”<br/>-Ape
        </motion.p>

        {/* Play again */}
        <motion.button
          onClick={handleRestart}
          animate={{ scale: [1, 1.07, 1] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
          className="px-8 py-4 bg-pink-500 text-white rounded-xl text-xl font-bold 
                     shadow-lg hover:scale-105 transition"
        >
          Play Again 💖
        </motion.button>

      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  );
}

// ------------------------------------------------------------
// KEYBOARD
// ------------------------------------------------------------
function Keyboard({ onLetter, onLeft, onRight, onBackspace, onDelete }) {
  const rows = [
    "QWERTYUIOP".split(""),
    "ASDFGHJKL".split(""),
    "ZXCVBNM".split("")
  ];

  const keyClass =
    "bg-white border border-pink-200 rounded-lg shadow-sm px-4 py-3 text-pink-700 text-lg font-semibold cursor-pointer hover:bg-pink-50 transition";

  return (
    <div className="w-full flex flex-col items-center space-y-3">

      {/* ROW 1 */}
      <div className="flex gap-2">
        {rows[0].map((l) => (
          <button key={l} className={keyClass} onClick={() => onLetter(l)}>
            {l}
          </button>
        ))}
      </div>

      {/* ROW 2 */}
      <div className="flex gap-2">
        {rows[1].map((l) => (
          <button key={l} className={keyClass} onClick={() => onLetter(l)}>
            {l}
          </button>
        ))}
      </div>

      {/* ROW 3 + Arrows inline */}
      <div className="flex gap-2 items-center">
        <button className={keyClass} onClick={onLeft}>←</button>

        {rows[2].map((l) => (
          <button key={l} className={keyClass} onClick={() => onLetter(l)}>
            {l}
          </button>
        ))}

        <button className={keyClass} onClick={onRight}>→</button>
      </div>
    </div>
  );
}