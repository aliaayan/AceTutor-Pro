/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCw, ChevronRight, ChevronLeft } from 'lucide-react';

interface Flashcard {
  question: string;
  answer: string;
  color: string;
}

const CARDS: Flashcard[] = [
  { question: "What is 2^10?", answer: "1024", color: "#FFF9C4" }, // Pale yellow
  { question: "Ohm's Law formula?", answer: "V = I x R", color: "#F8BBD0" }, // Pink
  { question: "Who founded Pakistan?", answer: "Quaid-e-Azam Muhammad Ali Jinnah", color: "#B3E5FC" }, // Light blue
  { question: "Mitochondria is also known as?", answer: "Powerhouse of the cell", color: "#C8E6C9" }, // Light green
];

export default function FlashcardFlip() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = CARDS[idx];

  const handleNext = () => {
    setFlipped(false);
    setTimeout(() => {
      setIdx((prev) => (prev + 1) % CARDS.length);
    }, 200);
  };

  const handlePrev = () => {
    setFlipped(false);
    setTimeout(() => {
      setIdx((prev) => (prev - 1 + CARDS.length) % CARDS.length);
    }, 200);
  };

  return (
    <div className="flex flex-col items-center space-y-8 py-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <RotateCw className="text-ink-blue" size={20} /> Flashcard Flip
      </h2>

      <div className="relative w-full max-w-[300px] h-[400px] perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx + (flipped ? '-back' : '-front')}
            initial={{ rotateY: flipped ? -180 : 0, opacity: 0 }}
            animate={{ rotateY: flipped ? -180 : 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            onClick={() => setFlipped(!flipped)}
            className="w-full h-full cursor-pointer relative preserve-3d"
          >
            {/* Note styling */}
            <div 
              className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center shadow-xl rounded-sm border-b-4 border-r-4 border-black/10 backface-hidden"
              style={{ backgroundColor: card.color, rotate: '-1deg' }}
            >
              <div className="absolute top-4 left-4 font-sans text-[10px] opacity-30 uppercase font-bold tracking-widest">Question</div>
              <p className="text-2xl font-bold font-childish">{card.question}</p>
              <div className="mt-8 text-xs opacity-50 underline">Tap to flip</div>
            </div>

            <div 
              className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center shadow-xl rounded-sm border-b-4 border-r-4 border-black/10 backface-hidden"
              style={{ 
                backgroundColor: card.color, 
                transform: 'rotateY(180deg)',
                rotate: '1deg'
              }}
            >
              <div className="absolute top-4 left-4 font-sans text-[10px] opacity-30 uppercase font-bold tracking-widest">Answer</div>
              <p className="text-2xl font-bold font-childish text-ink-blue">{card.answer}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-6">
        <button onClick={handlePrev} className="p-3 border-2 border-ink rounded-full hover:bg-ink hover:text-paper transition-all">
          <ChevronLeft size={24} />
        </button>
        <span className="font-sans text-sm font-bold opacity-40">
          {idx + 1} / {CARDS.length} Cards
        </span>
        <button onClick={handleNext} className="p-3 border-2 border-ink rounded-full hover:bg-ink hover:text-paper transition-all">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
