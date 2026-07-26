import React, { useState } from 'react';
import { Sparkles, Star, Heart, CheckCircle2, HelpCircle, Flame, Shuffle } from 'lucide-react';
import { CatalogQuestion, SharedMatchItem } from '../services/api';

interface MatchesViewProps {
  matches: SharedMatchItem[];
  onToggleStar?: (matchId: string) => void;
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
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Mutual Match 💖
          </span>
        );
      case 'MUTUAL_MAYBE':
        return (
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Mutual Maybe 🤔
          </span>
        );
      case 'TENTATIVE_MIXED':
        return (
          <span className="px-3 py-1 rounded-full bg-[#e8b4b8]/10 text-[#e8b4b8] border border-[#e8b4b8]/30 text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Tentative Match 💡
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="glass-card p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-[#36343a]">
        <div>
          <div className="flex items-center gap-2 text-[#e8b4b8] mb-1">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-2xl font-bold text-white font-headline">Verified Mutual Matches</h2>
          </div>
          <p className="text-xs text-slate-400">
            Exclusively displaying desires where both partners selected "YES" or "MAYBE". Declined items remain unrevealed.
          </p>
        </div>

        {/* Status Filter buttons */}
        <div className="flex gap-1.5 bg-[#1d1b21] p-1 rounded-full border border-[#36343a]">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === 'ALL' ? 'btn-rose' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({matches.length})
          </button>
          <button
            onClick={() => setFilter('MUTUAL_YES')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === 'MUTUAL_YES' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mutual YES
          </button>
          <button
            onClick={() => setFilter('MUTUAL_MAYBE')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === 'MUTUAL_MAYBE' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mutual MAYBE
          </button>
        </div>
      </div>

      {/* Matches Grid */}
      {visibleMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleMatches.map((m) => {
            const q = m.question;
            return (
              <div key={m.id} className="glass-card p-6 flex flex-col justify-between border border-[#36343a] hover:border-[#e8b4b8]/40">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-0.5 rounded-full bg-[#1d1b21] text-[#d1c5b2] text-[11px] font-semibold">
                      {q?.category || 'General'}
                    </span>
                    {getStatusBadge(m.matchStatus)}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 font-headline">
                    <Heart className="w-4 h-4 text-[#e8b4b8] fill-[#e8b4b8]/20" />
                    {q?.title || 'Shared Fantasy'}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {q?.description || 'Positive mutual match discovered.'}
                  </p>

                  {q?.roleType !== 'SYMMETRIC' && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#e8b4b8]/10 text-[#e8b4b8] text-[11px] font-semibold mb-3 border border-[#e8b4b8]/20">
                      <Shuffle className="w-3 h-3" />
                      <span>Complementary Roles: Giver & Receiver</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#2b292f] flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-[#d1c5b2]">
                    <Flame className="w-3.5 h-3.5 text-[#e8b4b8]" />
                    Intensity: {q?.intensityLevel || 'SPICY'}
                  </span>

                  <button className="flex items-center gap-1 text-[#e8b4b8] hover:text-white font-semibold transition">
                    <Star className="w-4 h-4" />
                    <span>Favorite</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card p-12 text-center text-slate-400 space-y-3">
          <Sparkles className="w-12 h-12 text-[#e8b4b8]/40 mx-auto" />
          <h3 className="text-xl font-bold text-white font-headline">No Mutual Matches Yet</h3>
          <p className="text-xs max-w-md mx-auto text-slate-300">
            Complete the Discovery Quiz in the first tab. Once both partners select "YES" or "MAYBE" for an item, it will automatically appear here!
          </p>
        </div>
      )}
    </div>
  );
};
