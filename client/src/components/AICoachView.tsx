import React, { useState } from 'react';
import { Bot, Sparkles, Send, Flame, Heart, BookOpen, User, RefreshCw } from 'lucide-react';
import { generateEveningScenario, askAICoach, ScenarioStep } from '../services/api';

interface AICoachViewProps {
  coupleId: string | null;
}

export const AICoachView: React.FC<AICoachViewProps> = ({ coupleId }) => {
  const [activeSubTab, setActiveSubTab] = useState<'SCENARIO' | 'CHAT'>('SCENARIO');

  // Scenario state
  const [intensity, setIntensity] = useState('SPICY');
  const [scenarioSteps, setScenarioSteps] = useState<ScenarioStep[]>([]);
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'aria'; text: string }>>([
    {
      sender: 'aria',
      text: "Hello, I'm Aria — your AI intimacy & communication guide. Ask me anything about exploring boundaries, discussing fantasies with your partner, or introducing new ideas safely."
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isSendingQuery, setIsSendingQuery] = useState(false);

  const handleGenerateScenario = async () => {
    setIsGeneratingScenario(true);
    try {
      const res = await generateEveningScenario(coupleId, intensity);
      if (res.success && res.steps) {
        setScenarioSteps(res.steps);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isSendingQuery) return;

    const userText = inputQuery.trim();
    setInputQuery('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsSendingQuery(true);

    try {
      const res = await askAICoach(userText);
      setChatMessages((prev) => [...prev, { sender: 'aria', text: res.answer }]);
    } catch (e) {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'aria', text: 'I am experiencing a transient connection issue. Please try again shortly.' }
      ]);
    } finally {
      setIsSendingQuery(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Selector: Scenario Generator vs Aria AI Coach */}
      <div className="flex justify-center mb-6">
        <div className="glass-card p-1.5 flex gap-2 border border-[#36343a]">
          <button
            onClick={() => setActiveSubTab('SCENARIO')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition ${
              activeSubTab === 'SCENARIO' ? 'btn-rose shadow-md shadow-[#e8b4b8]/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Evening Scenario Generator</span>
          </button>

          <button
            onClick={() => setActiveSubTab('CHAT')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition ${
              activeSubTab === 'CHAT' ? 'btn-rose shadow-md shadow-[#e8b4b8]/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Aria AI Coach</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: SCENARIO GENERATOR */}
      {activeSubTab === 'SCENARIO' && (
        <div className="space-y-6">
          <div className="glass-card p-6 border border-[#36343a] text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#e8b4b8] to-[#ffd2d5] flex items-center justify-center text-[#48272a] mx-auto shadow-lg shadow-[#e8b4b8]/20">
              <Sparkles className="w-6 h-6 fill-[#48272a]" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white font-headline">Custom Evening Scenario Generator</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Synthesizes your verified mutual matches into a tailored 4-step romantic progression for tonight.
              </p>
            </div>

            {/* Intensity Level Selection */}
            <div className="flex justify-center items-center gap-3">
              <span className="text-xs font-semibold text-slate-300">Select Intensity:</span>
              <div className="flex gap-2">
                {['VANILLA', 'SPICY', 'ADVENTUROUS'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setIntensity(lvl)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                      intensity === lvl ? 'bg-[#e8b4b8] text-[#48272a] shadow-sm' : 'bg-[#1d1b21] text-slate-400 border border-[#36343a]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateScenario}
              disabled={isGeneratingScenario}
              className="btn-rose px-8 py-3 text-xs flex items-center justify-center gap-2 mx-auto"
            >
              {isGeneratingScenario ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Scenario...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Evening Scenario</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Scenario Steps Cards */}
          {scenarioSteps.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scenarioSteps.map((step) => (
                <div key={step.stepNumber} className="glass-card p-6 border border-[#36343a] space-y-3 card-appear">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#1d1b21] text-[#e8b4b8] text-xs font-mono font-bold border border-[#36343a]">
                      Step {step.stepNumber} of 4
                    </span>
                    <span className="text-xs font-bold text-[#d1c5b2]">{step.phase}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-headline">{step.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>

                  <div className="pt-3 border-t border-[#2b292f] text-[11px] text-[#e8b4b8] font-semibold flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-[#e8b4b8]/20" />
                    <span>Suggested Setup & Mood Preparation</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: ARIA AI COACH */}
      {activeSubTab === 'CHAT' && (
        <div className="glass-card p-6 border border-[#36343a] flex flex-col h-[520px]">
          {/* Chat Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-[#2b292f]">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#e8b4b8] to-[#ffd2d5] flex items-center justify-center text-[#48272a] shadow-md shadow-[#e8b4b8]/20">
              <Bot className="w-5 h-5 fill-[#48272a]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-headline">Aria AI Intimacy Guide</h3>
              <p className="text-[11px] text-slate-400">Private, non-judgmental couples advisor</p>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-[#e8b4b8] text-[#48272a] font-bold'
                      : 'bg-[#2b292f] text-[#e8b4b8] border border-[#36343a]'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#e8b4b8] text-[#48272a] font-medium'
                      : 'bg-[#1d1b21] text-slate-200 border border-[#36343a]'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Starter Pills */}
          <div className="py-2 flex gap-1.5 overflow-x-auto border-t border-[#2b292f]">
            <button
              onClick={() => setInputQuery('How can I bring up a new fantasy without making my partner uncomfortable?')}
              className="px-3 py-1 rounded-full bg-[#1d1b21] text-slate-400 hover:text-white border border-[#36343a] text-[11px] whitespace-nowrap"
            >
              💬 How to bring up new fantasies?
            </button>
            <button
              onClick={() => setInputQuery('What are safe ways to set boundaries during roleplay?')}
              className="px-3 py-1 rounded-full bg-[#1d1b21] text-slate-400 hover:text-white border border-[#36343a] text-[11px] whitespace-nowrap"
            >
              🛡️ Safe boundary setting
            </button>
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSendMessage} className="pt-3 flex gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Aria anything..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-[#141218] border border-[#36343a] text-white text-xs focus:outline-none focus:border-[#e8b4b8]"
            />
            <button type="submit" disabled={isSendingQuery} className="btn-rose px-5 py-2.5 text-xs flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
