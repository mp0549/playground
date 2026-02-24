import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

async function loadImages() {
  const images = [];
  for (let i = 1; i <= 41; i++) {
    try {
      const img = await import(`../assets/pics/img${i}.jpg`);
      images.push(img.default);
    } catch (err) {
      console.error(`Error loading image img${i}:`, err);
    }
  }
  return images;
}

export default function ScratchPhoto() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const isDrawing = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const [percent, setPercent] = useState(0);
  const [fullyRevealed, setFullyRevealed] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [confettiList, setConfettiList] = useState([]);
  const [selectedImg, setSelectedImg] = useState(null);

  // ----------------------------------------
  // LOAD IMAGE
  // ----------------------------------------
  useEffect(() => {
    loadImages().then((imgs) => {
      if (imgs.length === 0) return;
      const choice = imgs[Math.floor(Math.random() * imgs.length)];
      setSelectedImg(choice);
    });
  }, []);

  // ----------------------------------------
  // INITIALIZE SCRATCH LAYER AFTER IMAGE LOADS
  // ----------------------------------------
  useEffect(() => {
    if (!selectedImg) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const { width } = containerRef.current.getBoundingClientRect();

      // perfect square
      canvas.width = width;
      canvas.height = width;

      // reset scratch layer
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#d1d5db";
      ctx.fillRect(0, 0, width, width);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);

  }, [selectedImg]);

  // ----------------------------------------
  // SCRATCH LOGIC
  // ----------------------------------------
  const scratch = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 22;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    last.current = { x, y };
  };

  const updatePercent = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let cleared = 0;
    for (let i = 3; i < img.data.length; i += 4) {
      if (img.data[i] === 0) cleared++;
    }

    const p = (cleared / (canvas.width * canvas.height)) * 100;
    setPercent(p);

    if (p > 88 && !fullyRevealed) triggerFullReveal();
  };

  const triggerFullReveal = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    setFullyRevealed(true);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    spawnConfetti();
  };

  // ----------------------------------------
  // HEART PARTICLES
  // ----------------------------------------
  const spawnHeart = (x, y) => {
    const id = Math.random().toString(36).slice(2);
    const emoji = ["💗", "💕", "💞", "💘"][Math.floor(Math.random() * 4)];

    setHearts((prev) => [...prev, { id, x, y, emoji }]);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id));
    }, 900);
  };

  // ----------------------------------------
  // POINTER EVENTS
  // ----------------------------------------
  const pointerDown = (e) => {
    isDrawing.current = true;
    const rect = canvasRef.current.getBoundingClientRect();
    last.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const pointerMove = (e) => {
    if (!isDrawing.current || fullyRevealed) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    scratch(x, y);
    updatePercent();
    spawnHeart(x, y);
  };

  const pointerUp = () => {
    isDrawing.current = false;
  };

  useEffect(() => {
    const move = (e) => {
      if (!isDrawing.current || fullyRevealed) return;
      if (e.buttons !== 1) {
        isDrawing.current = false;
        return;
      }
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      scratch(x, y);
      updatePercent();
      spawnHeart(x, y);
    };

    const up = () => (isDrawing.current = false);

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [fullyRevealed]);

  // ----------------------------------------
  // CONFETTI
  // ----------------------------------------
  const spawnConfetti = () => {
    const items = Array.from({ length: 12 }, () => ({
      id: Math.random().toString(36).slice(2),
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      size: Math.random() * 18 + 8,
      emoji: ['☘️', '🍀', '💗'][Math.floor(Math.random() * 3)],
    }));

    setConfettiList(items);
    setTimeout(() => setConfettiList([]), 1200);
  };

  const handleRevealClick = () => triggerFullReveal();

  // ----------------------------------------
  // RENDER
  // ----------------------------------------
  return (
    <>
      <style>{`
        @keyframes floatHeart {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-40px) scale(1.4); opacity: 0; }
        }
        .heart {
          position: absolute;
          animation: floatHeart 0.9s ease-out forwards;
          pointer-events: none;
          font-size: 20px;
        }
      `}</style>

      <div className="min-h-screen w-full bg-pink-100 flex items-center justify-center p-6">
        <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <Link
            to="/"
            className="absolute -top-4 left-4 px-4 py-2 rounded-lg bg-pink-300 hover:bg-pink-400 text-white text-sm shadow-md transition"
          >
            ← Back
          </Link>

          {hearts.map((h) => (
            <div key={h.id} className="heart" style={{ left: h.x, top: h.y }}>
              {h.emoji}
            </div>
          ))}

          {confettiList.map((c) => (
            <div
              key={c.id}
              className="absolute"
              style={{ left: `${c.x}%`, top: `${c.y}%`, fontSize: c.size }}
            >
              {c.emoji}
            </div>
          ))}

          <p className="mt-2 text-gray-600 text-lg text-center">Scratch to reveal 💖</p>

          {/* SQUARE CONTAINER */}
          <div
            ref={containerRef}
            className="relative w-[320px] aspect-square rounded-xl overflow-hidden border-4 border-pink-300 shadow-lg shadow-pink-200"
          >
            {selectedImg && (
              <img
                src={selectedImg}
                alt="Hidden"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {!selectedImg && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                Loading image…
              </div>
            )}

            <canvas
              ref={canvasRef}
              className="absolute inset-0 touch-none"
              onPointerDown={pointerDown}
              onPointerMove={pointerMove}
              onPointerUp={pointerUp}
            />
          </div>

          {!fullyRevealed && (
            <div className="mt-4 w-full flex flex-col items-center">
              {percent < 55 ? (
                <div className="w-64 h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-pink-400 transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              ) : (
                <button
                  onClick={handleRevealClick}
                  className="px-6 py-2 mt-2 rounded-full bg-pink-400 hover:bg-pink-500 text-white shadow-md transition"
                >
                  Reveal 💖
                </button>
              )}
            </div>
          )}

          {fullyRevealed && (
            <p className="mt-4 text-pink-600 text-xl font-bold text-center">
              I love you 💗
            </p>
          )}
        </div>
      </div>
    </>
  );
}
