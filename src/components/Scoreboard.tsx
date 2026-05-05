/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Trophy, RefreshCcw, Share2 } from 'lucide-react';

interface ScoreboardProps {
  result: { subject: string, score: number, total: number } | null;
  onRetry: () => void;
}

export default function Scoreboard({ result, onRetry }: ScoreboardProps) {
  if (!result) return null;

  const percentage = (result.score / result.total) * 100;
  
  const getRankMsg = () => {
    if (percentage === 100) return "Genius Alert! Perfect Score!";
    if (percentage >= 80) return "Brilliant! You're an Ace!";
    if (percentage >= 50) return "Great Effort! Keep revising.";
    return "Study hard! Let's try again.";
  };

  return (
    <div className="text-center space-y-8 py-8">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring' }}
        className="relative inline-block"
      >
        <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-10 rounded-full animate-pulse"></div>
        <Trophy size={100} className="text-yellow-500 relative z-10 mx-auto" />
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold">{getRankMsg()}</h2>
        <p className="text-xl opacity-60">Subject: {result.subject}</p>
      </div>

      <div className="scribble-box py-10">
        <div className="text-7xl font-black mb-2 animate-bounce">
          {result.score} / {result.total}
        </div>
        <div className="text-sm opacity-50 uppercase tracking-widest font-sans font-bold">Final Score</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={onRetry}
          className="flex items-center justify-center gap-2 py-5 border border-white/20 bg-white/5 rounded-3xl font-bold hover:bg-white/10 transition-all backdrop-blur-sm active:scale-95 shadow-sm"
        >
          <RefreshCcw size={18} /> Home
        </button>
        <button 
          onClick={() => alert(`I scored ${result.score}/${result.total} in ${result.subject} on AceTutor Pro!`)}
          className="flex items-center justify-center gap-2 py-5 bg-ink-blue/20 hover:bg-ink-blue/40 border border-ink-blue text-white rounded-3xl font-bold transition-all shadow-lg backdrop-blur-md active:scale-95"
        >
          <Share2 size={18} /> Share
        </button>
      </div>
    </div>
  );
}
