import React, { useState } from 'react';
import {
  Sparkles,
  Share2,
  Copy,
  Check,
  QrCode,
  ArrowLeft,
  ArrowRight,
  User,
  Flame,
  CheckSquare,
  Square,
  AlertCircle,
  Heart,
  Target,
  Compass
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Language, translations } from '../services/i18n';
import { signInWithGoogle } from '../services/api';

interface OnboardingProps {
  pairCode: string | null;
  onCreateCouple: () => void;
  onJoinCouple: (code: string) => void;
  onCompleteOnboarding: (profile: {
    alias: string;
    role: string;
    categories: string[];
    intensity: string;
    gender?: string;
    pronouns?: string;
    goal?: string;
    relationshipDynamic?: string;
    warmupAnswer?: string;
  }) => void;
  lang: Language;
  googleUser?: any;
}

// Avatar Illustrations for Woman & Man
const WomanIllustration: React.FC<{ isSelected: boolean }> = ({ isSelected }) => (
  <div className={`w-9 h-9 rounded-xl flex items-center justify-center p-0.5 transition shrink-0 ${isSelected ? 'bg-[#e8b4b8]/20 ring-2 ring-[#e8b4b8]' : 'bg-[#2b292f]'}`}>
    <svg className="w-6 h-6" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="22" r="11" fill={isSelected ? '#e8b4b8' : '#cbd5e1'} />
      <path d="M16 54C16 43 23 38 32 38C41 38 48 43 48 54" stroke={isSelected ? '#e8b4b8' : '#94a3b8'} strokeWidth="4" strokeLinecap="round" />
      <path d="M21 21C18 28 19 33 24 37M43 21C46 28 45 33 40 37" stroke={isSelected ? '#f472b6' : '#64748b'} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="32" cy="19" r="2" fill="#48272a" />
    </svg>
  </div>
);

const ManIllustration: React.FC<{ isSelected: boolean }> = ({ isSelected }) => (
  <div className={`w-9 h-9 rounded-xl flex items-center justify-center p-0.5 transition shrink-0 ${isSelected ? 'bg-[#e8b4b8]/20 ring-2 ring-[#e8b4b8]' : 'bg-[#2b292f]'}`}>
    <svg className="w-6 h-6" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="22" r="11" fill={isSelected ? '#e8b4b8' : '#cbd5e1'} />
      <path d="M16 54C16 43 23 38 32 38C41 38 48 43 48 54" stroke={isSelected ? '#e8b4b8' : '#94a3b8'} strokeWidth="4" strokeLinecap="round" />
      <path d="M21 16L32 10L43 16" stroke={isSelected ? '#e8b4b8' : '#64748b'} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="19" r="2" fill="#48272a" />
    </svg>
  </div>
);

