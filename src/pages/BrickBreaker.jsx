import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import cuteHeart from "../assets/photos/cuteheart.png";
import brokenHeart from "../assets/photos/cutebrokenheart.png";

import sfxBreak from "../assets/sfx/breaking.mp3";
import sfxNooo from "../assets/sfx/noooo.mp3";
import sfxPop from "../assets/sfx/pop.mp3";
import sfxStart from "../assets/sfx/mixkit-retro-arcade-casino-notification-211.wav";

export default function BrickBreaker() {
  const canvasRef = useRef(null);

  // ========== MESSAGE SYSTEM ==========
  const fullMessages = [
    "You make everything feel lighter.",
    "I fall for you more every day.",
    "You're my favorite part of every day.",
    "Loving you feels like home.",
    "My heart is safest with you."
  ];
  const messageIndex = useRef(Math.floor(Math.random() * fullMessages.length));
  const full = fullMessages[messageIndex.current];

  const [revealed, setRevealed] = useState(
    full.split("").map((ch) => (ch === " " ? " " : "_"))
  );
  const revealedRef = useRef(revealed);
  revealedRef.current = revealed;

  const [popup, setPopup] = useState(null);
  const [finalReveal, setFinalReveal] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [levelMessage, setLevelMessage] = useState("");
  const [lives, setLives] = useState(3);

  const pausedRef = useRef(false);
  const [lifeLostFlash, setLifeLostFlash] = useState(false);

  const gameRunning = useRef(true);
  const animationRef = useRef(null);

  const restartGame = () => window.location.reload();

  // ========== PARTICLES ==========
  const particles = useRef([]);

  function spawnSparkles(x, y) {
    for (let i = 0; i < 10; i++) {
      particles.current.push({
        x,
        y,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        life: 18,
        color: `rgba(255,150,200,${0.6 + Math.random() * 0.4})`
      });
    }
  }

  function updateParticles(ctx) {
    particles.current = particles.current.filter((p) => p.life > 0);
    particles.current.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;
      p.life -= 1;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 2, 2);
    });
  }

  // ========== EFFECT ==========
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 500;
    canvas.height = 600;

    const img = new Image();
    img.src = cuteHeart;

    const breakSound = new Audio(sfxBreak);
    const popSound = new Audio(sfxPop);
    const noooSound = new Audio(sfxNooo);
    const startSound = new Audio(sfxStart);

    startSound.volume = 0.4;
    startSound.play();

    // ===== PADDLE =====
    const paddle = {
      width: 90,
      height: 15,
      x: canvas.width / 2 - 45,
      y: canvas.height - 40,
      speed: 6,
      dx: 0
    };

    // ===== BALL =====
    const ball = {
      x: canvas.width / 2,
      y: canvas.height - 60,
      size: 10,
      dx: 4,
      dy: -4
    };

    function resetBall() {
      ball.x = canvas.width / 2;
      ball.y = canvas.height - 60;
      ball.dx = (Math.random() > 0.5 ? 1 : -1) * 4;
      ball.dy = -4;
    }

    // ===== BRICKS =====
    const brickRows = 4;
    const brickCols = 7;
    const brickWidth = 60;
    const brickHeight = 20;
    const brickPadding = 10;
    const offsetX = 30;
    const offsetY = 40;

    let bricks = [];

    function initBricks() {
      bricks = [];
      for (let r = 0; r < brickRows; r++) {
        for (let c = 0; c < brickCols; c++) {
          bricks.push({
            x: offsetX + c * (brickWidth + brickPadding),
            y: offsetY + r * (brickHeight + brickPadding),
            width: brickWidth,
            height: brickHeight,
            destroyed: false,
            shakeX: 0,
            shakeTimer: 0
          });
        }
      }
    }

    initBricks();
    const totalBricks = bricks.length;
    let destroyedCount = 0;

    // ===== LETTER REVEAL FIXED =====
    function revealRandomLetter() {
      const free = [];
      const arr = revealedRef.current;

      arr.forEach((val, i) => {
        if (val === "_" && full[i] !== " ") free.push(i);
      });

      if (free.length === 0) return null;

      const index = free[Math.floor(Math.random() * free.length)];
      const letter = full[index];

      setRevealed((p) => {
        const c = [...p];
        c[index] = "*";
        return c;
      });

      setTimeout(() => {
        setRevealed((p) => {
          const c = [...p];
          c[index] = letter;
          return c;
        });
      }, 150);

      return letter;
    }

    // ===== DRAWING =====
    function drawPaddle() {
      ctx.fillStyle = "#f472b6";
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 6;
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
      ctx.shadowBlur = 0;
    }

    function drawBall() {
      ctx.drawImage(img, ball.x - 12, ball.y - 12, 24, 24);
    }

    function drawBricks() {
      bricks.forEach((b) => {
        if (!b.destroyed) {
          let x = b.x + b.shakeX;
          ctx.fillStyle = "#f9a8d4";
          ctx.shadowColor = "rgba(0,0,0,0.15)";
          ctx.shadowBlur = 4;
          ctx.fillRect(x, b.y, b.width, b.height);
          ctx.shadowBlur = 0;
        }
      });
    }

    // ===== MOVEMENT =====
    function movePaddle() {
      paddle.x += paddle.dx;
      paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, paddle.x));
    }

    function collideBallBrick(ball, b) {
      const closestX = Math.max(b.x, Math.min(ball.x, b.x + b.width));
      const closestY = Math.max(b.y, Math.min(ball.y, b.y + b.height));
      const dx = ball.x - closestX;
      const dy = ball.y - closestY;
      return dx * dx + dy * dy <= ball.size * ball.size;
    }

    function moveBall() {
      ball.x += ball.dx;
      ball.y += ball.dy;

      // wall bounce
      if (ball.x < 0 || ball.x > canvas.width) {
        ball.dx *= -1;
        ball.dx += (Math.random() * 0.4 - 0.2);
      }

      if (ball.y < 0) ball.dy *= -1;

      // paddle
      if (
        ball.y + ball.size > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width &&
        ball.dy > 0
      ) {
        const hit = (ball.x - paddle.x) / paddle.width - 0.5;
        ball.dy *= -1;
        ball.dx = hit * 8 + (Math.random() * 0.4 - 0.2);
        popSound.currentTime = 0;
        popSound.play();
      }

      // bricks
      bricks.forEach((b) => {
        if (!b.destroyed && collideBallBrick(ball, b)) {
          // small shake effect
          b.shakeTimer = 6;
          b.shakeX = ball.dx > 0 ? 3 : -3;

          // brick break AFTER shake delay
          setTimeout(() => {
            if (!b.destroyed) {
              b.destroyed = true;
              spawnSparkles(b.x + b.width / 2, b.y + b.height / 2);

              breakSound.currentTime = 0;
              breakSound.play();

              destroyedCount++;

              const letter = revealRandomLetter();
              if (letter) {
                setPopup(letter);
                setTimeout(() => setPopup(null), 850);
              }

              if (destroyedCount === totalBricks) {
                setTimeout(() => {
                  setFinalReveal(true);
                  setLevelMessage(full);
                  stopGame();
                }, 600);
              }
            }
          }, 60);

          ball.dy *= -1;
        }

        if (b.shakeTimer > 0) {
          b.shakeTimer--;
          if (b.shakeTimer === 0) b.shakeX = 0;
        }
      });

      // miss
      if (ball.y > canvas.height - 20) {
        loseLife();
      }
    }

    // ===== LIFE LOST =====
    function loseLife() {
      if (pausedRef.current) return;

      pausedRef.current = true;
      setLifeLostFlash(true);

      noooSound.currentTime = 0;
      noooSound.play();

      setLives((prev) => {
        const newLives = prev - 1;

        if (newLives < 0) {
          triggerGameOver();
          return prev;
        }

        setTimeout(() => {
          resetBall();
          setLifeLostFlash(false);
          pausedRef.current = false;
        }, 1500);

        return newLives;
      });
    }

    function triggerGameOver() {
      setGameOver(true);
      setLevelMessage("You tried your best... 💗");
      stopGame();
    }

    function stopGame() {
      gameRunning.current = false;
      cancelAnimationFrame(animationRef.current);
    }

    // ===== MAIN UPDATE =====
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPaddle();
      drawBall();
      drawBricks();
      updateParticles(ctx);
    }

    function update() {
      if (!gameRunning.current) return;
      if (!pausedRef.current) {
        movePaddle();
        moveBall();
      }
      draw();
      animationRef.current = requestAnimationFrame(update);
    }

    update();

    // ===== CONTROLS =====
    function keyDown(e) {
      if (["ArrowRight", "d", "D"].includes(e.key)) paddle.dx = paddle.speed;
      else if (["ArrowLeft", "a", "A"].includes(e.key)) paddle.dx = -paddle.speed;
    }

    function keyUp() {
      paddle.dx = 0;
    }

    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);

    return () => {
      document.removeEventListener("keydown", keyDown);
      document.removeEventListener("keyup", keyUp);
    };
  }, []);

  // ===== HEART SHAKE ANIMATION =====
  const heartShakeClass = lifeLostFlash
    ? "animate-[wiggle_0.45s_ease-in-out]"
    : "";

  return (
    <>
      <style>{`
        @keyframes popupFade {
          0% { opacity:0; transform:scale(0.7);}
          20%{opacity:1;transform:scale(1);}
          80%{opacity:1;}
          100%{opacity:0; transform:scale(0.7);}
        }
        .popup {
          animation: popupFade 0.85s ease-out forwards;
        }

        @keyframes wiggle {
          0% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-pink-100 px-6">
        <div className="relative w-full max-w-[650px] bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center">

          {/* Back Button */}
          <Link
            to="/"
            className="absolute -top-4 left-4 px-4 py-2 rounded-lg bg-pink-300 hover:bg-pink-400 text-white text-sm shadow-md transition"
          >
            ← Back
          </Link>

          {/* Lives */}
          <div className="absolute top-4 right-4 flex space-x-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <img
                key={i}
                src={i < lives ? cuteHeart : brokenHeart}
                className={`w-7 h-7 ${heartShakeClass}`}
              />
            ))}
          </div>

          {/* Message */}
          {!finalReveal && !gameOver && (
            <div className="text-pink-700 text-xl font-semibold mb-4 bg-pink-50 px-5 py-2 rounded-lg shadow">
              {revealed.join("")}
            </div>
          )}

          {(finalReveal || gameOver) && (
            <div className="text-3xl text-pink-700 font-bold mb-6 bg-pink-50 px-6 py-4 rounded-xl shadow-lg text-center">
              {levelMessage}
            </div>
          )}

          {/* Popup Letter */}
          {popup && (
            <div className="popup absolute top-24 text-pink-700 bg-pink-200 px-4 py-2 rounded-lg shadow text-lg">
              {popup}
            </div>
          )}

          {/* Life Lost Overlay */}
          {lifeLostFlash && (
            <div className="absolute top-1/2 -translate-y-1/2 text-3xl text-pink-700 font-bold bg-white/80 px-6 py-4 rounded-xl shadow-xl">
              Life Lost 💔
            </div>
          )}

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className="rounded-xl shadow-lg border-4 border-pink-200"
            style={{ background: "#ffe4f2" }}
          />

          {(finalReveal || gameOver) && (
            <div className="mt-6 flex space-x-4">
              <button
                onClick={restartGame}
                className="px-6 py-3 bg-green-400 hover:bg-green-500 text-white rounded-xl shadow-lg text-lg transition"
              >
                Play Again 💚
              </button>

              <Link
                to="/"
                className="px-6 py-3 bg-pink-400 hover:bg-pink-500 text-white rounded-xl shadow-lg text-lg transition"
              >
                Back
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}