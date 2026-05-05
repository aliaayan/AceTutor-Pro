/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { SubjectQuiz, Question } from '../constants';

interface QuizSectionProps {
  quiz: SubjectQuiz;
  onComplete: (subjectName: string, score: number, total: number) => void;
  onBack: () => void;
}

export default function QuizSection({ quiz, onComplete, onBack }: QuizSectionProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Defensive check for missing quiz data
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="scribble-box p-8 text-center space-y-4">
        <h3 className="text-xl font-bold">Quiz Not Ready</h3>
        <p className="opacity-60 italic">This subject's practice vault is being indexed. Use the AI Tutor for now!</p>
        <button onClick={onBack} className="px-6 py-2 bg-ink-blue text-white rounded-full">Go Back</button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIdx];

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    
    if (idx === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onComplete(quiz.name, score, quiz.questions.length);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="p-1 hover:bg-ink/5 rounded-full flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> Quit
        </button>
        <span className="text-sm opacity-50 px-3 py-1 border border-ink/20 rounded-full">
          Q {currentIdx + 1} / {quiz.questions.length}
        </span>
      </div>

      <div className="scribble-box min-h-[150px] flex items-center justify-center p-6 text-center">
        <h3 className="text-2xl font-bold leading-tight">{currentQuestion.question}</h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {currentQuestion.options.map((option, idx) => {
          let stateClass = "border-ink hover:bg-ink/5";
          if (isAnswered) {
            if (idx === currentQuestion.correctAnswer) {
              stateClass = "bg-green-100 border-green-600 text-green-800";
            } else if (idx === selectedOption) {
              stateClass = "bg-red-100 border-red-600 text-red-800";
            } else {
              stateClass = "opacity-40 border-ink/10";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              className={`flex items-center justify-between p-5 border border-white/20 bg-white/5 rounded-3xl text-left transition-all relative active:scale-[0.98] ${stateClass}`}
            >
              <span className="font-medium text-white">{option}</span>
              {isAnswered && idx === currentQuestion.correctAnswer && <CheckCircle2 size={18} />}
              {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswer && <XCircle size={18} />}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {isAnswered && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full py-5 bg-ink-blue/20 hover:bg-ink-blue/40 border border-ink-blue text-white rounded-3xl font-bold text-lg shadow-lg backdrop-blur-md active:scale-95 transition-all"
            onClick={handleNext}
          >
            {currentIdx < quiz.questions.length - 1 ? 'Next Question' : 'View Results'}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
