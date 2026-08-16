import React, { useState } from 'react';
import { Sparkles, Clapperboard, Music, Eye, Wand2, Copy, Check, Heart, Shield, RefreshCw, Flame, UserCheck } from 'lucide-react';
import { generateEroticRoleplayScript, RoleplayScript } from '../services/gemini';
import { Language, translations } from '../services/i18n';

interface AIRoleplayDirectorProps {
  lang: Language;
  userProfile?: any;
  matches?: Array<{ title: string; category?: string }>;
}

const PRESET_THEMES = [
  { id: 'hotel', icon: '🍸', he: 'זרים בבר מלון יוקרתי', en: 'Hotel Bar Strangers' },
  { id: 'masquerade', icon: '🎭', he: 'נשף מסיכות ונציאני מסתורי', en: 'Venetian Masquerade' },
  { id: 'office', icon: '👑', he: 'שליטה ומבטים במשרד סגור', en: 'Executive Office Seduction' },
  { id: 'captive', icon: '⛓️', he: 'כניעה מלאה וכיסוי עיניים', en: 'Blindfolded Surrender' },
  { id: 'doctor', icon: '🩺', he: 'בדיקת דופק וחושים אינטימית', en: 'Sensory Pulse Examination' },
  { id: 'cabin', icon: '🍷', he: 'מפגש סודי בבקתה מבודדת', en: 'Secluded Cabin Escape' }
];

