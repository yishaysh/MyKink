import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Wand2, Shield, Heart } from 'lucide-react';
import { generateAIScenario, askGeminiAria, ScenarioStep, ChatMessage, UserContext } from '../services/gemini';
import { SharedMatchItem } from './MatchesView';
import { Language, translations, translateQuestion } from '../services/i18n';

// Helper component to format Aria's text beautifully in the UI
const FormattedMessageText: React.FC<{ content: string; isUser: boolean }> = ({ content, isUser }) => {
  if (isUser) {
    return <span>{content}</span>;
  }

  if (!content) return null;

  // Helper to render inline bold text (**text**)
  const renderInline = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return (
          <strong key={i} className="font-bold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      const cleanPart = part.replace(/\*/g, '').replace(/^#+\s*/, '');
      return cleanPart;
    });
  };

  const lines = content.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed text-xs">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-0.5" />;

        // Horizontal Dividers (--- or ***)
        if (trimmed === '---' || trimmed === '***') {
          return <hr key={idx} className="border-[#36343a] my-1.5" />;
        }

        // Headings (### or #### or ##)
        if (trimmed.startsWith('#')) {
          const headingText = trimmed.replace(/^#+\s*/, '');
          return (
            <div key={idx} className="font-bold text-[#e8b4b8] text-xs mt-2 mb-0.5 font-headline border-b border-[#36343a]/40 pb-0.5">
              {renderInline(headingText)}
            </div>
          );
        }

        // Blockquotes (> text)
        if (trimmed.startsWith('> ')) {
          const quoteText = trimmed.replace(/^>\s*/, '');
          return (
            <blockquote key={idx} className="border-r-2 border-[#e8b4b8] pr-2.5 pl-1.5 py-1 italic bg-[#1c1a22] rounded text-slate-200 my-1">
              {renderInline(quoteText)}
            </blockquote>
          );
        }

        // Bullet points (* or - or • or numbers like 1.)
        if (/^([*•-]\s|\d+\.\s)/.test(trimmed)) {
          const bulletContent = trimmed.replace(/^([*•-]\s|\d+\.\s)/, '');
          const matchNum = trimmed.match(/^(\d+)\.\s/);
          const prefix = matchNum ? `${matchNum[1]}.` : '•';

          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1 my-0.5">
              <span className="text-[#e8b4b8] font-bold text-xs shrink-0 mt-0.5">{prefix}</span>
              <span className="text-slate-200">{renderInline(bulletContent)}</span>
            </div>
          );
        }

        // Standard paragraph line
        return <div key={idx}>{renderInline(line)}</div>;
      })}
    </div>
  );
};

interface AICoachViewProps {
  coupleId: string | null;
  lang: Language;
  userProfile?: {
    alias: string;
    role: string;
    categories: string[];
    intensity: string;
    gender?: string;
    goal?: string;
    relationshipDynamic?: string;
  } | null;
  matches?: SharedMatchItem[];
}

