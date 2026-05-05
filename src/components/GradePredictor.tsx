/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Calculator, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { PREDICTOR_PROMPT, ALL_SUBJECTS } from '../constants';

export default function GradePredictor({ onBack, subjectId: propSubjectId }: { onBack: () => void, subjectId?: string }) {
  const [marks, setMarks] = useState('');
  const [total, setTotal] = useState('');
  const [subjectId, setSubjectId] = useState(propSubjectId || ALL_SUBJECTS[0].id);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!marks || !total || loading) return;

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const subject = ALL_SUBJECTS.find(s => s.id === subjectId);
      const prompt = `Student got ${marks}/${total} in ${subject?.name} (${subjectId}).`;
      
      const response = await model.generateContent({
        systemInstruction: PREDICTOR_PROMPT,
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });

      setPrediction(response.response.text() || "I'm having trouble seeing the future right now. Try again?");
    } catch (error) {
      console.error("Predictor Error:", error);
      setPrediction("Prediction failed. The future is cloudy!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="text-ink-blue" /> Grade Predictor
        </h2>
      </div>

      <div className="scribble-box space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-sans uppercase opacity-50">Subject</label>
            <select 
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white"
            >
              {ALL_SUBJECTS.map(s => (
                <option key={s.id} value={s.id}>{s.id} - {s.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-sans uppercase opacity-50">Your Marks</label>
              <input 
                type="number"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                placeholder="e.g. 75"
                className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-sans uppercase opacity-50">Total Marks</label>
              <input 
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                placeholder="e.g. 100"
                className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handlePredict}
          disabled={loading || !marks || !total}
          className="w-full py-5 bg-ink-blue/20 hover:bg-ink-blue/40 border border-ink-blue text-white rounded-3xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg backdrop-blur-md active:scale-95"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          Predict My Grade
        </button>
      </div>

      {prediction && (
        <div className="p-6 bg-white/5 border border-ink-blue/30 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-ink-blue"></div>
          <div className="ink-text font-childish text-lg whitespace-pre-wrap leading-relaxed">
            {prediction}
          </div>
        </div>
      )}
    </div>
  );
}
