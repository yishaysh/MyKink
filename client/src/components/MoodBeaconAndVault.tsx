import React, { useState, useEffect, useRef } from 'react';
import { Flame, Fingerprint, Lock, Unlock, Sparkles, Heart, Moon, ShieldCheck, Check, Zap, Eye, RotateCcw } from 'lucide-react';
import { Language, translations } from '../services/i18n';

interface MoodBeaconAndVaultProps {
  lang: Language;
  userAlias?: string;
  isPartnerConnected: boolean;
}

type MoodId = 'WILD' | 'ROMANTIC' | 'PAMPER' | 'KINKY' | 'CUDDLE';

interface MoodOption {
  id: MoodId;
  icon: string;
  titleHe: string;
  titleEn: string;
  descHe: string;
  descEn: string;
  color: string;
}

const MOODS: MoodOption[] = [
  {
    id: 'WILD',
    icon: '😈',
    titleHe: 'פראי ודומיננטי',
    titleEn: 'Wild & Dominant',
    descHe: 'תשוקה בוערת, לקיחת פיקוד ומשחקי כוח',
    descEn: 'High passion, taking charge & power exchange',
    color: '#ff4081'
  },
  {
    id: 'ROMANTIC',
    icon: '🕯️',
    titleHe: 'רומנטי ואיטי',
    titleEn: 'Slow & Romantic',
    descHe: 'נשיקות ממושכות, מבטים עמוקים ורוך',
    descEn: 'Prolonged kissing, deep eye contact & tenderness',
    color: '#f4e7d3'
  },
  {
    id: 'PAMPER',
    icon: '💆',
    titleHe: 'זקוק/ה לפינוק ומסאז\'',
    titleEn: 'Pamper & Massage',
    descHe: 'יום עמוס, מתמסר/ת למגע מרגיע ומפנק',
    descEn: 'Tough day, craving soothing sensual touch',
    color: '#00c6ff'
  },
  {
    id: 'KINKY',
    icon: '⛓️',
    titleHe: 'קינקי והרפתקני',
    titleEn: 'Kinky & Adventurous',
    descHe: 'חשק לפתוח פנטזיה חדשה או להשתמש בצעצוע',
    descEn: 'Eager to unlock a new fantasy or toy',
    color: '#a18cd1'
  },
  {
    id: 'CUDDLE',
    icon: '💤',
    titleHe: 'חיבוק ומנוחה',
    titleEn: 'Cuddle & Recharge',
    descHe: 'עייפות, חיבוק חם במיטה ללא לחץ',
    descEn: 'Low energy, warm snuggles without pressure',
    color: '#94a3b8'
  }
];

const SECRET_VAULT_FANTASIES = [
  {
    titleHe: 'ליל כניעה מלאה בעיניים מכוסות וקשירת משי',
    titleEn: 'Total Sensory Deprivation & Silk Restraints Night',
    descHe: 'בן/בת הזוג מובילים את כל הערב כשהצד השני אינו יודע מה יקרה ברגע הבא.',
    descEn: 'One partner orchestrates the entire evening in complete mystery.',
    level: 'EXTREME'
  },
  {
    titleHe: 'משחק שליטה ואורגזמות מודרכות (Orgasm Control & Edging)',
    titleEn: 'Guided Orgasm Control & Edging Surrender',
    descHe: 'שלושה סבבי טיזינג ממושכים עד לשיא המשותף רק באישור מפורש.',
    descEn: 'Three prolonged edging rounds with release only granted upon command.',
    level: 'SPICY'
  },
  {
    titleHe: 'תרחיש זרים בבר יוקרתי של מלון (Hotel Bar Strangers)',
    titleEn: 'Hotel Bar Strangers Roleplay Encounter',
    descHe: 'הגעה בנפרד, שיחה עם מבטים חודרים וסיום בחדר השינה ללא שמות אמיתיים.',
    descEn: 'Arrive separately, seduce each other under aliases, retire to bed.',
    level: 'ADVENTUROUS'
  }
];

