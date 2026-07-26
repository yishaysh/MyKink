import React, { useState } from 'react';
import { Heart, Lock, ShieldCheck, Share2, Copy, Check, QrCode, ArrowLeft, ArrowRight, Sparkles, User, Flame, CheckSquare, Square } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface OnboardingProps {
  pairCode: string | null;
  onCreateCouple: () => void;
  onJoinCouple: (code: string) => void;
  onCompleteOnboarding: (profile: {
    alias: string;
    role: string;
    categories: string[];
    intensity: string;
  }) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({
  pairCode,
  onCreateCouple,
  onJoinCouple,
  onCompleteOnboarding
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Profile Form State
  const [alias, setAlias] = useState('');
  const [role, setRole] = useState<'GIVER' | 'RECEIVER' | 'SWITCH'>('SWITCH');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Sensual', 'BDSM']);
  const [intensity, setIntensity] = useState<'VANILLA' | 'SPICY' | 'ADVENTUROUS'>('SPICY');
  const [agreedSafewords, setAgreedSafewords] = useState(true);

  // Pairing State
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);

  const availableCategories = [
    { id: 'Sensual', title: 'Sensual & Touch', desc: 'Oils, blindfolds, temperature play, slow intimacy' },
    { id: 'BDSM', title: 'BDSM & Restraints', desc: 'Satin cuffs, rope work, dominance & submission' },
    { id: 'Roleplay', title: 'Roleplay & Fantasies', desc: 'Stranger encounters, hotel scenarios, costumes' },
    { id: 'Toys', title: 'Toys & Tech', desc: 'Remote vibrators, electro-stimulation, couples toys' },
    { id: 'ENM', title: 'Open & ENM', desc: 'Threesomes, exhibitionism, voyeurism' }
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

  const handleFinish = () => {
    onCompleteOnboarding({
      alias: alias.trim() || 'Desire Explorer',
      role,
      categories: selectedCategories,
      intensity
    });
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onJoinCouple(inputCode.trim());
      handleFinish();
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Step Progress Indicators */}
      <div className="flex items-center justify-between mb-6 px-2">
        {[1, 2, 3, 4].map((s) => (
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
              <span className="hidden sm:inline text-xs font-semibold text-slate-300">
                {s === 1 && 'Alias'}
                {s === 2 && 'Fantasies'}
                {s === 3 && 'Boundaries'}
                {s === 4 && 'Pairing'}
              </span>
            </div>
            {s < 4 && <div className="flex-1 h-0.5 mx-2 bg-[#36343a]" />}
          </React.Fragment>
        ))}
      </div>

      {/* STEP 1: SEXY ALIAS & ROLE */}
      {step === 1 && (
        <div className="solid-card p-6 sm:p-8 space-y-6 card-appear">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#2b292f] border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center mx-auto mb-3 shadow-md">
              <User className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white font-headline">Step 1: Your Secret Alias & Role</h2>
            <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1">
              Choose an anonymous sexy nickname and your preferred dynamic role for your partner to see.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Sexy Nickname / Alias:
              </label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="e.g. Velvet Goddess, Shadow Prince, Silk Siren"
                className="w-full px-4 py-3 input-solid text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Preferred Intimacy Role:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('GIVER')}
                  className={`p-3 rounded-2xl text-center border transition ${
                    role === 'GIVER'
                      ? 'bg-[#e8b4b8] text-[#48272a] border-[#e8b4b8] font-bold'
                      : 'bg-[#141218] text-slate-300 border-[#36343a] hover:border-slate-500'
                  }`}
                >
                  <span className="text-xs block font-bold">Dominant / Giver</span>
                  <span className="text-[10px] block opacity-80 mt-0.5">Taking control</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('RECEIVER')}
                  className={`p-3 rounded-2xl text-center border transition ${
                    role === 'RECEIVER'
                      ? 'bg-[#e8b4b8] text-[#48272a] border-[#e8b4b8] font-bold'
                      : 'bg-[#141218] text-slate-300 border-[#36343a] hover:border-slate-500'
                  }`}
                >
                  <span className="text-xs block font-bold">Submissive / Receiver</span>
                  <span className="text-[10px] block opacity-80 mt-0.5">Surrendering</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('SWITCH')}
                  className={`p-3 rounded-2xl text-center border transition ${
                    role === 'SWITCH'
                      ? 'bg-[#e8b4b8] text-[#48272a] border-[#e8b4b8] font-bold'
                      : 'bg-[#141218] text-slate-300 border-[#36343a] hover:border-slate-500'
                  }`}
                >
                  <span className="text-xs block font-bold">Switch / Versatile</span>
                  <span className="text-[10px] block opacity-80 mt-0.5">Both roles</span>
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (!alias.trim()) setAlias('Desire Explorer');
              setStep(2);
            }}
            className="btn-rose w-full py-3.5 text-xs flex items-center justify-center gap-2"
          >
            <span>Continue to Fantasies</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: FANTASY & KINK CATEGORIES */}
      {step === 2 && (
        <div className="solid-card p-6 sm:p-8 space-y-6 card-appear">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#2b292f] border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center mx-auto mb-3 shadow-md">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white font-headline">Step 2: Select Favorite Categories</h2>
            <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1">
              Select the fantasy categories you are interested in exploring together.
            </p>
          </div>

          <div className="space-y-2.5">
            {availableCategories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <div
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-[#2b292f] border-[#e8b4b8] text-white'
                      : 'bg-[#141218] border-[#36343a] text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div>
                    <span className="text-sm font-bold block text-white">{cat.title}</span>
                    <span className="text-xs text-slate-400 block mt-0.5">{cat.desc}</span>
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

          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="btn-soft px-4 py-3 text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="btn-rose flex-1 py-3 text-xs flex items-center justify-center gap-2"
            >
              <span>Continue to Boundaries</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: BOUNDARIES & INTENSITY */}
      {step === 3 && (
        <div className="solid-card p-6 sm:p-8 space-y-6 card-appear">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#2b292f] border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center mx-auto mb-3 shadow-md">
              <Flame className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white font-headline">Step 3: Boundaries & Intensity</h2>
            <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1">
              Define your preferred intensity level and agree to fundamental safety principles.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Preferred Intensity Level:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['VANILLA', 'SPICY', 'ADVENTUROUS'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setIntensity(lvl)}
                    className={`p-3 rounded-2xl text-center border transition ${
                      intensity === lvl
                        ? 'bg-[#e8b4b8] text-[#48272a] border-[#e8b4b8] font-bold'
                        : 'bg-[#141218] text-slate-300 border-[#36343a] hover:border-slate-500'
                    }`}
                  >
                    <span className="text-xs font-bold block">{lvl}</span>
                  </button>
                ))}
              </div>
            </div>

            <div
              onClick={() => setAgreedSafewords(!agreedSafewords)}
              className="p-4 rounded-2xl bg-[#141218] border border-[#36343a] flex items-center gap-3 cursor-pointer"
            >
              {agreedSafewords ? (
                <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-600 shrink-0" />
              )}
              <div className="text-xs">
                <span className="font-bold text-white block">Safeword & Consent Agreement</span>
                <span className="text-slate-400 block text-[11px] mt-0.5">
                  I agree that Red means stop immediately, Yellow means slow down, and Green means continue.
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(2)}
              className="btn-soft px-4 py-3 text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (!pairCode) onCreateCouple();
                setStep(4);
              }}
              className="btn-rose flex-1 py-3 text-xs flex items-center justify-center gap-2"
            >
              <span>Continue to Pairing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: COUPLE PAIRING */}
      {step === 4 && (
        <div className="solid-card p-6 sm:p-8 text-center space-y-6 card-appear">
          <div className="w-14 h-14 rounded-2xl bg-[#2b292f] border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center mx-auto shadow-md">
            <Share2 className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white font-headline">Step 4: Anonymous Couple Pairing</h2>
            <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1">
              Share your invite link or enter your partner's code to unlock mutual matches.
            </p>
          </div>

          {/* Option A: Share Code & Link */}
          <div className="p-5 rounded-2xl bg-[#141218] border border-[#36343a] text-center space-y-3">
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
                <span className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <QrCode className="w-3 h-3 text-[#e8b4b8]" /> Scan QR from partner's phone
                </span>
              </div>
            )}
          </div>

          {/* Option B: Enter Partner's Code */}
          <form onSubmit={handleJoin} className="pt-2 border-t border-[#36343a] space-y-2.5">
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
                className="flex-1 px-4 py-2.5 input-solid font-mono text-center tracking-widest text-xs"
              />
              <button type="submit" className="btn-rose px-5 py-2.5 text-xs">
                Connect
              </button>
            </div>
          </form>

          <div className="pt-2 border-t border-[#36343a]">
            <button
              onClick={handleFinish}
              className="btn-rose w-full py-3.5 text-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Complete Setup & Enter Sanctuary</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
