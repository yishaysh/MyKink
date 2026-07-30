import React, { useState, useEffect, useRef } from 'react';
import { Heart, ThumbsDown, HelpCircle, Flame, Filter, RotateCcw, Lock, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { CatalogQuestion } from '../services/api';
import { Language, translations, translateQuestion } from '../services/i18n';

interface SwipeDeckProps {
  questions: CatalogQuestion[];
  answeredQuestionIds?: string[];
  userAnswerValues?: Record<string, 'YES' | 'MAYBE' | 'NO'>;
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
  userAnswerValues = {},
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
  const hasInitializedRef = useRef(false);

  // Touch Swipe Gesture Refs
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  // Jump to first unanswered question ONLY on initial filter load
  useEffect(() => {
    if (!hasInitializedRef.current && questions.length > 0) {
      if (answeredQuestionIds.length > 0) {
        const firstUnansweredIndex = questions.findIndex(
          (q) => !answeredQuestionIds.includes(q.id)
        );
        if (firstUnansweredIndex !== -1) {
          setCurrentIndex(firstUnansweredIndex);
        } else {
          setCurrentIndex(0);
        }
      } else {
        setCurrentIndex(0);
      }
      hasInitializedRef.current = true;
    }
  }, [questions, answeredQuestionIds]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    hasInitializedRef.current = false;
    setCurrentIndex(0);
  };

  const handleIntensityChange = (lvlId: string) => {
    setSelectedIntensity(lvlId);
    hasInitializedRef.current = false;
    setCurrentIndex(0);
  };

  const categories = [
    { id: 'ALL', label: lang === 'he' ? 'הכל' : 'All' },
    { id: 'Sensual', label: lang === 'he' ? 'חושים' : 'Sensual' },
    { id: 'BDSM', label: 'BDSM' },
    { id: 'Roleplay', label: lang === 'he' ? 'משחקים' : 'Roleplay' },
    { id: 'Toys', label: lang === 'he' ? 'צעצועים' : 'Toys' },
    { id: 'ENM', label: lang === 'he' ? 'פנטזיות' : 'Fantasies' }
  ];

  const intensities = [
    { id: 'ALL', label: lang === 'he' ? 'הכל' : 'All' },
    { id: 'VANILLA', label: lang === 'he' ? 'וונילה' : 'Vanilla' },
    { id: 'SPICY', label: lang === 'he' ? 'לוהט' : 'Spicy' },
    { id: 'ADVENTUROUS', label: lang === 'he' ? 'נועז' : 'Adventurous' }
  ];

  const rawQ = questions[currentIndex];
  const currentQ = rawQ ? translateQuestion(rawQ, lang) : null;
  const isFinished = currentIndex >= questions.length || !currentQ;
  const currentAnswer = rawQ ? userAnswerValues[rawQ.id] : undefined;

  const handleVote = (val: 'YES' | 'MAYBE' | 'NO') => {
    if (rawQ && !isVoting) {
      setIsVoting(true);
      onAnswer(rawQ.id, val);
      setCurrentIndex((prev) => Math.min(prev + 1, questions.length));
      setTimeout(() => setIsVoting(false), 200);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (currentIndex === questions.length - 1) {
      setCurrentIndex(questions.length);
    }
  };

  const handleReset = () => {
    hasInitializedRef.current = true;
    setCurrentIndex(0);
  };

  // Touch Swipe Event Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const deltaX = touchEndXRef.current - touchStartXRef.current;
    const minSwipeDistance = 45;

    if (lang === 'he') {
      // RTL: Swipe Right = Next, Swipe Left = Prev
      if (deltaX > minSwipeDistance) {
        handleNext();
      } else if (deltaX < -minSwipeDistance) {
        handlePrev();
      }
    } else {
      // LTR: Swipe Left = Next, Swipe Right = Prev
      if (deltaX < -minSwipeDistance) {
        handleNext();
      } else if (deltaX > minSwipeDistance) {
        handlePrev();
      }
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
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

        {/* Categories Choice Blocks */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
            {lang === 'he' ? 'קטגוריית פנטזיות' : 'Fantasy Category'}
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`p-2 rounded-xl text-center transition flex items-center justify-center min-h-[2.5rem] cursor-pointer text-xs ${
                    isSelected ? 'filter-box-selected' : 'filter-box-unselected'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Intensities Choice Blocks */}
        <div className="pt-2 border-t border-[#36343a]">
          <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
            {lang === 'he' ? 'רמת נועזות' : 'Intensity Level'}
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {intensities.map((lvl) => {
              const isSelected = selectedIntensity === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => handleIntensityChange(lvl.id)}
                  className={`p-1.5 rounded-xl text-center transition flex items-center justify-center min-h-[2.25rem] cursor-pointer text-[11px] ${
                    isSelected ? 'filter-box-selected' : 'filter-box-unselected'
                  }`}
                >
                  <span>{lvl.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Swiper Card Area */}
      {!isFinished && currentQ ? (
        <div className="flex-1 min-h-0 flex flex-col justify-between space-y-2 my-1 overflow-hidden">
          {/* Card Container with Touch Swipe Handlers */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="solid-card p-4 sm:p-6 flex-1 flex flex-col justify-between card-appear relative overflow-hidden select-none min-h-[280px]"
          >
            {/* Top Navigation Bar: Previous Arrow | Category Badges | Next Arrow */}
            <div className="flex items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-1.5 rounded-xl bg-[#2b292f] border border-[#36343a] text-slate-300 disabled:opacity-30 hover:text-white transition"
                title={lang === 'he' ? 'שאלה קודמת' : 'Previous Question'}
              >
                {lang === 'he' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#2b292f] border border-[#504444] text-[#e8b4b8] text-[11px] font-bold uppercase tracking-wider">
                  {currentQ.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#141218] border border-[#36343a] text-slate-300 text-[11px] font-mono font-bold">
                  {currentQ.intensityLevel === 'VANILLA' && t.intensityVanilla}
                  {currentQ.intensityLevel === 'SPICY' && t.intensitySpicy}
                  {currentQ.intensityLevel === 'ADVENTUROUS' && t.intensityAdventurous}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex >= questions.length - 1}
                className="p-1.5 rounded-xl bg-[#2b292f] border border-[#36343a] text-slate-300 disabled:opacity-30 hover:text-white transition"
                title={lang === 'he' ? 'שאלה הבאה' : 'Next Question'}
              >
                {lang === 'he' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

            {/* Question Title & Description */}
            <div className="my-auto py-3 text-center space-y-2.5">
              <h3 className="text-lg sm:text-2xl font-bold text-white leading-snug font-headline">
                {currentQ.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                {currentQ.description}
              </p>

              {/* Swipe Instruction Hint */}
              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1 pt-1">
                <span>👈 {lang === 'he' ? 'החלק לשאלה הבאה / הקודמת' : 'Swipe left/right to navigate'} 👉</span>
              </div>
            </div>

            {/* Bottom Role Indicator & Counter */}
            <div className="pt-2 border-t border-[#36343a] flex items-center justify-between text-[11px] text-slate-400 shrink-0">
              <span className="font-semibold text-[#d1c5b2]">
                {currentQ.roleType === 'GIVER' && t.roleGiverBadge}
                {currentQ.roleType === 'RECEIVER' && t.roleReceiverBadge}
                {currentQ.roleType === 'SYMMETRIC' && (lang === 'he' ? 'תפקיד הדדי' : 'Symmetric / Both')}
              </span>
              <span className="font-mono text-slate-300 font-bold">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>
          </div>

          {/* Voting Action Buttons with Active Selection Indicator */}
          <div className="grid grid-cols-3 gap-2 shrink-0">
            {/* NO */}
            <button
              onClick={() => handleVote('NO')}
              disabled={isVoting}
              style={{
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: currentAnswer === 'NO' ? '#f43f5e' : 'rgba(225, 29, 72, 0.6)',
                backgroundColor: currentAnswer === 'NO' ? '#4c0519' : '#1d1b21'
              }}
              className={`py-3 px-2 rounded-xl hover:bg-rose-950/40 text-rose-400 font-bold text-xs flex flex-col items-center justify-center gap-1 transition group shadow-lg disabled:opacity-60 relative ${
                currentAnswer === 'NO' ? 'ring-2 ring-rose-500 scale-[1.02]' : ''
              }`}
            >
              {currentAnswer === 'NO' && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
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
                borderColor: currentAnswer === 'MAYBE' ? '#f59e0b' : 'rgba(217, 119, 6, 0.6)',
                backgroundColor: currentAnswer === 'MAYBE' ? '#451a03' : '#1d1b21'
              }}
              className={`py-4 px-3 rounded-2xl hover:bg-amber-950/40 text-amber-400 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition group shadow-lg disabled:opacity-60 relative ${
                currentAnswer === 'MAYBE' ? 'ring-2 ring-amber-500 scale-[1.02]' : ''
              }`}
            >
              {currentAnswer === 'MAYBE' && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
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
                borderColor: currentAnswer === 'YES' ? '#e8b4b8' : '#e8b4b8',
                backgroundColor: currentAnswer === 'YES' ? '#48272a' : '#2b292f'
              }}
              className={`py-4 px-3 rounded-2xl hover:bg-[#36343a] text-[#e8b4b8] font-black text-xs flex flex-col items-center justify-center gap-1.5 transition group shadow-xl disabled:opacity-60 relative ${
                currentAnswer === 'YES' ? 'ring-2 ring-[#e8b4b8] scale-[1.02]' : ''
              }`}
            >
              {currentAnswer === 'YES' && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#e8b4b8] text-[#48272a] flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
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
