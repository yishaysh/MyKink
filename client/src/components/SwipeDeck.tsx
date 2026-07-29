import React, { useState, useEffect } from 'react';
import { Heart, ThumbsDown, HelpCircle, Flame, Filter, RotateCcw, Lock } from 'lucide-react';
import { CatalogQuestion } from '../services/api';
import { Language, translations, translateQuestion } from '../services/i18n';

interface SwipeDeckProps {
  questions: CatalogQuestion[];
  answeredQuestionIds?: string[];
  onAnswer: (questionId: string, value: 'YES' | 'MAYBE' | 'NO') => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedIntensity: string;
  setSelectedIntensity: (int: string) => void;
  onGoToMatches: () => void;
  lang: Language;
}

export const SwipeDeck: React.FC<SwipeDeckProps> = ({
  questions,
  answeredQuestionIds = [],
  onAnswer,
  selectedCategory,
  setSelectedCategory,
  selectedIntensity,
  setSelectedIntensity,
  onGoToMatches,
  lang
}) => {
  const t = translations[lang];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVoting, setIsVoting] = useState(false);

  // Jump to first unanswered question if available, or set to finished if all are answered
  useEffect(() => {
    if (questions.length > 0) {
      if (answeredQuestionIds.length > 0) {
        const firstUnansweredIndex = questions.findIndex(
          (q) => !answeredQuestionIds.includes(q.id)
        );
        if (firstUnansweredIndex !== -1) {
          setCurrentIndex(firstUnansweredIndex);
        } else {
          // All questions in the current filter list have already been answered
          setCurrentIndex(questions.length);
        }
      } else {
        setCurrentIndex(0);
      }
    }
  }, [questions, answeredQuestionIds]);

  const categories = [
    { id: 'ALL', label: t.allCategories },
    { id: 'Sensual', label: lang === 'he' ? 'חושים ומגע' : 'Sensual' },
    { id: 'BDSM', label: 'BDSM' },
    { id: 'Roleplay', label: lang === 'he' ? 'משחקי תפקידים' : 'Roleplay' },
    { id: 'Toys', label: lang === 'he' ? 'צעצועים' : 'Toys' },
    { id: 'ENM', label: lang === 'he' ? 'פנטזיות פתוחות' : 'Open / ENM' }
  ];

  const intensities = [
    { id: 'ALL', label: t.allIntensities },
    { id: 'VANILLA', label: t.intensityVanilla },
    { id: 'SPICY', label: t.intensitySpicy },
    { id: 'ADVENTUROUS', label: t.intensityAdventurous }
  ];

  const rawQ = questions[currentIndex];
  const currentQ = rawQ ? translateQuestion(rawQ, lang) : null;
  const isFinished = currentIndex >= questions.length || !currentQ;

  const handleVote = (val: 'YES' | 'MAYBE' | 'NO') => {
    if (rawQ && !isVoting) {
      setIsVoting(true);
      onAnswer(rawQ.id, val);
      setCurrentIndex((prev) => prev + 1);
      setTimeout(() => setIsVoting(false), 200);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
      {/* Category & Intensity Filters */}
      <div className="solid-card p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
          <div className="flex items-center gap-1.5 text-[#e8b4b8]">
            <Filter className="w-4 h-4" />
            <span>{t.filterTitle}</span>
          </div>
          {answeredQuestionIds.length > 0 && (
            <span className="text-[11px] font-mono text-[#d1c5b2]">
              {lang === 'he' ? 'נענו:' : 'Answered:'} {answeredQuestionIds.length} / {questions.length}
            </span>
          )}
        </div>

        {/* Categories Pills */}
        <div className="flex overflow-x-auto gap-1 py-0.5 no-scrollbar scrollbar-none flex-nowrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setCurrentIndex(0); }}
              className={`shrink-0 px-3 py-0.5 rounded-full text-[11px] font-semibold transition whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'btn-rose shadow-sm'
                  : 'btn-soft'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Intensities Pills */}
        <div className="flex overflow-x-auto gap-1 pt-1 border-t border-[#36343a] no-scrollbar scrollbar-none flex-nowrap">
          {intensities.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => { setSelectedIntensity(lvl.id); setCurrentIndex(0); }}
              className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition whitespace-nowrap ${
                selectedIntensity === lvl.id
                  ? 'bg-[#e8b4b8] text-[#48272a] font-bold'
                  : 'bg-[#2b292f] text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Swiper Card Area */}
      {!isFinished && currentQ ? (
        <div className="flex-1 min-h-0 flex flex-col justify-between space-y-2 my-1 overflow-hidden">
          <div className="solid-card p-4 sm:p-6 flex-1 flex flex-col justify-between card-appear relative overflow-hidden">
            {/* Top Badges */}
            <div className="flex items-center justify-between gap-2 shrink-0">
              <span className="px-2.5 py-0.5 rounded-full bg-[#2b292f] border border-[#504444] text-[#e8b4b8] text-[11px] font-bold uppercase tracking-wider">
                {currentQ.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#141218] border border-[#36343a] text-slate-300 text-[11px] font-mono font-bold">
                {currentQ.intensityLevel === 'VANILLA' && t.intensityVanilla}
                {currentQ.intensityLevel === 'SPICY' && t.intensitySpicy}
                {currentQ.intensityLevel === 'ADVENTUROUS' && t.intensityAdventurous}
              </span>
            </div>

            {/* Question Title & Description */}
            <div className="my-auto py-2 text-center space-y-2">
              <h3 className="text-lg sm:text-2xl font-bold text-white leading-snug font-headline">
                {currentQ.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                {currentQ.description}
              </p>
            </div>

            {/* Bottom Role Indicator & Privacy Footnote */}
            <div className="pt-2 border-t border-[#36343a] flex items-center justify-between text-[11px] text-slate-400 shrink-0">
              <span className="font-semibold text-[#d1c5b2]">
                {currentQ.roleType === 'GIVER' && t.roleGiverBadge}
                {currentQ.roleType === 'RECEIVER' && t.roleReceiverBadge}
                {currentQ.roleType === 'SYMMETRIC' && (lang === 'he' ? 'תפקיד הדדי' : 'Symmetric / Both')}
              </span>
              <span className="font-mono text-slate-400">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>
          </div>

          {/* Voting Action Buttons */}
          <div className="grid grid-cols-3 gap-2 shrink-0">
            {/* NO */}
            <button
              onClick={() => handleVote('NO')}
              disabled={isVoting}
              style={{
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: 'rgba(225, 29, 72, 0.6)',
                backgroundColor: '#1d1b21'
              }}
              className="py-2.5 px-2 rounded-xl hover:bg-rose-950/40 text-rose-400 font-bold text-xs flex flex-col items-center justify-center gap-1 transition group shadow-lg disabled:opacity-60"
            >
              <ThumbsDown className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{t.btnNo}</span>
            </button>

            {/* MAYBE */}
            <button
              onClick={() => handleVote('MAYBE')}
              disabled={isVoting}
              style={{
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: 'rgba(217, 119, 6, 0.6)',
                backgroundColor: '#1d1b21'
              }}
              className="py-4 px-3 rounded-2xl hover:bg-amber-950/40 text-amber-400 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition group shadow-lg disabled:opacity-60"
            >
              <HelpCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>{t.btnMaybe}</span>
            </button>

            {/* YES */}
            <button
              onClick={() => handleVote('YES')}
              disabled={isVoting}
              style={{
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: '#e8b4b8',
                backgroundColor: '#2b292f'
              }}
              className="py-4 px-3 rounded-2xl hover:bg-[#36343a] text-[#e8b4b8] font-black text-xs flex flex-col items-center justify-center gap-1.5 transition group shadow-xl hover:scale-105 active:scale-100 disabled:opacity-60"
            >
              <Heart className="w-6 h-6 fill-[#e8b4b8] text-[#e8b4b8] group-hover:scale-110 transition-transform" />
              <span>{t.btnYes}</span>
            </button>
          </div>

          <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-[#e8b4b8]" />
            <span>{t.noPrivacyFootnote}</span>
          </p>
        </div>
      ) : (
        /* Quiz Finished State */
        <div className="solid-card p-8 text-center space-y-5 card-appear">
          <div className="w-16 h-16 rounded-full bg-[#2b292f] border border-[#e8b4b8]/40 text-[#e8b4b8] flex items-center justify-center mx-auto shadow-lg">
            <Flame className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white font-headline">{t.quizCompletedTitle}</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1">
              {t.quizCompletedSub}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onGoToMatches}
              className="btn-rose flex-1 py-3 text-xs flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-[#48272a]" />
              <span>{t.viewMatchesBtn}</span>
            </button>
            <button
              onClick={handleReset}
              className="btn-soft px-5 py-3 text-xs flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.restartQuizBtn}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
