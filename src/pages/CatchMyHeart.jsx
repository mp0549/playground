import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import heartImg from "../assets/photos/cuteheart.png";
import brokenHeartImg from "../assets/photos/cutebrokenheart.png";

export default function HeartsGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [gameOver, setGameOver] = useState(false);

  // NEW: Compliment state
  const [compliment, setCompliment] = useState("");
  const [showCompliment, setShowCompliment] = useState(false);

  const compliments = [
    "You make every day feel like Valentine’s Day. 💕",
    "Your smile is my favorite power-up. ✨",
    "If love was a game, I'd choose you every time. 🎮💖",
    "You’re cuter than every heart in this game combined. 💗",
    "I still get butterflies because of you. 🦋",
    "You’re my favorite person and my favorite everything. 🌷",
    "One year with you feels like one second and one lifetime. 💘",
    "You’re my cozy place in a chaotic world. 🩷",
    "You're the plot twist I always hoped for. ✨",
    "I love you more than this game loves pink. 🌸",
    "Your laugh > every sound effect ever created. 🎀",
    "Being with you makes my heart do cartwheels. 🤸‍♀️💕",
    "You’re the reason my heart has a high score. 💓",
    "I love you to the moon, back, and all the cute planets. 🌙💫",
    "You’re the sweetest thing since sugar became a thing. 🍬",
    "You make my whole soul go *sparkle mode*. ✨💗",
    "I’m in love with you and it’s extremely your fault. 😌💕",
    "You + me = undefeated duo forever. 💞",
    "You make even ordinary moments feel magical. 🧁",
    "You're my favorite chapter in the story I'm writing. 📖💘"
  ];

  const basketRef = useRef({
    x: 200,
    width: 80,
    height: 40,
    speed: 8
  });

  const heartsRef = useRef([]);
  const keys = useRef({ left: false, right: false });

  const heartImage = new Image();
  heartImage.src = heartImg;

  const brokenHeartImage = new Image();
  brokenHeartImage.src = brokenHeartImg;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") keys.current.left = true;
      if (e.key === "ArrowRight" || e.key === "d") keys.current.right = true;
    };

    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") keys.current.left = false;
      if (e.key === "ArrowRight" || e.key === "d") keys.current.right = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const spawnHeart = (canvas) => {
    const speed = 1 + Math.random() * 1 + score * 0.05;
    heartsRef.current.push({
      x: Math.random() * (canvas.width - 40),
      y: -10,
      speed,
      broken: false,
      brokenTimer: 0,
    });
  };

  // NEW:
  // compliment triggers every time score hits a multiple of 5 (except 0)
  useEffect(() => {
    if (score > 0 && score % 5 === 0) {
      const newCompliment =
        compliments[Math.floor(Math.random() * compliments.length)];
      setCompliment(newCompliment);
      setShowCompliment(true);

      // fade out after animation
      setTimeout(() => setShowCompliment(false), 1800);
    }
  }, [score]);

  // GAME LOOP
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let lastSpawnTime = 0;
    let animationFrame;

    const gameLoop = (timestamp) => {
      if (gameOver) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (timestamp - lastSpawnTime > 2400) {
        spawnHeart(canvas);
        lastSpawnTime = timestamp;
      }

      if (keys.current.left) basketRef.current.x -= basketRef.current.speed;
      if (keys.current.right) basketRef.current.x += basketRef.current.speed;

      basketRef.current.x = Math.max(
        0,
        Math.min(canvas.width - basketRef.current.width, basketRef.current.x)
      );

      ctx.fillStyle = "#ffb6d9";
      ctx.fillRect(
        basketRef.current.x,
        canvas.height - basketRef.current.height - 10,
        basketRef.current.width,
        basketRef.current.height
      );
      ctx.fillStyle = "#ff8ac9";
      ctx.fillRect(
        basketRef.current.x + 10,
        canvas.height - basketRef.current.height - 5,
        basketRef.current.width - 20,
        basketRef.current.height - 20
      );

      heartsRef.current.forEach((heart) => {
        heart.y += heart.speed;

        if (!heart.broken) {
          const basketTop = canvas.height - basketRef.current.height - 10;
          const caught =
            heart.y + 40 >= basketTop &&
            heart.x + 30 >= basketRef.current.x &&
            heart.x <= basketRef.current.x + basketRef.current.width;

          if (caught) {
            setScore((s) => s + 1);
            heart.toDelete = true;
          }
        }

        if (!heart.broken && heart.y > canvas.height - 35) {
          heart.broken = true;
          heart.speed = 0;
          heart.brokenTimer = timestamp + 1000;
        }

        if (heart.broken) {
          ctx.drawImage(brokenHeartImage, heart.x, heart.y, 40, 40);

          if (timestamp > heart.brokenTimer && !heart.toDelete) {
            setLives((l) => {
              if (l - 1 <= 0) setGameOver(true);
              return l - 1;
            });
            heart.toDelete = true;
          }
        } else {
          ctx.drawImage(heartImage, heart.x, heart.y, 40, 40);
        }
      });

      heartsRef.current = heartsRef.current.filter((h) => !h.toDelete);

      animationFrame = requestAnimationFrame(gameLoop);
    };

    animationFrame = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrame);
  }, [score, gameOver]);

  const restartGame = () => {
    setScore(0);
    setLives(5);
    setGameOver(false);
    heartsRef.current = [];
  };

  return (
    <div className="min-h-screen bg-pink-100 flex items-center justify-center p-6">
      <div className="relative bg-white rounded-xl shadow-2xl p-10 w-full max-w-4xl flex flex-col items-center">

        <Link
          to="/"
          className="absolute -top-4 left-4 px-4 py-2 rounded-lg bg-pink-300 hover:bg-pink-400 text-white text-sm shadow-md transition"
        >
          ← Back
        </Link>

        <h1 className="text-3xl font-bold text-pink-600 mb-4">
          Falling Hearts 💖
        </h1>

        <div className="absolute top-6 right-10 text-right">
          <div className="text-pink-600 font-bold text-xl">Score: {score}</div>
          <div className="text-pink-400 font-semibold text-lg">Lives: {lives}</div>
        </div>

        <canvas
          ref={canvasRef}
          width={650}
          height={500}
          className="rounded-xl shadow-lg border border-pink-200 bg-pink-50"
        ></canvas>

        {/* 💕 NEW Compliment Section */}
        <div className="mt-6 h-16 flex items-center justify-center">
  {showCompliment && (
    <div
      className="text-pink-600 text-xl font-bold text-center"
      style={{
        animation: "pop 0.6s ease-out, fade 1.2s ease-out 0.6s",
        animationFillMode: "forwards",
      }}
    >
      {compliment}
    </div>
  )}
</div>


        {/* Custom animations */}
        <style>{`
          @keyframes pop {
            0% { transform: scale(0.3); opacity: 0; }
            60% { transform: scale(1.15); opacity: 1; }
            100% { transform: scale(1); }
          }
          @keyframes fade {
            0% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}</style>

        {gameOver && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="relative bg-white rounded-2xl p-10 shadow-2xl text-center space-y-6">
              <h2 className="text-3xl text-pink-600 font-bold">Game Over 💔</h2>
              <p className="text-lg text-pink-500">Your Score: {score}</p>

              <button
                onClick={restartGame}
                className="px-6 py-3 rounded-lg bg-pink-300 hover:bg-pink-400 text-white font-semibold shadow transition"
              >
                Play Again
              </button>

              <Link
                to="/"
                className="block mt-2 px-4 py-2 rounded-lg bg-pink-200 hover:bg-pink-300 text-pink-700 text-sm shadow transition"
              >
                Back Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}