export const Onboarding: React.FC<OnboardingProps> = ({
  pairCode,
  onCreateCouple,
  onJoinCouple,
  onCompleteOnboarding,
  lang,
  googleUser
}) => {
  const t = translations[lang];
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Profile Form State
  const [alias, setAlias] = useState('');
  const [aliasError, setAliasError] = useState(false);
  const [gender, setGender] = useState<'MAN' | 'WOMAN'>('WOMAN');
  
  // Multi-select states
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['REIGNITE']);
  const [selectedDynamics, setSelectedDynamics] = useState<string[]>(['LONG_TERM']);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(['HOTEL']);

  const [role, setRole] = useState<'GIVER' | 'RECEIVER' | 'SWITCH'>('SWITCH');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Sensual', 'BDSM']);
  const [intensity, setIntensity] = useState<'VANILLA' | 'SPICY' | 'ADVENTUROUS'>('SPICY');
  const [agreedSafewords, setAgreedSafewords] = useState(true);

  // Pairing State
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Dynamic Aliases Pools
  const poolHe = [
    'מגע סאטן 💋', 'נמר מסתורי 🐅', 'להבה יצרית 🔥', 'שועל חושני 🦊', 'ורד חצות 🌹',
    'לחישה סודית ✨', 'תשוקה אנונימית 🖤', 'פנתר פראי 🐆', 'משי וסאטן 🎀', 'קטיפה שחורה ♠️',
    'נשיקת חצות 💋', 'סופה יצרית 🌪️', 'נסיכה פראית 👑', 'מלכת הלילה 🔮', 'צל מסתורי 🌒',
    'VelvetTouch 💋', 'ShadowFox 🦊', 'MidnightRose 🌹', 'WildHeart 🖤', 'MysticFlame 🔥'
  ];

  const poolEn = [
    'VelvetTouch 💋', 'ShadowFox 🦊', 'MidnightRose 🌹', 'WildHeart 🖤', 'MysticFlame 🔥',
    'SatinWhisper ✨', 'SilkWhisper 🎀', 'SecretDesire 🖤', 'MidnightVixen 🦊', 'SeductiveShadow 🌒',
    'SatinPanther 🐆', 'CrimsonKiss 💋', 'DarkObsession ♠️', 'EroticStorm 🌪️', 'GoldenPhoenix 🔮'
  ];

  const getRandomAliases = (language: Language) => {
    const list = [...(language === 'he' ? poolHe : poolEn)];
    const shuffled = list.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 7);
  };

  const [suggestedAliases, setSuggestedAliases] = useState<string[]>(() => getRandomAliases(lang));

  const shuffleAliases = () => {
    setSuggestedAliases(getRandomAliases(lang));
  };

  const availableCategories = [
    { id: 'Sensual', title: lang === 'he' ? 'חושים ומגע' : 'Sensual & Touch', desc: lang === 'he' ? 'שמנים, כיסויי עיניים, משחקי טמפרטורה' : 'Oils, blindfolds, temperature play, slow intimacy' },
    { id: 'BDSM', title: lang === 'he' ? 'BDSM וקשירות' : 'BDSM & Restraints', desc: lang === 'he' ? 'סרטי משי, קשרים, שליטה והתמסרות' : 'Satin cuffs, rope work, dominance & submission' },
    { id: 'Roleplay', title: lang === 'he' ? 'משחקי תפקידים' : 'Roleplay & Fantasies', desc: lang === 'he' ? 'פגישות אנונימיות, מועדון מלון, תלבושות' : 'Stranger encounters, hotel scenarios, costumes' },
    { id: 'Toys', title: 'צעצועים וטכנולוגיה', desc: lang === 'he' ? 'שלט רחוק, צעצועי זוגות, גירוי חשמלי' : 'Remote vibrators, electro-stimulation, couples toys' },
    { id: 'ENM', title: lang === 'he' ? 'פנטזיות פתוחות' : 'Open & ENM', desc: lang === 'he' ? 'שלישיות, מציצנות, אקסהיביציוניזם' : 'Threesomes, exhibitionism, voyeurism' }
  ];

  const shareUrl = pairCode
    ? `${window.location.origin}/?pair=${pairCode}`
    : window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Toggle Multi-select Helpers
  const toggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      if (selectedGoals.length > 1) {
        setSelectedGoals(selectedGoals.filter((g) => g !== goalId));
      }
    } else {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  const toggleDynamic = (dynamicId: string) => {
    if (selectedDynamics.includes(dynamicId)) {
      if (selectedDynamics.length > 1) {
        setSelectedDynamics(selectedDynamics.filter((d) => d !== dynamicId));
      }
    } else {
      setSelectedDynamics([...selectedDynamics, dynamicId]);
    }
  };

  const toggleLocation = (locationId: string) => {
    if (selectedLocations.includes(locationId)) {
      if (selectedLocations.length > 1) {
        setSelectedLocations(selectedLocations.filter((l) => l !== locationId));
      }
    } else {
      if (selectedLocations.length < 2) {
        setSelectedLocations([...selectedLocations, locationId]);
      } else {
        // Swap second selection to maintain max 2
        setSelectedLocations([selectedLocations[1], locationId]);
      }
    }
  };

  const toggleCategory = (catId: string) => {
    if (selectedCategories.includes(catId)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== catId));
      }
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const handleNextFromStep1 = () => {
    if (!alias.trim()) {
      setAliasError(true);
      return;
    }
    setAliasError(false);
    setStep(2);
  };

  const handleFinish = async () => {
    const finalAlias = alias.trim() || (lang === 'he' ? 'מגע סאטן 💋' : 'VelvetTouch 💋');
    if (!pairCode) {
      await onCreateCouple();
    }
    onCompleteOnboarding({
      alias: finalAlias,
      role,
      categories: selectedCategories,
      intensity,
      gender,
      pronouns: gender === 'MAN' ? 'HE' : 'SHE',
      goal: selectedGoals.join(','),
      relationshipDynamic: selectedDynamics.join(','),
      warmupAnswer: selectedLocations.join(',')
    });
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onJoinCouple(inputCode.trim());
      handleFinish();
    }
  };

  const getIntensityText = (lvl: 'VANILLA' | 'SPICY' | 'ADVENTUROUS') => {
    if (lvl === 'VANILLA') return t.intensityVanilla;
    if (lvl === 'SPICY') return t.intensitySpicy;
    return t.intensityAdventurous;
  };

  // Step Indicators Titles without "Step X" prefix
  const stepTitles = [
    lang === 'he' ? 'זהות וכינוי' : 'Identity & Alias',
    lang === 'he' ? 'מטרה זוגית' : 'Intimacy Goals',
    lang === 'he' ? 'אופי הקשר' : 'Relationship Dynamic',
    lang === 'he' ? 'דייט נועז' : 'Teaser Quiz',
    lang === 'he' ? 'פנטזיות' : 'Fantasies & Limits',
    lang === 'he' ? 'צימוד' : 'Pairing'
  ];

  return (
    /* Full-Screen Solid Modal Overlay covering background headers/bottom bars */
    <div className="h-full w-full bg-[#141218] p-3 sm:p-4 flex flex-col items-center justify-center overflow-hidden">
      <div className="max-w-xl w-full mx-auto my-auto flex flex-col justify-between max-h-full overflow-hidden">
        {/* Step Progress Indicators */}
        <div dir="ltr" className="flex items-center justify-between mb-2 sm:mb-3 px-1 shrink-0">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-1">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] transition ${
                    step >= s
                      ? 'bg-[#e8b4b8] text-[#48272a] shadow-md shadow-[#e8b4b8]/30'
                      : 'bg-[#2b292f] text-slate-400'
                  }`}
                >
                  {s}
                </span>
                <span className="hidden md:inline text-[11px] font-semibold text-slate-300">
                  {stepTitles[s - 1]}
                </span>
              </div>
              {s < 6 && <div className="flex-1 h-0.5 mx-1 bg-[#36343a]" />}
            </React.Fragment>
          ))}
        </div>

        {/* STEP 1: GENDER (WITH ILLUSTRATIONS), GOOGLE AUTH & SEXY ALIAS */}
        {step === 1 && (
          <div className="solid-card p-3.5 sm:p-5 space-y-2.5 sm:space-y-3 card-appear border border-[#36343a] overflow-hidden">
            <div className="text-center">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#2b292f] border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center mx-auto mb-1 shadow-md">
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-base sm:text-xl font-bold text-white font-headline leading-tight">
                {lang === 'he' ? 'זהות, מגדר וכינוי אינטימי' : 'Identity, Gender & Sexy Alias'}
              </h2>
              <p className="text-[11px] text-slate-300 max-w-xs mx-auto mt-0.5 leading-tight">
                {lang === 'he'
                  ? 'המידע שלכם מוצפן לחלוטין. הזינו כינוי סקסי לשמירה על סודיות מלאה.'
                  : 'Your privacy is 100% encrypted. Choose a sexy alias for complete discretion.'}
              </p>
            </div>

            {/* Google OAuth Login Section */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#141218] border border-[#36343a] text-center">
              {googleUser ? (
                <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-bold">
                  <Check className="w-3.5 h-3.5" />
                  <span className="truncate">{t.googleSignedInAs} {googleUser.email}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => signInWithGoogle()}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{t.googleSignInBtn}</span>
                </button>
              )}
            </div>

            {/* Gender Selection with Illustrations & Compact Height */}
            <div className="space-y-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {lang === 'he' ? 'בחירת מגדר' : 'Gender Selection'}
                </label>
                <div className="grid grid-cols-2 gap-2 text-center">
                  {/* WOMAN */}
                  <button
                    type="button"
                    onClick={() => setGender('WOMAN')}
                    style={{
                      borderColor: gender === 'WOMAN' ? '#e8b4b8' : '#36343a',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      backgroundColor: gender === 'WOMAN' ? '#2b292f' : '#141218'
                    }}
                    className="p-2 rounded-xl text-center transition-all duration-150 flex items-center justify-center gap-2 h-14 sm:h-16 cursor-pointer"
                  >
                    <WomanIllustration isSelected={gender === 'WOMAN'} />
                    <span className={`text-xs font-bold block ${gender === 'WOMAN' ? 'text-[#e8b4b8]' : 'text-slate-200'}`}>
                      {lang === 'he' ? 'אישה ♀️' : 'Woman ♀️'}
                    </span>
                  </button>

                  {/* MAN */}
                  <button
                    type="button"
                    onClick={() => setGender('MAN')}
                    style={{
                      borderColor: gender === 'MAN' ? '#e8b4b8' : '#36343a',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      backgroundColor: gender === 'MAN' ? '#2b292f' : '#141218'
                    }}
                    className="p-2 rounded-xl text-center transition-all duration-150 flex items-center justify-center gap-2 h-14 sm:h-16 cursor-pointer"
                  >
                    <ManIllustration isSelected={gender === 'MAN'} />
                    <span className={`text-xs font-bold block ${gender === 'MAN' ? 'text-[#e8b4b8]' : 'text-slate-200'}`}>
                      {lang === 'he' ? 'גבר ♂️' : 'Man ♂️'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Sexy Alias */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {lang === 'he' ? 'כינוי סקסי (Sexy Alias)' : t.sexyAliasLabel}
                </label>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => {
                    setAlias(e.target.value);
                    if (e.target.value.trim()) setAliasError(false);
                  }}
                  placeholder={lang === 'he' ? 'למשל: מגע סאטן 💋' : t.sexyAliasPlaceholder}
                  className={`w-full px-3 py-2 input-solid text-xs text-white ${
                    aliasError ? 'border-rose-500 ring-1 ring-rose-500' : ''
                  }`}
                  required
                />

                {aliasError && (
                  <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1 font-bold">
                    <AlertCircle className="w-3 h-3" />
                    <span>{lang === 'he' ? 'חובה לבחור או להזין כינוי סקסי 🌹' : 'Please enter a sexy alias to continue'}</span>
                  </p>
                )}

                {/* Quick Selection Pills with Horizontal Scroll Single Line */}
                <div className="mt-1.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {lang === 'he' ? 'הצעות לכינויים:' : 'Suggested sexy aliases:'}
                    </span>
                    <button
                      type="button"
                      onClick={shuffleAliases}
                      className="text-[10px] text-[#e8b4b8] hover:underline font-bold flex items-center gap-0.5"
                    >
                      <span>🎲 {lang === 'he' ? 'ערבב' : 'Shuffle'}</span>
                    </button>
                  </div>
                  <div className="flex overflow-x-auto gap-1 py-0.5 no-scrollbar scrollbar-none flex-nowrap">
                    {suggestedAliases.map((suggested) => (
                      <button
                        key={suggested}
                        type="button"
                        onClick={() => {
                          setAlias(suggested);
                          setAliasError(false);
                        }}
                        className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition whitespace-nowrap ${
                          alias === suggested
                            ? 'bg-[#e8b4b8] text-[#48272a] font-bold shadow-sm'
                            : 'bg-[#2b292f] border border-[#36343a] text-slate-300 hover:border-[#e8b4b8]/50'
                        }`}
                      >
                        {suggested}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleNextFromStep1}
              className="btn-rose w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 mt-1"
            >
              <span>{t.continue}</span>
              {lang === 'he' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* STEP 2: INTIMACY GOALS (MULTI-SELECT WITH MATCHING BORDER HIGHLIGHT) */}
        {step === 2 && (
          <div className="solid-card p-3.5 sm:p-5 space-y-2.5 sm:space-y-3 card-appear border border-[#36343a]">
            <div className="text-center">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#2b292f] border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center mx-auto mb-1 shadow-md">
                <Target className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-base sm:text-xl font-bold text-white font-headline leading-tight">
                {lang === 'he' ? 'מה המטרה הזוגית שלכם?' : 'What is your intimacy goal?'}
              </h2>
              <p className="text-[11px] text-slate-300 max-w-xs mx-auto mt-0.5 leading-tight">
                {lang === 'he'
                  ? 'אפשר לבחור מספר מטרות שתרצו להגשים יחד באמצעות האפליקציה (בחירה מרובה)'
                  : 'Select one or more goals you wish to achieve together (Multi-select)'}
              </p>
            </div>

            <div className="space-y-2">
              {[
                {
                  id: 'REIGNITE',
                  title: lang === 'he' ? 'להצית מחדש את התשוקה 🔥' : 'Reignite the Spark 🔥',
                  desc: lang === 'he' ? 'להכניס אש, פלפול וריענון לרוטינה הזוגית' : 'Add fire, excitement and refresh the routine'
                },
                {
                  id: 'SECRET_FANTASIES',
                  title: lang === 'he' ? 'לגלות פנטזיות סודיות 🤫' : 'Discover Secret Desires 🤫',
                  desc: lang === 'he' ? 'לגלות תשוקות שמעולם לא העזתם להגיד בקול' : 'Reveal hidden fantasies safely without awkwardness'
                },
                {
                  id: 'ROLEPLAY',
                  title: lang === 'he' ? 'משחקי תפקידים ואתגרים 🎭' : 'Roleplay & Challenges 🎭',
                  desc: lang === 'he' ? 'אתגרים יומיים, משימות חושיות ודייטים נועזים' : 'Daily challenges, sensory dares & naughty date nights'
                },
                {
                  id: 'EXPLORE_BOUNDARIES',
                  title: lang === 'he' ? 'לחקור גבולות בבטחה 🛡️' : 'Explore Kinks Safely 🛡️',
                  desc: lang === 'he' ? 'חקירת עולמות BDSM ותשוקות בדיסקרטיות מלאה' : 'Explore BDSM & taboos with total encryption & safety'
                }
              ].map((g) => {
                const isSelected = selectedGoals.includes(g.id);
                return (
                  <div
                    key={g.id}
                    onClick={() => toggleGoal(g.id)}
                    style={{
                      borderColor: isSelected ? '#e8b4b8' : '#36343a',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      backgroundColor: isSelected ? '#2b292f' : '#141218'
                    }}
                    className="p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all duration-150"
                  >
                    <div>
                      <span className={`text-xs font-bold block ${isSelected ? 'text-[#e8b4b8]' : 'text-white'}`}>
                        {g.title}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 leading-tight">{g.desc}</span>
                    </div>
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-[#e8b4b8] shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="btn-soft px-3 py-2.5 text-xs flex items-center gap-1"
              >
                {lang === 'he' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                <span>{t.back}</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="btn-rose flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2"
              >
                <span>{t.continue}</span>
                {lang === 'he' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: RELATIONSHIP DYNAMIC (MULTI-SELECT WITH MATCHING BORDER HIGHLIGHT) */}
        {step === 3 && (
          <div className="solid-card p-3.5 sm:p-5 space-y-2.5 card-appear border border-[#36343a]">
            <div className="text-center">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#2b292f] border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center mx-auto mb-1 shadow-md">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-base sm:text-xl font-bold text-white font-headline leading-tight">
                {lang === 'he' ? 'אופי הקשר ותפקיד במיטה' : 'Relationship Dynamic & Role'}
              </h2>
              <p className="text-[11px] text-slate-300 max-w-xs mx-auto mt-0.5 leading-tight">
                {lang === 'he'
                  ? 'אפשר לסמן מספר מאפיינים שמתארים את אופי הזוגיות שלכם (בחירה מרובה)'
                  : 'Select all characteristics describing your dynamic (Multi-select)'}
              </p>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  {lang === 'he' ? 'אופי הזוגיות (בחירה מרובה)' : 'Relationship Dynamic (Multi-select)'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'NEW', title: lang === 'he' ? '✨ זוג בתחילת הדרך' : '✨ New Romance', desc: lang === 'he' ? 'מגלים אחד את השנייה' : 'Exploring each other' },
                    { id: 'LONG_TERM', title: lang === 'he' ? '🚀 זוגיות ממושכת' : '🚀 Long-Term / Married', desc: lang === 'he' ? 'שבירת רוטינה וריענון' : 'Breaking routine' },
                    { id: 'OPEN', title: lang === 'he' ? '🔓 קשר פתוח / ENM' : '🔓 Open / Non-Monogamous', desc: lang === 'he' ? 'חופש ופתיחות' : 'Open exploration' },
                    { id: 'BDSM', title: lang === 'he' ? '⛓️ דינמיקת D/s & BDSM' : '⛓️ Dominance & Submission', desc: lang === 'he' ? 'שליטה ותשוקה' : 'Power exchange' }
                  ].map((rd) => {
                    const isSelected = selectedDynamics.includes(rd.id);
                    return (
                      <button
                        key={rd.id}
                        type="button"
                        onClick={() => toggleDynamic(rd.id)}
                        style={{
                          borderColor: isSelected ? '#e8b4b8' : '#36343a',
                          borderWidth: '2px',
                          borderStyle: 'solid',
                          backgroundColor: isSelected ? '#2b292f' : '#141218'
                        }}
                        className="p-2 rounded-xl text-right transition-all duration-150 flex flex-col justify-center h-15 sm:h-17 cursor-pointer"
                      >
                        <span className={`text-xs font-bold block ${isSelected ? 'text-[#e8b4b8]' : 'text-white'}`}>
                          {rd.title}
                        </span>
                        <span className="text-[9px] text-slate-400 block font-normal mt-0.5 leading-tight">{rd.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-[#e8b4b8] font-bold block mb-1">
                  {t.intimacyRoleLabel}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {/* GIVER */}
                  <button
                    type="button"
                    onClick={() => setRole('GIVER')}
                    style={{
                      borderColor: role === 'GIVER' ? '#e8b4b8' : '#36343a',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      backgroundColor: role === 'GIVER' ? '#2b292f' : '#141218'
                    }}
                    className="p-1.5 rounded-xl text-center transition-all flex flex-col justify-center items-center h-14 sm:h-16"
                  >
                    <span className={`text-xs font-bold block ${role === 'GIVER' ? 'text-[#e8b4b8]' : 'text-slate-200'}`}>
                      {t.roleGiver}
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5 leading-tight">
                      {t.roleGiverSub}
                    </span>
                  </button>

                  {/* RECEIVER */}
                  <button
                    type="button"
                    onClick={() => setRole('RECEIVER')}
                    style={{
                      borderColor: role === 'RECEIVER' ? '#e8b4b8' : '#36343a',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      backgroundColor: role === 'RECEIVER' ? '#2b292f' : '#141218'
                    }}
                    className="p-1.5 rounded-xl text-center transition-all flex flex-col justify-center items-center h-14 sm:h-16"
                  >
                    <span className={`text-xs font-bold block ${role === 'RECEIVER' ? 'text-[#e8b4b8]' : 'text-slate-200'}`}>
                      {t.roleReceiver}
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5 leading-tight">
                      {t.roleReceiverSub}
                    </span>
                  </button>

                  {/* SWITCH */}
                  <button
                    type="button"
                    onClick={() => setRole('SWITCH')}
                    style={{
                      borderColor: role === 'SWITCH' ? '#e8b4b8' : '#36343a',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      backgroundColor: role === 'SWITCH' ? '#2b292f' : '#141218'
                    }}
                    className="p-1.5 rounded-xl text-center transition-all flex flex-col justify-center items-center h-14 sm:h-16"
                  >
                    <span className={`text-xs font-bold block ${role === 'SWITCH' ? 'text-[#e8b4b8]' : 'text-slate-200'}`}>
                      {t.roleSwitch}
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5 leading-tight">
                      {t.roleSwitchSub}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="btn-soft px-3 py-2.5 text-xs flex items-center gap-1"
              >
                {lang === 'he' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                <span>{t.back}</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="btn-rose flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2"
              >
                <span>{t.continue}</span>
                {lang === 'he' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: INTERACTIVE WARM-UP TEASER QUESTION (UP TO 2 SELECTIONS & MATCHING BORDER HIGHLIGHT) */}
        {step === 4 && (
          <div className="solid-card p-3.5 sm:p-5 space-y-2.5 card-appear border border-[#36343a]">
            <div className="text-center">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#2b292f] border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center mx-auto mb-1 shadow-md">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              </div>
              <span className="text-[9px] uppercase tracking-widest font-extrabold text-[#e8b4b8] block">
                {lang === 'he' ? '🌶️ שאלת חימום סודית' : '🌶️ Teaser Question'}
              </span>
              <h2 className="text-base sm:text-xl font-bold text-white font-headline mt-0.5 leading-tight">
                {lang === 'he' ? 'איפה הייתם רוצים שהדייט הנועז הבא שלכם יתרחש?' : 'Where should your next wild date take place?'}
              </h2>
              <p className="text-[11px] text-slate-300 max-w-xs mx-auto mt-0.5 leading-tight">
                {lang === 'he'
                  ? 'אפשר לסמן עד 2 תשובות שמוצאות חן בעיניכם (בחירה של עד 2 תשובות)'
                  : 'Select up to 2 date locations you would love to experience'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'HOTEL', title: lang === 'he' ? '🏨 חדר מלון מבודד' : '🏨 Luxury Hotel Room', desc: lang === 'he' ? 'סדיני משי, ג׳קוזי ועיסוי חושי' : 'Silk sheets, jacuzzi & massage' },
                { id: 'CAR', title: lang === 'he' ? '🚗 במושב האחורי בלילה' : '🚗 Back Seat at Night', desc: lang === 'he' ? 'חלונות מטושטשים, חושך ומתח' : 'Steamy windows & night adrenaline' },
                { id: 'SOFA', title: lang === 'he' ? '🛋️ על הספה בסלון' : '🛋️ Living Room Sofa', desc: lang === 'he' ? 'שניכם לבד בבית בלי הפרעות' : 'Spontaneous passion when home alone' },
                { id: 'NATURE', title: lang === 'he' ? '🌲 בטבע תחת השמיים' : '🌲 Outdoors & Stars', desc: lang === 'he' ? 'חוף ים מוצנע או יער שקט' : 'Secluded beach or quiet forest' }
              ].map((wa) => {
                const isSelected = selectedLocations.includes(wa.id);
                return (
                  <button
                    key={wa.id}
                    type="button"
                    onClick={() => toggleLocation(wa.id)}
                    style={{
                      borderColor: isSelected ? '#e8b4b8' : '#36343a',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      backgroundColor: isSelected ? '#2b292f' : '#141218'
                    }}
                    className="p-2.5 rounded-xl text-right transition flex flex-col justify-between h-20 sm:h-22 cursor-pointer"
                  >
                    <span className={`text-xs font-bold block ${isSelected ? 'text-[#e8b4b8]' : 'text-white'}`}>
                      {wa.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 leading-tight">{wa.desc}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(3)}
                className="btn-soft px-3 py-2.5 text-xs flex items-center gap-1"
              >
                {lang === 'he' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                <span>{t.back}</span>
              </button>
              <button
                onClick={() => setStep(5)}
                className="btn-rose flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2"
              >
                <span>{t.continue}</span>
                {lang === 'he' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: FANTASY CATEGORIES, INTENSITY & SAFEWORD PLEDGE */}
        {step === 5 && (
          <div className="solid-card p-3.5 sm:p-5 space-y-2.5 card-appear border border-[#36343a]">
            <div className="text-center">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#2b292f] border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center mx-auto mb-1 shadow-md">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-base sm:text-xl font-bold text-white font-headline leading-tight">{t.onboardingStep2Title}</h2>
              <p className="text-[11px] text-slate-300 max-w-xs mx-auto mt-0.5 leading-tight">
                {t.onboardingStep2Sub}
              </p>
            </div>

            <div className="space-y-1.5">
              {availableCategories.map((cat) => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <div
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    style={{
                      borderColor: isSelected ? '#e8b4b8' : '#36343a',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      backgroundColor: isSelected ? '#2b292f' : '#141218'
                    }}
                    className="p-2 rounded-xl cursor-pointer flex items-center justify-between transition-all duration-150"
                  >
                    <div>
                      <span className={`text-xs font-bold block ${isSelected ? 'text-[#e8b4b8]' : 'text-white'}`}>
                        {cat.title}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 leading-tight">{cat.desc}</span>
                    </div>
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-[#e8b4b8] shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Intensity & Safeword */}
            <div className="space-y-2 pt-1.5 border-t border-[#36343a]">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  {t.intensityLabel}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['VANILLA', 'SPICY', 'ADVENTUROUS'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setIntensity(lvl)}
                      style={{
                        borderColor: intensity === lvl ? '#e8b4b8' : '#36343a',
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        backgroundColor: intensity === lvl ? '#2b292f' : '#141218'
                      }}
                      className="p-1 rounded-xl text-center transition h-9 flex flex-col items-center justify-center"
                    >
                      <span className={`text-xs font-bold block text-center ${intensity === lvl ? 'text-[#e8b4b8]' : 'text-slate-300'}`}>
                        {getIntensityText(lvl)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div
                onClick={() => setAgreedSafewords(!agreedSafewords)}
                className="p-2.5 rounded-xl bg-[#141218] border border-[#36343a] flex items-center gap-2.5 cursor-pointer"
              >
                {agreedSafewords ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-600 shrink-0" />
                )}
                <div className="text-xs">
                  <span className="font-bold text-white block leading-tight">{t.safewordTitle}</span>
                  <span className="text-slate-400 block text-[10px] mt-0.5 leading-tight">
                    {t.safewordSub}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(4)}
                className="btn-soft px-3 py-2.5 text-xs flex items-center gap-1"
              >
                {lang === 'he' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                <span>{t.back}</span>
              </button>
              <button
                onClick={() => {
                  if (!pairCode) onCreateCouple();
                  setStep(6);
                }}
                className="btn-rose flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2"
              >
                <span>{t.continue}</span>
                {lang === 'he' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: COUPLE PAIRING */}
        {step === 6 && (
          <div className="solid-card p-3.5 sm:p-5 text-center space-y-2.5 card-appear border border-[#36343a]">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#2b292f] border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center mx-auto shadow-md">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div>
              <h2 className="text-base sm:text-xl font-bold text-white font-headline leading-tight">{t.onboardingStep4Title}</h2>
              <p className="text-[11px] text-slate-300 max-w-xs mx-auto mt-0.5 leading-tight">
                {t.onboardingStep4Sub}
              </p>
            </div>

            {/* Option A: Share Code & Link */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-[#141218] border border-[#36343a] text-center space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 block">{t.yourCoupleCode}</span>

              <div className="text-xl sm:text-2xl font-black text-[#e8b4b8] font-mono tracking-widest leading-none">
                {pairCode || '...'}
              </div>

              <button
                onClick={handleCopyLink}
                className="btn-rose px-4 py-1.5 text-xs flex items-center justify-center gap-1.5 mx-auto font-bold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#48272a]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t.linkCopied : t.copyInviteLink}</span>
              </button>

              {pairCode && (
                <div className="pt-1.5 flex flex-col items-center">
                  <div className="p-1.5 bg-white rounded-xl">
                    <QRCodeSVG value={shareUrl} size={65} />
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 flex items-center gap-1">
                    <QrCode className="w-3 h-3 text-[#e8b4b8]" /> {t.scanQR}
                  </span>
                </div>
              )}
            </div>

            {/* Option B: Enter Partner's Code */}
            <form onSubmit={handleJoin} className="pt-1.5 border-t border-[#36343a] space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 block">
                {t.orEnterCode}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  placeholder="e.g. AB12CD"
                  maxLength={8}
                  className="flex-1 px-3 py-2 input-solid font-mono text-center tracking-widest text-xs"
                />
                <button type="submit" className="btn-rose px-3 py-2 text-xs font-bold">
                  {t.connect}
                </button>
              </div>
            </form>

            <div className="pt-1.5 border-t border-[#36343a]">
              <button
                onClick={handleFinish}
                className="btn-rose w-full py-2.5 text-xs flex items-center justify-center gap-2 font-bold"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.completeSetupBtn}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
