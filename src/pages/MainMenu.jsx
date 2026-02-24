import React, { useEffect, useRef, useState } from 'react';
import GameCard from '../components/GameCard';
import games from '../gamesData';

function SystemStatus() {
  const states = ['CALIBRATING…', 'MONITORING SUBJECT', 'ANOMALY DETECTED', 'STABLE'];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % states.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="system-status absolute top-4 right-4 text-xs font-mono text-black/80 uppercase tracking-wider">
      <div className="label text-xxs text-gray-600">SYSTEM STATUS</div>
      <div className="state transition-opacity duration-500 opacity-90">{states[idx]}</div>
    </div>
  );
}

export default function MainMenu() {
  const [accessCount, setAccessCount] = useState(0);
  const [buildLine, setBuildLine] = useState('BUILD 0.1.3');
  const [buildFlicker, setBuildFlicker] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef(null);

  // track interactions to reset idle
  useEffect(() => {
    const reset = () => {
      setIsIdle(false);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setIsIdle(true), 60000); // 60s
    };
    ['mousemove', 'keydown', 'mousedown', 'touchstart'].forEach((ev) =>
      window.addEventListener(ev, reset)
    );
    reset();
    return () => {
      ['mousemove', 'keydown', 'mousedown', 'touchstart'].forEach((ev) =>
        window.removeEventListener(ev, reset)
      );
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  // update build after interactions
  useEffect(() => {
    if (accessCount >= 2) {
      // quick flicker then update
      setBuildFlicker(true);
      const t = setTimeout(() => {
        setBuildLine('BUILD 0.1.4');
        setTimeout(() => setBuildFlicker(false), 400);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [accessCount]);

  const handleAccess = () => setAccessCount((c) => c + 1);

  return (
    <div className={`grid-bg relative ${isIdle ? 'idle' : ''}`}>
      <SystemStatus />

      <main className="p-8 max-w-7xl mx-auto text-black min-h-screen font-serif">
        <div className="header-area mb-12">
          <h1 className="text-4xl font-bold mb-4 uppercase tracking-wider">EXPERIMENTAL LABORATORY</h1>
          <p className="text-sm text-gray-600 uppercase tracking-wide mb-4">Interactive Control Panel</p>
          <hr className="border-black mb-6" />
          <div className="flex items-center gap-4">
            <div className={`text-xs text-gray-700 uppercase tracking-wide build-line ${buildFlicker ? 'flicker' : ''}`}>
              {buildLine}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">| STATUS: OPERATIONAL</div>
          </div>
        </div>

        {/* handwritten annotations in margins */}
        <div className="annotations pointer-events-none">
          <div className="note left-note">hypothesis unstable</div>
          <div className="note right-note">do not terminate test</div>
          <div className="note bottom-note">unexpected attachment forming</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((g, index) => (
            <GameCard
              key={g.id}
              title={g.title}
              subtitle={g.tagline}
              href={g.route}
              image={g.image}
              moduleId={`EXP-${String(index + 1).padStart(2, '0')}`}
              onAccess={handleAccess}
            />
          ))}
        </div>

        <footer className="mt-16 text-center text-xs text-gray-500 uppercase tracking-wide">System Status: Operational</footer>

        {/* awaiting input overlay */}
        {isIdle && (
          <div className="awaiting-input fixed inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-transparent text-gray-600 text-sm uppercase tracking-wide">AWAITING INPUT…</div>
          </div>
        )}
      </main>
    </div>
  );
}
