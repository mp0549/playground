import scratchtoreveal from '../src/assets/thumbnails/scratchtoreveal.png';
import memorymatch from '../src/assets/thumbnails/memorymatch.png';
import cryptogramthumbnail from '../src/assets/thumbnails/cryptogram.png';
import relationshiptrivia from '../src/assets/thumbnails/relationshiptrivia.png';
import puzzleustogether from '../src/assets/thumbnails/puzzleustogether.png';
import brickbreaker from '../src/assets/thumbnails/brickbreaker.png';
import fortune from '../src/assets/thumbnails/fortune.png';
import catchtheheart from '../src/assets/thumbnails/catchtheheart.png';



const games = [
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

];

export default games;
