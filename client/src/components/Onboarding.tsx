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
  Compass,
  HelpCircle,
  Shield,
  Key
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
  const [gender, setGender] = useState<'MAN' | 'WOMAN' | 'NON_BINARY' | 'UNDISCLOSED'>('WOMAN');
  const [pronouns, setPronouns] = useState<'HE' | 'SHE' | 'THEY'>('SHE');
  const [goal, setGoal] = useState<'REIGNITE' | 'SECRET_FANTASIES' | 'ROLEPLAY' | 'EXPLORE_BOUNDARIES'>('REIGNITE');
  const [relationshipDynamic, setRelationshipDynamic] = useState<'NEW' | 'LONG_TERM' | 'OPEN' | 'BDSM'>('LONG_TERM');
  const [role, setRole] = useState<'GIVER' | 'RECEIVER' | 'SWITCH'>('SWITCH');
  const [warmupAnswer, setWarmupAnswer] = useState<'HOTEL' | 'CAR' | 'SOFA' | 'NATURE'>('HOTEL');
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
      pronouns,
      goal,
      relationshipDynamic,
      warmupAnswer
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

  const stepTitles = [
    lang === 'he' ? 'זהות וכינוי' : 'Identity & Alias',
    lang === 'he' ? 'מטרה וווייב' : 'Intimacy Goals',
    lang === 'he' ? 'אופי הקשר' : 'Relationship Dynamic',
    lang === 'he' ? 'חימום סודי' : 'Teaser Quiz',
    lang === 'he' ? 'פנטזיות' : 'Fantasies & Limits',
    lang === 'he' ? 'צימוד' : 'Pairing'
  ];

  return (
    /* Full-Screen Solid Modal Overlay covering background headers/bottom bars */
    <div className="fixed inset-0 z-50 bg-[#141218] overflow-y-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-xl w-full mx-auto my-auto">
        {/* Step Progress Indicators */}
        <div dir="ltr" className="flex items-center justify-between mb-6 px-1">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition ${
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

        {/* STEP 1: GENDER, PRONOUNS, GOOGLE AUTH & SEXY ALIAS */}
        {step === 1 && (
          <div className="solid-card p-5 sm:p-8 space-y-5 card-appear border border-[#36343a]">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#2b292f] border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center mx-auto mb-2.5 shadow-md">
                <User className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-headline">
                {lang === 'he' ? 'זהות, מגדר וכינוי אינטימי' : 'Identity, Gender & Sexy Alias'}
              </h2>
              <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1">
                {lang === 'he'
                  ? 'המידע שלכם מוצפן לחלוטין. הזינו כינוי סקסי לשמירה על סודיות מלאה מול המערכת.'
                  : 'Your privacy is 100% encrypted. Choose a sexy alias for complete discretion.'}
              </p>
            </div>

            {/* Google OAuth Login Section */}
            <div className="p-4 rounded-2xl bg-[#141218] border border-[#36343a] space-y-2 text-center">
              {googleUser ? (
                <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-bold">
                  <Check className="w-4 h-4" />
                  <span>{t.googleSignedInAs} {googleUser.email}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => signInWithGoogle()}
                  className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
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

            {/* Gender Selection */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  {lang === 'he' ? 'מגדר (Gender)' : 'Gender Selection'}
                </label>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { id: 'WOMAN', label: lang === 'he' ? 'אישה ♀️' : 'Woman ♀️', p: 'SHE' },
                    { id: 'MAN', label: lang === 'he' ? 'גבר ♂️' : 'Man ♂️', p: 'HE' },
                    { id: 'NON_BINARY', label: lang === 'he' ? 'א-בינארי ⚧️' : 'Non-binary ⚧️', p: 'THEY' },
                    { id: 'UNDISCLOSED', label: lang === 'he' ? 'דיסקרטי 🤫' : 'Secret 🤫', p: 'THEY' }
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setGender(g.id as any);
                        setPronouns(g.p as any);
                      }}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition border ${
                        gender === g.id
                          ? 'bg-[#e8b4b8] text-[#48272a] border-[#e8b4b8] shadow-sm'
                          : 'bg-[#141218] border-[#36343a] text-slate-300 hover:border-[#e8b4b8]/40'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sexy Alias */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {lang === 'he' ? 'כינוי סקסי חובה (Sexy Alias)' : t.sexyAliasLabel}
                </label>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => {
                    setAlias(e.target.value);
                    if (e.target.value.trim()) setAliasError(false);
                  }}
                  placeholder={lang === 'he' ? 'למשל: מגע סאטן 💋' : t.sexyAliasPlaceholder}
                  className={`w-full px-4 py-3 input-solid text-xs text-white ${
                    aliasError ? 'border-rose-500 ring-1 ring-rose-500' : ''
                  }`}
                  required
                />

                {aliasError && (
                  <p className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1 font-bold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{lang === 'he' ? 'חובה לבחור או להזין כינוי סקסי כדי להמשיך 🌹' : 'Please enter a sexy alias to continue'}</span>
                  </p>
                )}

                {/* Quick Selection Pills with Shuffle Button */}
                <div className="mt-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {lang === 'he' ? 'הצעות לכינויים בלחיצה קלה:' : 'Quick suggested sexy aliases:'}
                    </span>
                    <button
                      type="button"
                      onClick={shuffleAliases}
                      className="text-[10px] text-[#e8b4b8] hover:underline font-bold flex items-center gap-1"
                    >
                      <span>🎲 {lang === 'he' ? 'ערבב הצעות' : 'Shuffle'}</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedAliases.map((suggested) => (
                      <button
                        key={suggested}
                        type="button"
                        onClick={() => {
                          setAlias(suggested);
                          setAliasError(false);
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
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
              className="btn-rose w-full py-3.5 text-xs flex items-center justify-center gap-2"
            >
              <span>{t.continue}</span>
              {lang === 'he' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* STEP 2: INTIMACY GOALS & VIBE */}
        {step === 2 && (
          <div className="solid-card p-5 sm:p-8 space-y-5 card-appear border border-[#36343a]">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#2b292f] border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center mx-auto mb-2.5 shadow-md">
                <Target className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-headline">
                {lang === 'he' ? 'מה המטרה הזוגית שלכם?' : 'What is your intimacy goal?'}
              </h2>
              <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1">
                {lang === 'he'
                  ? 'בחרו את התפיסה העיקרית שברצונכם להגשים באמצעות MyKink'
                  : 'Select what you want to achieve together in MyKink'}
              </p>
            </div>

            <div className="space-y-2.5">
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
                const isSelected = goal === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => setGoal(g.id as any)}
                    style={{
                      borderColor: isSelected ? '#e8b4b8' : '#36343a',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      backgroundColor: isSelected ? '#2b292f' : '#141218'
                    }}
                    className="p-3.5 rounded-2xl cursor-pointer flex items-center justify-between transition"
                  >
                    <div>
                      <span className={`text-xs font-bold block ${isSelected ? 'text-[#e8b4b8]' : 'text-white'}`}>
                        {g.title}
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{g.desc}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#e8b4b8] bg-[#e8b4b8]' : 'border-slate-600'}`}>
                      {isSelected && <Check className="w-3 h-3 text-[#48272a]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="btn-soft px-4 py-3 text-xs flex items-center gap-1"
              >
                {lang === 'he' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{t.back}</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="btn-rose flex-1 py-3 text-xs flex items-center justify-center gap-2"
              >
                <span>{t.continue}</span>
                {lang === 'he' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: RELATIONSHIP DYNAMIC & INTIMACY ROLE */}
        {step === 3 && (
          <div className="solid-card p-5 sm:p-8 space-y-5 card-appear border border-[#36343a]">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#2b292f] border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center mx-auto mb-2.5 shadow-md">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-headline">
                {lang === 'he' ? 'אופי הקשר ותפקיד במיטה' : 'Relationship Dynamic & Role'}
              </h2>
              <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1">
                {lang === 'he'
                  ? 'הגדרה זו תעזור למנוע ההתאמות להתאים לכם שאלות ותרחישים מדוייקים'
                  : 'Helps us tailor double-blind scenarios to your exact dynamic'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  {lang === 'he' ? 'אופי הזוגיות (Relationship Dynamic)' : 'Relationship Type'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'NEW', title: lang === 'he' ? '✨ זוג בתחילת הדרך' : '✨ New Romance', desc: lang === 'he' ? 'מגלים אחד את השנייה' : 'Exploring each other' },
                    { id: 'LONG_TERM', title: lang === 'he' ? '🚀 זוגיות ממושכת' : '🚀 Long-Term / Married', desc: lang === 'he' ? 'שבירת רוטינה וריענון' : 'Breaking routine' },
                    { id: 'OPEN', title: lang === 'he' ? '🔓 קשר פתוח / ENM' : '🔓 Open / Non-Monogamous', desc: lang === 'he' ? 'חופש ופתיחות' : 'Open exploration' },
                    { id: 'BDSM', title: lang === 'he' ? '⛓️ דינמיקת D/s & BDSM' : '⛓️ Dominance & Submission', desc: lang === 'he' ? 'שליטה ותשוקה' : 'Power exchange' }
                  ].map((rd) => (
                    <button
                      key={rd.id}
                      type="button"
                      onClick={() => setRelationshipDynamic(rd.id as any)}
                      className={`p-3 rounded-2xl text-right transition border text-xs font-bold flex flex-col justify-center ${
                        relationshipDynamic === rd.id
                          ? 'bg-[#2b292f] border-[#e8b4b8] text-[#e8b4b8]'
                          : 'bg-[#141218] border-[#36343a] text-slate-300 hover:border-[#e8b4b8]/40'
                      }`}
                    >
                      <span className="block">{rd.title}</span>
                      <span className="text-[10px] text-slate-400 block font-normal mt-0.5">{rd.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-[#e8b4b8] font-bold block mb-2">
                  {t.intimacyRoleLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
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
                    className="p-2.5 sm:p-3.5 rounded-2xl text-center transition-all flex flex-col justify-center items-center h-20"
                  >
                    <span className={`text-xs font-bold block ${role === 'GIVER' ? 'text-[#e8b4b8]' : 'text-slate-200'}`}>
                      {t.roleGiver}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1 leading-tight">
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
                    className="p-2.5 sm:p-3.5 rounded-2xl text-center transition-all flex flex-col justify-center items-center h-20"
                  >
                    <span className={`text-xs font-bold block ${role === 'RECEIVER' ? 'text-[#e8b4b8]' : 'text-slate-200'}`}>
                      {t.roleReceiver}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1 leading-tight">
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
                    className="p-2.5 sm:p-3.5 rounded-2xl text-center transition-all flex flex-col justify-center items-center h-20"
                  >
                    <span className={`text-xs font-bold block ${role === 'SWITCH' ? 'text-[#e8b4b8]' : 'text-slate-200'}`}>
                      {t.roleSwitch}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1 leading-tight">
                      {t.roleSwitchSub}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="btn-soft px-4 py-3 text-xs flex items-center gap-1"
              >
                {lang === 'he' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{t.back}</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="btn-rose flex-1 py-3 text-xs flex items-center justify-center gap-2"
              >
                <span>{t.continue}</span>
                {lang === 'he' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: INTERACTIVE WARM-UP TEASER QUESTION */}
        {step === 4 && (
          <div className="solid-card p-5 sm:p-8 space-y-5 card-appear border border-[#36343a]">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#2b292f] border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center mx-auto mb-2.5 shadow-md">
                <Compass className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#e8b4b8] block">
                {lang === 'he' ? '🌶️ שאלת חימום סודית' : '🌶️ Teaser Question'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-headline mt-1">
                {lang === 'he' ? 'איפה הייתם רוצים שהדייט הנועז הבא שלכם יתרחש?' : 'Where should your next wild date date take place?'}
              </h2>
              <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1">
                {lang === 'he'
                  ? 'בחרו את הלוקיישן החלומי שלכם – התשובה תושווה באופן סודי מול הפרטנר/ית!'
                  : 'Pick your dream location – this will be double-blind matched with your partner!'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'HOTEL', title: lang === 'he' ? '🏨 חדר מלון מבודד' : '🏨 Luxury Hotel Room', desc: lang === 'he' ? 'סדיני משי, ג׳קוזי ועיסוי חושי' : 'Silk sheets, jacuzzi & massage' },
                { id: 'CAR', title: lang === 'he' ? '🚗 במושב האחורי בלילה' : '🚗 Back Seat at Night', desc: lang === 'he' ? 'חלונות מטושטשים, חושך ומתח' : 'Steamy windows & night adrenaline' },
                { id: 'SOFA', title: lang === 'he' ? '🛋️ על הספה בסלון' : '🛋️ Living Room Sofa', desc: lang === 'he' ? 'שניכם לבד בבית בלי הפרעות' : 'Spontaneous passion when home alone' },
                { id: 'NATURE', title: lang === 'he' ? '🌲 בטבע תחת השמיים' : '🌲 Outdoors & Stars', desc: lang === 'he' ? 'חוף ים מוצנע או יער שקט' : 'Secluded beach or quiet forest' }
              ].map((wa) => {
                const isSelected = warmupAnswer === wa.id;
                return (
                  <button
                    key={wa.id}
                    type="button"
                    onClick={() => setWarmupAnswer(wa.id as any)}
                    style={{
                      borderColor: isSelected ? '#e8b4b8' : '#36343a',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      backgroundColor: isSelected ? '#2b292f' : '#141218'
                    }}
                    className="p-3.5 rounded-2xl text-right transition flex flex-col justify-between h-28"
                  >
                    <span className={`text-xs font-bold block ${isSelected ? 'text-[#e8b4b8]' : 'text-white'}`}>
                      {wa.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1 leading-tight">{wa.desc}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(3)}
                className="btn-soft px-4 py-3 text-xs flex items-center gap-1"
              >
                {lang === 'he' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{t.back}</span>
              </button>
              <button
                onClick={() => setStep(5)}
                className="btn-rose flex-1 py-3 text-xs flex items-center justify-center gap-2"
              >
                <span>{t.continue}</span>
                {lang === 'he' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: FANTASY CATEGORIES, INTENSITY & SAFEWORD PLEDGE */}
        {step === 5 && (
          <div className="solid-card p-5 sm:p-8 space-y-5 card-appear border border-[#36343a]">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#2b292f] border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center mx-auto mb-2.5 shadow-md">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-headline">{t.onboardingStep2Title}</h2>
              <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1">
                {t.onboardingStep2Sub}
              </p>
            </div>

            <div className="space-y-2.5">
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
                    className="p-3.5 rounded-2xl cursor-pointer flex items-center justify-between transition"
                  >
                    <div>
                      <span className={`text-xs font-bold block ${isSelected ? 'text-[#e8b4b8]' : 'text-white'}`}>
                        {cat.title}
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{cat.desc}</span>
                    </div>
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-[#e8b4b8] shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-600 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Intensity & Safeword */}
            <div className="space-y-3 pt-2 border-t border-[#36343a]">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  {t.intensityLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
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
                      className="p-2 rounded-xl text-center transition h-12 flex flex-col items-center justify-center"
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
                className="p-3.5 rounded-2xl bg-[#141218] border-2 border-[#36343a] flex items-center gap-3 cursor-pointer"
              >
                {agreedSafewords ? (
                  <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-slate-600 shrink-0" />
                )}
                <div className="text-xs">
                  <span className="font-bold text-white block">{t.safewordTitle}</span>
                  <span className="text-slate-400 block text-[11px] mt-0.5">
                    {t.safewordSub}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(4)}
                className="btn-soft px-4 py-3 text-xs flex items-center gap-1"
              >
                {lang === 'he' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{t.back}</span>
              </button>
              <button
                onClick={() => {
                  if (!pairCode) onCreateCouple();
                  setStep(6);
                }}
                className="btn-rose flex-1 py-3 text-xs flex items-center justify-center gap-2"
              >
                <span>{t.continue}</span>
                {lang === 'he' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: COUPLE PAIRING */}
        {step === 6 && (
          <div className="solid-card p-5 sm:p-8 text-center space-y-5 card-appear border border-[#36343a]">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#2b292f] border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center mx-auto shadow-md">
              <Share2 className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-headline">{t.onboardingStep4Title}</h2>
              <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1">
                {t.onboardingStep4Sub}
              </p>
            </div>

            {/* Option A: Share Code & Link */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#141218] border border-[#36343a] text-center space-y-3">
              <span className="text-xs font-semibold text-slate-400 block">{t.yourCoupleCode}</span>

              <div className="text-2xl sm:text-3xl font-black text-[#e8b4b8] font-mono tracking-widest">
                {pairCode || '...'}
              </div>

              <button
                onClick={handleCopyLink}
                className="btn-rose px-5 py-2.5 text-xs flex items-center justify-center gap-2 mx-auto"
              >
                {copied ? <Check className="w-4 h-4 text-[#48272a]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? t.linkCopied : t.copyInviteLink}</span>
              </button>

              {pairCode && (
                <div className="pt-3 flex flex-col items-center">
                  <div className="p-2.5 bg-white rounded-2xl">
                    <QRCodeSVG value={shareUrl} size={100} />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                    <QrCode className="w-3 h-3 text-[#e8b4b8]" /> {t.scanQR}
                  </span>
                </div>
              )}
            </div>

            {/* Option B: Enter Partner's Code */}
            <form onSubmit={handleJoin} className="pt-2 border-t border-[#36343a] space-y-2.5">
              <label className="text-xs font-semibold text-slate-300 block">
                {t.orEnterCode}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  placeholder="e.g. AB12CD"
                  maxLength={8}
                  className="flex-1 px-4 py-2.5 input-solid font-mono text-center tracking-widest text-xs"
                />
                <button type="submit" className="btn-rose px-4 py-2.5 text-xs">
                  {t.connect}
                </button>
              </div>
            </form>

            <div className="pt-2 border-t border-[#36343a]">
              <button
                onClick={handleFinish}
                className="btn-rose w-full py-3.5 text-xs flex items-center justify-center gap-2 font-bold"
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
