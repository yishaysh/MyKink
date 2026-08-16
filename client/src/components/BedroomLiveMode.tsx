import React, { useState, useEffect, useRef } from 'react';
import { Flame, Play, Pause, RotateCcw, Sparkles, Volume2, Moon, Sun, Shield, Award, CheckCircle2, Shuffle, AlertCircle } from 'lucide-react';
import { Language, translations } from '../services/i18n';

interface BedroomLiveModeProps {
  lang: Language;
  onAddPoints?: (pts: number) => void;
}

type FlameLevel = 'ROMANTIC' | 'SPICY' | 'EXTREME';

interface CommandResult {
  action: { he: string; en: string; icon: string };
  zone: { he: string; en: string };
  modifier: { he: string; en: string };
  seconds: number;
}

const ACTIONS_BY_LEVEL: Record<FlameLevel, Array<{ he: string; en: string; icon: string }>> = {
  ROMANTIC: [
    { he: 'נשיקות מלטפות ואיטיות', en: 'Slow Sensual Kisses', icon: '💋' },
    { he: 'עיסוי חושני בשמן חם', en: 'Sensory Warm Oil Stroke', icon: '✨' },
    { he: 'מגע נוצה וליטוף עדין', en: 'Feather-light Soft Touch', icon: '🪶' },
    { he: 'לחישת שלוש פנטזיות כמוסות', en: 'Whisper 3 Secret Fantasies', icon: '👂' },
    { he: 'חיבוק גוף צמוד ללא תנועה', en: 'Skin-to-Skin Motionless Hold', icon: '🕯️' }
  ],
  SPICY: [
    { he: 'נשיכות עדינות ומשיכות קלות', en: 'Teasing Nibbles & Light Bites', icon: '⚡' },
    { he: 'החלקה חושנית של קוביית קרח', en: 'Sensory Ice Cube Glide', icon: '🧊' },
    { he: 'הפשטת פריט לבוש באמצעות השיניים בלבד', en: 'Strip an item using teeth only', icon: '🫦' },
    { he: 'ליקוק איטי וטיזינג ממושך', en: 'Slow Licking & Edge Tease', icon: '👅' },
    { he: 'אחיזה תקיפה וספאנקינג עדין', en: 'Firm Grip & Gentle Spank', icon: '🖐️' }
  ],
  EXTREME: [
    { he: 'קשירת ידיים רכה ואיסור מגע עצמי', en: 'Soft Wrist Restraint & No-Touch Rule', icon: '⛓️' },
    { he: 'ספאנקינג קצבי ופקודות ציות', en: 'Rhythmic Spanking & Strict Commands', icon: '🔥' },
    { he: 'טפטוף שעוות מסאז\' חמה ובטוחה', en: 'Warm Body Wax Drip (Low Temp)', icon: '🕯️' },
    { he: 'שליטה מלאה בקצב האורגזמה (Edging)', en: 'Edging & Full Climax Control', icon: '⏳' },
    { he: 'עצימת עיניים מלאה בפקודה וכיסוי בד', en: 'Total Sensory Deprivation & Blindfold', icon: '👁️' }
  ]
};

const TARGET_ZONES = [
  { he: 'עורף וצוואר', en: 'Nape & Throat' },
  { he: 'פנים הירך', en: 'Inner Thigh' },
  { he: 'שפתיים וסנטר', en: 'Lips & Chin' },
  { he: 'שקע הגב התחתון', en: 'Lower Back Dimples' },
  { he: 'חזה ופטמות', en: 'Chest & Nipples' },
  { he: 'מאחורי האוזן', en: 'Behind the Ear' },
  { he: 'ישבן ואגן', en: 'Glutes & Pelvis' }
];

const MODIFIERS = [
  { he: 'בעיניים מכוסות לחלוטין', en: 'Fully Blindfolded' },
  { he: 'ללא שימוש בכפות הידיים', en: 'Without using hands' },
  { he: 'בשקט מוחלט ללא הוצאת הגה', en: 'In complete silence' },
  { he: 'תוך שמירה על קשר עין רצוף', en: 'With unbroken eye contact' },
  { he: 'בליווי נשימות חמות ואיטיות', en: 'With hot, heavy breathing' },
  { he: 'בפקודת דומיננטיות ובקשת אישור', en: 'Under strict Dominance & Consent' }
];

const TIMER_DURATIONS = [45, 90, 150, 240];

