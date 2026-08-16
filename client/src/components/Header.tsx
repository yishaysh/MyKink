import React from 'react';
import {
  Heart,
  Sparkles,
  Flame,
  Bot,
  Share2,
  Globe,
  LogOut,
  Trash2,
  Layers,
  Play,
  Shield,
  Moon,
  Clapperboard,
  Zap
} from 'lucide-react';
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

  const allTabs = [
    { id: 'swipe', label: t.tabDiscovery, icon: Heart },
    { id: 'heatmap', label: t.tabHeatmap, icon: Layers },
    { id: 'live', label: t.tabLiveMode, icon: Zap },
    { id: 'contract', label: t.tabContract, icon: Shield },
    { id: 'beacon', label: t.tabBeacon, icon: Moon },
    { id: 'roleplay', label: t.tabRoleplay, icon: Clapperboard },
    { id: 'matches', label: t.tabMatches, icon: Sparkles },
    { id: 'dares', label: t.tabChallenges, icon: Flame },
    { id: 'ai', label: t.tabAria, icon: Bot }
  ];

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 app-header-solid border-b border-[#36343a] px-3 py-2 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 overflow-hidden">
          {/* Brand Logo Image & Sexy Alias Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <img
              src="/logo.png"
              alt="MyKink Logo"
              className="w-8 h-8 rounded-xl object-cover border border-[#e8b4b8]/40 shadow-sm shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {userAlias && (
              <span className="px-2.5 py-1 rounded-full bg-[#2e2329] border border-[#e8b4b8]/40 text-[#e8b4b8] text-xs font-bold shadow-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#e8b4b8]" />
                <span className="truncate max-w-[120px] sm:max-w-[180px]">{userAlias}</span>
              </span>
            )}
          </div>

          {/* Desktop Navigation Tabs */}
          {activeTab !== 'onboarding' && (
            <nav className="hidden lg:flex items-center gap-1 bg-[#1e1b24] p-1 rounded-full border border-[#36343a] overflow-x-auto">
              {allTabs.map((tabItem) => {
                const Icon = tabItem.icon;
                const isActive = activeTab === tabItem.id;
                return (
                  <button
                    key={tabItem.id}
                    onClick={() => setActiveTab(tabItem.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-[#e8b4b8] to-[#ffd2d5] text-[#141218] shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#2b292f]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tabItem.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Controls: Language Switcher, Pair Code, Reset & Logout */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Live Mode Shortcut Button */}
            {activeTab !== 'onboarding' && (
              <button
                onClick={() => setActiveTab('live')}
                className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold transition shadow-xs ${
                  activeTab === 'live'
                    ? 'bg-[#ff4081] text-white border-[#ff4081]'
                    : 'bg-[#291622] text-[#ffd2d5] border-[#ff4081]/40 hover:border-[#ff4081]'
                }`}
                title={lang === 'he' ? 'הפעל מצב חדר שינה' : 'Launch Bedside Mode'}
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>{lang === 'he' ? 'חדר שינה 🎲' : 'Bedside 🎲'}</span>
              </button>
            )}

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

            {/* Delete Account / Reset Button */}
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

        {/* Sub-header Horizontal Pill Scrollbar for Tablets & Mobile (Top secondary bar) */}
        {activeTab !== 'onboarding' && (
          <div className="lg:hidden mt-2 pt-1.5 border-t border-[#36343a]/60 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 px-1 min-w-max pb-1">
              {allTabs.map((tabItem) => {
                const Icon = tabItem.icon;
                const isActive = activeTab === tabItem.id;
                return (
                  <button
                    key={tabItem.id}
                    onClick={() => setActiveTab(tabItem.id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-[#e8b4b8] to-[#ffd2d5] text-[#141218] shadow-sm'
                        : 'bg-[#1e1b24] text-slate-400 hover:text-slate-200 border border-[#36343a]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tabItem.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar (Core Quick Actions) */}
      {activeTab !== 'onboarding' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 app-bottom-nav-solid border-t border-[#36343a] px-2 py-1.5 shadow-2xl">
          <nav className="max-w-md mx-auto grid grid-cols-5 gap-1">
            {[
              { id: 'swipe', label: t.tabDiscovery, icon: Heart },
              { id: 'heatmap', label: lang === 'he' ? 'חושים' : 'Heatmap', icon: Layers },
              { id: 'live', label: lang === 'he' ? 'בלייב' : 'Live', icon: Zap },
              { id: 'beacon', label: lang === 'he' ? 'משדר' : 'Beacon', icon: Moon },
              { id: 'roleplay', label: lang === 'he' ? 'במאי AI' : 'Roleplay', icon: Clapperboard }
            ].map((tabItem) => {
              const Icon = tabItem.icon;
              const isActive = activeTab === tabItem.id;
              return (
                <button
                  key={tabItem.id}
                  onClick={() => setActiveTab(tabItem.id)}
                  className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition ${
                    isActive
                      ? 'bg-[#2b292f] text-[#e8b4b8] font-bold border border-[#e8b4b8]/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                  <span className="text-[9.5px] tracking-tight truncate">{tabItem.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
};
