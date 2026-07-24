import React, { useState } from 'react';
import { Sparkles, Star, Heart, CheckCircle2, HelpCircle, Flame, Shuffle } from 'lucide-react';
import { CatalogQuestion } from './SwipeDeck';

export interface SharedMatchItem {
  id: string;
  coupleId: string;
  questionId: string;
  matchStatus: 'MUTUAL_YES' | 'MUTUAL_MAYBE' | 'TENTATIVE_MIXED' | 'HIDDEN';
  isStarred: boolean;
  question?: CatalogQuestion;
}

interface MatchesViewProps {
  matches: SharedMatchItem[];
  onToggleStar?: (matchId: string) => void;
  onSelectForScenario?: (matchTitle: string) => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({ matches }) => {
  const [filter, setFilter] = useState<'ALL' | 'MUTUAL_YES' | 'MUTUAL_MAYBE'>('ALL');

  const visibleMatches = matches.filter((m) => {
    if (m.matchStatus === 'HIDDEN') return false;
    if (filter === 'MUTUAL_YES') return m.matchStatus === 'MUTUAL_YES';
    if (filter === 'MUTUAL_MAYBE') return m.matchStatus === 'MUTUAL_MAYBE' || m.matchStatus === 'TENTATIVE_MIXED';
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'MUTUAL_YES':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> התאמה מלאה (Mutual Match)
          </span>
        );
      case 'MUTUAL_MAYBE':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> התאמה מותנית (Mutual Maybe)
          </span>
        );
      case 'TENTATIVE_MIXED':
        return (
          <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> התאמה חלקית (Tentative)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="glass-card p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-700/80">
        <div>
          <div className="flex items-center gap-2 text-pink-400 mb-1">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-xl font-bold text-white">ההתאמות הזוגיות המשותפות שלכם</h2>
          </div>
          <p className="text-xs text-slate-400">
            כאן מוצגות רק הפעילויות ששניכם עניתם עליהן "כן" או "אולי". תשובות "לא" אינן מופיעות כלל.
          </p>
        </div>

        {/* Status Filter buttons */}
        <div className="flex gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'ALL' ? 'bg-pink-500 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            הכל ({matches.length})
          </button>
          <button
            onClick={() => setFilter('MUTUAL_YES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'MUTUAL_YES' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            התאמה מלאה
          </button>
          <button
            onClick={() => setFilter('MUTUAL_MAYBE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'MUTUAL_MAYBE' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            התאמה מותנית
          </button>
        </div>
      </div>

      {/* Matches Grid */}
      {visibleMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleMatches.map((m) => {
            const q = m.question;
            return (
              <div key={m.id} className="glass-card p-5 flex flex-col justify-between border border-slate-700/70 hover:border-pink-500/40">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-semibold">
                      {q?.category || 'General'}
                    </span>
                    {getStatusBadge(m.matchStatus)}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-400 fill-pink-400/20" />
                    {q?.title || 'פנטזיה משותפת'}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {q?.description || 'נמצאה התאמה חיובית בין בני הזוג.'}
                  </p>

                  {q?.roleType !== 'SYMMETRIC' && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 text-[11px] font-semibold mb-3 border border-purple-500/20">
                      <Shuffle className="w-3 h-3" />
                      <span>תפקידים משלימים: Giver & Receiver</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-purple-400" />
                    דרגת עוצמה: {q?.intensityLevel || 'SPICY'}
                  </span>

                  <button className="flex items-center gap-1 text-pink-400 hover:text-pink-300 font-semibold transition">
                    <Star className="w-4 h-4" />
                    <span>שמור למועדפים</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card p-12 text-center text-slate-400">
          <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">עדיין אין התאמות מוצגות</h3>
          <p className="text-xs max-w-md mx-auto">
            כדי ליצור התאמות, ענו שניכם על שאלות בטאב **"החלקת קלפים"**. ברגע ששניכם תענו "כן" או "אולי", ההתאמה תופיע כאן מיידית!
          </p>
        </div>
      )}
    </div>
  );
};
