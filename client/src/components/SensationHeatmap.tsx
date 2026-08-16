import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, Heart, Eye, RotateCcw, Check, Info, Shield, Layers, Zap } from 'lucide-react';
import { Language, translations } from '../services/i18n';

export interface SensoryZone {
  id: string;
  nameHe: string;
  nameEn: string;
  view: 'front' | 'back';
  cx: number;
  cy: number;
  r: number;
}

export interface ZonePreference {
  sensations: string[]; // e.g. ['kisses', 'ice', 'biting']
  intensity: 'GENTLE' | 'MODERATE' | 'INTENSE';
  preferenceType: 'RECEIVE' | 'GIVE' | 'BOTH';
}

const BODY_ZONES: SensoryZone[] = [
  // Front View Zones
  { id: 'lips', nameHe: 'שפתיים ופה', nameEn: 'Lips & Mouth', view: 'front', cx: 150, cy: 68, r: 16 },
  { id: 'neck_front', nameHe: 'צוואר ועורק', nameEn: 'Throat & Neck', view: 'front', cx: 150, cy: 98, r: 18 },
  { id: 'ears', nameHe: 'אוזניים ותנוכים', nameEn: 'Ears & Lobes', view: 'front', cx: 118, cy: 68, r: 12 },
  { id: 'chest', nameHe: 'חזה ופטמות', nameEn: 'Chest & Nipples', view: 'front', cx: 150, cy: 148, r: 24 },
  { id: 'torso', nameHe: 'בטן וטבור', nameEn: 'Abdomen & Navel', view: 'front', cx: 150, cy: 205, r: 22 },
  { id: 'wrists_front', nameHe: 'פרקי ידיים', nameEn: 'Wrists & Palms', view: 'front', cx: 70, cy: 235, r: 14 },
  { id: 'pelvis', nameHe: 'אגן ואזור אינטימי', nameEn: 'Pelvis & Intimate', view: 'front', cx: 150, cy: 268, r: 24 },
  { id: 'inner_thighs', nameHe: 'פנים הירכיים', nameEn: 'Inner Thighs', view: 'front', cx: 150, cy: 330, r: 26 },
  { id: 'feet_front', nameHe: 'כפות רגליים', nameEn: 'Feet & Toes', view: 'front', cx: 150, cy: 450, r: 18 },

  // Back View Zones
  { id: 'nape', nameHe: 'עורף ובסיס הגולגולת', nameEn: 'Nape of Neck', view: 'back', cx: 150, cy: 78, r: 18 },
  { id: 'shoulders', nameHe: 'כתפיים ושכמות', nameEn: 'Shoulders & Blades', view: 'back', cx: 150, cy: 125, r: 28 },
  { id: 'lower_back', nameHe: 'שקע הגב התחתון', nameEn: 'Lower Back / Dimples', view: 'back', cx: 150, cy: 215, r: 22 },
  { id: 'buttocks', nameHe: 'ישבן וספאנקינג', nameEn: 'Glutes & Spanking Zone', view: 'back', cx: 150, cy: 275, r: 28 },
  { id: 'back_thighs', nameHe: 'ירך אחורית', nameEn: 'Back of Thighs', view: 'back', cx: 150, cy: 345, r: 24 },
  { id: 'calves', nameHe: 'שוקיים וקרסוליים', nameEn: 'Calves & Ankles', view: 'back', cx: 150, cy: 415, r: 20 }
];

const SENSORY_PALETTE = [
  { id: 'kisses', icon: '💋', nameHe: 'נשיקות מלטפות', nameEn: 'Soft Kisses', color: '#ff758c' },
  { id: 'ice', icon: '🧊', nameHe: 'קרח וטמפרטורה', nameEn: 'Ice & Temperature', color: '#00c6ff' },
  { id: 'feather', icon: '🪶', nameHe: 'מגע נוצה ודיגדוג', nameEn: 'Feather & Tickle', color: '#ffd2d5' },
  { id: 'biting', icon: '⚡', nameHe: 'נשיכות עדינות', nameEn: 'Light Nibbling', color: '#ffb199' },
  { id: 'spanking', icon: '🖐️', nameHe: 'אחיזה תקיפה / ספאנקינג', nameEn: 'Firm Grip / Spanking', color: '#ff5858' },
  { id: 'wax', icon: '🕯️', nameHe: 'שעווה חמה וטפטוף', nameEn: 'Warm Wax Drip', color: '#f7ba2c' },
  { id: 'bondage', icon: '⛓️', nameHe: 'קשירה ואיפוק', nameEn: 'Restraint & Bondage', color: '#a18cd1' },
  { id: 'oral', icon: '👅', nameHe: 'ליקוק וגירוי אוראלי', nameEn: 'Licking & Oral Tease', color: '#f857a6' }
];

