import React, { useState } from "react";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

export default function GuessMyAnswer() {
  const quiz = [
    {
      question: "What’s my favorite memory with you?",
      choices: ["Our first date", "That one sunset!", "The long call"],
      correct: 0
    },
    {
      question: "Which nickname do I secretly love the most?",
      choices: ["Baby", "My boy", "Pookie", "Love"],
      correct: 1
    },
    {
      question: "What’s my go-to comfort food?",
      choices: ["Pizza", "Ramen", "Oreos", "Ice cream"],
      correct: 2
    },
    {
      question: "What do I think about the most?",
      choices: ["You", "Food", "Sleep", "You again"],
      correct: 0
    },
    {
      question: "If I could have any superpower, which one would I choose??",
      choices: ["Invisibility", "Flying", "Time travel", "Reading minds"],
      correct: 3
    },
    {
      question: "If I could be any animal, what would I be and why?",
      choices: ["Cat", "Dog", "Bear", "Falcon"],
      correct: 2
    },
    {
      question: "What’s my favorite beverage?",
      choices: ["Alcohol", "Coffee", "Tea", "Energy drinks"],
      correct: 1
    },
    {
      question: "What's my top love language?",
      choices: ["Words of Affirmation", "Acts of Service", "Quality Time", "Physical Touch"],
      correct: 2
    },
    {
      question: "What’s my favorite type of movie?",
      choices: ["Romantic Comedy", "Horror", "Action", "Documentary"],
      correct: 1
    },
    {
      question: "What’s my dream vacation spot?",
      choices: ["Beach", "Mountains", "City", "Forest"],
      correct: 3
    },
    {
      question: "What would I most likely do if I had an entire day to myself??",
      choices: ["Sleep in", "Binge-watch shows", "Go for a hike", "Read a book"],
      correct: 0
    },
    {
      question: "What's my favorite time of day?",
      choices: ["Morning", "Afternoon", "Evening", "Night"],
      correct: 3
    },
    {
      question: "Which of these is most likely to stress me out?",
      choices: ["Being unproductive", "Social gatherings", "Deadlines", "Conflict"],
      correct: 0
    },
    {
      question: "Who is my favorite Harry Potter character?",
      choices: ["Dumbledore", "Harry", "Hermoine", "Voldemort"],
      correct: 0
    },
    {
      question: "Who is my favorite One Piece character?",
      choices: ["Luffy", "Zoro", "Sanji", "Nami"],
      correct: 1
    },
  ];

  const getRandomQuestionIndex = () => {
    return Math.floor(Math.random() * quiz.length);
  };

  const [current, setCurrent] = useState(getRandomQuestionIndex());
  const [feedback, setFeedback] = useState("");
  const [answeredCorrect, setAnsweredCorrect] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  const handleChoice = (index) => {
    const correctIndex = quiz[current].correct;

    if (index === correctIndex) {
      setFeedback("OMG you know me so well! ❤️");
      setAnsweredCorrect(true);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      setFeedback("Nice try 😂 but try again!");
      setAnsweredCorrect(false);
    }
  };

  const shuffleQuestion = () => {
    let newIndex = getRandomQuestionIndex();
    while (newIndex === current && quiz.length > 1) {
      newIndex = getRandomQuestionIndex();
    }

    setCurrent(newIndex);
    setFeedback("");
    setAnsweredCorrect(false);
    setShuffleKey((key) => key + 1);
  };

  // 🎀 Soft cute shuffle animation
  const shuffleVariants = {
    initial: { opacity: 0, scale: 0.95, rotate: -2 },
    animate: {
      opacity: 1,
      scale: [0.95, 1.02, 1],
      rotate: [0, 1.5, 0],
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      rotate: 2,
      transition: { duration: 0.25 }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-pink-100 px-6 py-10">


      <AnimatePresence mode="wait">
        <motion.div
          key={shuffleKey}
          variants={shuffleVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-xl max-w-xl w-full text-center space-y-8"
        >
          <h1 className="text-3xl font-semibold text-pink-700">
            {quiz[current].question}
          </h1>

          <div className="flex flex-col space-y-4">
                  <Link
        to="/"
        className="absolute -top-4 left-4 px-4 py-2 rounded-lg bg-pink-300 hover:bg-pink-400 text-white text-sm shadow-md transition"
      >
        ← Back
      </Link>
            {quiz[current].choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoice(index)}
                disabled={answeredCorrect}
                className={`
                  px-6 py-4 rounded-xl text-lg font-bold shadow-md transition 
                  bg-pink-300 hover:bg-pink-400 text-white
                  disabled:opacity-60 disabled:cursor-default
                `}
              >
                {choice}
              </button>
            ))}
          </div>

          {feedback && (
            <p
              className={`text-lg font-medium ${
                answeredCorrect ? "text-green-600" : "text-red-500"
              }`}
            >
              {feedback}
            </p>
          )}
          <div style={{ height: '20px' }}></div>
          <button
            onClick={shuffleQuestion}
            className="mt-4 px-5 py-3 rounded-lg bg-purple-400 hover:bg-purple-500 text-white shadow-md font-medium transition active:scale-95 flex items-center justify-center gap-2"
            style={{ margin: '0 auto' }}
          >
            {/* Cute pastel shuffle icon */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-90"
            >
              <path d="M4 4h3l4 6 4-6h3" />
              <path d="M4 20h3l4-6 4 6h3" />
              <path d="M18 4l2 2-2 2" />
              <path d="M18 16l2 2-2 2" />
            </svg>
            Shuffle
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
