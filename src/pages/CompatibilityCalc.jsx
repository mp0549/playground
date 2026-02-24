import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// A big silly list of fun/cute/chaotic relationship questions
const allQuestions = [
  "How often do you think about him? 💭",
  "Who falls asleep first? 😴",
  "Who’s more dramatic? 🎭",
  "What’s your love language? 💗",
  "Rate his cuteness from 1–1000 💖",
  "Would you let him steal your hoodie? 🧥💕",
  "If you two were a movie genre, what would you be? 🎬",
  "Who wins in a pillow fight? 🛏️",
  "Would you still love him if he was a worm? 🐛❤️",
  "What would your couple aesthetic be? ✨",
  "How many inside jokes do you guys have? 😂",
  "Would you share your fries with him? 🍟💞",
  "If he was a fictional character, who would he be? 📚",
  "If you won the lottery, what’s the first thing you’d buy for him? 💸",
  "Would you give him the last slice of pizza? 🍕❤️",
  "Would you rather fight one horse-sized duck or 100 duck-sized horses? 🦆🐴",
];


const sillyResults = [
  "Infinite% ❤️♾️",
  "Perfect Match 💖",
  "3000",
  "12/10 compatibility 😳",
  "Super Ultra Mega Compatible 💖✨",
  "Comfirmed Soulmates",
  "Astronomically Compatible 💞",
  "999999%",
  "Cosmic Love Alignment",
  "Basically Married 😎",
  "Matched Like PB&J",
  ""

];

export default function CompatibilityCalc() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [displayNumber, setDisplayNumber] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [finalResult, setFinalResult] = useState(null);

  // Choose 3 random questions on mount
  useEffect(() => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 3));
  }, []);

  const handleAnswer = (q, val) => {
    setAnswers((prev) => ({ ...prev, [q]: val }));
  };

  const startCalculation = () => {
    setCalculating(true);
    setFinalResult(null);

    let value = 0;
    setDisplayNumber(value);

    const interval = setInterval(() => {
      value = value + Math.floor(Math.random() * 9000) + 500;
      setDisplayNumber(value);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);

      const final =
        Math.random() < 0.6
          ? Math.floor(Math.random() * (999999 - 999 + 1)) + 999 + "%"
          : sillyResults[Math.floor(Math.random() * sillyResults.length)];

      setFinalResult(final);
      setCalculating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-purple-200 px-4">

      <div className="relative bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-lg text-center animate-fadeIn">

        {/* <Link
          to="/"
          className="absolute top-4 left-4 px-4 py-2 rounded-lg bg-pink-300 hover:bg-pink-400 text-white text-sm shadow-md transition"
        >
          ← Back
        </Link> */}

        
        {/* Back Button */}
        <Link
          to="/"
          className="absolute -top-4 left-4 px-4 py-2 rounded-lg bg-pink-300 hover:bg-pink-400 text-white text-sm shadow-md transition"
        >
          ← Back
        </Link>
        <div className="p-8 text-center">
        <h1 className="text-3xl font-bold text-pink-600 mb-6">
          Compatibility Calculator 💖
        </h1>

        {/* Random relationship questions */}
        <div className="space-y-6 mb-6 text-left">
          {questions.map((q, i) => (
            <div key={i}>
              <p className="mb-2 font-medium text-purple-700">{q}</p>
              <input
                type="text"
                placeholder="Your answer (anything works!)"
                onChange={(e) => handleAnswer(q, e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>
          ))}
        </div>

        {/* Calculate Button */}
        <button
          onClick={startCalculation}
          disabled={calculating}
          className="w-full py-3 bg-pink-500 text-white font-bold rounded-lg shadow-md hover:bg-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {calculating ? "Calculating..." : "Calculate Compatibility"}
        </button>

        {/* Result */}
        {(displayNumber !== null || finalResult) && (
          <div className="mt-8">
            {!finalResult ? (
              <p className="text-4xl font-bold text-purple-600 animate-pulse">
                {displayNumber}%
              </p>
            ) : (
              <>
                <p className="text-4xl font-bold text-purple-600 animate-fadeIn">
                  {finalResult}
                </p>
                <p className="mt-3 text-pink-600 text-xl font-semibold animate-fadeIn">
                  Perfect match detected 💗
                </p>
              </>
            )}
          </div>
        )}
        </div>
      </div>

      {/* Fade-in animation */}
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}
      </style>
    </div>
  );
}