export const AIRoleplayDirector: React.FC<AIRoleplayDirectorProps> = ({
  lang,
  userProfile,
  matches = []
}) => {
  const t = translations[lang];

  const [selectedThemes, setSelectedThemes] = useState<string[]>([PRESET_THEMES[0].he]);
  const [selectedDynamic, setSelectedDynamic] = useState<string>('Dominant / Submissive');
  const [customNote, setCustomNote] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [script, setScript] = useState<RoleplayScript | null>(null);
  const [checkedProps, setCheckedProps] = useState<Record<string, boolean>>({});
  const [copiedQuote, setCopiedQuote] = useState<boolean>(false);

  const toggleTheme = (themeName: string) => {
    if (selectedThemes.includes(themeName)) {
      if (selectedThemes.length > 1) {
        setSelectedThemes(selectedThemes.filter(t => t !== themeName));
      }
    } else {
      if (selectedThemes.length < 3) {
        setSelectedThemes([...selectedThemes, themeName]);
      }
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCheckedProps({});
    const themesToPass = customNote.trim() ? [...selectedThemes, customNote.trim()] : selectedThemes;
    const generated = await generateEroticRoleplayScript(themesToPass, selectedDynamic, lang);
    setScript(generated);
    setIsGenerating(false);
  };

  const handleCopyOpening = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  const toggleProp = (prop: string) => {
    setCheckedProps(prev => ({ ...prev, [prop]: !prev[prop] }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 px-2 pb-14 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#251a2a] via-[#1a1722] to-[#201827] border border-[#e8b4b8]/30 rounded-2xl p-4 shadow-xl text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8b4b8]/15 border border-[#e8b4b8]/30 text-[#ffd2d5] text-xs font-bold mb-2">
          <Clapperboard className="w-3.5 h-3.5 text-[#e8b4b8]" />
          <span>{lang === 'he' ? 'במאי התרחישים והפנטזיות ב-AI' : 'AI Erotic Roleplay & Scenario Director'}</span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-white">
          {lang === 'he' ? 'הפקת תסריט אירוטי זוגי בהתאמה אישית' : 'Generate Cinematic Intimacy Scripts'}
        </h2>
        <p className="text-xs text-[#d1c5b2] max-w-md mx-auto mt-1">
          {lang === 'he'
            ? 'הפכו פנטזיות והתאמות לתסריט משחק תפקידים מלוטש בן 2 דקות — עם שורת פתיחה, קוד לבוש והנחיות בימוי.'
            : 'Transform fantasies into tailored 2-minute erotic roleplay scripts with props, dress code, and opening lines.'}
        </p>
      </div>

      {/* Configuration Box */}
      <div className="bg-[#181520] border border-[#e8b4b8]/20 rounded-2xl p-4 shadow-md space-y-3">
        {/* Theme Selector */}
        <div>
          <label className="text-xs font-bold text-[#ffd2d5] block mb-1.5 flex items-center justify-between">
            <span>{lang === 'he' ? '1. בחרו נושאי פנטזיה (עד 3 נושאים):' : '1. Select Fantasy Themes (up to 3):'}</span>
            <span className="text-[10px] text-slate-400 font-normal">({selectedThemes.length}/3)</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESET_THEMES.map(th => {
              const label = lang === 'he' ? th.he : th.en;
              const isSelected = selectedThemes.includes(th.he) || selectedThemes.includes(th.en);

              return (
                <button
                  key={th.id}
                  onClick={() => toggleTheme(lang === 'he' ? th.he : th.en)}
                  className={`p-2 rounded-xl text-xs font-semibold border transition text-right flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#2b1f30] border-[#e8b4b8] text-white shadow-xs'
                      : 'bg-[#141218] border-[#36343a] text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-base">{th.icon}</span>
                  <span className="truncate">{label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick inject from Mutual Matches if available */}
          {matches.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-[#36343a]/60">
              <span className="text-[11px] text-[#e8b4b8] font-bold block mb-1">
                {lang === 'he' ? '✨ שלב מתוך ההתאמות המשותפות שלכם:' : '✨ Quick-add from mutual matches:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {matches.slice(0, 4).map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleTheme(m.title)}
                    className={`text-[10px] px-2 py-0.5 rounded-full border transition ${
                      selectedThemes.includes(m.title)
                        ? 'bg-[#e8b4b8] text-[#141218] font-bold border-[#e8b4b8]'
                        : 'bg-[#1e1b24] border-[#36343a] text-slate-300 hover:border-[#e8b4b8]'
                    }`}
                  >
                    + {m.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic & Custom Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="text-xs font-bold text-[#ffd2d5] block mb-1">
              {lang === 'he' ? '2. דינמיקת שליטה רצויה:' : '2. Power Dynamic:'}
            </label>
            <select
              value={selectedDynamic}
              onChange={e => setSelectedDynamic(e.target.value)}
              className="w-full bg-[#141218] border border-[#36343a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e8b4b8]"
            >
              <option value="Dominant / Submissive">{lang === 'he' ? 'שולט/ת ונשלט/ת' : 'Dominant / Submissive'}</option>
              <option value="Brat / Tamer">{lang === 'he' ? 'בראט ומאלף/ת' : 'Brat & Tamer'}</option>
              <option value="Equal Strangers">{lang === 'he' ? 'שני זרים ספונטניים ושווים' : 'Equal Seduction'}</option>
              <option value="Switch Dynamic">{lang === 'he' ? 'חילופי תפקידים והפתעות' : 'Switch Dynamic'}</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#ffd2d5] block mb-1">
              {lang === 'he' ? '3. בקשות מיוחדות (אופציונלי):' : '3. Custom Notes (Optional):'}
            </label>
            <input
              type="text"
              value={customNote}
              onChange={e => setCustomNote(e.target.value)}
              placeholder={lang === 'he' ? 'למשל: לשלב כיסוי עיניים משי...' : 'e.g. Include ice cubes...'}
              className="w-full bg-[#141218] border border-[#36343a] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e8b4b8]"
            />
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff4081] via-[#e8b4b8] to-[#7d5c7e] text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2 mt-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{lang === 'he' ? 'ה-AI מביים את הסצנה המושלמת...' : 'Directing scene in AI...'}</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>{lang === 'he' ? '🎬 הפק תסריט אירוטי מבוים ב-AI' : '🎬 Generate Erotic Roleplay Script'}</span>
            </>
          )}
        </button>
      </div>

      {/* Produced Script Display Card */}
      {script && (
        <div className="bg-[#191522] border-2 border-[#e8b4b8]/40 rounded-3xl p-5 shadow-2xl space-y-4 animate-fadeIn text-right relative overflow-hidden">
          {/* Header & Tagline */}
          <div className="border-b border-[#36343a] pb-3">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#e8b4b8] uppercase tracking-widest mb-1">
              <Sparkles className="w-3 h-3" />
              {lang === 'he' ? 'תסריט הפקה אירוטי מאושר' : 'Official Production Card'}
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white font-serif">
              {script.title}
            </h3>
            <p className="text-xs text-[#ffd2d5] italic mt-0.5">
              "{script.tagline}"
            </p>
          </div>

          {/* Ambiance, Props & Attire Box */}
          <div className="bg-[#120f18] border border-[#e8b4b8]/20 rounded-2xl p-3.5 space-y-2.5 text-xs">
            <div className="flex items-center gap-1.5 text-[#f4e7d3] font-bold">
              <Music className="w-4 h-4 text-[#e8b4b8]" />
              <span>{lang === 'he' ? 'הכנת החדר והאווירה (Ambiance & Props)' : 'Ambiance & Staging Props'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div>
                <span className="text-[#ffd2d5] font-semibold">{lang === 'he' ? '🎵 מוזיקה:' : 'Music:'}</span> {script.ambiance.music}
              </div>
              <div>
                <span className="text-[#ffd2d5] font-semibold">{lang === 'he' ? '🕯️ תאורה:' : 'Lighting:'}</span> {script.ambiance.lighting}
              </div>
              <div className="sm:col-span-2">
                <span className="text-[#ffd2d5] font-semibold">{lang === 'he' ? '👗 קוד לבוש:' : 'Attire:'}</span> {script.ambiance.attire}
              </div>
            </div>

            {/* Interactive Props Checklist */}
            {script.ambiance.props.length > 0 && (
              <div className="pt-2 border-t border-[#36343a]/60">
                <span className="text-[10px] text-slate-400 font-bold block mb-1">
                  {lang === 'he' ? 'אביזרים להכנה על השידה (לחצו לסמן V):' : 'Props Checklist:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {script.ambiance.props.map((p, idx) => {
                    const isDone = !!checkedProps[p];
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleProp(p)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition ${
                          isDone
                            ? 'bg-green-900/30 border-green-500 text-green-300 line-through'
                            : 'bg-[#1c1824] border-[#36343a] text-slate-300 hover:border-[#e8b4b8]'
                        }`}
                      >
                        {isDone ? <Check className="w-3 h-3 text-green-400" /> : <span className="w-2 h-2 rounded-full bg-[#e8b4b8]" />}
                        <span>{p}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ACT 1: Opening & Staging */}
          <div className="bg-[#201a28] border border-[#e8b4b8]/25 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#ffd2d5] text-xs">
                🎬 {script.act1.title}
              </span>
            </div>

            <div className="bg-[#14111c] border border-amber-400/40 rounded-xl p-3 relative space-y-1">
              <span className="text-[10px] text-amber-300 font-bold block">
                {lang === 'he' ? 'שורת הפתיחה המדויקת:' : 'Exact Opening Line:'}
              </span>
              <p className="text-sm font-black text-white italic font-serif leading-relaxed">
                "{script.act1.dialogue}"
              </p>
              <button
                onClick={() => handleCopyOpening(script.act1.dialogue)}
                className="absolute top-2 left-2 p-1.5 rounded-lg bg-[#211f25] border border-[#36343a] text-slate-400 hover:text-white transition text-[10px] flex items-center gap-1"
                title="Copy opening line"
              >
                {copiedQuote ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
              <strong className="text-slate-200">{lang === 'he' ? 'הוראות בימוי ומיקום:' : 'Staging Direction:'}</strong> {script.act1.stageDirection}
            </p>
          </div>

          {/* ACT 2: Sensory Escalation */}
          <div className="bg-[#201a28] border border-[#e8b4b8]/25 rounded-2xl p-4 space-y-1.5 text-xs">
            <span className="font-bold text-[#ffd2d5] text-xs block">
              ⚡ {script.act2.title}
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong className="text-slate-200">{lang === 'he' ? 'פעולת מגע עיקרית:' : 'Sensory Action:'}</strong> {script.act2.sensoryAction}
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong className="text-slate-200">{lang === 'he' ? 'הסלמת המתח:' : 'Escalation:'}</strong> {script.act2.escalation}
            </p>
          </div>

          {/* ACT 3: Climax & Aftercare */}
          <div className="bg-[#201a28] border border-[#e8b4b8]/25 rounded-2xl p-4 space-y-1.5 text-xs">
            <span className="font-bold text-[#ffd2d5] text-xs block">
              💖 {script.act3.title}
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong className="text-slate-200">{lang === 'he' ? 'השיא וההתמסרות:' : 'The Climax:'}</strong> {script.act3.climax}
            </p>
            <div className="bg-[#15121b] border border-green-500/30 rounded-xl p-2.5 text-[11px] text-green-300 mt-1">
              <strong>{lang === 'he' ? '🌿 הנחיית Aftercare:' : '🌿 Aftercare Guidance:'}</strong> {script.act3.aftercare}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
