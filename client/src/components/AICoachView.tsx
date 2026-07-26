import React, { useState } from 'react';
import { Bot, Send, Sparkles, Wand2, Shield, Heart } from 'lucide-react';
import { askAICoach, generateEveningScenario, ScenarioStep } from '../services/api';
import { Language, translations } from '../services/i18n';

interface AICoachViewProps {
  coupleId: string | null;
  lang: Language;
}

export const AICoachView: React.FC<AICoachViewProps> = ({ coupleId, lang }) => {
  const t = translations[lang];
  const [activeSubTab, setActiveSubTab] = useState<'scenario' | 'aria'>('scenario');

  // Scenario Generator State
  const [intensity, setIntensity] = useState('SPICY');
  const [scenarioSteps, setScenarioSteps] = useState<ScenarioStep[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Aria Chat State
  const [chatMessages, setChatMessages] = useState<
    { sender: 'aria' | 'user'; text: string }[]
  >([
    {
      sender: 'aria',
      text: t.ariaWelcomeMsg
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const handleGenerateScenario = async () => {
    setIsGenerating(true);
    const res = await generateEveningScenario(coupleId, intensity);
    if (res.success && res.steps) {
      setScenarioSteps(res.steps);
    }
    setIsGenerating(false);
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputMsg('');
    setIsAsking(true);

    const res = await askAICoach(userText);
    setChatMessages((prev) => [...prev, { sender: 'aria', text: res.answer }]);
    setIsAsking(false);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 space-y-4">
      {/* Sub-tab Navigation */}
      <div className="flex bg-[#211f25] p-1 rounded-2xl border border-[#36343a]">
        <button
          onClick={() => setActiveSubTab('scenario')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'scenario'
              ? 'btn-rose shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>{t.scenarioTab}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('aria')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'aria'
              ? 'btn-rose shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>{t.ariaTab}</span>
        </button>
      </div>

      {/* SUB-TAB 1: SCENARIO GENERATOR */}
      {activeSubTab === 'scenario' && (
        <div className="space-y-4 card-appear">
          <div className="solid-card p-5 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#2b292f] border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center mx-auto shadow-md">
              <Wand2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-headline">{t.scenarioTitle}</h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                {t.scenarioSub}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">{t.selectIntensity}</span>
                <select
                  value={intensity}
                  onChange={(e) => setIntensity(e.target.value)}
                  className="px-3 py-1.5 input-solid text-xs font-bold text-white bg-[#141218]"
                >
                  <option value="VANILLA">{t.intensityVanilla}</option>
                  <option value="SPICY">{t.intensitySpicy}</option>
                  <option value="ADVENTUROUS">{t.intensityAdventurous}</option>
                </select>
              </div>

              <button
                onClick={handleGenerateScenario}
                disabled={isGenerating}
                className="btn-rose px-5 py-2.5 text-xs flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? (lang === 'he' ? 'מייצר תרחיש...' : 'Generating...') : t.generateScenarioBtn}</span>
              </button>
            </div>
          </div>

          {/* Generated Steps */}
          {scenarioSteps.length > 0 && (
            <div className="space-y-3">
              {scenarioSteps.map((step) => (
                <div key={step.stepNumber} className="solid-card p-5 space-y-2 card-appear">
                  <div className="flex items-center justify-between text-xs text-[#e8b4b8] font-bold">
                    <span>{t.stepNumber} {step.stepNumber}: {step.phase}</span>
                    <Heart className="w-3.5 h-3.5 fill-[#e8b4b8]" />
                  </div>
                  <h3 className="text-base font-bold text-white font-headline">{step.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: ARIA AI COACH CHAT */}
      {activeSubTab === 'aria' && (
        <div className="solid-card p-5 space-y-4 flex flex-col h-[500px] card-appear">
          {/* Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-[#36343a]">
            <div className="w-10 h-10 rounded-2xl bg-[#2b292f] border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-headline">{t.ariaHeaderTitle}</h3>
              <p className="text-[11px] text-slate-400">{t.ariaHeaderSub}</p>
            </div>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 text-xs ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'aria' && (
                  <div className="w-7 h-7 rounded-full bg-[#2b292f] text-[#e8b4b8] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-[82%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#e8b4b8] text-[#48272a] font-semibold'
                      : 'bg-[#141218] border border-[#36343a] text-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isAsking && (
              <div className="text-xs text-slate-500 italic pl-9">
                {lang === 'he' ? 'אריאל חושבת...' : 'Aria is thinking...'}
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-[#36343a]">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={t.askPlaceholder}
              className="flex-1 px-4 py-2.5 input-solid text-xs"
            />
            <button type="submit" className="btn-rose px-4 py-2.5 text-xs flex items-center gap-1">
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.sendBtn}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
