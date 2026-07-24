import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, HelpCircle, Flame, Filter, RotateCcw, Lock } from 'lucide-react';

export interface CatalogQuestion {
  id: string;
  title: string;
  description: string | null;
  category: string;
  intensityLevel: string;
  roleType: string;
  linkedQuestion?: CatalogQuestion | null;
}

interface SwipeDeckProps {
  questions: CatalogQuestion[];
  onAnswer: (questionId: string, value: 'YES' | 'MAYBE' | 'NO') => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedIntensity: string;
  setSelectedIntensity: (int: string) => void;
}

export const SwipeDeck: React.FC<SwipeDeckProps> = ({
  questions,
  onAnswer,
  selectedCategory,
  setSelectedCategory,
  selectedIntensity,
  setSelectedIntensity
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = ['ALL', 'Sensual', 'BDSM', 'Roleplay', 'Toys', 'ENM'];
  const intensities = ['ALL', 'VANILLA', 'SPICY', 'ADVENTUROUS'];

  const currentQ = questions[currentIndex];
  const isFinished = currentIndex >= questions.length || !currentQ;

  const handleVote = (val: 'YES' | 'MAYBE' | 'NO') => {
    if (currentQ) {
      onAnswer(currentQ.id, val);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Category & Intensity Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-3">
          <Filter className="w-4 h-4 text-pink-400" />
          <span>סינון קטגוריות ורמות עוצמה:</span>
        </div>

        <div className="space-y-2.5">
          {/* Categories Pill List */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setCurrentIndex(0); }}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'הכל' : cat}
              </button>
            ))}
          </div>

          {/* Intensity Pill List */}
          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-800">
            {intensities.map((lvl) => (
              <button
                key={lvl}
                onClick={() => { setSelectedIntensity(lvl); setCurrentIndex(0); }}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium transition ${
                  selectedIntensity === lvl
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:text-slate-300'
                }`}
              >
                {lvl === 'ALL' ? 'כל הדרגות' : lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Swiper Card */}
      {!isFinished ? (
        <div className="glass-card p-6 md:p-8 text-center relative min-h-[380px] flex flex-col justify-between swipe-card-enter border border-slate-700/80">
          {/* Card Top Info */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
              <span className="px-2.5 py-1 rounded-full bg-slate-800/90 text-pink-300 border border-slate-700 font-semibold">
                {currentQ.category}
              </span>
              <span className="flex items-center gap-1 font-semibold text-purple-400">
                <Flame className="w-3.5 h-3.5" />
                {currentQ.intensityLevel}
              </span>
              <span className="font-mono text-slate-500">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>

            {/* Asymmetric Role Badge */}
            {currentQ.roleType !== 'SYMMETRIC' && (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-4">
                <span>תפקיד אסימטרי: {currentQ.roleType === 'GIVER' ? 'מעניק / שולט (Giver)' : 'מקבל / נשלט (Receiver)'}</span>
              </div>
            )}

            {/* Question Title & Description */}
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3 tracking-tight">
              {currentQ.title}
            </h3>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-md mx-auto">
              {currentQ.description || 'האם היית רוצה לחקור פנטזיה זו יחד?'}
            </p>
          </div>

          {/* Privacy Footnote */}
          <div className="my-4 text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-pink-400" />
            <span>תשובת "לא" נשמרת חסויה לחלוטין ולעולם לא תוצג לבן/בת הזוג</span>
          </div>

          {/* Action Buttons: YES / MAYBE / NO */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800">
            {/* NO Button */}
            <button
              onClick={() => handleVote('NO')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition group"
            >
              <ThumbsDown className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">לא</span>
            </button>

            {/* MAYBE Button */}
            <button
              onClick={() => handleVote('MAYBE')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition group"
            >
              <HelpCircle className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">אולי</span>
            </button>

            {/* YES Button */}
            <button
              onClick={() => handleVote('YES')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition group"
            >
              <ThumbsUp className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">כן!</span>
            </button>
          </div>
        </div>
      ) : (
        /* Finished State */
        <div className="glass-card p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-4 text-white shadow-lg shadow-pink-500/30">
            <Flame className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">עברת על כל השאלות בקטגוריה זו!</h3>
          <p className="text-xs text-slate-400 mb-6 max-w-sm">
            כעת תוכל לעבור לטאב **"התאמות זוגיות"** כדי לראות באילו פנטזיות שניכם עניתם "כן" או "אולי".
          </p>
          <button
            onClick={handleReset}
            className="btn-neon px-6 py-2.5 text-xs flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ענה שוב מתחילה</span>
          </button>
        </div>
      )}
    </div>
  );
};
