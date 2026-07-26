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
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#141218]/90 backdrop-blur-xl border-b border-[#e8b4b8]/10 px-4 py-3">
        <div className="max-w-md md:max-w-5xl mx-auto flex items-center justify-between gap-2">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#e8b4b8] to-[#ffd2d5] flex items-center justify-center shadow-lg shadow-[#e8b4b8]/20 shrink-0">
              <Heart className="w-5 h-5 text-[#48272a] fill-[#48272a]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white font-headline leading-none">
                MyKink
              </h1>
              <div className="flex items-center gap-1 text-[10px] text-[#d1c5b2] mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">Digital Sanctuary</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#211f25]/90 p-1 rounded-full border border-[#36343a]">
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

          {/* Pair Code Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={openPairingModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#211f25] border border-[#36343a] hover:border-[#e8b4b8]/40 text-xs font-semibold text-slate-200 transition shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5 text-[#e8b4b8]" />
              <span className="font-mono text-[11px]">{pairCode || 'Pair'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Fixed for Mobile Screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#141218]/95 backdrop-blur-2xl border-t border-[#e8b4b8]/15 px-3 py-2">
        <nav className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition ${
                  isActive
                    ? 'bg-[#e8b4b8]/15 text-[#e8b4b8] font-bold border border-[#e8b4b8]/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-[10px] tracking-tight">{t.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};
