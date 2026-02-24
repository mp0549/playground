import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { Link } from "react-router-dom";

// ------------------------------------------------------------
// Load image assets (jpg or png fallback)
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
// Load sound effects
// ------------------------------------------------------------
const loadAudio = (path) => {
  const audio = new Audio(path);
  audio.preload = "auto";
  return audio;
};

const snapSFX = loadAudio("/src/assets/sfx/snap_sfx.mp3");
const shuffleSFX = loadAudio("/src/assets/sfx/shuffle_sfx.mp3");
const completeSFX = loadAudio("/src/assets/sfx/cartoonyay.mp3");

// ------------------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------------------
export default function PuzzleUsTogether() {
  const [selectedImg, setSelectedImg] = useState(null);
  const [gridSize, setGridSize] = useState(0);
  const [pieces, setPieces] = useState([]);
  const [showDifficulty, setShowDifficulty] = useState(true);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const boardRef = useRef(null);
  const cardRef = useRef(null);
  const draggingId = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const zCounter = useRef(10);

  // ------------------------------------------------------------
  // Load random image on mount
  // ------------------------------------------------------------
  useEffect(() => {
    loadImages().then((imgs) => {
      const img = imgs[Math.floor(Math.random() * imgs.length)];
      setSelectedImg(img);
    });
  }, []);

  // ------------------------------------------------------------
  // Log board size after difficulty modal disappears
  // ------------------------------------------------------------
  useLayoutEffect(() => {
    if (!showDifficulty && boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      console.log("LAYOUT EFFECT board size:", rect.width, rect.height);
    }
  }, [showDifficulty]);

  // ------------------------------------------------------------
  // Create solved pieces
  // ------------------------------------------------------------
  const createSolvedPieces = (boardRect, cardRect, img, size) => {
  if (!boardRect || !cardRect || !img || !size) {
    console.log("→ Missing values:", { boardRect, cardRect, img, size });
    return [];
  }

  if (boardRect.width === 0 || boardRect.height === 0) {
    console.log("→ boardRect width/height is 0");
    return [];
  }

  const pieceW = boardRect.width / size;
  const pieceH = boardRect.height / size;

  const offsetX = boardRect.left - cardRect.left;
  const offsetY = boardRect.top - cardRect.top;

  const arr = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const id = r * size + c;

      arr.push({
        id,
        row: r,
        col: c,
        x: offsetX + c * pieceW,
        y: offsetY + r * pieceH,
        correctX: offsetX + c * pieceW,
        correctY: offsetY + r * pieceH,
        locked: true,
        z: 1,
        animate: false,
      });
    }
  }

  return arr;
};

  // ------------------------------------------------------------
  // Scrambling animation
  // ------------------------------------------------------------
  const scramblePieces = () => {
    shuffleSFX.currentTime = 0;
    shuffleSFX.play();

    const cardRect = cardRef.current.getBoundingClientRect();

    setPieces((prev) =>
      prev.map((p) => {
        const angle = Math.random() * Math.PI * 2;
        const distance =
          Math.random() * (cardRect.width * 0.35) + 80;

        return {
          ...p,
          locked: false,
          animate: true,
          x: p.x + Math.cos(angle) * distance,
          y: p.y + Math.sin(angle) * distance,
        };
      })
    );

    setTimeout(() => {
      setPieces((prev) => prev.map((p) => ({ ...p, animate: false })));
    }, 600);
  };

  // ------------------------------------------------------------
  // Start game
  // ------------------------------------------------------------
  const startGame = (size) => {
  setGridSize(size);
  setShowDifficulty(false);

  // Wait for layout to update after modal disappears
  setTimeout(() => {
    const board = boardRef.current;
    const card = cardRef.current;

    const br = board?.getBoundingClientRect();
    const cr = card?.getBoundingClientRect();

    console.log("STARTGAME board rect:", br);
    console.log("STARTGAME card rect:", cr);
    console.log("STARTGAME selectedImg:", selectedImg);
    console.log("STARTGAME size:", size);

    const solved = createSolvedPieces(br, cr, selectedImg, size);

    console.log("Solved pieces:", solved);

    setPieces(solved);

    if (solved.length > 0) {
      setTimeout(scramblePieces, 400);
    }
  }, 100);
};


  // ------------------------------------------------------------
  // Dragging
  // ------------------------------------------------------------
  const onPointerDown = (e, id) => {
    const piece = pieces.find((p) => p.id === id);
    if (!piece || piece.locked) return;

    draggingId.current = id;
    dragOffset.current = {
      x: e.clientX - piece.x,
      y: e.clientY - piece.y,
    };

    zCounter.current++;
    piece.z = zCounter.current;

    e.target.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (draggingId.current == null) return;

    setPieces((prev) =>
      prev.map((p) =>
        p.id === draggingId.current
          ? { ...p, x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y }
          : p
      )
    );
  };

  const onPointerUp = () => {
  const id = draggingId.current;
  if (id == null) return;

  setPieces((prev) => {
    const updated = prev.map((p) => {
      if (p.id !== id || p.locked) return p;

      const dx = p.x - p.correctX;
      const dy = p.y - p.correctY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 60) {
        snapSFX.currentTime = 0;
        snapSFX.play();

        // Lower the z-index after snapping into place
        return {
          ...p,
          x: p.correctX,
          y: p.correctY,
          locked: true,
          animate: true,
          z: 0, // Lower z-index after piece is locked
        };
      }
      return p;
    });

    if (updated.every((p) => p.locked)) {
      setPuzzleSolved(true);
      completeSFX.currentTime = 0;
      setTimeout(() => completeSFX.play(), 400);
      setTimeout(() => setShowCongrats(true), 1000);
    }

    return updated;
  });

  draggingId.current = null;

  setTimeout(() => {
    setPieces((prev) => prev.map((p) => ({ ...p, animate: false })));
  }, 300);
};


  // ------------------------------------------------------------
  // Piece style
  // ------------------------------------------------------------
  const pieceStyle = (p) => {
    const br = boardRef.current?.getBoundingClientRect();
    if (!br || !gridSize) return {};

    const pieceW = br.width / gridSize;
    const pieceH = br.height / gridSize;

    return {
      position: "absolute",
      left: p.x,
      top: p.y,
      width: pieceW,
      height: pieceH,
      backgroundImage: `url(${selectedImg})`,
      backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
      backgroundPosition: `${(p.col * 100) / (gridSize - 1)}% ${(p.row * 100) / (gridSize - 1)}%`,
      borderRadius: "6px",
      border: "1px solid #ccc",
      boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
      zIndex: p.z,
      cursor: p.locked ? "default" : "grab",
      transition: p.animate ? "all 0.35s ease-in-out" : "none",
      touchAction: "none",
    };
  };

  // ------------------------------------------------------------
  // Restart
  // ------------------------------------------------------------