export const AICoachView: React.FC<AICoachViewProps> = ({ coupleId, lang, userProfile, matches }) => {
  const t = translations[lang];
  const [activeSubTab, setActiveSubTab] = useState<'scenario' | 'aria'>('scenario');

  // Scenario Generator State
  const [intensity, setIntensity] = useState('SPICY');
  const [scenarioSteps, setScenarioSteps] = useState<ScenarioStep[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Aria Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'aria',
      text: t.ariaWelcomeMsg
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const chatStreamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeSubTab === 'aria') {
      chatStreamRef.current?.scrollTo({
        top: chatStreamRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatMessages, isAsking, activeSubTab]);

  const handleGenerateScenario = async () => {
    setIsGenerating(true);
    const steps = await generateAIScenario(intensity, lang);
    setScenarioSteps(steps);
    setIsGenerating(false);
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || isAsking) return;

    const userText = inputMsg.trim();
    const updatedHistory: ChatMessage[] = [
      ...chatMessages,
      { sender: 'user', text: userText }
    ];
    setChatMessages(updatedHistory);
    setInputMsg('');
    setIsAsking(true);

    const userMatches: { title: string; category?: string }[] = [];
    if (matches && matches.length > 0) {
      for (const m of matches) {
        if (m.question) {
          const q = translateQuestion(m.question, lang);
          userMatches.push({ title: q.title, category: m.question.category });
        }
      }
    }

    const userContext: UserContext = {
      alias: userProfile?.alias,
      role: userProfile?.role,
      categories: userProfile?.categories,
      intensity: userProfile?.intensity,
      gender: userProfile?.gender,
      goal: userProfile?.goal,
      relationshipDynamic: userProfile?.relationshipDynamic,
      matches: userMatches
    };

    const answer = await askGeminiAria(userText, lang, updatedHistory, userContext);
    setChatMessages((prev) => [...prev, { sender: 'aria', text: answer }]);
    setIsAsking(false);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 space-y-4">
      {/* Sub-tab Navigation */}
      <div className="flex bg-[#211f25] p-1 rounded-2xl border border-[#36343a] shrink-0">
        <button
          onClick={() => setActiveSubTab('scenario')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
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
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
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
        <div className="flex-1 min-h-0 flex flex-col space-y-2 card-appear overflow-hidden">
          <div className="solid-card p-3 space-y-2 text-center shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#2b292f] border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center mx-auto shadow-md">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-headline leading-tight">{t.scenarioTitle}</h2>
              <p className="text-[11px] text-slate-300 max-w-md mx-auto leading-tight mt-0.5">
                {t.scenarioSub}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1.5 border-t border-[#36343a]">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">{t.selectIntensity}</span>
                <select
                  value={intensity}
                  onChange={(e) => setIntensity(e.target.value)}
                  className="px-2.5 py-1 input-solid text-xs font-bold text-white bg-[#141218]"
                >
                  <option value="VANILLA">{t.intensityVanilla}</option>
                  <option value="SPICY">{t.intensitySpicy}</option>
                  <option value="ADVENTUROUS">{t.intensityAdventurous}</option>
                </select>
              </div>

              <button
                onClick={handleGenerateScenario}
                disabled={isGenerating}
                className="btn-rose px-4 py-2 text-xs flex items-center gap-1.5 font-bold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? (lang === 'he' ? 'מייצר תרחיש...' : 'Generating...') : t.generateScenarioBtn}</span>
              </button>
            </div>
          </div>

          {/* Generated Steps */}
          {scenarioSteps.length > 0 && (
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
              {scenarioSteps.map((step) => (
                <div key={step.stepNumber} className="solid-card p-3.5 space-y-1.5 card-appear">
                  <div className="flex items-center justify-between text-xs text-[#e8b4b8] font-bold">
                    <span>{t.stepNumber} {step.stepNumber}: {step.phase}</span>
                    <Heart className="w-3.5 h-3.5 fill-[#e8b4b8]" />
                  </div>
                  <h3 className="text-sm font-bold text-white font-headline">{step.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: ARIA AI COACH CHAT */}
      {activeSubTab === 'aria' && (
        <div className="solid-card p-3 space-y-2 flex flex-col flex-1 min-h-0 card-appear overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#36343a] shrink-0">
            <div className="w-8 h-8 rounded-xl bg-[#2b292f] border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center shadow-md shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-headline leading-tight">{t.ariaHeaderTitle}</h3>
              <p className="text-[10px] text-slate-400 leading-tight">{t.ariaHeaderSub}</p>
            </div>
          </div>

          {/* Chat Stream */}
          <div ref={chatStreamRef} className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 scroll-smooth">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 text-xs ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'aria' && (
                  <div className="w-6 h-6 rounded-full bg-[#2b292f] text-[#e8b4b8] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-xl max-w-[88%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#e8b4b8] text-[#48272a] font-semibold text-xs'
                      : 'bg-[#141218] border border-[#36343a] text-slate-200'
                  }`}
                >
                  <FormattedMessageText content={msg.text} isUser={msg.sender === 'user'} />
                </div>
              </div>
            ))}
            {isAsking && (
              <div className="text-xs text-slate-500 italic pl-8">
                {lang === 'he' ? 'אריאל חושבת...' : 'Aria is thinking...'}
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendChat} className="flex gap-2 pt-1.5 border-t border-[#36343a] shrink-0">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={t.askPlaceholder}
              className="flex-1 px-3 py-2 input-solid text-xs"
            />
            <button type="submit" className="btn-rose px-3.5 py-2 text-xs flex items-center gap-1 font-bold">
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.sendBtn}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
