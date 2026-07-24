import React, { useState } from 'react';
import { Bot, Sparkles, Send, ShieldCheck, Flame, ChevronRight, CheckCircle2 } from 'lucide-react';
import { generateAIScenario, askAria } from '../services/api';

interface AICoachViewProps {
  coupleId: string | null;
}

export const AICoachView: React.FC<AICoachViewProps> = ({ coupleId }) => {
  const [intensityMode, setIntensityMode] = useState<'VANILLA' | 'SPICY' | 'ADVENTUROUS'>('SPICY');
  const [scenario, setScenario] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Aria Chat state
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'aria'; text: string; topic?: string }>>([
    {
      sender: 'aria',
      text: 'שלום! אני Aria, יועצת האינטימיות והחינוך המיני האישית שלכם. תוכלו לשאול אותי כל שאלה לגבי גבולות, בטיחות ב-BDSM, תקשורת זוגית או בילוי משותף.',
      topic: 'ברוכים הבאים'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  const handleGenerate = async () => {
    if (!coupleId) return;
    setIsGenerating(true);
    try {
      const res = await generateAIScenario(coupleId, intensityMode);
      if (res.success) {
        setScenario(res.scenario);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery.trim();
    setInputQuery('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);

    try {
      const res = await askAria(userText);
      if (res.success) {
        setMessages((prev) => [
          ...prev,
          { sender: 'aria', text: res.advice.response, topic: res.advice.topic }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* SECTION 1: AI EVENING SCENARIO GENERATOR */}
      <div className="glass-card p-6 border border-slate-700/80">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-pink-400 mb-1">
              <Sparkles className="w-6 h-6" />
              <h2 className="text-xl font-bold text-white">מחולל התרחישים הזוגיים (AI RAG Engine)</h2>
            </div>
            <p className="text-xs text-slate-400">
              מייצר תרחיש אינטימי 4-שלבי המבוסס **אך ורק** על התשוקות המשותפות שלכם שאומתו בהתאמות הזוגיות.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={intensityMode}
              onChange={(e) => setIntensityMode(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold"
            >
              <option value="VANILLA">דרגה: Vanilla</option>
              <option value="SPICY">דרגה: Spicy 🔥</option>
              <option value="ADVENTUROUS">דרגה: Adventurous ⚡</option>
            </select>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-neon px-5 py-2 text-xs flex items-center gap-2"
            >
              {isGenerating ? (
                <span>מייצר תרחיש...</span>
              ) : (
                <>
                  <Flame className="w-4 h-4" />
                  <span>חולל תרחיש ערב</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Display Scenario Steps */}
        {scenario ? (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-lg font-bold text-pink-300">{scenario.title}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scenario.steps.map((step: any) => (
                <div key={step.stepNumber} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-pink-500 text-white text-xs font-bold flex items-center justify-center">
                      {step.stepNumber}
                    </span>
                    <span className="text-xs font-bold text-purple-300">{step.title}</span>
                  </div>

                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">{step.description}</p>

                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>אות הסכמה (Consent Cue): {step.consentCue}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/30 text-xs text-pink-300 text-center font-medium">
              ✨ {scenario.romanticClosing}
            </div>
          </div>
        ) : (
          <div className="text-center p-6 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
            לחץ על "חולל תרחיש ערב" כדי ליצור חוויה זוגית מותאמת אישית.
          </div>
        )}
      </div>

      {/* SECTION 2: ARIA AI INTIMACY COACH CHATBOT */}
      <div className="glass-card p-6 border border-slate-700/80">
        <div className="flex items-center gap-2 text-purple-400 mb-4">
          <Bot className="w-6 h-6" />
          <h2 className="text-xl font-bold text-white">Aria - יועצת האינטימיות האנונימית</h2>
        </div>

        {/* Chat Messages Window */}
        <div className="h-64 overflow-y-auto space-y-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700 rounded-bl-none'
                }`}
              >
                {m.topic && (
                  <span className="text-[10px] font-bold text-pink-300 block mb-1">
                    [{m.topic}]
                  </span>
                )}
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input Form */}
        <form onSubmit={handleSendQuery} className="flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="שאל את Aria שאלה לגבי גבולות, בטיחות ב-BDSM או תקשורת..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500"
          />
          <button type="submit" className="btn-neon px-5 py-2.5 text-xs flex items-center gap-1">
            <Send className="w-4 h-4" />
            <span>שלח</span>
          </button>
        </form>
      </div>
    </div>
  );
};
