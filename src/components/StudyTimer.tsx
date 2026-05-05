/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

export default function StudyTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      alert("Time's up! Take a short break.");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Hand-drawn clock style using SVG
  const dashOffset = ((25 * 60 - timeLeft) / (25 * 60)) * 283;

  return (
    <div className="scribble-box flex flex-col items-center justify-center p-8 space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Clock className="text-ink-blue" /> Study Timer
      </h2>
      
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          {/* Rough hand-drawn circle background */}
          <circle
            cx="96"
            cy="96"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-ink/10"
          />
          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r="90"
            fill="none"
            stroke="var(--color-electric)"
            strokeWidth="4"
            strokeDasharray="283"
            style={{ 
              strokeDashoffset: 283 - dashOffset,
              transition: 'stroke-dashoffset 0.5s ease',
              strokeLinecap: 'round'
            }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-black font-sans">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
          <span className="text-xs uppercase opacity-50 font-bold">Focus Session</span>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={toggleTimer}
          className="p-6 bg-ink-blue/20 hover:bg-ink-blue/40 border border-ink-blue text-paper rounded-full hover:scale-110 transition-transform shadow-lg backdrop-blur-md active:scale-90"
        >
          {isActive ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
        <button 
          onClick={resetTimer}
          className="p-6 border border-white/20 bg-white/5 rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm active:scale-90 shadow-sm"
        >
          <RotateCcw size={24} />
        </button>
      </div>

      <p className="text-sm opacity-60 text-center italic">
        "One step at a time, don't rush the ink!"
      </p>
    </div>
  );
}
