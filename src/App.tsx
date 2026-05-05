/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, MessageSquare, Trophy, Home, ExternalLink, Library, Clock, RotateCw, FileText, ChevronRight, Calculator, Camera } from 'lucide-react';
import { QUIZZES, CAMBRIDGE_SUBJECTS, SINDH_SUBJECTS, ALL_SUBJECTS } from './constants.ts';
import AITutor from './components/AITutor';
import QuizSection from './components/QuizSection';
import Scoreboard from './components/Scoreboard';
import StudyTimer from './components/StudyTimer';
import FlashcardFlip from './components/FlashcardFlip';
import AIQuickNotes from './components/AIQuickNotes';
import GradePredictor from './components/GradePredictor';
import SnapAndMark from './components/SnapAndMark';
import QuizErrorBoundary from './components/QuizErrorBoundary';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';

type View = 'shelf' | 'board_select' | 'home' | 'tutor' | 'quiz' | 'scoreboard' | 'timer' | 'flashcards' | 'notes' | 'predictor' | 'snap_mark';
type Board = 'cambridge' | 'sindh';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('shelf');
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [latestScore, setLatestScore] = useState<{subject: string, score: number, total: number} | null>(null);

  const handleQuizComplete = (subjectName: string, score: number, total: number) => {
    setLatestScore({ subject: subjectName, score, total });
    setCurrentView('scoreboard');
  };

  const startQuiz = (id: string) => {
    setSelectedSubject(id);
    setCurrentView('quiz');
  };

  const selectBoard = (board: Board) => {
    setSelectedBoard(board);
    setCurrentView('home');
  };

  return (
    <GlobalErrorBoundary>
      <div className="notebook-paper min-h-screen">
      {/* Monetization Banner top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-paper/80 backdrop-blur-sm border-b border-rule px-4 py-2 flex justify-between items-center text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="bg-gray-200 px-2 py-1 rounded text-[10px] uppercase font-sans font-bold">AdSense</div>
          <span className="opacity-50">Hand-picked for you</span>
        </div>
        <a 
          href="https://monetag.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 bg-ink text-paper px-3 py-1 rounded-full text-xs hover:opacity-80 transition-opacity"
        >
          Support Us <ExternalLink size={12} />
        </a>
      </div>

      <main className="page-container max-w-2xl mx-auto pt-16">
        <header className="mb-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-2">AceTutor Pro</h1>
          {selectedBoard && (
            <p className="opacity-50 text-sm font-sans uppercase tracking-[0.2em]">
              {selectedBoard === 'cambridge' ? 'Cambridge O/A Level' : 'Sindh Board'}
            </p>
          )}
        </header>

        <AnimatePresence mode="wait">
          {currentView === 'shelf' && (
            <motion.div
              key="shelf"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4 mb-12">
                <Library size={48} className="mx-auto text-ink-blue opacity-20" />
                <h2 className="text-3xl font-bold">The Study Shelf</h2>
                <p className="opacity-60 italic">Pick your board to browse your subjects...</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <button 
                  onClick={() => selectBoard('cambridge')}
                  className="scribble-box group flex items-center justify-between hover:bg-ink-blue/5 transition-colors"
                >
                  <div className="text-left">
                    <h3 className="text-2xl font-bold">Cambridge O/A Level</h3>
                    <p className="text-sm opacity-60 font-sans">IGCSE, O Level, A Level subjects</p>
                  </div>
                  <ChevronRight className="opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                </button>

                <button 
                  onClick={() => selectBoard('sindh')}
                  className="scribble-box group flex items-center justify-between hover:bg-ink-blue/5 transition-colors"
                >
                  <div className="text-left">
                    <h3 className="text-2xl font-bold">Sindh Board</h3>
                    <p className="text-sm opacity-60 font-sans">Karachi, Hyderabad, Sukkur Boards</p>
                  </div>
                  <ChevronRight className="opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                </button>
              </div>
            </motion.div>
          )}

          {currentView === 'home' && selectedBoard && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-12"
            >
              {/* Tool Quick Access */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <button onClick={() => setCurrentView('timer')} className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all backdrop-blur-sm shadow-sm active:scale-95">
                  <Clock size={20} className="text-pink-500" />
                  <span className="text-[9px] font-sans font-black uppercase">Timer</span>
                </button>
                <button onClick={() => setCurrentView('flashcards')} className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all backdrop-blur-sm shadow-sm active:scale-95">
                  <RotateCw size={20} className="text-yellow-500" />
                  <span className="text-[9px] font-sans font-black uppercase">Cards</span>
                </button>
                <button onClick={() => setCurrentView('notes')} className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all backdrop-blur-sm shadow-sm active:scale-95">
                  <FileText size={20} className="text-blue-500" />
                  <span className="text-[9px] font-sans font-black uppercase">Notes</span>
                </button>
                <button onClick={() => setCurrentView('predictor')} className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all backdrop-blur-sm shadow-sm active:scale-95">
                  <Calculator size={20} className="text-green-500" />
                  <span className="text-[9px] font-sans font-black uppercase">Grade</span>
                </button>
                <button onClick={() => setCurrentView('snap_mark')} className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all backdrop-blur-sm shadow-sm active:scale-95">
                  <Camera size={20} className="text-pink-400" />
                  <span className="text-[9px] font-sans font-black uppercase">Snap</span>
                </button>
              </div>

              <div className="scribble-box">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <MessageSquare className="text-ink-blue" /> Ask AI Buddy {selectedSubject && <span className="text-sm opacity-40">in {selectedSubject}</span>}
                </h2>
                <button 
                  onClick={() => setCurrentView('tutor')}
                  className="w-full py-4 bg-white/10 hover:bg-white/20 border border-ink-blue/50 text-white rounded-3xl hover:rotate-1 transition-all backdrop-blur-md shadow-lg active:scale-[0.98]"
                >
                  {selectedSubject ? `Discuss marking schemes for ${selectedSubject}...` : 'Write a Message...'}
                </button>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-ink-blue">
                  <Library size={24} /> Subject Shelf
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(selectedBoard === 'cambridge' ? CAMBRIDGE_SUBJECTS : SINDH_SUBJECTS).map((sub) => {
                    const hasQuiz = QUIZZES.some(q => q.id === sub.id);
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setSelectedSubject(sub.id);
                          if (hasQuiz) startQuiz(sub.id);
                        }}
                        className={`p-6 border border-ink-blue/30 bg-white/5 rounded-3xl text-left group transition-all backdrop-blur-sm relative overflow-hidden active:scale-[0.98] shadow-sm hover:shadow-ink-blue/20 ${sub.isRTL ? 'rtl' : ''}`}
                      >
                        <div className="absolute top-2 right-2 text-[10px] font-bold opacity-30 group-hover:opacity-100 transition-opacity">
                          {sub.id}
                        </div>
                        <h4 className={`font-bold transition-colors ${sub.isRTL ? 'text-2xl font-urdu' : 'group-hover:text-ink-blue'}`}>
                          {sub.name}
                        </h4>
                        <p className="text-xs font-sans opacity-40 group-hover:opacity-60">
                          {hasQuiz ? 'Full Sync: 2015-2025 Vault Active' : 'Vault Connected • AI Tutor Ready'}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'tutor' && (
            <motion.div key="tutor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
              <div className="absolute -top-16 right-0 flex gap-2">
                <button 
                  onClick={() => setCurrentView('predictor')}
                  className="p-3 bg-white/5 border border-white/20 rounded-2xl text-green-500 hover:bg-white/10 transition-all backdrop-blur-md shadow-lg"
                  title="Grade Predictor"
                >
                  <Calculator size={18} />
                </button>
                <button 
                  onClick={() => setCurrentView('snap_mark')}
                  className="p-3 bg-white/5 border border-white/20 rounded-2xl text-pink-400 hover:bg-white/10 transition-all backdrop-blur-md shadow-lg"
                  title="Snap & Mark"
                >
                  <Camera size={18} />
                </button>
              </div>
              <AITutor onBack={() => setCurrentView('home')} subjectId={selectedSubject || undefined} />
            </motion.div>
          )}

          {currentView === 'timer' && (
            <motion.div key="timer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-4"><button onClick={() => setCurrentView('home')} className="flex items-center gap-1 opacity-50"><Home size={16} /> Dashboard</button></div>
              <StudyTimer />
            </motion.div>
          )}

          {currentView === 'flashcards' && (
            <motion.div key="flashcards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-4"><button onClick={() => setCurrentView('home')} className="flex items-center gap-1 opacity-50"><Home size={16} /> Dashboard</button></div>
              <FlashcardFlip />
            </motion.div>
          )}

          {currentView === 'notes' && (
            <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-4"><button onClick={() => setCurrentView('home')} className="flex items-center gap-1 opacity-50"><Home size={16} /> Dashboard</button></div>
              <AIQuickNotes />
            </motion.div>
          )}

          {currentView === 'predictor' && (
            <motion.div key="predictor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GradePredictor onBack={() => setCurrentView('home')} subjectId={selectedSubject || undefined} />
            </motion.div>
          )}

          {currentView === 'snap_mark' && (
            <motion.div key="snap_mark" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SnapAndMark onBack={() => setCurrentView('home')} subjectId={selectedSubject || undefined} />
            </motion.div>
          )}

          {currentView === 'quiz' && selectedSubject && (
            <motion.div key="quiz" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <QuizErrorBoundary onReset={() => setCurrentView('home')}>
                <QuizSection 
                  quiz={QUIZZES.find(q => q.id === selectedSubject) || { id: selectedSubject, name: 'Subject', questions: [], board: 'cambridge' }} 
                  onComplete={handleQuizComplete}
                  onBack={() => setCurrentView('home')}
                />
              </QuizErrorBoundary>
            </motion.div>
          )}

          {currentView === 'scoreboard' && (
            <motion.div key="scoreboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Scoreboard result={latestScore} onRetry={() => setCurrentView('home')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-paper border-t border-rule py-3 px-6 flex justify-around items-center z-50">
        <button onClick={() => setCurrentView('shelf')} className={`flex flex-col items-center gap-1 ${currentView === 'shelf' ? 'text-ink-blue scale-110' : 'opacity-40'}`}>
          <Library size={20} />
          <span className="text-[10px] uppercase font-sans">Shelf</span>
        </button>
        <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center gap-1 ${currentView === 'home' ? 'text-ink-blue scale-110' : 'opacity-40'}`}>
          <Home size={20} />
          <span className="text-[10px] uppercase font-sans">Board</span>
        </button>
        <button onClick={() => setCurrentView('tutor')} className={`flex flex-col items-center gap-1 ${currentView === 'tutor' ? 'text-ink-blue scale-110' : 'opacity-40'}`}>
          <MessageSquare size={20} />
          <span className="text-[10px] uppercase font-sans">Tutor</span>
        </button>
        <button onClick={() => setCurrentView('scoreboard')} className={`flex flex-col items-center gap-1 ${currentView === 'scoreboard' ? 'text-ink-blue scale-110' : 'opacity-40'}`}>
          <Trophy size={20} />
          <span className="text-[10px] uppercase font-sans">Stats</span>
        </button>
      </nav>
    </div>
    </GlobalErrorBoundary>
  );
}

