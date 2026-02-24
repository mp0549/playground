import willyoustaywithme from '../src/assets/thumbnails/willyoustaywithme.png';
import scratchtoreveal from '../src/assets/thumbnails/scratchtoreveal.png';
import memorymatch from '../src/assets/thumbnails/memorymatch.png';
import cryptogramthumbnail from '../src/assets/thumbnails/cryptogram.png';
import relationshiptrivia from '../src/assets/thumbnails/relationshiptrivia.png';
import puzzleustogether from '../src/assets/thumbnails/puzzleustogether.png';
import sliderlove from '../src/assets/thumbnails/sliderlove.png';
import brickbreaker from '../src/assets/thumbnails/brickbreaker.png';
import guessaboutme from '../src/assets/thumbnails/guessaboutme.png';
import fortune from '../src/assets/thumbnails/fortune.png';
import catchtheheart from '../src/assets/thumbnails/catchtheheart.png';
import calculator from '../src/assets/thumbnails/calculator.png';



const games = [
  {
    id: 'will-you-stay',
    title: 'Will You Stay With Me?',
    tagline: '“The cutest interrogation you’ll ever face.”',
    route: '/will-you-stay',
    image: willyoustaywithme
  },
  {
    id: 'relationship-trivia',
    title: 'Relationship Trivia',
    tagline: '“Test your knowledge about us!”',
    route: '/relationship-trivia',
    image: relationshiptrivia},
  {
    id: 'cryptogram',
    title: 'Cryptogram Love Notes',
    tagline: 'Decode the little messages that make your heart melt.',
    route: '/cryptogram',
    image: cryptogramthumbnail
  },
  {
    id: 'compatibility',
    title: 'Compatibility Calculator',
    tagline: '“Warning: results may cause excessive smiling.”',
    route: '/compatibility',
    image: calculator
  },
  {
    id: 'guess-my-heart',
    title: 'Mind Reader',
    tagline: '"Have you been practicing your telepathy?”',
    route: '/guess-my-heart',
    image: guessaboutme
  },
  {
    id: 'catch-my-heart',
    title: 'Catch My Love',
    tagline: '“Collect falling hearts and cheesy compliments.”',
    route: '/catch-my-heart',
    image: catchtheheart
  },
  {
    id: 'breakout',
    title: 'Breakout',
    tagline: '“Break bricks to reveal surprise photos + love notes.”',
    route: '/breakout',
    image: brickbreaker
  },
  {
    id: 'scratch-to-reveal',
    title: 'Scratch to Reveal',
    tagline: '“Uncover a hidden photo and message from me.”',
    route: '/scratch-to-reveal',
    image: scratchtoreveal
  },
  {
    id: 'puzzle-us-together',
    title: 'Puzzle Us Together',
    tagline: '“Solve a tiny tile puzzle to reveal us.”',
    route: '/puzzle-us-together',
    image: puzzleustogether
  },
  {
    id: 'fortune-cookie',
    title: 'Love Fortune Cookie',
    tagline: '“Click for a random sweet (or ridiculous) fortune.”',
    route: '/fortune-cookie',
    image: fortune
  },
  {
    id: 'memory-match',
    title: 'Memory',
    tagline: '“Flip cards to match memories.”',
    route: '/memory-match',
    image: memorymatch
  },
  {
    id: 'slider-love',
    title: 'Slider Love',
    tagline: '“Slide to express how much you love me.”',
    route: '/slider-love',
    image: sliderlove
  },

];

export default games;