interface SensationHeatmapProps {
  lang: Language;
  coupleId: string | null;
  isPartnerConnected: boolean;
}

export const SensationHeatmap: React.FC<SensationHeatmapProps> = ({
  lang,
  coupleId,
  isPartnerConnected
}) => {
  const t = translations[lang];
  const [currentView, setCurrentView] = useState<'front' | 'back'>('front');
  const [activeTabMode, setActiveTabMode] = useState<'my' | 'partner' | 'heatmap'>('my');
  const [selectedZone, setSelectedZone] = useState<SensoryZone | null>(null);

  // Stored preferences
  const [myPreferences, setMyPreferences] = useState<Record<string, ZonePreference>>(() => {
    try {
      const saved = localStorage.getItem('mykink_sensory_heatmap');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Simulated partner preferences for demonstration or sync
  const [partnerPreferences, setPartnerPreferences] = useState<Record<string, ZonePreference>>(() => {
    try {
      const saved = localStorage.getItem('mykink_partner_sensory_heatmap');
      if (saved) return JSON.parse(saved);
      // Pre-seed enticing partner preferences to create exciting instant matches!
      return {
        neck_front: { sensations: ['kisses', 'biting'], intensity: 'MODERATE', preferenceType: 'RECEIVE' },
        chest: { sensations: ['feather', 'kisses', 'ice'], intensity: 'INTENSE', preferenceType: 'RECEIVE' },
        inner_thighs: { sensations: ['kisses', 'feather', 'oral'], intensity: 'INTENSE', preferenceType: 'RECEIVE' },
        nape: { sensations: ['kisses', 'biting'], intensity: 'MODERATE', preferenceType: 'RECEIVE' },
        buttocks: { sensations: ['spanking', 'firm'], intensity: 'INTENSE', preferenceType: 'RECEIVE' },
        lower_back: { sensations: ['kisses', 'wax'], intensity: 'MODERATE', preferenceType: 'RECEIVE' }
      };
    } catch {
      return {};
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mykink_sensory_heatmap', JSON.stringify(myPreferences));
    } catch (e) {
      console.warn('Failed to save sensory preferences', e);
    }
  }, [myPreferences]);

  const handleToggleSensation = (zoneId: string, sensationId: string) => {
    setMyPreferences(prev => {
      const current = prev[zoneId] || { sensations: [], intensity: 'MODERATE', preferenceType: 'BOTH' };
      const exists = current.sensations.includes(sensationId);
      const newSensations = exists
        ? current.sensations.filter(s => s !== sensationId)
        : [...current.sensations, sensationId];

      if (newSensations.length === 0) {
        const copy = { ...prev };
        delete copy[zoneId];
        return copy;
      }

      return {
        ...prev,
        [zoneId]: {
          ...current,
          sensations: newSensations
        }
      };
    });
  };

  const handleSetIntensity = (zoneId: string, intensity: 'GENTLE' | 'MODERATE' | 'INTENSE') => {
    setMyPreferences(prev => {
      const current = prev[zoneId] || { sensations: ['kisses'], intensity: 'MODERATE', preferenceType: 'BOTH' };
      return {
        ...prev,
        [zoneId]: { ...current, intensity }
      };
    });
  };

  const handleSetPreferenceType = (zoneId: string, preferenceType: 'RECEIVE' | 'GIVE' | 'BOTH') => {
    setMyPreferences(prev => {
      const current = prev[zoneId] || { sensations: ['kisses'], intensity: 'MODERATE', preferenceType: 'BOTH' };
      return {
        ...prev,
        [zoneId]: { ...current, preferenceType }
      };
    });
  };

  // Calculate Matches in Heatmap Mode
  const mutualMatches: Array<{ zone: SensoryZone; sharedSensations: string[] }> = [];
  BODY_ZONES.forEach(zone => {
    const myPref = myPreferences[zone.id];
    const partnerPref = partnerPreferences[zone.id];
    if (myPref && partnerPref) {
      const shared = myPref.sensations.filter(s => partnerPref.sensations.includes(s));
      if (shared.length > 0) {
        mutualMatches.push({ zone, sharedSensations: shared });
      }
    }
  });

  const getZoneHeatColor = (zoneId: string) => {
    if (activeTabMode === 'my') {
      const pref = myPreferences[zoneId];
      if (!pref) return 'rgba(232, 180, 184, 0.15)';
      const count = pref.sensations.length;
      if (count >= 3) return '#ff4081'; // High Hot
      if (count === 2) return '#e8b4b8'; // Medium
      return '#ffd2d5'; // Light
    }

    if (activeTabMode === 'partner') {
      const pref = partnerPreferences[zoneId];
      if (!pref) return 'rgba(244, 231, 211, 0.15)';
      return '#f4e7d3';
    }

    // Heatmap Combined Mode
    const isMatch = mutualMatches.some(m => m.zone.id === zoneId);
    if (isMatch) return 'url(#fireGradient)';
    return 'rgba(255, 255, 255, 0.08)';
  };

  const filteredZones = BODY_ZONES.filter(z => z.view === currentView);

  return (
    <div className="max-w-2xl mx-auto space-y-4 px-2 pb-12 animate-fadeIn">
      {/* Header & Intro */}
      <div className="bg-gradient-to-r from-[#221b28] via-[#1a1722] to-[#221b28] border border-[#e8b4b8]/30 rounded-2xl p-4 shadow-xl text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#e8b4b8]/10 rounded-full blur-xl pointer-events-none" />
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8b4b8]/15 border border-[#e8b4b8]/30 text-[#ffd2d5] text-xs font-bold mb-2 shadow-xs">
          <Flame className="w-3.5 h-3.5 text-[#e8b4b8]" />
          <span>{lang === 'he' ? 'מיפוי חושים ותשוקה אינטראקטיבי' : 'Sensory & Pleasure Heatmap'}</span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-white tracking-wide">
          {lang === 'he' ? 'מפת הגוף והתשוקה שלכם' : 'Your Interactive Touch Canvas'}
        </h2>
        <p className="text-xs text-[#d1c5b2] max-w-md mx-auto mt-1">
          {lang === 'he'
            ? 'געו באזורי הגוף כדי לסמן את סוגי המגע, הטמפרטורה והעוצמה שאתם כמהים לחוות — וגלו נקודות התאמה מושלמות.'
            : 'Touch body zones to map desired sensations, temperature, and intensity — unveiling glowing mutual touch hotspots.'}
        </p>

        {/* View Mode Toggle: My Map / Partner Map / Combined Heatmap */}
        <div className="flex items-center justify-center gap-1.5 mt-4 p-1 bg-[#131018] rounded-xl border border-[#36343a]">
          <button
            onClick={() => { setActiveTabMode('my'); setSelectedZone(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTabMode === 'my'
                ? 'bg-[#e8b4b8] text-[#141218] shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>{lang === 'he' ? 'המיפוי שלי' : 'My Canvas'}</span>
          </button>

          <button
            onClick={() => { setActiveTabMode('partner'); setSelectedZone(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTabMode === 'partner'
                ? 'bg-[#f4e7d3] text-[#141218] shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{lang === 'he' ? 'מיפוי בן/בת הזוג' : "Partner's"}</span>
          </button>

          <button
            onClick={() => { setActiveTabMode('heatmap'); setSelectedZone(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTabMode === 'heatmap'
                ? 'bg-gradient-to-r from-[#ff4081] to-[#7d5c7e] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'he' ? '🔥 התאמת תשוקה' : '🔥 Mutual Matches'}</span>
            {mutualMatches.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-[#141218] font-black text-[10px] flex items-center justify-center">
                {mutualMatches.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Body Canvas + Sidebar Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        {/* Interactive Body Canvas Silhouette */}
        <div className="md:col-span-6 bg-[#16131c] border border-[#e8b4b8]/20 rounded-2xl p-4 flex flex-col items-center shadow-lg relative">
          {/* Front / Back Toggle Buttons */}
          <div className="w-full flex justify-between items-center mb-2 px-2">
            <span className="text-xs font-semibold text-[#ffd2d5] flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#e8b4b8]" />
              {currentView === 'front' ? (lang === 'he' ? 'מבט מקדימה (חזית)' : 'Front View') : (lang === 'he' ? 'מבט מאחור (גב)' : 'Back View')}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentView('front')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${
                  currentView === 'front' ? 'bg-[#e8b4b8] text-[#141218]' : 'bg-[#211f25] text-slate-400'
                }`}
              >
                {lang === 'he' ? 'חזית' : 'Front'}
              </button>
              <button
                onClick={() => setCurrentView('back')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${
                  currentView === 'back' ? 'bg-[#e8b4b8] text-[#141218]' : 'bg-[#211f25] text-slate-400'
                }`}
              >
                {lang === 'he' ? 'גב' : 'Back'}
              </button>
            </div>
          </div>

          {/* SVG Body Silhouette */}
          <div className="relative w-full max-w-[280px] h-[460px] bg-gradient-to-b from-[#1c1824] to-[#121017] rounded-xl border border-[#36343a] flex items-center justify-center overflow-hidden">
            <svg
              viewBox="0 0 300 500"
              className="w-full h-full select-none"
              style={{ filter: 'drop-shadow(0 0 10px rgba(232, 180, 184, 0.1))' }}
            >
              <defs>
                <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2c2736" />
                  <stop offset="50%" stopColor="#211d2b" />
                  <stop offset="100%" stopColor="#17141f" />
                </linearGradient>

                <linearGradient id="fireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff4081" />
                  <stop offset="50%" stopColor="#ff9100" />
                  <stop offset="100%" stopColor="#ff1744" />
                </linearGradient>

                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Stylized Body Silhouette Path */}
              {currentView === 'front' ? (
                <path
                  d="M150,35 C162,35 172,45 172,62 C172,78 165,88 159,94 C175,98 198,108 202,130 C206,155 190,200 178,245 C170,250 166,270 174,310 C182,350 180,410 170,470 C162,472 155,470 152,460 C150,430 148,340 146,310 C144,340 142,430 140,460 C137,470 130,472 122,470 C112,410 110,350 118,310 C126,270 122,250 114,245 C102,200 86,155 90,130 C94,108 117,98 133,94 C127,88 120,78 120,62 C120,45 130,35 142,35 Z"
                  fill="url(#bodyGradient)"
                  stroke="rgba(232, 180, 184, 0.4)"
                  strokeWidth="2"
                />
              ) : (
                <path
                  d="M150,35 C162,35 172,45 172,62 C172,78 165,88 159,94 C178,98 202,108 205,130 C208,160 192,210 180,250 C175,258 178,285 182,320 C186,360 182,415 170,470 C162,472 155,470 152,460 C150,430 148,340 146,310 C144,340 142,430 140,460 C137,470 130,472 122,470 C110,415 106,360 110,320 C114,285 117,258 112,250 C100,210 84,160 87,130 C90,108 114,98 133,94 C127,88 120,78 120,62 C120,45 130,35 142,35 Z"
                  fill="url(#bodyGradient)"
                  stroke="rgba(232, 180, 184, 0.4)"
                  strokeWidth="2"
                />
              )}

              {/* Anatomical Contour Lines */}
              <path d="M138,150 Q150,165 162,150" fill="none" stroke="rgba(232, 180, 184, 0.2)" strokeWidth="1.5" />
              <path d="M142,205 Q150,212 158,205" fill="none" stroke="rgba(232, 180, 184, 0.2)" strokeWidth="1.5" />
              <circle cx="150" cy="205" r="2.5" fill="rgba(232, 180, 184, 0.4)" />

              {/* Interactive Zone Circles */}
              {filteredZones.map(zone => {
                const isSelected = selectedZone?.id === zone.id;
                const heatColor = getZoneHeatColor(zone.id);
                const pref = activeTabMode === 'my' ? myPreferences[zone.id] : partnerPreferences[zone.id];
                const hasSensations = pref && pref.sensations.length > 0;
                const isMutual = mutualMatches.some(m => m.zone.id === zone.id);

                return (
                  <g
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className="cursor-pointer transition-all duration-300 group"
                  >
                    {/* Pulsing Aura if mutual match */}
                    {activeTabMode === 'heatmap' && isMutual && (
                      <circle
                        cx={zone.cx}
                        cy={zone.cy}
                        r={zone.r + 8}
                        fill="none"
                        stroke="#ff4081"
                        strokeWidth="2"
                        className="animate-ping opacity-75"
                      />
                    )}

                    {/* Zone Target Disc */}
                    <circle
                      cx={zone.cx}
                      cy={zone.cy}
                      r={zone.r}
                      fill={heatColor}
                      stroke={isSelected ? '#ffffff' : (hasSensations ? '#ffd2d5' : 'rgba(232, 180, 184, 0.4)')}
                      strokeWidth={isSelected ? 3 : (hasSensations ? 2 : 1)}
                      filter={hasSensations || isSelected ? 'url(#glowEffect)' : undefined}
                      className="transition-transform group-hover:scale-110"
                    />

                    {/* Zone Icon or Pulse Pin */}
                    {hasSensations ? (
                      <text
                        x={zone.cx}
                        y={zone.cy + 4}
                        textAnchor="middle"
                        fontSize={zone.r > 20 ? "14" : "11"}
                        className="pointer-events-none select-none"
                      >
                        {isMutual ? '🔥' : SENSORY_PALETTE.find(p => p.id === pref.sensations[0])?.icon || '💋'}
                      </text>
                    ) : (
                      <circle
                        cx={zone.cx}
                        cy={zone.cy}
                        r="3"
                        fill="#ffd2d5"
                        className="pointer-events-none opacity-60"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-[#e8b4b8]" />
            {lang === 'he' ? 'לחצו על כל נקודת מגע כדי להגדיר או לערוך תשוקות' : 'Tap any hotspot to configure sensations'}
          </p>
        </div>

        {/* Sidebar Controls & Sensation Selector */}
        <div className="md:col-span-6 space-y-3">
          {selectedZone ? (
            <div className="bg-[#1a1722] border border-[#e8b4b8]/30 rounded-2xl p-4 shadow-xl animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#36343a] pb-2.5 mb-3">
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                    <span>{lang === 'he' ? selectedZone.nameHe : selectedZone.nameEn}</span>
                  </h3>
                  <span className="text-[11px] text-[#e8b4b8]">
                    {selectedZone.view === 'front' ? (lang === 'he' ? 'אזור חזית' : 'Front Area') : (lang === 'he' ? 'אזור גב' : 'Back Area')}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedZone(null)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-[#211f25] rounded-lg"
                >
                  ✕
                </button>
              </div>

              {/* Sensation Selector Tiles */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#f4e7d3] block">
                  {lang === 'he' ? 'בחר/י את סוגי הגירוי האהובים באזור זה:' : 'Select preferred sensations for this zone:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SENSORY_PALETTE.map(item => {
                    const currentPref = myPreferences[selectedZone.id];
                    const isSelected = currentPref?.sensations.includes(item.id);

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleToggleSensation(selectedZone.id, item.id)}
                        className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium border text-right transition ${
                          isSelected
                            ? 'bg-[#2a2130] border-[#e8b4b8] text-white shadow-xs'
                            : 'bg-[#141218] border-[#36343a] text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span className="truncate">{lang === 'he' ? item.nameHe : item.nameEn}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#e8b4b8] mr-auto shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Intensity Level */}
              <div className="mt-4 pt-3 border-t border-[#36343a]/60">
                <label className="text-xs font-semibold text-[#f4e7d3] block mb-1.5">
                  {lang === 'he' ? 'עוצמת המגע המבוקשת:' : 'Desired Intensity:'}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['GENTLE', 'MODERATE', 'INTENSE'] as const).map(lvl => {
                    const currentPref = myPreferences[selectedZone.id];
                    const isCurrent = (currentPref?.intensity || 'MODERATE') === lvl;
                    const labels = {
                      GENTLE: lang === 'he' ? 'עדין ומלטף' : 'Gentle',
                      MODERATE: lang === 'he' ? 'בינוני ונוכח' : 'Moderate',
                      INTENSE: lang === 'he' ? 'חזק ותשוקתי' : 'Intense'
                    };
                    return (
                      <button
                        key={lvl}
                        onClick={() => handleSetIntensity(selectedZone.id, lvl)}
                        className={`py-1.5 rounded-lg text-xs font-semibold transition ${
                          isCurrent
                            ? 'bg-[#e8b4b8] text-[#141218] shadow-xs'
                            : 'bg-[#141218] border border-[#36343a] text-slate-400 hover:text-white'
                        }`}
                      >
                        {labels[lvl]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Direction: Give / Receive / Both */}
              <div className="mt-3">
                <label className="text-xs font-semibold text-[#f4e7d3] block mb-1.5">
                  {lang === 'he' ? 'העדפת תפקיד באזור זה:' : 'Role Preference:'}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['RECEIVE', 'GIVE', 'BOTH'] as const).map(type => {
                    const currentPref = myPreferences[selectedZone.id];
                    const isCurrent = (currentPref?.preferenceType || 'BOTH') === type;
                    const labels = {
                      RECEIVE: lang === 'he' ? 'לקבל' : 'Receive',
                      GIVE: lang === 'he' ? 'להעניק' : 'Give',
                      BOTH: lang === 'he' ? 'שניהם' : 'Both'
                    };
                    return (
                      <button
                        key={type}
                        onClick={() => handleSetPreferenceType(selectedZone.id, type)}
                        className={`py-1.5 rounded-lg text-xs font-semibold transition ${
                          isCurrent
                            ? 'bg-[#ffd2d5] text-[#141218]'
                            : 'bg-[#141218] border border-[#36343a] text-slate-400 hover:text-white'
                        }`}
                      >
                        {labels[type]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Mutual Matches / Summary Card */
            <div className="bg-[#1a1722] border border-[#e8b4b8]/20 rounded-2xl p-4 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-[#36343a] pb-2">
                <Sparkles className="w-4 h-4 text-[#e8b4b8]" />
                <span>{lang === 'he' ? 'נקודות התאמה שלכם (Touch Matches)' : 'Mutual Touch Matches'}</span>
              </div>

              {mutualMatches.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-[#d1c5b2]">
                    {lang === 'he'
                      ? `נמצאו ${mutualMatches.length} אזורים עם התאמת גירוי מושלמת בין שניכם:`
                      : `Found ${mutualMatches.length} body zones with matching desires:`}
                  </p>
                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                    {mutualMatches.map(match => (
                      <div
                        key={match.zone.id}
                        onClick={() => {
                          setCurrentView(match.zone.view);
                          setSelectedZone(match.zone);
                        }}
                        className="flex items-center justify-between p-2 rounded-xl bg-[#211d2b] border border-[#e8b4b8]/25 hover:border-[#e8b4b8] cursor-pointer transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">🔥</span>
                          <div>
                            <div className="text-xs font-bold text-white">
                              {lang === 'he' ? match.zone.nameHe : match.zone.nameEn}
                            </div>
                            <div className="text-[10px] text-[#ffd2d5]">
                              {match.sharedSensations.map(s => SENSORY_PALETTE.find(p => p.id === s)?.nameHe || s).join(', ')}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] bg-[#e8b4b8]/20 text-[#ffd2d5] px-2 py-0.5 rounded-full font-bold">
                          {lang === 'he' ? 'התאמה!' : 'Match!'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Heart className="w-8 h-8 text-[#e8b4b8]/40 mx-auto mb-2" />
                  <p className="text-xs text-slate-300 font-medium">
                    {lang === 'he'
                      ? 'לחצו על אזורי הגוף השונים בסילואט כדי להתחיל למפות את התשוקות שלכם'
                      : 'Tap hotspots on the body canvas to start mapping your sensory desires'}
                  </p>
                </div>
              )}

              {/* Reset Map Button */}
              <div className="pt-2 border-t border-[#36343a] flex justify-between items-center text-[11px] text-slate-400">
                <span>{Object.keys(myPreferences).length} {lang === 'he' ? 'אזורים מופו על ידך' : 'zones mapped by you'}</span>
                <button
                  onClick={() => {
                    if (confirm(lang === 'he' ? 'האם לאפס את מפת החושים שלך?' : 'Reset your sensory map?')) {
                      setMyPreferences({});
                      setSelectedZone(null);
                    }
                  }}
                  className="flex items-center gap-1 text-red-400 hover:text-red-300 transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{lang === 'he' ? 'איפוס מפה' : 'Reset'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
