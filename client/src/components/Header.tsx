import React from 'react';
import { Heart, ShieldCheck, Sparkles, MessageCircle, Flame, Calendar, Bot, Users } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pairCode: string | null;
  openPairingModal: () => void;
  isPartnerConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  pairCode,
  openPairingModal,
  isPartnerConnected
}) => {
  const tabs = [
    { id: 'swipe', label: 'החלקת קלפים', icon: Heart },
    { id: 'matches', label: 'התאמות זוגיות', icon: Sparkles },
    { id: 'dares', label: 'אתגרים ומשחקים', icon: Flame },
    { id: 'intimacy', label: 'יומן אינטימי', icon: Calendar },
    { id: 'ai', label: 'מחולל AI & Aria', icon: Bot },
    { id: 'chat', label: 'צ\'אט מוצפן', icon: MessageCircle }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Security Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              MyKink NEXUS
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Knowledge & Client E2EE</span>
            </div>
          </div>
        </div>

        {/* Pair Code & Connection Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={openPairingModal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 hover:border-pink-500/50 text-xs font-semibold text-slate-200 transition-all shadow-sm"
          >
            <Users className="w-4 h-4 text-pink-400" />
            <span>קוד צימוד: {pairCode || 'צור קוד'}</span>
          </button>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              isPartnerConnected
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isPartnerConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isPartnerConnected ? 'בן/בת זוג מחובר/ת' : 'ממתין לבן/בת הזוג'}</span>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 overflow-x-auto max-w-full">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
