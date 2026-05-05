/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FileText, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { SUMMARIZER_PROMPT } from '../constants';

export default function AIQuickNotes() {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!inputText.trim() || loading) return;

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const response = await model.generateContent({
        systemInstruction: SUMMARIZER_PROMPT,
        contents: [{ role: 'user', parts: [{ text: inputText }] }]
      });

      setSummary(response.response.text() || "I couldn't quite condense that. Can you provide more details?");
    } catch (error) {
      console.error("Summary Error:", error);
      setSummary("Error: Couldn't process the notes. My ink ran out!");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setInputText('');
    setSummary(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="text-ink-blue" size={24} /> AI Quick Notes
        </h2>
        {summary && (
          <button onClick={reset} className="text-sm border-b border-ink flex items-center gap-1 opacity-50">
            <RefreshCw size={12} /> Clear
          </button>
        )}
      </div>

      {!summary ? (
        <div className="scribble-box space-y-4">
          <p className="opacity-70 text-sm">Paste a chapter segment, marking scheme, or your own messy notes and I'll clean them up for you!</p>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste text here..."
            className="w-full h-48 p-4 bg-paper/50 border-2 border-dashed border-ink rounded-lg focus:outline-none placeholder:opacity-30 resize-none font-sans text-sm"
          />
          <button
            onClick={handleSummarize}
            disabled={loading || !inputText.trim()}
            className="w-full py-5 bg-ink-blue/20 hover:bg-ink-blue/40 border border-ink-blue text-paper rounded-3xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-95 shadow-lg backdrop-blur-md"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? 'Summarizing...' : 'Summarize Notes'}
          </button>
        </div>
      ) : (
        <div 
          className="relative p-8 shadow-lg min-h-[300px] flex flex-col justify-center"
          style={{ backgroundColor: '#FFF9C4', rotate: '1deg' }}
        >
          <div className="absolute top-4 left-4 font-sans text-[10px] opacity-30 uppercase font-bold tracking-widest">AIE Summarized Notes</div>
          <div className="ink-text font-childish text-lg whitespace-pre-wrap leading-relaxed">
            {summary}
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black/5 rounded-full blur-xl"></div>
        </div>
      )}
    </div>
  );
}
