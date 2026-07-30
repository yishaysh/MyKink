import React, { useState, useEffect, useRef } from 'react';
import { Heart, ThumbsDown, HelpCircle, Flame, Filter, RotateCcw, Lock, Check } from 'lucide-react';
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

  // Pure Horizontal Physics Drag State for Card Navigation
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState<'next' | 'prev' | null>(null);

  const startXRef = useRef<number | null>(null);

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
    setDragOffsetX(0);
  };

  const handleIntensityChange = (lvlId: string) => {
    setSelectedIntensity(lvlId);
    hasInitializedRef.current = false;
    setCurrentIndex(0);
    setDragOffsetX(0);
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
  const nextRawQ = questions[currentIndex + 1];
  const currentQ = rawQ ? translateQuestion(rawQ, lang) : null;
  const nextQ = nextRawQ ? translateQuestion(nextRawQ, lang) : null;

  const isFinished = currentIndex >= questions.length || !currentQ;
  const currentAnswer = rawQ ? userAnswerValues[rawQ.id] : undefined;

  // Handle voting via action buttons below
  const handleVote = (val: 'YES' | 'MAYBE' | 'NO') => {
    if (!rawQ || isVoting || exitDirection) return;
    setIsVoting(true);
    onAnswer(rawQ.id, val);
    setExitDirection('next');
    setTimeout(() => {
      setExitDirection(null);
      setDragOffsetX(0);
      setCurrentIndex((prev) => Math.min(prev + 1, questions.length));
      setIsVoting(false);
    }, 220);
  };

  const handleReset = () => {
    hasInitializedRef.current = true;
    setCurrentIndex(0);
    setDragOffsetX(0);
  };

  // Drag Gesture Handlers (Horizontal X-Axis ONLY)
  const handleDragStart = (clientX: number) => {
    if (isVoting || exitDirection) return;
    startXRef.current = clientX;
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || startXRef.current === null) return;
    const deltaX = clientX - startXRef.current;
    setDragOffsetX(deltaX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 65;

    // RTL (Hebrew): Swipe Right = Next Question, Swipe Left = Previous Question
    // LTR (English): Swipe Left = Next Question, Swipe Right = Previous Question
    const isNext = lang === 'he' ? dragOffsetX > threshold : dragOffsetX < -threshold;
    const isPrev = lang === 'he' ? dragOffsetX < -threshold : dragOffsetX > threshold;

    if (isNext) {
      if (currentIndex < questions.length - 1) {
        setExitDirection('next');
        setTimeout(() => {
          setExitDirection(null);
          setDragOffsetX(0);
          setCurrentIndex((prev) => prev + 1);
        }, 220);
      } else if (currentIndex === questions.length - 1) {
        setExitDirection('next');
        setTimeout(() => {
          setExitDirection(null);
          setDragOffsetX(0);
          setCurrentIndex(questions.length);
        }, 220);
      } else {
        setDragOffsetX(0);
      }
    } else if (isPrev) {
      if (currentIndex > 0) {
        setExitDirection('prev');
        setTimeout(() => {
          setExitDirection(null);
          setDragOffsetX(0);
          setCurrentIndex((prev) => prev - 1);
        }, 220);
      } else {
        setDragOffsetX(0);
      }
    } else {
      setDragOffsetX(0);
    }

    startXRef.current = null;
  };

  // Dynamic CSS Transform calculation (X-axis tilt physics)
  let cardTransform = `translate3d(${dragOffsetX}px, 0, 0) rotate(${dragOffsetX * 0.05}deg)`;
  if (exitDirection === 'next') {
    cardTransform = `translate3d(${lang === 'he' ? '130%' : '-130%'}, 0, 0) rotate(${lang === 'he' ? '20deg' : '-20deg'})`;
  } else if (exitDirection === 'prev') {
    cardTransform = `translate3d(${lang === 'he' ? '-130%' : '130%'}, 0, 0) rotate(${lang === 'he' ? '-20deg' : '20deg'})`;
  }

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

      {/* Main Card Swiper Area */}
      {!isFinished && currentQ ? (
        <div className="flex-1 min-h-0 flex flex-col justify-between space-y-3 my-1 overflow-hidden">
          {/* Card Stack Wrapper */}
          <div className="relative w-full min-h-[300px] flex items-center justify-center">
            {/* Background Card Stack Layer (Next Card Preview) */}
            {nextQ && (
              <div
                className="absolute inset-0 solid-card p-5 sm:p-6 flex flex-col justify-between opacity-40 scale-95 transition-transform duration-300 pointer-events-none rounded-2xl border border-[#36343a]"
                style={{
                  transform:
                    isDragging || exitDirection
                      ? 'scale(0.98) translateY(0px)'
                      : 'scale(0.94) translateY(12px)'
                }}
              >
                <div className="flex items-center justify-between gap-2 shrink-0">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#2b292f] border border-[#504444] text-[#e8b4b8] text-[11px] font-bold uppercase tracking-wider">
                    {nextQ.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#141218] border border-[#36343a] text-slate-300 text-[11px] font-mono font-bold">
                    {nextQ.intensityLevel === 'VANILLA' && t.intensityVanilla}
                    {nextQ.intensityLevel === 'SPICY' && t.intensitySpicy}
                    {nextQ.intensityLevel === 'ADVENTUROUS' && t.intensityAdventurous}
                  </span>
                </div>

                <div className="my-auto py-3 text-center space-y-2.5">
                  <h3 className="text-lg sm:text-2xl font-bold text-white leading-snug font-headline">
                    {nextQ.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    {nextQ.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#36343a] flex items-center justify-between text-[11px] text-slate-400 shrink-0">
                  <span className="font-semibold text-[#d1c5b2]">
                    {nextQ.roleType === 'GIVER' && t.roleGiverBadge}
                    {nextQ.roleType === 'RECEIVER' && t.roleReceiverBadge}
                    {nextQ.roleType === 'SYMMETRIC' && (lang === 'he' ? 'תפקיד הדדי' : 'Symmetric / Both')}
                  </span>
                  <span className="font-mono text-slate-300 font-bold">
                    {currentIndex + 2} / {questions.length}
                  </span>
                </div>
              </div>
            )}

            {/* Active Foreground Card (Horizontal Swipe for Navigation) */}
            <div
              onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
              onTouchEnd={handleDragEnd}
              onMouseDown={(e) => handleDragStart(e.clientX)}
              onMouseMove={(e) => handleDragMove(e.clientX)}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              style={{
                transform: cardTransform,
                transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
              className="w-full solid-card p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden select-none min-h-[300px] shadow-2xl cursor-grab active:cursor-grabbing rounded-2xl border border-[#e8b4b8]/30 z-10"
            >
              {/* Card Header Badges */}
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
              <div className="my-auto py-4 text-center space-y-3">
                <h3 className="text-lg sm:text-2xl font-bold text-white leading-snug font-headline">
                  {currentQ.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  {currentQ.description}
                </p>
              </div>

              {/* Card Footer Info */}
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
          </div>

          {/* Voting Action Buttons */}
          <div className="grid grid-cols-3 gap-2 shrink-0">
            <button
              onClick={() => handleVote('NO')}
              disabled={isVoting}
              className={`py-3 px-2 rounded-xl border-2 border-rose-900 bg-[#1d1b21] text-rose-400 font-bold text-xs flex flex-col items-center justify-center gap-1 transition group shadow-lg ${currentAnswer === 'NO' ? 'ring-2 ring-rose-500' : ''}`}
            >
              <ThumbsDown className="w-5 h-5" />
              <span>{t.btnNo}</span>
            </button>
            <button
              onClick={() => handleVote('MAYBE')}
              disabled={isVoting}
              className={`py-4 px-3 rounded-2xl border-2 border-amber-900 bg-[#1d1b21] text-amber-400 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition group shadow-lg ${currentAnswer === 'MAYBE' ? 'ring-2 ring-amber-500' : ''}`}
            >
              <HelpCircle className="w-6 h-6" />
              <span>{t.btnMaybe}</span>
            </button>
            <button
              onClick={() => handleVote('YES')}
              disabled={isVoting}
              className={`py-4 px-3 rounded-2xl border-2 border-[#e8b4b8] bg-[#2b292f] text-[#e8b4b8] font-black text-xs flex flex-col items-center justify-center gap-1.5 transition group shadow-xl ${currentAnswer === 'YES' ? 'ring-2 ring-[#e8b4b8]' : ''}`}
            >
              <Heart className="w-6 h-6 fill-[#e8b4b8]" />
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
            <p className="text-xs text-[#e8b4b8] max-w-sm mx-auto mt-1 font-semibold">
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
