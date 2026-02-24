import React, { useState } from "react";
import { Link } from 'react-router-dom';

// Expanded response arrays 💗
// Add/remove freely!
const yesResponses = [
  "Really?? 😭",
  "You mean it??",
  "OMG yayyy!!",
  "That makes me so happy omg.",
  "I knew you loved me 🥺",
  "WAHHH I'm crying happy tears 😭💗",
  "You're stuck with me forever now 😈",
  "Yesss!! You passed the loyalty test 😌💘",
  "Kicking my feet",
  "OMG omg OMG STOP 😳",
  "You chose correctly. Your reward is me 😌✨",
  "THIS IS THE BEST DAY EVER AAAA 💞",
  "I LOVE YOUUUUUUU",
  "YAYAYAYAYAYAYAYAYAYAYAYAY 💗",
  "RAHHHHH",
  "You'd better mean that 😤",
  "Omg ME TOO",
  "i'm so so so so so so so so so so so so so so so so so so so so happy",
  "You just made my whole year",
  "uwU",
  "I’m literally the luckiest person alive",
  "very good choice",
  "I’m so relieved omg",
  "You’re my favorite human ever",
  "Can we celebrate with ice cream??",
];

const noResponses = [
  "No?? 😱 Try again.",
  "I think you meant yes",
  "That can't be right… choose again.",
  "wat.",
  "That must’ve been a typo. try again.",
  "WRONG. Pick the other button 😤",
  "Interesting choice… try again tho",
  "You’re funny 😂 now press yes.",
  "No isn’t allowed here 🙅‍♀️",
  "Try again but with love in your heart 🥺",
  "Oops! Your finger slipped",
  "Let’s pretend that didn’t happen. Try again 😌💗",
  "Okay buddy",
  "Hmm… I don’t think so.",
  "Are you sure about that?",
  "That answer is unacceptable",
  "Error 404: Love not found. Please try again.",
  "Nice try, but no.",
  "You must be joking",
  "That's not the answer I was looking for",
  "I don't think so",
];

// Cute floating heart animation + fade-in
const customAnimations = `
@keyframes floatUp {
  0% { opacity: 0; transform: translateY(20px) scale(0.8); }
  50% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-40px) scale(1.2); }
}
.floating-heart {
  position: absolute;
  animation: floatUp 1.2s ease-out forwards;
  pointer-events: none;
}
@keyframes fadeInCute {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-in-cute {
  animation: fadeInCute 0.45s ease-out;
}
`;

export default function WillYouStay() {
  const [displayText, setDisplayText] = useState("Will you stay with me?<br/>(forever and ever and ever and ever?)");
  const [heartList, setHeartList] = useState([]);
  const [yesSize, setYesSize] = useState(1); // yes button grows each click 🌱
  const [noSize, setNoSize] = useState(1);

  const spawnHeart = () => {
    const id = Math.random().toString(36).slice(2);
    const emojiChoices = ["❤️", "💗", "💞", "💕", "💘", "✨"];
    const emoji = emojiChoices[Math.floor(Math.random() * emojiChoices.length)];

    setHeartList((prev) => [...prev, { id, emoji, left: Math.random() * 80 + 10 }]);

    setTimeout(() => {
      setHeartList((prev) => prev.filter((h) => h.id !== id));
    }, 1200);
  };

  const handleYes = () => {
    const res = yesResponses[Math.floor(Math.random() * yesResponses.length)];
    setDisplayText(res);
    spawnHeart();
    setYesSize((size) => size + 0.05); // grows slightly
  };

  const handleNo = () => {
    const res = noResponses[Math.floor(Math.random() * noResponses.length)];
    setDisplayText(res);
    spawnHeart();
    setNoSize((size) => size - 0.05); // shrinks slightly

  };

  return (
    <>
      <style>{customAnimations}</style>

      <div className="relative flex items-center justify-center min-h-screen bg-pink-100 text-center px-6 overflow-hidden">

        {/* Floating hearts */}
        {heartList.map((h) => (
          <div
            key={h.id}
            className="floating-heart text-3xl"
            style={{ left: `${h.left}%`, bottom: "20%" }}
          >
            {h.emoji}
          </div>
        ))}

        {/* Container */}
        <div className="relative flex flex-col items-center justify-center space-y-10 fade-in-cute">
          
          {/* Back Button */}
          <Link
            to="/"
            className="absolute top-4 left-4 px-4 py-2 rounded-lg bg-pink-300 hover:bg-pink-400 text-white text-sm shadow-md transition"
          >
            ← Back
          </Link>

          {/* Text Block */}
          <h1
  className="text-4xl md:text-5xl font-semibold text-pink-700 bg-white/70 px-8 py-6 rounded-xl shadow fade-in-cute"
  dangerouslySetInnerHTML={{ __html: displayText }}
></h1>

          {/* Buttons */}
          <div className="flex space-x-6">

            {/* YES grows each time */}
            <button
              onClick={handleYes}
              style={{ transform: `scale(${yesSize})` }}
              className="px-8 py-4 rounded-full bg-green-400 hover:bg-green-500 text-white text-xl font-bold shadow-lg transition-transform fade-in-cute"
            >
              Yes 💚
            </button>

            <button
              onClick={handleNo}
              style={{ transform: `scale(${noSize})` }}

              className="px-8 py-4 rounded-full bg-red-400 hover:bg-red-500 text-white text-xl font-bold shadow-lg transition fade-in-cute"
            >
              No 💔
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