export const MoodBeaconAndVault: React.FC<MoodBeaconAndVaultProps> = ({
  lang,
  userAlias,
  isPartnerConnected
}) => {
  const t = translations[lang];

  // Daily Mood State
  const [myMood, setMyMood] = useState<MoodId | null>(() => {
    try {
      return (localStorage.getItem('mykink_my_mood') as MoodId) || null;
    } catch {
      return null;
    }
  });

  const [partnerMood, setPartnerMood] = useState<MoodId | null>(() => {
    try {
      return (localStorage.getItem('mykink_partner_mood') as MoodId) || 'WILD';
    } catch {
      return 'WILD';
    }
  });

  // Dual Fingerprint Holding State
  const [leftHolding, setLeftHolding] = useState(false);
  const [rightHolding, setRightHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [selectedVaultIndex, setSelectedVaultIndex] = useState(0);

  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSelectMood = (moodId: MoodId) => {
    setMyMood(moodId);
    try {
      localStorage.setItem('mykink_my_mood', moodId);
    } catch {}
  };

  // Check chemistry match
  const isMatch = myMood && partnerMood && (
    myMood === partnerMood ||
    (myMood === 'WILD' && partnerMood === 'PAMPER') ||
    (myMood === 'PAMPER' && partnerMood === 'WILD') ||
    (myMood === 'KINKY' && partnerMood === 'WILD') ||
    (myMood === 'ROMANTIC' && partnerMood === 'PAMPER')
  );

  // Biometric hold progress logic (simulates dual finger hold or dual partner interaction)
  useEffect(() => {
    if (leftHolding && rightHolding && !isVaultUnlocked) {
      holdIntervalRef.current = setInterval(() => {
        setHoldProgress(prev => {
          if (prev >= 100) {
            clearInterval(holdIntervalRef.current!);
            setIsVaultUnlocked(true);
            // Strong unlock vibration
            if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
              navigator.vibrate([100, 50, 100, 50, 300]);
            }
            return 100;
          }
          return prev + 5;
        });
      }, 50);
    } else {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      if (!isVaultUnlocked) {
        setHoldProgress(0);
      }
    }
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, [leftHolding, rightHolding, isVaultUnlocked]);

  const activeFantasy = SECRET_VAULT_FANTASIES[selectedVaultIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-5 px-2 pb-14 animate-fadeIn">
      {/* SECTION 1: TONIGHT'S MOOD BEACON */}
      <div className="bg-gradient-to-b from-[#201927] to-[#14111a] border border-[#e8b4b8]/30 rounded-2xl p-4 shadow-xl text-center relative overflow-hidden space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff4081]/15 border border-[#ff4081]/30 text-[#ffd2d5] text-xs font-bold shadow-xs">
          <Moon className="w-3.5 h-3.5 text-[#ff4081]" />
          <span>{lang === 'he' ? 'משדר התשוקה הלילי (Zero Rejection)' : "Tonight's Mood Beacon"}</span>
        </div>

        <h2 className="text-xl md:text-2xl font-black text-white">
          {lang === 'he' ? 'מה הוייב שלכם להערב?' : "What's Your Vibe Tonight?"}
        </h2>
        <p className="text-xs text-[#d1c5b2] max-w-md mx-auto">
          {lang === 'he'
            ? 'סמנו בדיסקרטיות את מצב הרוח שלכם. התראת כימיה תישלח רק אם יש הלימה מושלמת בין שניכם!'
            : 'Silently broadcast your intimate mood. A chemistry match is revealed only when both of you align!'}
        </p>

        {/* Mood Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-right pt-2">
          {MOODS.map(m => {
            const isSelected = myMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleSelectMood(m.id)}
                className={`p-3 rounded-2xl border transition flex items-center gap-3 relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#291f30] border-[#e8b4b8] shadow-md ring-1 ring-[#e8b4b8]'
                    : 'bg-[#16131c] border-[#36343a] hover:border-slate-500'
                }`}
              >
                <span className="text-2xl p-2 rounded-xl bg-[#1f1a26] border border-[#36343a] shrink-0">
                  {m.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-xs flex items-center justify-between">
                    <span>{lang === 'he' ? m.titleHe : m.titleEn}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#e8b4b8]" />}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {lang === 'he' ? m.descHe : m.descEn}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Chemistry Result Box */}
        {myMood && (
          <div className="pt-2 animate-fadeIn">
            {isMatch ? (
              <div className="bg-gradient-to-r from-[#341624] via-[#2d1b32] to-[#341624] border-2 border-[#ff4081] rounded-2xl p-4 text-center shadow-[0_0_20px_rgba(255,64,129,0.3)] space-y-1">
                <div className="text-2xl animate-bounce">🔥 ⚡ 💋</div>
                <h3 className="font-black text-white text-base">
                  {lang === 'he' ? 'התאמת כימיה לילית לוהטת!' : 'Tonight is Going to be Electric!'}
                </h3>
                <p className="text-xs text-[#ffd2d5]">
                  {lang === 'he'
                    ? 'שניכם אותתם על תשוקה תואמת להערב. הזמן להכין את האווירה ולהתמסר!'
                    : 'Both of you signaled aligned desire for tonight. Prepare the bedroom!'}
                </p>
              </div>
            ) : (
              <div className="bg-[#181520] border border-[#36343a] rounded-xl p-3 text-xs text-slate-300">
                {lang === 'he'
                  ? '✨ הוייב שלך עודכן בדיסקרטיות. ממתין לאיתות של בן/בת הזוג...'
                  : '✨ Your mood is discreetly beaconed. Awaiting partner signal...'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECTION 2: DUAL FINGERPRINT VAULT */}
      <div className="bg-gradient-to-b from-[#1b1724] to-[#121017] border-2 border-[#e8b4b8]/30 rounded-2xl p-5 shadow-2xl space-y-4 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8b4b8]/15 border border-[#e8b4b8]/30 text-[#ffd2d5] text-xs font-bold">
          <Lock className="w-3.5 h-3.5 text-[#e8b4b8]" />
          <span>{lang === 'he' ? 'כספת פנטזיות סודית בפתיחה כפולה' : 'Dual Biometric Fantasy Vault'}</span>
        </div>

        <h2 className="text-xl font-black text-white">
          {lang === 'he' ? 'פתיחת פנטזיית אקסטרים נעולה' : 'Unlock Locked Extreme Fantasy'}
        </h2>
        <p className="text-xs text-[#d1c5b2] max-w-md mx-auto">
          {lang === 'he'
            ? 'כדי לחשוף את הפנטזיה הבאה, שני בני הזוג חייבים להניח אצבע בו-זמנית על המסך למשך 3 שניות רצופות!'
            : 'To unlock, both partners must press and hold their fingerprints simultaneously for 3 seconds!'}
        </p>

        {!isVaultUnlocked ? (
          <div className="py-4 space-y-4">
            {/* Circular Progress Ring */}
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="text-[#2b2736]"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="text-[#ff4081] transition-all duration-75"
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * holdProgress) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Lock className={`w-8 h-8 text-[#e8b4b8] ${holdProgress > 0 ? 'animate-pulse' : ''}`} />
                <span className="text-[11px] font-bold text-white font-mono mt-1">{holdProgress}%</span>
              </div>
            </div>

            {/* Dual Touch Touchpads (Touch or Mouse hold) */}
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              {/* Left Fingerprint */}
              <div
                onMouseDown={() => setLeftHolding(true)}
                onMouseUp={() => setLeftHolding(false)}
                onTouchStart={() => setLeftHolding(true)}
                onTouchEnd={() => setLeftHolding(false)}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer select-none transition ${
                  leftHolding
                    ? 'bg-[#ff4081]/30 border-[#ff4081] scale-95 shadow-[0_0_15px_rgba(255,64,129,0.5)]'
                    : 'bg-[#1c1824] border-[#36343a] hover:border-[#e8b4b8]'
                }`}
              >
                <Fingerprint className={`w-10 h-10 ${leftHolding ? 'text-[#ff4081]' : 'text-slate-400'}`} />
                <span className="text-[10px] font-bold text-[#ffd2d5] mt-1.5">
                  {lang === 'he' ? 'בן/בת זוג 1' : 'Partner 1'}
                </span>
              </div>

              {/* Right Fingerprint */}
              <div
                onMouseDown={() => setRightHolding(true)}
                onMouseUp={() => setRightHolding(false)}
                onTouchStart={() => setRightHolding(true)}
                onTouchEnd={() => setRightHolding(false)}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer select-none transition ${
                  rightHolding
                    ? 'bg-[#ff4081]/30 border-[#ff4081] scale-95 shadow-[0_0_15px_rgba(255,64,129,0.5)]'
                    : 'bg-[#1c1824] border-[#36343a] hover:border-[#e8b4b8]'
                }`}
              >
                <Fingerprint className={`w-10 h-10 ${rightHolding ? 'text-[#ff4081]' : 'text-slate-400'}`} />
                <span className="text-[10px] font-bold text-[#ffd2d5] mt-1.5">
                  {lang === 'he' ? 'בן/בת זוג 2' : 'Partner 2'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              {lang === 'he'
                ? '👈 החזיקו שניכם את האצבעות יחד על שני הכפתורים למשך 3 שניות 👉'
                : '👈 Hold both fingerprint pads simultaneously for 3 seconds 👉'}
            </p>
          </div>
        ) : (
          /* Unlocked Secret Fantasy Reveal Card */
          <div className="bg-[#241c2c] border-2 border-amber-400/80 rounded-3xl p-5 shadow-[0_0_30px_rgba(251,191,36,0.3)] space-y-3 animate-fadeIn text-right">
            <div className="flex items-center justify-between border-b border-[#36343a] pb-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <Unlock className="w-3.5 h-3.5" />
                {lang === 'he' ? 'פנטזיה נחשפה בהצלחה!' : 'Fantasy Unlocked!'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-red-900/40 text-red-300 text-[10px] font-bold border border-red-500/30">
                {activeFantasy.level}
              </span>
            </div>

            <h3 className="text-base md:text-lg font-black text-white">
              {lang === 'he' ? activeFantasy.titleHe : activeFantasy.titleEn}
            </h3>

            <p className="text-xs text-[#d1c5b2] leading-relaxed">
              {lang === 'he' ? activeFantasy.descHe : activeFantasy.descEn}
            </p>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  setSelectedVaultIndex(prev => (prev + 1) % SECRET_VAULT_FANTASIES.length);
                  setIsVaultUnlocked(false);
                  setHoldProgress(0);
                  setLeftHolding(false);
                  setRightHolding(false);
                }}
                className="flex-1 py-2 rounded-xl bg-[#2b2736] hover:bg-[#363045] text-[#ffd2d5] font-bold text-xs transition"
              >
                {lang === 'he' ? 'נעל ועבור לפנטזיה הבאה' : 'Next Locked Fantasy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