export const BedroomLiveMode: React.FC<BedroomLiveModeProps> = ({ lang, onAddPoints }) => {
  const t = translations[lang];
  const [level, setLevel] = useState<FlameLevel>('SPICY');
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentCommand, setCurrentCommand] = useState<CommandResult | null>(null);

  // Timer state
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSessionScore, setTotalSessionScore] = useState<number>(0);
  const [ambientTheme, setAmbientTheme] = useState<'red' | 'purple' | 'amber'>('red');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const rollCommand = () => {
    setIsSpinning(true);
    setIsRunning(false);

    // Haptic feedback if available
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      navigator.vibrate(80);
    }

    setTimeout(() => {
      const actions = ACTIONS_BY_LEVEL[level];
      const selectedAction = actions[Math.floor(Math.random() * actions.length)];
      const selectedZone = TARGET_ZONES[Math.floor(Math.random() * TARGET_ZONES.length)];
      const selectedModifier = MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)];
      const selectedSecs = TIMER_DURATIONS[Math.floor(Math.random() * TIMER_DURATIONS.length)];

      setCurrentCommand({
        action: selectedAction,
        zone: selectedZone,
        modifier: selectedModifier,
        seconds: selectedSecs
      });
      setTimeLeft(selectedSecs);
      setIsSpinning(false);
    }, 600);
  };

  // Initialize first roll on mount
  useEffect(() => {
    rollCommand();
  }, [level]);

  // Timer countdown
  useEffect(() => {
    if (isRunning && timeLeft !== null && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev !== null && prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            // Finished vibration
            if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
              navigator.vibrate([200, 100, 200, 100, 400]);
            }
            return 0;
          }
          return (prev || 0) - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleCompleteCommand = () => {
    setTotalSessionScore(prev => prev + 15);
    if (onAddPoints) onAddPoints(15);
    rollCommand();
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const getThemeGlow = () => {
    if (ambientTheme === 'red') return 'rgba(232, 70, 95, 0.18)';
    if (ambientTheme === 'purple') return 'rgba(157, 78, 221, 0.2)';
    return 'rgba(255, 183, 3, 0.18)';
  };

  return (
    <div
      className="max-w-xl mx-auto space-y-4 px-2 pb-14 transition-all duration-700 animate-fadeIn"
      style={{
        background: `radial-gradient(circle at center 20%, ${getThemeGlow()} 0%, rgba(13, 11, 17, 0.95) 75%)`
      }}
    >
      {/* Bedside Mode Top Bar */}
      <div className="flex items-center justify-between bg-[#181520]/90 border border-[#e8b4b8]/30 rounded-2xl p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ff4081] to-[#7d5c7e] flex items-center justify-center text-white shadow-md">
            🎲
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-none">
              {lang === 'he' ? 'מצב חדר שינה בלייב' : 'Live Bedroom Mode'}
            </h2>
            <span className="text-[10px] text-[#ffd2d5] font-semibold">
              {lang === 'he' ? 'רולטת תשוקה וקוביות סנסוריות' : 'Action Dice & Bedside Roulette'}
            </span>
          </div>
        </div>

        {/* Ambient Color Switcher */}
        <div className="flex items-center gap-1 bg-[#121017] p-1 rounded-xl border border-[#36343a]">
          <button
            onClick={() => setAmbientTheme('red')}
            className={`w-5 h-5 rounded-full bg-[#ff4081] transition ${ambientTheme === 'red' ? 'ring-2 ring-white scale-110' : 'opacity-60'}`}
            title="Red Passion"
          />
          <button
            onClick={() => setAmbientTheme('purple')}
            className={`w-5 h-5 rounded-full bg-[#9d4edd] transition ${ambientTheme === 'purple' ? 'ring-2 ring-white scale-110' : 'opacity-60'}`}
            title="Velvet Purple"
          />
          <button
            onClick={() => setAmbientTheme('amber')}
            className={`w-5 h-5 rounded-full bg-[#ffb703] transition ${ambientTheme === 'amber' ? 'ring-2 ring-white scale-110' : 'opacity-60'}`}
            title="Candle Amber"
          />
        </div>
      </div>

      {/* Flame Level Selector */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setLevel('ROMANTIC')}
          className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
            level === 'ROMANTIC'
              ? 'bg-[#f4e7d3] text-[#141218] border-[#f4e7d3] shadow-md'
              : 'bg-[#181520] border-[#36343a] text-slate-300 hover:text-white'
          }`}
        >
          <span>🕯️</span>
          <span>{lang === 'he' ? 'עדין ומקרב' : 'Romantic'}</span>
        </button>

        <button
          onClick={() => setLevel('SPICY')}
          className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
            level === 'SPICY'
              ? 'bg-gradient-to-r from-[#ff4081] to-[#e8b4b8] text-white border-[#ff4081] shadow-md'
              : 'bg-[#181520] border-[#36343a] text-slate-300 hover:text-white'
          }`}
        >
          <span>🔥</span>
          <span>{lang === 'he' ? 'לוהט ומעורר' : 'Spicy Tease'}</span>
        </button>

        <button
          onClick={() => setLevel('EXTREME')}
          className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
            level === 'EXTREME'
              ? 'bg-gradient-to-r from-[#9d4edd] to-[#ff007f] text-white border-[#9d4edd] shadow-md'
              : 'bg-[#181520] border-[#36343a] text-slate-300 hover:text-white'
          }`}
        >
          <span>⛓️</span>
          <span>{lang === 'he' ? 'קינקי ושליטה' : 'Power Play'}</span>
        </button>
      </div>

      {/* Main Bedside Action Card */}
      <div className="bg-[#191522]/95 border-2 border-[#e8b4b8]/40 rounded-3xl p-5 shadow-2xl text-center relative overflow-hidden space-y-4">
        {/* Glow Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-[#e8b4b8]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Action Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#271f2d] border border-[#e8b4b8]/30 text-[#ffd2d5] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#e8b4b8]" />
          <span>{lang === 'he' ? 'פקודת חדר שינה חיה' : 'Active Bedroom Dare'}</span>
        </div>

        {currentCommand && (
          <div className={`space-y-3 transition-opacity duration-300 ${isSpinning ? 'opacity-20 scale-95' : 'opacity-100 scale-100'}`}>
            {/* Action Headline */}
            <div className="space-y-1">
              <div className="text-3xl animate-bounce">{currentCommand.action.icon}</div>
              <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                {lang === 'he' ? currentCommand.action.he : currentCommand.action.en}
              </h3>
            </div>

            {/* Target Zone & Modifier Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <div className="bg-[#241c2c] border border-[#e8b4b8]/30 px-3 py-1.5 rounded-xl text-xs text-[#ffd2d5] font-bold">
                🎯 {lang === 'he' ? 'אזור יעד:' : 'Target:'} <span className="text-white">{lang === 'he' ? currentCommand.zone.he : currentCommand.zone.en}</span>
              </div>
              <div className="bg-[#241c2c] border border-[#e8b4b8]/30 px-3 py-1.5 rounded-xl text-xs text-[#f4e7d3] font-bold">
                🔒 {lang === 'he' ? 'תנאי/מגבלה:' : 'Rule:'} <span className="text-white">{lang === 'he' ? currentCommand.modifier.he : currentCommand.modifier.en}</span>
              </div>
            </div>

            {/* Pulsing Sensory Countdown Timer */}
            <div className="pt-3 pb-1 flex flex-col items-center">
              <div
                className={`relative w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all ${
                  isRunning
                    ? 'border-[#ff4081] shadow-[0_0_25px_rgba(255,64,129,0.5)] animate-pulse'
                    : timeLeft === 0
                    ? 'border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.5)]'
                    : 'border-[#36343a]'
                } bg-[#120f18]`}
              >
                <span className="text-2xl font-black text-white tracking-widest font-mono">
                  {timeLeft !== null ? formatTimer(timeLeft) : '0:00'}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">
                  {timeLeft === 0 ? (lang === 'he' ? 'הזמן תם!' : 'Time Up!') : (isRunning ? (lang === 'he' ? 'בביצוע...' : 'Running') : (lang === 'he' ? 'טיימר' : 'Timer'))}
                </span>
              </div>

              {/* Timer Control Buttons */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md ${
                    isRunning
                      ? 'bg-amber-500 text-[#141218] hover:bg-amber-400'
                      : 'bg-[#e8b4b8] text-[#141218] hover:bg-[#ffd2d5]'
                  }`}
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isRunning ? (lang === 'he' ? 'השהה' : 'Pause') : (lang === 'he' ? 'הפעל טיימר' : 'Start Timer')}</span>
                </button>

                <button
                  onClick={() => {
                    setIsRunning(false);
                    if (currentCommand) setTimeLeft(currentCommand.seconds);
                  }}
                  className="p-2 bg-[#211f25] border border-[#36343a] text-slate-400 hover:text-white rounded-xl"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Primary Action Buttons: Re-roll & Complete */}
        <div className="pt-2 border-t border-[#36343a] grid grid-cols-2 gap-2">
          <button
            onClick={rollCommand}
            disabled={isSpinning}
            className="flex items-center justify-center gap-1.5 py-2.5 bg-[#211d2a] border border-[#e8b4b8]/30 hover:border-[#e8b4b8] text-[#ffd2d5] font-bold text-xs rounded-xl transition shadow-sm active:scale-95"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>{lang === 'he' ? 'הגרל פקודה חדשה' : 'Re-Roll Dice'}</span>
          </button>

          <button
            onClick={handleCompleteCommand}
            className="flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-[#ff4081] to-[#e8b4b8] text-[#141218] font-black text-xs rounded-xl transition shadow-md active:scale-95 hover:brightness-110"
          >
            <Award className="w-3.5 h-3.5" />
            <span>{lang === 'he' ? 'בוצע בהצלחה (+15 נק\')' : 'Completed (+15 pts)'}</span>
          </button>
        </div>
      </div>

      {/* Session Points Banner */}
      <div className="bg-[#15121c] border border-[#e8b4b8]/20 rounded-xl p-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[#d1c5b2]">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{lang === 'he' ? 'ניקוד חדר שינה שנצבר בסשן זה:' : 'Session bedroom points earned:'}</span>
        </div>
        <span className="font-black text-amber-400 text-sm">+{totalSessionScore} pts</span>
      </div>
    </div>
  );
};
