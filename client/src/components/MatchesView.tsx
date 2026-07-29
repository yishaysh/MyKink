import React, { useState } from 'react';
import { Sparkles, Heart, HelpCircle, Filter, Star, Flame, ShieldCheck } from 'lucide-react';
import { CatalogQuestion } from '../services/api';
import { Language, translations, translateQuestion } from '../services/i18n';

export interface SharedMatchItem {
  id: string;
  matchStatus: 'MUTUAL_YES' | 'MUTUAL_MAYBE' | 'TENTATIVE_MIXED' | 'HIDDEN';
  questionId: string;
  question?: CatalogQuestion;
  updatedAt?: string;
}

interface MatchesViewProps {
  matches: SharedMatchItem[];
  lang: Language;
}

export const MatchesView: React.FC<MatchesViewProps> = ({ matches, lang }) => {
  const t = translations[lang];
  const [filter, setFilter] = useState<'ALL' | 'YES' | 'MAYBE'>('ALL');
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredMatches = matches.filter((m) => {
    if (filter === 'YES') return m.matchStatus === 'MUTUAL_YES';
    if (filter === 'MAYBE') return m.matchStatus === 'MUTUAL_MAYBE';
    return true;
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
      {/* Header Banner */}
      <div className="solid-card p-5 text-center space-y-3">
        <div className="w-10 h-10 rounded-2xl bg-[#2b292f] border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center mx-auto shadow-md">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white font-headline">
            {t.matchesTitle}
          </h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto mt-1 leading-relaxed">
            {t.matchesSub}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex justify-center gap-2 pt-2 border-t border-[#36343a]">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs transition ${
              filter === 'ALL' ? 'filter-box-selected' : 'filter-box-unselected'
            }`}
          >
            {t.filterAll} ({matches.length})
          </button>
          <button
            onClick={() => setFilter('YES')}
            className={`px-3.5 py-1.5 rounded-full text-xs transition ${
              filter === 'YES' ? 'filter-box-selected' : 'filter-box-unselected'
            }`}
          >
            {t.filterYes} ({matches.filter((m) => m.matchStatus === 'MUTUAL_YES').length})
          </button>
          <button
            onClick={() => setFilter('MAYBE')}
            className={`px-3.5 py-1.5 rounded-full text-xs transition ${
              filter === 'MAYBE' ? 'filter-box-selected' : 'filter-box-unselected'
            }`}
          >
            {t.filterMaybe} ({matches.filter((m) => m.matchStatus === 'MUTUAL_MAYBE').length})
          </button>
        </div>
      </div>

      {/* Matches Cards List */}
      {filteredMatches.length > 0 ? (
        <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
          {filteredMatches.map((m) => {
            const rawQ = m.question;
            const q = rawQ ? translateQuestion(rawQ, lang) : null;
            const isFav = favorites.includes(m.id);
            if (!q) return null;

            return (
              <div
                key={m.id}
                className="solid-card p-5 space-y-3 card-appear hover:border-[#e8b4b8]/40 transition relative"
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#2b292f] border border-[#504444] text-[#e8b4b8] text-xs font-bold">
                      {q.category}
                    </span>
                    {m.matchStatus === 'MUTUAL_YES' ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-emerald-300" />
                        <span>{t.badgeMutualMatch}</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1">
                        <HelpCircle className="w-3 h-3 text-amber-300" />
                        <span>{t.badgeMutualMaybe}</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleFavorite(m.id)}
                    className={`p-2 rounded-full transition ${
                      isFav ? 'text-amber-400 bg-amber-950/50' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                  </button>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-bold text-white font-headline">{q.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{q.description}</p>
                </div>

                {/* Footer Details */}
                <div className="pt-3 border-t border-[#36343a] flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-[#d1c5b2] font-semibold">
                    {q.roleType === 'GIVER' && t.roleGiverBadge}
                    {q.roleType === 'RECEIVER' && t.roleReceiverBadge}
                    {q.roleType === 'SYMMETRIC' && (lang === 'he' ? 'תפקיד הדדי' : 'Symmetric / Both')}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {q.intensityLevel === 'VANILLA' && t.intensityVanilla}
                    {q.intensityLevel === 'SPICY' && t.intensitySpicy}
                    {q.intensityLevel === 'ADVENTUROUS' && t.intensityAdventurous}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="solid-card p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#2b292f] text-slate-500 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white font-headline">{t.noMatchesTitle}</h4>
          <p className="text-xs text-slate-300 max-w-sm mx-auto">
            {t.noMatchesSub}
          </p>
        </div>
      )}
    </div>
  );
};
