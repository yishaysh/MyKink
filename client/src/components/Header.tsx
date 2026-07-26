import React from 'react';
import { Heart, ShieldCheck, Sparkles, Flame, Bot, Share2, User, Globe } from 'lucide-react';
import { Language, translations } from '../services/i18n';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pairCode: string | null;
  openPairingModal: () => void;
  isPartnerConnected: boolean;
  userAlias?: string;
  lang: Language;
  onToggleLang: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  pairCode,
  openPairingModal,
  isPartnerConnected,
  userAlias,
  lang,
  onToggleLang
}) => {
  const t = translations[lang];

  const tabs = [
    { id: 'swipe', label: t.tabDiscovery, icon: Heart },
    { id: 'matches', label: t.tabMatches, icon: Sparkles },
    { id: 'dares', label: t.tabChallenges, icon: Flame },
    { id: 'ai', label: t.tabAria, icon: Bot }
  ];

  return (
    <>
      {/* Top Solid Header Bar */}
      <header className="sticky top-0 z-40 bg-[#141218] border-b border-[#36343a] px-4 py-3 shadow-md">
        <div className="max-w-md md:max-w-5xl mx-auto flex items-center justify-between gap-2">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#e8b4b8] to-[#ffd2d5] flex items-center justify-center shadow-md shadow-[#e8b4b8]/20 shrink-0">
              <Heart className="w-5 h-5 text-[#48272a] fill-[#48272a]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white font-headline leading-none">
                MyKink
              </h1>
              <div className="flex items-center gap-1 text-[10px] text-[#d1c5b2] mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{t.digitalSanctuary}</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#211f25] p-1 rounded-full border border-[#36343a]">
            {tabs.map((tabItem) => {
              const Icon = tabItem.icon;
              const isActive = activeTab === tabItem.id;
              return (
                <button
                  key={tabItem.id}
                  onClick={() => setActiveTab(tabItem.id)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                    isActive
                      ? 'btn-rose shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#2b292f]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tabItem.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controls: Language Switcher, User Badge, Pair Code Button */}
          <div className="flex items-center gap-2">
            {/* Language Switcher Toggle Button */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2b292f] border border-[#504444] hover:border-[#e8b4b8] text-xs font-bold text-[#d1c5b2] hover:text-white transition shadow-sm"
              title={lang === 'en' ? 'Switch to Hebrew (עברית)' : 'Switch to English'}
            >
              <Globe className="w-3.5 h-3.5 text-[#e8b4b8]" />
              <span>{lang === 'en' ? '🇮🇱 עברית' : '🇺🇸 English'}</span>
            </button>

            {userAlias && (
              <span className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-[#211f25] border border-[#36343a] text-xs font-semibold text-[#e8b4b8]">
                <User className="w-3.5 h-3.5" />
                <span>{userAlias}</span>
              </span>
            )}

            <button
              onClick={openPairingModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#211f25] border border-[#36343a] hover:border-[#e8b4b8] text-xs font-semibold text-slate-200 transition shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5 text-[#e8b4b8]" />
              <span className="font-mono text-[11px]">{pairCode || t.code}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Solid 100% Opaque) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1d1b21] border-t border-[#36343a] px-3 py-2 shadow-2xl">
        <nav className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {tabs.map((tabItem) => {
            const Icon = tabItem.icon;
            const isActive = activeTab === tabItem.id;
            return (
              <button
                key={tabItem.id}
                onClick={() => setActiveTab(tabItem.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition ${
                  isActive
                    ? 'bg-[#2b292f] text-[#e8b4b8] font-bold border border-[#e8b4b8]/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-[10px] tracking-tight">{tabItem.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};