const restart = () => {
  // Reset puzzle state
  setPuzzleSolved(false);
  setShowCongrats(false);
  setShowDifficulty(true);
  setGridSize(0);
  setPieces([]);

  // Load a new random image
  loadImages().then((imgs) => {
    const img = imgs[Math.floor(Math.random() * imgs.length)];
    setSelectedImg(img);
  });
};

  // ------------------------------------------------------------
  // JSX
  // ------------------------------------------------------------
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-pink-100 p-6">
      <div
        ref={cardRef}
        className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl"
        style={{ minHeight: "80vh" }}
      >
        <Link
          to="/"
          className="absolute -top-4 left-4 bg-pink-300 hover:bg-pink-400 text-white px-4 py-2 rounded-lg shadow-md"
        >
          ← Back
        </Link>

        {/* Difficulty selection */}
        {showDifficulty && selectedImg && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur flex flex-col items-center justify-center z-50 rounded-xl">
            <img
              src={selectedImg}
              alt="preview"
              className="w-80 rounded-lg shadow mb-6"
            />
            <h2 className="text-3xl font-bold text-pink-600 mb-4">
              Select Difficulty
            </h2>

            <div className="flex gap-4">
              <button className="px-5 py-3 bg-pink-300 rounded-lg shadow text-white hover:bg-pink-400"
                onClick={() => startGame(3)}>Easy</button>
              <button className="px-5 py-3 bg-pink-400 rounded-lg shadow text-white hover:bg-pink-500"
                onClick={() => startGame(4)}>Medium</button>
              <button className="px-5 py-3 bg-pink-500 rounded-lg shadow text-white hover:bg-pink-600"
                onClick={() => startGame(5)}>Hard</button>
              <button className="px-5 py-3 bg-pink-600 rounded-lg shadow text-white hover:bg-pink-700"
                onClick={() => startGame(6)}>Extreme</button>
            </div>
          </div>
        )}

        {/* Puzzle board */}
        <div
          ref={boardRef}
          className="relative border-4 border-pink-300 rounded-xl mx-auto mt-12"
          style={{ width: "420px", height: "420px" }}
        >
          {/* Prevent size collapse */}
          <div style={{ width: "100%", height: "100%", opacity: 0 }} />
        </div>

        {/* Pieces */}
        {pieces.map((p) => (
          <div
            key={p.id}
            style={pieceStyle(p)}
            onPointerDown={(e) => onPointerDown(e, p.id)}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          />
        ))}

        {/* Completed overlay */}
        {puzzleSolved && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-40 backdrop-blur-sm">
            <div className="bg-white p-10 rounded-xl shadow-xl text-center">
              <h2 className="text-3xl font-bold text-pink-600 mb-4">
                Puzzle Complete! 🎉
              </h2>
              <button
                onClick={restart}
                className="px-6 py-3 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Anniversary popup */}
        {showCongrats && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg text-center">
              <h2 className="text-4xl font-extrabold text-pink-600 mb-4">
                ❤️ Happy Anniversary ❤️
              </h2>
              <p className="text-lg text-pink-700 mb-6">
                We solved it together, piece by piece.
                Let’s keep putting together memories like this.
              </p>

              <img
                src={selectedImg}
                alt="completed"
                className="w-full rounded-xl shadow mb-6"
              />

              <button
                onClick={restart}
                className="px-6 py-3 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
