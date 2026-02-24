import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import cardback from '../assets/photos/cardback.jpg';

// ------------------------------------------------------------
// LOAD IMAGES (same logic as your other games)
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// RANDOMLY PICK 8 UNIQUE IMAGES
// ------------------------------------------------------------
function pickEightUnique(imgs) {
  const copy = [...imgs];
  const selected = [];

  while (selected.length < 8 && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    selected.push(copy.splice(idx, 1)[0]);
  }
  return selected;
}

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [hearts, setHearts] = useState([]);

  // ------------------------------------------------------------
  // LOAD CARDS ONCE
  // ------------------------------------------------------------
  useEffect(() => {
    loadImages().then((imgs) => {
      const eight = pickEightUnique(imgs);

      // duplicate & shuffle
      const doubled = [...eight, ...eight].sort(() => Math.random() - 0.5);

      setCards(doubled);
    });
  }, []);

  // ------------------------------------------------------------
  // HEART POP EFFECT
  // ------------------------------------------------------------
  const spawnHearts = () => {
    for (let i = 0; i < 20; i++) {
      const id = Math.random().toString(36).slice(2);
      const emojis = ["❤️", "💗", "💕", "💞", "💘", "✨"];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];

      setHearts((prev) => [
        ...prev,
        {
          id,
          emoji,
          left: Math.random() * 90 + 5,
          top: Math.random() * 30 + 60,
        },
      ]);

      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== id));
      }, 1800);
    }
  };

  // ------------------------------------------------------------
  // FLIP LOGIC
  // ------------------------------------------------------------
  const handleFlip = (i) => {
    if (flipped.length === 2 || flipped.includes(i) || matched.includes(i)) {
      return;
    }
    setFlipped((prev) => [...prev, i]);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const [a, b] = flipped;

      if (cards[a] === cards[b]) {
        setMatched((prev) => [...prev, a, b]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  }, [flipped, cards]);

  // ------------------------------------------------------------
  // CHECK WIN
  // ------------------------------------------------------------
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setTimeout(() => {
        spawnHearts();
        setShowModal(true);
      }, 500);
    }
  }, [matched, cards.length]);

  return (
    <>
      <style>
        {`
          .card-inner {
            transition: transform 0.6s;
            transform-style: preserve-3d;
          }
          .card.flipped .card-inner {
            transform: rotateY(180deg);
          }
          .card-face {
            backface-visibility: hidden;
          }
          .card-back {
            transform: rotateY(180deg);
          }

          @keyframes floatUpFun {
            0% { opacity: 0; transform: translateY(20px) scale(0.8); }
            40% { opacity: 1; }
            100% { opacity: 0; transform: translateY(-120px) scale(1.6); }
          }
          .win-heart {
            position: absolute;
            font-size: 2rem;
            animation: floatUpFun 1.8s ease-out forwards;
            pointer-events: none;
          }

          @keyframes settleBounce {
            0%   { transform: scale(1); }
            20%  { transform: scale(1.08); }
            40%  { transform: scale(0.96); }
            60%  { transform: scale(1.04); }
            80%  { transform: scale(0.98); }
            100% { transform: scale(1); }
          }
          .modal-bounce-once {
            animation: settleBounce 0.9s ease-out;
          }
        `}
      </style>

      <div className="min-h-screen bg-pink-100 flex items-center justify-center p-6">
        <div className="relative bg-white rounded-3xl shadow-2xl p-10 pb-14 w-full max-w-3xl flex flex-col items-center">

          {/* Back Button */}
          <Link
            to="/"
            className="absolute -top-4 left-4 px-4 py-2 rounded-lg bg-pink-300 hover:bg-pink-400 text-white text-sm shadow-md transition"
          >
            ← Back
          </Link>

          {/* Heart effects */}
          {hearts.map((h) => (
            <div
              key={h.id}
              className="win-heart"
              style={{ left: `${h.left}%`, top: `${h.top}%` }}
            >
              {h.emoji}
            </div>
          ))}

          <h1 className="text-4xl font-bold text-pink-700 mb-8">Memory Game 💖</h1>

          {/* CARDS GRID */}
          <div className="grid grid-cols-4 gap-4">
            {cards.map((img, i) => {
              const isFlipped = flipped.includes(i) || matched.includes(i);
              return (
                <div
                  key={i}
                  className={`card w-24 h-24 md:w-28 md:h-28 relative cursor-pointer ${
                    isFlipped ? "flipped" : ""
                  }`}
                  onClick={() => handleFlip(i)}
                >
                  <div className="card-inner w-full h-full">

                    {/* Back side image (non-AI, neutral) */}
                    <div className="card-face absolute inset-0 rounded-xl shadow-lg border border-pink-200">
                      <img
                        src={cardback}
                        alt="card-back"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>

                    {/* Front side (your imported photos) */}
                    <div className="card-face card-back absolute inset-0 rounded-xl shadow-lg border border-pink-300 bg-white overflow-hidden">
                      <img
                        src={img}
                        alt={`memory-${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* WIN MODAL */}
          {showModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="relative bg-white rounded-2xl p-10 shadow-2xl text-center space-y-6 modal-bounce-once">

                <Link
                  to="/"
                  className="absolute -top-3 left-3 px-4 py-1 rounded-lg bg-pink-300 hover:bg-pink-400 text-white text-xs shadow-md transition"
                >
                  ← Back
                </Link>

                <h2 className="text-3xl text-pink-600 font-bold">
                  We’re a perfect match ❤️
                </h2>

                <button
                  onClick={() => {
                    loadImages().then((imgs) => {
                      const eight = pickEightUnique(imgs);
                      const doubled = [...eight, ...eight].sort(() => Math.random() - 0.5);

                      setCards(doubled);
                      setFlipped([]);
                      setMatched([]);
                      setShowModal(false);
                    });
                  }}
                  className="px-6 py-3 rounded-lg bg-pink-300 hover:bg-pink-400 text-white font-semibold shadow transition"
                >
                  Play again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
