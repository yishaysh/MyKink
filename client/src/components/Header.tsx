import React from 'react';
import { Heart, ShieldCheck, Sparkles, MessageCircle, Flame, Calendar, Bot, Users, Share2 } from 'lucide-react';

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
    { id: 'swipe', label: 'העדפות שלי', icon: Heart },
    { id: 'matches', label: 'התאמות', icon: Sparkles },
    { id: 'dares', label: 'אתגרים ומשחקים', icon: Flame },
    { id: 'ai', label: 'Aria & ערב אינטימי', icon: Bot }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-rose-500/10 px-4 py-3">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/25">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">
              MyKink
            </h1>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>דיסקרטיות ופרטיות מוחלטת</span>
            </div>
          </div>
        </div>

        {/* Pair Code & Status */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={openPairingModal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 text-xs font-semibold text-slate-200 transition shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-rose-400" />
            <span>קוד: {pairCode || 'צור קוד'}</span>
          </button>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border ${
              isPartnerConnected
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isPartnerConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isPartnerConnected ? 'מחובר זוגית' : 'ממתין לחיבור'}</span>
          </div>
        </div>

        {/* Simplified Navigation */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'btn-rose text-white shadow-md shadow-rose-500/25'
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
