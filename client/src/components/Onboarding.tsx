import React, { useState } from 'react';
import { Heart, Lock, ShieldCheck, Share2, Copy, Check, QrCode, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface OnboardingProps {
  pairCode: string | null;
  onCreateCouple: () => void;
  onJoinCouple: (code: string) => void;
  onStartSwiping: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({
  pairCode,
  onCreateCouple,
  onJoinCouple,
  onStartSwiping
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);

  const shareUrl = pairCode
    ? `${window.location.origin}/?pair=${pairCode}`
    : window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onJoinCouple(inputCode.trim());
      setStep(3);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Onboarding Step Progress */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 1 ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-slate-800 text-slate-400'
            }`}
          >
            1
          </span>
          <span className="text-xs font-semibold text-slate-300">ברוכים הבאים</span>
        </div>
        <div className="w-12 h-0.5 bg-slate-800" />
        <div className="flex items-center gap-2">
          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 2 ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-slate-800 text-slate-400'
            }`}
          >
            2
          </span>
          <span className="text-xs font-semibold text-slate-300">צימוד זוגי</span>
        </div>
        <div className="w-12 h-0.5 bg-slate-800" />
        <div className="flex items-center gap-2">
          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 3 ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-slate-800 text-slate-400'
            }`}
          >
            3
          </span>
          <span className="text-xs font-semibold text-slate-300">התחלת גילוי</span>
        </div>
      </div>

      {/* STEP 1: WELCOME & PRIVACY */}
      {step === 1 && (
        <div className="glass-card p-8 text-center space-y-6 card-appear">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white mx-auto shadow-xl shadow-rose-500/30">
            <Heart className="w-8 h-8 fill-white" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">MyKink</h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              הדרך הדיסקרטית והנעימה לגלות תשוקות, פנטזיות ואתגרים זוגיים משותפים בפרטיות מוחלטת.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-right">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mb-1">
                <Lock className="w-4 h-4" />
                <span>הצפנה כפולה-סמויה</span>
              </div>
              <p className="text-[11px] text-slate-400">
                תשובות "לא" נשמרות חסויות לחלוטין ולעולם לא תוצגנה לבן/בת הזוג.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>התאמות מוכחות בלבד</span>
              </div>
              <p className="text-[11px] text-slate-400">
                מוצגות אך ורק פנטזיות ששניכם עניתם עליהן "כן" או "אולי".
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (!pairCode) onCreateCouple();
              setStep(2);
            }}
            className="btn-rose w-full py-3 text-sm flex items-center justify-center gap-2"
          >
            <span>המשך לצימוד זוגי</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: PAIRING & LINK SHARING */}
      {step === 2 && (
        <div className="glass-card p-8 text-center space-y-6 card-appear">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <Share2 className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-1">צימוד אנונימי עם בן/בת הזוג</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              שתף את הקישור או הקוד הזוגי עם בן/בת הזוג כדי שתוכלו לראות התאמות משותפות.
            </p>
          </div>

          {/* Option A: Share Code & Link */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-3">
            <span className="text-xs font-semibold text-slate-400 block">הקוד הזוגי שלכם:</span>

            <div className="text-3xl font-black text-rose-400 font-mono tracking-widest">
              {pairCode || 'טוען קוד...'}
            </div>

            <button
              onClick={handleCopyLink}
              className="btn-rose px-5 py-2 text-xs flex items-center justify-center gap-2 mx-auto"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'הקישור הועתק!' : 'העתק קישור חיבור זוגי'}</span>
            </button>

            {pairCode && (
              <div className="pt-3 flex flex-col items-center">
                <div className="p-3 bg-white rounded-2xl">
                  <QRCodeSVG value={shareUrl} size={110} />
                </div>
                <span className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
                  <QrCode className="w-3 h-3" /> סרוק QR זה מהטלפון השני
                </span>
              </div>
            )}
          </div>

          {/* Option B: Enter Partner's Code */}
          <form onSubmit={handleJoin} className="pt-2 border-t border-slate-800 space-y-2.5">
            <label className="text-xs font-semibold text-slate-300 block">
              או הזן קוד שקיבלת מבן/בת הזוג:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="למשל: AB12CD"
                maxLength={8}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-center tracking-widest text-xs focus:outline-none focus:border-rose-500"
              />
              <button type="submit" className="btn-rose px-5 py-2.5 text-xs">
                חבר זוג
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStep(1)}
              className="btn-soft px-4 py-2 text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>חזור</span>
            </button>

            <button
              onClick={() => {
                onStartSwiping();
                setStep(3);
              }}
              className="btn-rose px-6 py-2.5 text-xs flex items-center gap-1.5"
            >
              <span>התחל למלא העדפות</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: READY */}
      {step === 3 && (
        <div className="glass-card p-8 text-center space-y-6 card-appear">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-1">החשבון מוכן ומחובר!</h2>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              ענו כעת על שאלון ההעדפות. ברגע ששניכם תסיימו, ההתאמות המשותפות תופענה בלשונית **"התאמות"**.
            </p>
          </div>

          <button
            onClick={onStartSwiping}
            className="btn-rose w-full py-3 text-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>לשאלון ההעדפות</span>
          </button>
        </div>
      )}
    </div>
  );
};
