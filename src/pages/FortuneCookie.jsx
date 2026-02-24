import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';
import cookieClosed from '../assets/photos/cookie-closed.png';
import cookieOpen from '../assets/photos/cookie-open.png';

export default function FortuneCookie() {
  const fortunes = [
    // Sweet & romantic
    "You make every day sweeter ❤️",
    "I love you more than cookies 🍪",
    "Your smile is my favorite.",
    "You’re my lucky charm ✨",
    "I choose you — always.",
    "You’re the warmest part of my day ☀️",
    "My heart does a tiny dance when I see you 💃🩷",
    "Your love is my favorite place to be.",
    "I still get butterflies when I think of you 🦋",
    "You’re my forever person 💞",

    // Funny & jokey
    "Warning: excessive cuteness detected. It’s you 😳",
    "A kiss is coming your way. Probably from me 😌💋",
    "You will soon receive a cuddle… actually right now 🫂",
    "Your future includes snacks. Because I’m bringing them 🍿",
    "Someone loves you a *suspicious* amount… 👀 (it’s me)",
    "Your fortune: There is a 100% chance of me annoying you today 😈",
    "You’re cute. That’s the whole message. Deal with it 😤💕",
    "A romantic moment will happen soon. Prepare yourself 😌✨",
    "I predict you will think about me in 3… 2… 1… 😏",
    "Your next task: give me a kiss. No exceptions 😚",

    // Silly/goofy
    "Your cuddles restore 50 HP 🩷✨",
    "You unlocked: +10 Love Points 💗",
    "If you were a cookie, you’d be the one with the most chocolate chips 🍪",
    "Preparing love.exe… please wait… ❤️‍🔥",
    "You smell nice. Yes, this is a psychic reading 🌸",
    "A tiny goblin has chosen you as their favorite. (It’s me. I’m the goblin.) 🧌💕",
    "Your destiny involves holding my hand immediately 🙌💞",
    "You gain +5 charisma when I look at you 😳",
    "Your aura is: absolutely kissable 💋✨",

    // Wholesome
    "You are loved more than you know.",
    "Your heart is so gentle — it makes mine feel safe 💗",
    "You deserve all the softness this world can offer 🤍",
    "You make people feel warm just by existing.",
    "You shine without even trying ✨",

    // Anniversary-ish
    "Happy anniversary, my love — here’s to forever with you 💞",
    "Another year with you? Luckiest cookie alive 🍪💖",
    "Every day with you feels like a celebration 🎉💗",
    "Thank you for being my person — today and always ❤️",
    "Our love story is still my favorite chapter 📖✨",
    "Another year, another reason to love you more 💞",

    // Fortune-style
    "Good news: love is in your immediate future (spoiler: it’s from me).",
    "Your soulmate is reading this message… 👀",
    "A sweet surprise is coming your way — hint: it’s me, I’m the surprise 🎁💗",
    "The universe whispers: 'kiss them.'",
    "Luck follows you because I do 💗🍀",
  ];

  const [clickCount, setClickCount] = useState(0);
  const [finalOpened, setFinalOpened] = useState(false);
  const [fortune, setFortune] = useState("");
  const [crumbs, setCrumbs] = useState([]);
  const [confetti, setConfetti] = useState([]);

  // Create crumbs on each click
  const spawnCrumbs = () => {
    const newCrumbs = Array.from({ length: 4 }, () => ({
      id: Math.random(),
      x: Math.random() * 60 - 30,
      y: Math.random() * -20 - 10,
      size: Math.random() * 10 + 6,
    }));

    setCrumbs((prev) => [...prev, ...newCrumbs]);

    // Auto-remove after animation
    setTimeout(() => {
      setCrumbs((prev) => prev.slice(newCrumbs.length));
    }, 1000);
  };

  // Clover confetti on final break
  const spawnConfetti = () => {
    const items = Array.from({ length: 12 }, () => ({
      id: Math.random(),
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      rot: Math.random() * 360,
      scale: Math.random() * 0.6 + 0.4,
    }));

    setConfetti(items);

    // Clear after 1 sec
    setTimeout(() => setConfetti([]), 1200);
  };

  const handleClick = () => {
    if (finalOpened) return;

    spawnCrumbs();

    if (clickCount < 2) {
      setClickCount(clickCount + 1);
    } else {
      // Third click → final animation
      setClickCount(3);

      const random = fortunes[Math.floor(Math.random() * fortunes.length)];
      setFortune(random);

      // spawn confetti
      spawnConfetti();

      // Delay before swapping to open cookie
      setTimeout(() => {
        setFinalOpened(true);
      }, 500);
    }
  };

  // Animation variants for each click
  const clickAnimations = {
    0: { scale: 1, rotate: 0 },
    1: { scale: 1.08, rotate: [-3, 3, -2, 2, 0], transition: { duration: 0.35 } },
    2: { scale: 1.14, rotate: [-5, 5, -3, 3, 0], transition: { duration: 0.4 } },
    3: {
      scale: [1.15, 0.3],
      rotate: [0, -10, 10, 0],
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  const fortuneAnim = {
    initial: { opacity: 0, y: -12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen
                    bg-gradient-to-b from-[#f3e2c2] to-[#e8cfa5] text-center px-6 overflow-hidden">

      {/* Back button */}
      <Link
        to="/"
        className="absolute top-4 left-4 px-4 py-2 rounded-lg bg-pink-300 
                   hover:bg-pink-400 text-white text-sm shadow-md transition"
      >
        ← Back
      </Link>

      <div className="relative flex flex-col items-center justify-center space-y-10">

        {/* CRUMBS */}
        {crumbs.map((c) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 1, x: 0, y: 0 }}
            animate={{ opacity: 0, x: c.x, y: c.y }}
            transition={{ duration: 0.9 }}
            className="absolute bg-yellow-700 rounded-full"
            style={{
              width: c.size,
              height: c.size,
            }}
          />
        ))}

        {/* CLOVER CONFETTI */}
        {confetti.map((c) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 1, scale: c.scale, x: 0, y: 0, rotate: 0 }}
            animate={{ opacity: 0, x: c.x, y: c.y, rotate: c.rot }}
            transition={{ duration: 1 }}
            className="absolute text-green-500 text-3xl"
          >
            ☘️
          </motion.div>
        ))}

        {/* COOKIE */}
        <motion.div
          onClick={handleClick}
          animate={clickAnimations[clickCount]}
          className="cursor-pointer drop-shadow-lg"
        >
          {!finalOpened ? (
            <img src={cookieClosed} alt="Fortune Cookie" className="w-64" />
          ) : (
            <motion.img
              src={cookieOpen}
              alt="Opened Cookie"
              className="drop-shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </motion.div>

        {/* FORTUNE */}
        <AnimatePresence>
          {finalOpened && (
            <motion.div
              variants={fortuneAnim}
              initial="initial"
              animate="animate"
              className="mt-4 bg-white/90 px-8 py-4 rounded-xl shadow-lg
                         text-lg font-medium text-gray-800"
            >
              {fortune}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
