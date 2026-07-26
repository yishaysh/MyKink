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
      {/* Step Progress Indicators */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 1 ? 'bg-[#e8b4b8] text-[#48272a] shadow-lg shadow-[#e8b4b8]/30' : 'bg-[#211f25] text-slate-400'
            }`}
          >
            1
          </span>
          <span className="text-xs font-semibold text-slate-300">Welcome</span>
        </div>
        <div className="w-12 h-0.5 bg-[#2b292f]" />
        <div className="flex items-center gap-2">
          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 2 ? 'bg-[#e8b4b8] text-[#48272a] shadow-lg shadow-[#e8b4b8]/30' : 'bg-[#211f25] text-slate-400'
            }`}
          >
            2
          </span>
          <span className="text-xs font-semibold text-slate-300">Pair Couple</span>
        </div>
        <div className="w-12 h-0.5 bg-[#2b292f]" />
        <div className="flex items-center gap-2">
          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 3 ? 'bg-[#e8b4b8] text-[#48272a] shadow-lg shadow-[#e8b4b8]/30' : 'bg-[#211f25] text-slate-400'
            }`}
          >
            3
          </span>
          <span className="text-xs font-semibold text-slate-300">Discovery</span>
        </div>
      </div>

      {/* STEP 1: WELCOME & PRIVACY */}
      {step === 1 && (
        <div className="glass-card p-8 text-center space-y-6 card-appear">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#e8b4b8] to-[#ffd2d5] flex items-center justify-center text-[#48272a] mx-auto shadow-xl shadow-[#e8b4b8]/30">
            <Heart className="w-8 h-8 fill-[#48272a]" />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2 font-headline">MyKink</h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              A private digital sanctuary for couples to discreetly explore desires, fantasies, and intimacy in complete privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
            <div className="p-4 rounded-2xl bg-[#1d1b21] border border-[#36343a]">
              <div className="flex items-center gap-2 text-[#e8b4b8] text-xs font-bold mb-1">
                <Lock className="w-4 h-4" />
                <span>Double-Blind Privacy</span>
              </div>
              <p className="text-[11px] text-slate-400">
                "NO" answers are client-encrypted and strictly hidden. Your partner will never see declined questions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1d1b21] border border-[#36343a]">
              <div className="flex items-center gap-2 text-[#d1c5b2] text-xs font-bold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Mutual Matches Only</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Only activities where both partners answered "YES" or "MAYBE" are revealed as shared matches.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (!pairCode) onCreateCouple();
              setStep(2);
            }}
            className="btn-rose w-full py-3.5 text-sm flex items-center justify-center gap-2"
          >
            <span>Continue to Couple Pairing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: PAIRING & LINK SHARING */}
      {step === 2 && (
        <div className="glass-card p-8 text-center space-y-6 card-appear">
          <div className="w-14 h-14 rounded-2xl bg-[#e8b4b8]/10 border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center mx-auto">
            <Share2 className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-1 font-headline">Anonymous Couple Pairing</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Share this invite link or pair code with your partner to reveal mutual matches together.
            </p>
          </div>

          {/* Option A: Share Code & Link */}
          <div className="p-5 rounded-2xl bg-[#1d1b21] border border-[#36343a] text-center space-y-3">
            <span className="text-xs font-semibold text-slate-400 block">Your Unique Couple Code:</span>

            <div className="text-3xl font-black text-[#e8b4b8] font-mono tracking-widest">
              {pairCode || 'Generating...'}
            </div>

            <button
              onClick={handleCopyLink}
              className="btn-rose px-5 py-2.5 text-xs flex items-center justify-center gap-2 mx-auto"
            >
              {copied ? <Check className="w-4 h-4 text-[#48272a]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Copy Partner Invite Link'}</span>
            </button>

            {pairCode && (
              <div className="pt-3 flex flex-col items-center">
                <div className="p-3 bg-white rounded-2xl">
                  <QRCodeSVG value={shareUrl} size={110} />
                </div>
                <span className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
                  <QrCode className="w-3 h-3" /> Scan QR from your partner's phone
                </span>
              </div>
            )}
          </div>

          {/* Option B: Enter Partner's Code */}
          <form onSubmit={handleJoin} className="pt-2 border-t border-[#2b292f] space-y-2.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Or enter partner's pair code:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="e.g. AB12CD"
                maxLength={8}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-[#141218] border border-[#36343a] text-white font-mono text-center tracking-widest text-xs focus:outline-none focus:border-[#e8b4b8]"
              />
              <button type="submit" className="btn-rose px-5 py-2.5 text-xs">
                Connect
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStep(1)}
              className="btn-soft px-4 py-2 text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => {
                onStartSwiping();
                setStep(3);
              }}
              className="btn-rose px-6 py-2.5 text-xs flex items-center gap-1.5"
            >
              <span>Start Discovery Quiz</span>
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
            <h2 className="text-2xl font-bold text-white mb-1 font-headline">Partner Linked Successfully!</h2>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Answer the discovery questions. Once both partners finish, mutual matches will automatically appear under **"Matches"**.
            </p>
          </div>

          <button
            onClick={onStartSwiping}
            className="btn-rose w-full py-3.5 text-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Discovery Quiz</span>
          </button>
        </div>
      )}
    </div>
  );
};
