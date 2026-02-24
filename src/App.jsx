import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainMenu from './pages/MainMenu';
import WillYouStay from './pages/WillYouStay';
import Cryptogram from './pages/TextCryptogram';
import CompatibilityCalc from './pages/CompatibilityCalc';
import GuessMyAnswer from './pages/GuessMyHeart';
import MemoryGame from './pages/MemoryGame';
import BrickBreaker from './pages/BrickBreaker';
import FortuneCookie from './pages/FortuneCookie';
import SliderLove from './pages/SliderLove';
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
        <Route path="/will-you-stay" element={<WillYouStay />} />
        <Route path="/relationship-trivia" element={<RelationshipTrivia />} />
        <Route path="/cryptogram" element={<Cryptogram />} />
        <Route path="/compatibility" element={<CompatibilityCalc />} />
        <Route path="/guess-my-heart" element={<GuessMyAnswer />} />
        <Route path="/catch-my-heart" element={<CatchMyHeart />} />
        <Route path="/breakout" element={<BrickBreaker />} />
        <Route path="/scratch-to-reveal" element={<ScratchToReveal />} />
        <Route path="/puzzle-us-together" element={<PuzzleUsTogether />} />
        <Route path="/fortune-cookie" element={<FortuneCookie />} />
        <Route path="/memory-match" element={<MemoryGame />} />
        <Route path="/slider-love" element={<SliderLove />} />
       <Route path="*" element={<MainMenu />} />
      </Routes>
    </div>
  )
}
