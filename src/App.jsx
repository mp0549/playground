import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainMenu from './pages/MainMenu';
import Cryptogram from './pages/TextCryptogram';
import MemoryGame from './pages/MemoryGame';
import BrickBreaker from './pages/BrickBreaker';
import FortuneCookie from './pages/FortuneCookie';
import ScratchToReveal from './pages/ScratchToReveal';
import PuzzleUsTogether from './pages/PuzzleUsTogether';
import CatchMyHeart from './pages/CatchMyHeart';
import RelationshipTrivia from './pages/RelationshipTrivia';
import './index.css';

export default function App(){
  return (
    <div data-theme="roblox-bright" className="blocky min-h-screen">
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/relationship-trivia" element={<RelationshipTrivia />} />
        <Route path="/cryptogram" element={<Cryptogram />} />
        <Route path="/catch-my-heart" element={<CatchMyHeart />} />
        <Route path="/breakout" element={<BrickBreaker />} />
        <Route path="/scratch-to-reveal" element={<ScratchToReveal />} />
        <Route path="/puzzle-us-together" element={<PuzzleUsTogether />} />
        <Route path="/fortune-cookie" element={<FortuneCookie />} />
        <Route path="/memory-match" element={<MemoryGame />} />
       <Route path="*" element={<MainMenu />} />
      </Routes>
    </div>
  )
}
