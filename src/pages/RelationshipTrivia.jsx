import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ------------------------
// Sound Helper
// ------------------------

// Preloaded audio objects
const sfxNext = new Audio("src/assets/sfx/mixkit-retro-arcade-casino-notification-211.wav");
const sfxCorrect = new Audio("src/assets/sfx/mixkit-correct-positive-answer-949.wav");
const sfxWrong = new Audio("src/assets/sfx/mixkit-ominous-drums-227.wav");
const sfxCountdown = new Audio("src/assets/sfx/mixkit-simple-game-countdown-921.wav");
const sfxEnd = new Audio("src/assets/sfx/mixkit-game-level-complete-205.wav");


const playSound = (audio, rate = 1.0) => {
  audio.pause();
  audio.currentTime = 0;
  audio.playbackRate = rate;
  audio.play();
};


// ------------------------
// Shuffle Utility
// ------------------------
const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export default function RelationshipTriviaShow() {
  // ------------------------
  // Base Question Data
  // ------------------------
  const questions = [
    {
      q: "When did we go on our first date?",
      choices: ["December 12th 2025", "December 7th 2025", "December 2nd 2025"],
      correct: 1,
    },
    {
      q: "What did we do for our 1 month anniversary?",
      choices: ["Movie night", "Roblox", "Dinner date"],
      correct: 0,
    },
    {
      q: "Who said 'I love you' first?",
      choices: ["You did", "I did", "We said it together"],
      correct: 1,
    },
    {
      q: "When was our first kiss?",
      choices: ["December 12th 2025", "December 7th 2025", "December 2nd 2025"],
      correct: 2,
    },
    {
      q: "When did we first do it?",
      choices: ["Febuary 2nd 2025", "January 24th", "January 25th 2025"],
      correct: 2,
    },
    {
      q: "What is our song?",
      choices: ["blue", "Struck by Lightning", "Home for the Summer"],
      correct: 1,
    },
    {
      q: "Which of these songs songs did we first dance to?",
      choices: ["Steal The Show", "I Like Me Better", "You Were The Dream"],
      correct: 0,
    },
    {
      q: "When did I sleepover at your place for the first time?",
      choices: [ "6/7/2025", "7/4/2025", "6/14/2025"],
      correct: 0,
    },
  ];

  // ------------------------
  // State
  // ------------------------
  const [gameState, setGameState] = useState("start"); // start → countdown → quiz → end
  const [count, setCount] = useState(3);

  const [order] = useState(() => shuffle(questions));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [locked, setLocked] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);

  const question = order[index];

  // ------------------------
  // Start → Countdown Logic
  // ------------------------
  const beginCountdown = () => {
    setGameState("countdown");
    playSound(sfxCountdown);
  };

  useEffect(() => {
    if (gameState === "countdown") {
      if (count > 0) {
        const timer = setTimeout(() => setCount((c) => c - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setTimeout(() => {
          setGameState("quiz");
        }, 400);
      }
    }
  }, [gameState, count]);

  // ------------------------
  // Handle Answer
  // ------------------------
  const handleChoice = (i) => {
    if (locked) return;
    setSelected(i);
    setLocked(true);

    if (i === question.correct) {
      setScore((s) => s + 1);
      playSound(sfxCorrect);
      setFeedback("Correct! ✨");
    } else {
      playSound(sfxWrong);
      setFeedback("Not quite 😵‍💫");

      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 400);
    }
  };

  // ------------------------
  // Next Question
  // ------------------------
  const nextQuestion = () => {
    playSound(sfxNext, 3.0);
    setSelected(null);
    setFeedback("");
    setLocked(false);

    if (index < order.length - 1) {
      setIndex((i) => i + 1);
    } else {
      playSound(sfxEnd);
      setGameState("end");
    }
  };

  // ------------------------
  // START SCREEN
  // ------------------------
  if (gameState === "start") {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center relative overflow-hidden">

        {/* BACK */}
        <Link
          to="/"
          className="absolute top-4 left-4 px-4 py-2 rounded-lg bg-white/20 text-white shadow-md backdrop-blur-md hover:bg-white/30"
        >
          ← Back
        </Link>

        {/* Spotlights */}
        <div className="start-spotlight left-[-150px] top-[-150px]"></div>
        <div className="start-spotlight right-[-150px] top-[-150px]"></div>

        <div className="text-center text-white px-6">
          <motion.h1
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-7xl font-extrabold text-white game-title-glow"
          >
            ✨ RELATIONSHIP TRIVIA SHOW! ✨
          </motion.h1>
          
          <div style={{ height: '30px' }}></div>


          <motion.button
            onClick={beginCountdown}
            animate={{ scale: [1, 1.07, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="px-10 py-4 bg-white text-pink-600 font-extrabold text-2xl rounded-2xl shadow-xl hover:scale-105 transition"
          >
            START 💖
          </motion.button>
        </div>
      </div>
    );
  }

  // ------------------------
  // COUNTDOWN SCREEN
  // ------------------------
  if (gameState === "countdown") {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center">
        <AnimatePresence>
          <motion.div
            key={count}
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0.2, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-white text-9xl font-extrabold countdown-glow"
          >
            {count === 0 ? "GO!" : count}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ------------------------
  // END SCREEN
  // ------------------------
  if (gameState === "end") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center relative overflow-hidden px-4">

        <Link
          to="/"
          className="absolute top-4 left-4 px-4 py-2 rounded-lg bg-pink-300 hover:bg-pink-400 text-white text-sm shadow-md transition"
        >
          ← Back
        </Link>

        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 720 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="relative"
        >
          <div className="marquee-border bg-white/90 backdrop-blur-md p-10 rounded-3xl max-w-xl text-center shadow-xl">
            <h1 className="text-4xl font-extrabold text-pink-700 mb-6">
              🎉 YOU FINISHED THE SHOW! 🎉
            </h1>

            <p className="text-3xl font-extrabold text-purple-700 mb-6">
              Score: {score} / {order.length}
            </p>

            <motion.button
              onClick={() => window.location.reload()}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.2 }}
              className="px-8 py-4 bg-purple-500 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition"
            >
              Play Again 🎀
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ------------------------
  // QUIZ SCREEN
  // ------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center relative px-4 overflow-hidden">
      


      {/* Main Card */}
      <div className="relative marquee-border">
        {/* BACK */}
        <Link
          to="/"
          className="absolute -top-4 left-4 px-4 py-2 rounded-lg bg-pink-300 hover:bg-pink-400 text-white text-sm shadow-md transition z-20"
        >
          ← Back
        </Link>
        {/* Spotlights */}
        <div className="spotlight left"></div>
        <div className="spotlight right"></div>

        <motion.div
          animate={wrongShake ? { x: [-6, 6, -6, 6, 0] } : {}}
          transition={{ duration: 0.35 }}
          className="bg-white/90 backdrop-blur-md p-10 rounded-3xl max-w-2xl w-full shadow-xl"
        >
          {/* SCORE */}
          <div className="flex justify-center mb-6">
            <div className="px-5 py-2 bg-gradient-to-r from-pink-300 to-purple-300 text-white rounded-full text-xl font-bold shadow-md">
              ⭐ Score: {score}
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-pink-700 text-center mb-8">
            {question.q}
          </h2>

          {/* CHOICES */}
          <div className="flex flex-col space-y-4">
            {question.choices.map((c, i) => {
              const isCorrect = selected !== null && i === question.correct;
              const isWrong = selected === i && i !== question.correct;

              return (
                <button
                  key={i}
                  disabled={locked}
                  onClick={() => handleChoice(i)}
                  className={`
                    w-full px-6 py-4 rounded-xl font-bold text-lg
                    transition transform hover:scale-[1.03] active:scale-[0.97]
                    shadow-md
                    ${locked && isCorrect ? "bg-green-300 text-green-800" : ""}
                    ${locked && isWrong ? "bg-red-300 text-red-800" : ""}
                    ${!locked ? "bg-pink-200 hover:bg-pink-300 text-pink-700" : ""}
                  `}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* FEEDBACK */}
          {feedback && (
            <p className="text-center text-purple-700 font-extrabold text-xl mt-6">
              {feedback}
            </p>
          )}

          {/* NEXT */}
          {feedback && (
            <button
              onClick={nextQuestion}
              className="mt-8 w-full px-6 py-3 bg-purple-500 text-white font-extrabold rounded-xl shadow-md hover:scale-[1.03] transition"
            >
              Next →
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
