import React, { useState } from 'react';
import { Heart, ThumbsDown, HelpCircle, Flame, Filter, RotateCcw, Lock } from 'lucide-react';
import { CatalogQuestion } from '../services/api';

interface SwipeDeckProps {
  questions: CatalogQuestion[];
  onAnswer: (questionId: string, value: 'YES' | 'MAYBE' | 'NO') => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedIntensity: string;
  setSelectedIntensity: (int: string) => void;
  onGoToMatches: () => void;
}

export const SwipeDeck: React.FC<SwipeDeckProps> = ({
  questions,
  onAnswer,
  selectedCategory,
  setSelectedCategory,
  selectedIntensity,
  setSelectedIntensity,
  onGoToMatches
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
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Category & Intensity Filters */}
      <div className="glass-card p-4 mb-6 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
          <div className="flex items-center gap-1.5 text-rose-400">
            <Filter className="w-4 h-4" />
            <span>סינון לפי קטגוריה ועוצמה:</span>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setCurrentIndex(0); }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'btn-rose text-white shadow-sm'
                  : 'btn-soft text-slate-400'
              }`}
            >
              {cat === 'ALL' ? 'הכל' : cat}
            </button>
          ))}
        </div>

        {/* Intensity Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
          {intensities.map((lvl) => (
            <button
              key={lvl}
              onClick={() => { setSelectedIntensity(lvl); setCurrentIndex(0); }}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium transition ${
                selectedIntensity === lvl
                  ? 'bg-amber-500 text-white font-bold'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl === 'ALL' ? 'כל הדרגות' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Main Preference Card Swiper */}
      {!isFinished ? (
        <div className="glass-card p-6 md:p-8 text-center relative min-h-[380px] flex flex-col justify-between card-appear">
          {/* Top Metadata */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
              <span className="px-2.5 py-1 rounded-full bg-slate-900 text-rose-300 border border-slate-800 font-semibold">
                {currentQ.category}
              </span>
              <span className="flex items-center gap-1 font-semibold text-amber-400">
                <Flame className="w-3.5 h-3.5" />
                {currentQ.intensityLevel}
              </span>
              <span className="font-mono text-slate-500 text-[11px]">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>

            {/* Asymmetric Role Tag */}
            {currentQ.roleType !== 'SYMMETRIC' && (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-4">
                <span>תפקיד: {currentQ.roleType === 'GIVER' ? 'שולט / מעניק (Giver)' : 'נשלט / מקבל (Receiver)'}</span>
              </div>
            )}

            {/* Title & Description */}
            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">
              {currentQ.title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
              {currentQ.description || 'האם היית רוצה לחקור פנטזיה זו יחד?'}
            </p>
          </div>

          {/* Double-Blind Privacy Indicator */}
          <div className="my-4 text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>תשובת "לא" מוגנת בהצפנה כפולה סמויה ולעולם לא תוצג</span>
          </div>

          {/* Voting Action Buttons */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800">
            {/* NO */}
            <button
              onClick={() => handleVote('NO')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition group"
            >
              <ThumbsDown className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">לא 🔒</span>
            </button>

            {/* MAYBE */}
            <button
              onClick={() => handleVote('MAYBE')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 transition group"
            >
              <HelpCircle className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">אולי 🤔</span>
            </button>

            {/* YES */}
            <button
              onClick={() => handleVote('YES')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition group"
            >
              <Heart className="w-5 h-5 mb-1 fill-emerald-400/20 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">כן! 💖</span>
            </button>
          </div>
        </div>
      ) : (
        /* Finished Screen */
        <div className="glass-card p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center mx-auto text-white shadow-lg shadow-rose-500/30">
            <Heart className="w-8 h-8 fill-white" />
          </div>
          <h3 className="text-xl font-bold text-white">עברת על כל השאלות בקטגוריה זו!</h3>
          <p className="text-xs text-slate-300 max-w-xs mx-auto">
            כעת תוכל לעבור לטאב **"התאמות"** כדי לראות את התשוקות והפנטזיות המשותפות שלכם.
          </p>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onGoToMatches}
              className="btn-rose flex-1 py-2.5 text-xs"
            >
              לצפייה בהתאמות
            </button>
            <button
              onClick={handleReset}
              className="btn-soft px-4 py-2.5 text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ענה שוב</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
