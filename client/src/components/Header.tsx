import React from 'react';
import { Heart, ShieldCheck, Sparkles, Flame, Bot, Share2 } from 'lucide-react';

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
    { id: 'swipe', label: 'Discovery', icon: Heart },
    { id: 'matches', label: 'Matches', icon: Sparkles },
    { id: 'dares', label: 'Challenges', icon: Flame },
    { id: 'ai', label: 'Aria AI', icon: Bot }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#141218]/90 backdrop-blur-xl border-b border-[#e8b4b8]/10 px-4 py-3">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#e8b4b8] to-[#ffd2d5] flex items-center justify-center shadow-lg shadow-[#e8b4b8]/20">
            <Heart className="w-5 h-5 text-[#48272a] fill-[#48272a]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white font-headline">
              MyKink
            </h1>
            <div className="flex items-center gap-1.5 text-[11px] text-[#d1c5b2]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Digital Sanctuary • End-to-End Encrypted</span>
            </div>
          </div>
        </div>

        {/* Pair Code & Status */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={openPairingModal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#211f25] border border-[#36343a] hover:border-[#e8b4b8]/40 text-xs font-semibold text-slate-200 transition shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-[#e8b4b8]" />
            <span>Code: {pairCode || 'Generate'}</span>
          </button>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border ${
              isPartnerConnected
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isPartnerConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isPartnerConnected ? 'Partner Connected' : 'Waiting for Partner'}</span>
          </div>
        </div>

        {/* Floating Glass Navigation */}
        <nav className="flex items-center gap-1 bg-[#211f25]/90 p-1 rounded-full border border-[#36343a]">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                  isActive
                    ? 'btn-rose shadow-md shadow-[#e8b4b8]/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#2b292f]'
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
