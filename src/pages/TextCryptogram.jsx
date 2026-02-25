import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

/* ============================================================
   GLOBAL PUZZLE CACHE (persists across navigation)
============================================================ */

const puzzleCache = {};
let hasPreloaded = false;

/* ============================================================
   TEXT BUILDING (multi-sentence splice, 90–160 chars)
============================================================ */

function buildPlayableText(text, min = 90, max = 160) {
  const sentences = text.split(/(?<=[.!?])\s+/);

  let result = "";

  for (let s of sentences) {
    const cleaned = s
      .replace(/\([^)]*\)/g, "")
      .replace(/[^a-zA-Z0-9\s.,!?'-]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleaned) continue;

    if ((result + " " + cleaned).length > max) break;

    result += (result ? " " : "") + cleaned;

    if (result.length >= min) break;
  }

  if (result.length < min) return null;

  return result.toUpperCase();
}

/* ============================================================ */

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

/* ============================================================ */

function matchesCategory(data, category) {
  if (category === "general") return true;

  const desc = data.description?.toLowerCase() || "";

  if (category === "people") {
    return (
      desc.includes("born") ||
      desc.includes("actor") ||
      desc.includes("writer") ||
      desc.includes("scientist")
    );
  }

  if (category === "places") {
    return desc.match(/city|country|town|village|capital|state/);
  }

  return true;
}

/* ============================================================ */

async function getRandomPuzzle(category) {
  while (true) {
    const res = await fetch(
      "https://en.wikipedia.org/api/rest_v1/page/random/summary"
    );
    const data = await res.json();

    if (!data.extract || data.type !== "standard") continue;
    if (!matchesCategory(data, category)) continue;

    const playable = buildPlayableText(data.extract);
    if (!playable) continue;

    return playable;
  }
}

async function getDailyPuzzle(category) {
  const seed = `${getTodayString()}-${category}`;
  const number = hashString(seed);
  const pageId = (number % 1000000) + 1;

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${pageId}`
    );
    const data = await res.json();

    if (!data.extract || data.type !== "standard")
      return getRandomPuzzle(category);

    if (!matchesCategory(data, category))
      return getRandomPuzzle(category);

    const playable = buildPlayableText(data.extract);
    if (!playable) return getRandomPuzzle(category);

    return playable;
  } catch {
    return getRandomPuzzle(category);
  }
}

/* ============================================================ */

function generateCipherNumbers(plaintext) {
  const letters = [...new Set(
    plaintext
      .toUpperCase()
      .split("")
      .filter((ch) => /[A-Z]/.test(ch))
  )];

  const nums = Array.from({ length: 26 }, (_, i) => i + 1);
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }

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

/* ============================================================ */

export default function Cryptogram() {
  const [restartKey, setRestartKey] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const [guesses, setGuesses] = useState({});
  const [phrase, setPhrase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revealsUsed, setRevealsUsed] = useState(0);

  const [mode, setMode] = useState("random");
  const [category, setCategory] = useState("general");
  const [difficulty, setDifficulty] = useState("easy");

  /* ============================================================
     CACHED FETCH (GLOBAL CACHE)
  ============================================================ */

  useEffect(() => {
    const key = `${mode}-${category}`;

    const loadPuzzle = async () => {
      setRevealsUsed(0);

      if (puzzleCache[key]) {
        setPhrase(puzzleCache[key]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const text =
          mode === "daily"
            ? await getDailyPuzzle(category)
            : await getRandomPuzzle(category);

        puzzleCache[key] = text;
        setPhrase(text);
      } catch {
        setPhrase("FALLBACK PHRASE");
      }

      setLoading(false);
    };

    loadPuzzle();
  }, [mode, category, restartKey]);

  /* ============================================================
     BACKGROUND PRELOAD (RUNS ONCE PER APP SESSION)
  ============================================================ */

  useEffect(() => {
    if (hasPreloaded) return;
    hasPreloaded = true;

    const preloadAll = async () => {
      const modes = ["random", "daily"];
      const categories = ["general", "people", "places"];

      for (let m of modes) {
        for (let c of categories) {
          const key = `${m}-${c}`;
          if (puzzleCache[key]) continue;

          const text =
            m === "daily"
              ? await getDailyPuzzle(c)
              : await getRandomPuzzle(c);

          puzzleCache[key] = text;
        }
      }
    };

    preloadAll();
  }, []);

  /* ============================================================ */

  const puzzle = useMemo(() => {
    if (!phrase) return { phrase: "", data: [] };
    const cipher = generateCipherNumbers(phrase);
    return { phrase, data: buildPuzzleData(phrase, cipher) };
  }, [phrase]);

  const { data } = puzzle;

  const isSolved =
    data.length > 0 &&
    data.every((cell, i) => {
      if (cell.type !== "letter") return true;

      const guess =
        difficulty === "easy"
          ? guesses[cell.code]
          : guesses[i];

      return guess && guess.toUpperCase() === cell.plain;
    });

  /* ============================================================
     KEYBOARD
  ============================================================ */

  useEffect(() => {
    const handler = (e) => {
      if (activeIndex === null) return;

      if (e.key.match(/^[a-zA-Z]$/)) handleGuess(e.key.toUpperCase());
      if (e.key === "ArrowLeft") handleArrowLeft();
      if (e.key === "ArrowRight") handleArrowRight();
      if (e.key === "Backspace") handleBackspace();
      if (e.key === "Delete") handleDelete();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  useEffect(() => {
    setGuesses({});
    setActiveIndex(null);
  }, [difficulty, phrase]);

  const handleGuess = (letter) => {
    if (activeIndex == null || data[activeIndex].type !== "letter") return;

    if (difficulty === "easy") {
      const code = data[activeIndex].code;
      setGuesses((prev) => ({ ...prev, [code]: letter }));
    } else {
      setGuesses((prev) => ({ ...prev, [activeIndex]: letter }));
    }

    setActiveIndex(moveToNextLetter(data, activeIndex));
  };

  const handleArrowLeft = () => {
    if (activeIndex != null)
      setActiveIndex(moveToPrevLetter(data, activeIndex));
  };

  const handleArrowRight = () => {
    if (activeIndex != null)
      setActiveIndex(moveToNextLetter(data, activeIndex));
  };

  const handleDelete = () => {
    if (activeIndex == null) return;

    if (difficulty === "easy") {
      const code = data[activeIndex].code;
      setGuesses((prev) => ({ ...prev, [code]: "" }));
    } else {
      setGuesses((prev) => ({ ...prev, [activeIndex]: "" }));
    }
  };

  const handleBackspace = () => {
    handleDelete();
    handleArrowLeft();
  };

  const handleRestart = () => {
    setActiveIndex(null);
    setGuesses({});
    setRestartKey((x) => x + 1);
  };

  const revealRandomLetter = () => {
    const unrevealed = data.filter((cell, i) => {
      if (cell.type !== "letter") return false;

      const guess =
        difficulty === "easy"
          ? guesses[cell.code]
          : guesses[i];

      return !guess;
    });

    if (!unrevealed.length) return;

    const chosen =
      unrevealed[Math.floor(Math.random() * unrevealed.length)];

    const index = data.findIndex((c) => c === chosen);

    if (difficulty === "easy") {
      setGuesses((prev) => ({
        ...prev,
        [chosen.code]: chosen.plain,
      }));
    } else {
      setGuesses((prev) => ({
        ...prev,
        [index]: chosen.plain,
      }));
    }

    setRevealsUsed((r) => r + 1);
  };

  const Spinner = () => (
    <div className="flex items-center justify-center py-10">
      <div className="w-10 h-10 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin" />
    </div>
  );

  /* ============================================================ */

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-pink-100 px-6">
      <div className="relative bg-white/70 backdrop-blur-md rounded-xl shadow-xl p-10 
                      flex flex-col items-center space-y-8 max-w-3xl w-full">

        <Link
          to="/"
          className="absolute -top-4 left-4 px-4 py-2 rounded-lg bg-pink-300 text-white text-sm shadow-md"
        >
          ← Back
        </Link>

        <h1 className="text-4xl font-bold text-pink-700">
          Cryptogram
        </h1>

        <div className="flex gap-4">
          <button onClick={() => setMode("random")} className="px-3 py-1 bg-pink-200 rounded">
            Random
          </button>
          <button onClick={() => setMode("daily")} className="px-3 py-1 bg-pink-200 rounded">
            Daily
          </button>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1 rounded"
          >
            <option value="general">General</option>
            <option value="people">People</option>
            <option value="places">Places</option>
          </select>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
              {data.map((cell, i) => {
                if (cell.type === "space")
                  return <div key={i} style={{ width: 16 }} />;

                if (cell.type === "punct")
                  return (
                    <div key={i} className="text-2xl text-pink-700">
                      {cell.char}
                    </div>
                  );

                const guess =
                  difficulty === "easy"
                    ? guesses[cell.code] || ""
                    : guesses[i] || "";

                const isActive = i === activeIndex;

                return (
                  <div
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`flex flex-col items-center cursor-pointer rounded px-1
                      ${isActive ? "bg-pink-200 shadow-md scale-105" : ""}
                    `}
                  >
                    <div className="h-6 text-xl">{guess}</div>
                    <div
                      className={`w-6 h-[2px] mb-1 ${
                        isActive ? "bg-pink-500" : "bg-pink-700"
                      }`}
                    />
                    <div className="text-xs">{cell.code}</div>
                  </div>
                );
              })}
            </div>

            <Keyboard
              onLetter={handleGuess}
              onLeft={handleArrowLeft}
              onRight={handleArrowRight}
              onBackspace={handleBackspace}
              onDelete={handleDelete}
            />

            <button
              onClick={revealRandomLetter}
              className="px-3 py-2 bg-purple-300 text-white rounded"
            >
              Reveal a Letter ✨
            </button>
          </>
        )}
      </div>

      <AnimatePresence>
        {isSolved && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Confetti recycle={false} />

            <div className="bg-white p-10 rounded-3xl text-center">
              <h2 className="text-3xl font-bold mb-4">
                🎉 SOLVED! 🎉
              </h2>

              <p className="mb-6 text-lg">
                “{puzzle.phrase}”
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 bg-pink-500 text-white rounded"
                >
                  Play Again 💖
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   KEYBOARD
============================================================ */

function Keyboard({ onLetter, onLeft, onRight, onBackspace, onDelete }) {
  const rows = [
    "QWERTYUIOP".split(""),
    "ASDFGHJKL".split(""),
    "ZXCVBNM".split("")
  ];

  return (
    <div className="flex flex-col items-center space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2">
          {row.map((l) => (
            <button
              key={l}
              onClick={() => onLetter(l)}
              className="px-3 py-2 bg-white border rounded"
            >
              {l}
            </button>
          ))}
        </div>
      ))}

      <div className="flex gap-2">
        <button onClick={onLeft} className="px-3 py-2 bg-white border rounded">←</button>
        <button onClick={onRight} className="px-3 py-2 bg-white border rounded">→</button>
        <button onClick={onBackspace} className="px-3 py-2 bg-white border rounded">⌫</button>
        <button onClick={onDelete} className="px-3 py-2 bg-white border rounded">DEL</button>
      </div>
    </div>
  );
}