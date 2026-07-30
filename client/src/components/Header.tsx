import React from 'react';
import { ShieldCheck, Sparkles, Flame, Bot, Share2, Globe, LogOut, Trash2, Heart } from 'lucide-react';
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
  onSignOut: () => void;
  onResetAccount: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  pairCode,
  openPairingModal,
  isPartnerConnected,
  userAlias,
  lang,
  onToggleLang,
  onSignOut,
  onResetAccount
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
      {/* Top Header Bar (100% Solid Dark Background, Zero Transparency) */}
      <header className="sticky top-0 z-40 app-header-solid border-b border-[#36343a] px-3 py-2.5 shadow-md">
        <div className="max-w-md md:max-w-5xl mx-auto flex items-center justify-between gap-1.5 overflow-hidden">
          {/* Brand Logo Image & Title */}
          <div className="flex items-center gap-2 shrink-0">
            <img
              src="/logo.png"
              alt="MyKink Logo"
              className="w-8 h-8 rounded-xl object-cover border border-[#e8b4b8]/40 shadow-sm shrink-0"
              onError={(e) => {
                // Fallback to Heart icon if image fails to render
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold tracking-tight text-white font-headline leading-none">
                  MyKink
                </h1>
                {userAlias && (
                  <span className="px-2 py-0.5 rounded-full bg-[#2e2329] border border-[#e8b4b8]/40 text-[#e8b4b8] text-[11px] font-bold shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#e8b4b8]" />
                    <span className="truncate max-w-[110px] sm:max-w-[180px]">{userAlias}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#d1c5b2] mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{t.digitalSanctuary}</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs (rendered only when in main app tabs) */}
          {activeTab !== 'onboarding' && (
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
          )}

          {/* Controls: Language Switcher, Pair Code, Reset & Logout Buttons (ICON ONLY) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Language Switcher Toggle Button */}
            <button
              onClick={onToggleLang}
              className="p-2 rounded-full bg-[#2b292f] border border-[#36343a] hover:border-[#e8b4b8] text-slate-300 hover:text-white transition shadow-sm"
              title={lang === 'en' ? 'עברית' : 'English'}
            >
              <Globe className="w-4 h-4 text-[#e8b4b8]" />
            </button>

            {/* Pair Code Button */}
            <button
              onClick={openPairingModal}
              className="p-2 rounded-full bg-[#2b292f] border border-[#36343a] hover:border-[#e8b4b8] text-slate-300 hover:text-white transition shadow-sm"
              title={pairCode ? `${t.code}: ${pairCode}` : t.code}
            >
              <Share2 className="w-4 h-4 text-[#e8b4b8]" />
            </button>

            {/* Delete Account / Reset Onboarding Button */}
            <button
              onClick={onResetAccount}
              className="p-2 rounded-full bg-[#2b292f] border border-[#36343a] hover:border-red-500 text-slate-300 hover:text-red-400 transition shadow-sm"
              title={lang === 'he' ? 'מחק והתחל מחדש' : 'Delete Account & Start Over'}
            >
              <Trash2 className="w-4 h-4 text-slate-300 hover:text-red-400" />
            </button>

            {/* Sign Out Button */}
            <button
              onClick={onSignOut}
              className="p-2 rounded-full bg-[#2b292f] border border-[#36343a] hover:border-rose-500 text-slate-300 hover:text-rose-400 transition shadow-sm"
              title={lang === 'he' ? 'התנתקות מהחשבון' : 'Sign Out'}
            >
              <LogOut className="w-4 h-4 text-slate-300 hover:text-rose-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (rendered only when in main app tabs) */}
      {activeTab !== 'onboarding' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 app-bottom-nav-solid border-t border-[#36343a] px-2 py-2 shadow-2xl">
          <nav className="max-w-md mx-auto grid grid-cols-4 gap-1">
            {tabs.map((tabItem) => {
              const Icon = tabItem.icon;
              const isActive = activeTab === tabItem.id;
              return (
                <button
                  key={tabItem.id}
                  onClick={() => setActiveTab(tabItem.id)}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition ${
                    isActive
                      ? 'bg-[#2b292f] text-[#e8b4b8] font-[#e8b4b8] font-bold border border-[#e8b4b8]/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                  <span className="text-[10px] tracking-tight">{tabItem.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
};
