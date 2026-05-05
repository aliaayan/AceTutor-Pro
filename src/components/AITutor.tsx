/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, ArrowLeft, Loader2, Mic, PhoneCall, Image as ImageIcon, X, Circle } from 'lucide-react';
import { TUTOR_PROMPT, ALL_SUBJECTS } from '../constants';

interface Message {
  role: 'user' | 'model';
  text: string;
  image?: string;
}

export default function AITutor({ onBack, subjectId }: { onBack: () => void, subjectId?: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Hey there! I'm your AceTutor study buddy for ${subjectId || 'your exams'}. What chapter are we tackling today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subject = ALL_SUBJECTS.find(s => s.id === subjectId);
  const isRTL = subject?.isRTL && subjectId !== 'C-2058';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (imageB64?: string) => {
    if (!input.trim() && !imageB64 && !pendingImage) return;

    const userText = input.trim();
    const activeImage = imageB64 || pendingImage;
    
    setInput('');
    setPendingImage(null);
    setMessages(prev => [...prev, { role: 'user', text: userText, image: activeImage || undefined }]);
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const contents: any[] = messages.map(m => ({ 
        role: m.role, 
        parts: [{ text: m.text }] 
      }));

      const userParts: any[] = [{ text: userText }];
      if (activeImage) {
        userParts.push({
          inlineData: {
            data: activeImage.split(',')[1],
            mimeType: "image/jpeg"
          }
        });
      }

      contents.push({ role: 'user', parts: userParts });

      const response = await model.generateContent({
        systemInstruction: TUTOR_PROMPT(subjectId),
        contents
      });

      const aiText = response.response.text() || "I'm having a bit of trouble finding the right marking scheme. Could you rephrase?";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("Tutor Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Whoops, my ink ran out! Please check your connection." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPendingImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setInput("Tell me about the key sections of a marking scheme...");
    }, 2000);
  };

  if (isCalling) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-12 bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-ink-blue/5 animate-pulse"></div>
        <div className="text-center space-y-4 relative z-10">
          <div className="w-32 h-32 rounded-full bg-ink-blue/20 flex items-center justify-center border-4 border-ink-blue/50 mx-auto">
            <PhoneCall size={64} className="text-ink-blue animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold">AceTutor Live Call</h2>
          <p className="opacity-60 text-sm font-sans">Connecting to your AI Buddy...</p>
        </div>
        
        <div className="flex gap-8 relative z-10">
          <button onClick={() => setIsCalling(false)} className="p-6 bg-red-500 rounded-full shadow-lg hover:scale-110 transition-transform">
            <X size={32} className="text-white" />
          </button>
          <div className="flex items-center gap-2 text-ink-blue">
            <div className="w-2 h-2 bg-ink-blue rounded-full animate-ping"></div>
            <span className="font-bold">Listening...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-[75vh] ${isRTL ? 'rtl' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Circle className="text-green-500 fill-green-500" size={8} /> AI Study Buddy
          </h2>
        </div>
        <button 
          onClick={() => setIsCalling(true)}
          className="flex items-center gap-2 px-4 py-2 bg-ink-blue/20 border border-ink-blue/40 rounded-full text-xs font-bold text-ink-blue hover:bg-ink-blue/40 transition-all"
        >
          <PhoneCall size={14} /> Live Call
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar"
      >
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-ink-blue/20 border border-ink-blue/50 text-white backdrop-blur-md' 
                : 'bg-white/5 border border-white/20 text-white ink-text'
            }`}>
              {msg.image && (
                <img src={msg.image} alt="Handwritten answer" className="w-full h-auto rounded-lg mb-3 border border-white/10" />
              )}
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-3 rounded-2xl flex items-center gap-2 text-white italic opacity-60 backdrop-blur-sm border border-white/10">
              <Loader2 size={16} className="animate-spin text-ink-blue" />
              <span>Reviewing marking scheme...</span>
            </div>
          </div>
        )}
      </div>

      {pendingImage && (
        <div className="relative inline-block mb-2 ml-auto">
          <img src={pendingImage} alt="Pending" className="w-20 h-20 object-cover rounded-lg border-2 border-ink-blue" />
          <button 
            onClick={() => setPendingImage(null)}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg"
          >
            <X size={12} />
          </button>
        </div>
      )}

      <div className="relative flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-white/5 border border-white/20 rounded-2xl text-white hover:bg-white/10 transition-all active:scale-90"
          >
            <ImageIcon size={20} />
          </button>
          <button 
            onClick={startVoiceSearch}
            className={`p-3 bg-white/5 border border-white/20 rounded-2xl transition-all active:scale-90 ${isListening ? 'text-pink-500 animate-pulse' : 'text-white'}`}
          >
            <Mic size={20} />
          </button>
        </div>
        
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 p-3 bg-white/5 border border-white/20 rounded-2xl focus:outline-none focus:border-ink-blue/50 text-white placeholder:opacity-20 font-sans"
          disabled={loading}
        />
        
        <button 
          onClick={() => handleSend()}
          disabled={loading || (!input.trim() && !pendingImage)}
          className="p-3 bg-ink-blue/80 text-white border border-ink-blue rounded-2xl hover:bg-ink-blue disabled:opacity-30 transition-all active:scale-90 shadow-md shadow-ink-blue/20"
        >
          <Send size={20} />
        </button>
        
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
      </div>
      
      {isListening && (
        <div className="mt-2 text-center text-xs text-pink-500 animate-pulse font-sans font-bold uppercase tracking-widest">
          Listening to your voice...
        </div>
      )}
    </div>
  );
}
