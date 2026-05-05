/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Camera, Image as ImageIcon, Sparkles, Loader2, ArrowLeft, RefreshCcw } from 'lucide-react';
import { SNAP_MARK_PROMPT, ALL_SUBJECTS } from '../constants';

export default function SnapAndMark({ onBack, subjectId: propSubjectId }: { onBack: () => void, subjectId?: string }) {
  const [image, setImage] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [subjectId, setSubjectId] = useState(propSubjectId || ALL_SUBJECTS[0].id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setFeedback(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMark = async () => {
    if (!image || loading) return;

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const subject = ALL_SUBJECTS.find(s => s.id === subjectId);
      
      const base64 = image.split(',')[1];
      
      const result = await model.generateContent([
        { text: `${SNAP_MARK_PROMPT}\nSubject: ${subject?.name} (${subjectId}). Compare this handwritten answer against current marking scheme standards.` },
        { 
          inlineData: { 
            data: base64, 
            mimeType: "image/jpeg" 
          } 
        }
      ]);

      setFeedback(result.response.text() || "I'm having trouble reading your writing. Can you snap a clearer photo?");
    } catch (error) {
      console.error("SnapMark Error:", error);
      setFeedback("Error: AI couldn't read the image. Check your internet connection!");
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
        <h2 className="text-2xl font-bold flex items-center gap-2 text-pink-400">
          <Camera /> Snap & Mark
        </h2>
      </div>

      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="scribble-box h-64 border-dashed border-2 border-pink-400/30 flex flex-col items-center justify-center cursor-pointer hover:bg-pink-400/5 transition-colors"
        >
          <ImageIcon size={48} className="opacity-20 mb-4" />
          <p className="font-sans text-sm opacity-50">Upload a photo of your answer</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageUpload} 
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative group">
            <img src={image} alt="Handwritten answer" className="w-full h-auto rounded-lg shadow-lg border-2 border-white/10" />
            <button 
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <RefreshCcw size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <select 
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white"
            >
              {ALL_SUBJECTS.map(s => (
                <option key={s.id} value={s.id}>{s.id} - {s.name}</option>
              ))}
            </select>

            <button
              onClick={handleMark}
              disabled={loading}
              className="w-full py-5 bg-pink-400/20 hover:bg-pink-400/40 border border-pink-400 text-white rounded-3xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg backdrop-blur-md active:scale-95"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              Analyze Answer
            </button>
          </div>
        </div>
      )}

      {feedback && (
        <div className="p-6 bg-pink-400/10 border border-pink-400/30 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-pink-400"></div>
          <div className="ink-text font-childish text-lg whitespace-pre-wrap leading-relaxed text-pink-100">
            {feedback}
          </div>
        </div>
      )}
    </div>
  );
}
