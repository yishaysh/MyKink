import React, { useState } from 'react';
import { Flame, Clock, Award, Plus, CheckCircle2, AlertCircle, Wand2, Sparkles } from 'lucide-react';
import { ChallengeItem } from '../services/api';
import { generateAIDare } from '../services/gemini';
import { Language, translations } from '../services/i18n';

interface DaresViewProps {
  challenges: ChallengeItem[];
  onCreateDare: (title: string, description: string, hours: number) => void;
  lang: Language;
}

const defaultDareTranslationsHe: Record<string, { title: string; description: string }> = {
  'Sensual Tease Without Touching': {
    title: 'גירוי חושי ללא מגע',
    description: 'הקדישו 5 דקות בלחישת שלוש פנטזיות כמוסות תוך שמירה על קשר עין רציף.'
  },
  'Secret Intimacy Note': {
    title: 'פתק תשוקה סודי',
    description: 'החביאו פתק רומנטי בכתב יד בכיס או בתיק של בן/בת הזוג לפני היציאה לעבודה.'
  }
};

export const DaresView: React.FC<DaresViewProps> = ({ challenges, onCreateDare, lang }) => {
  const t = translations[lang];
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState(24);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const totalPoints = challenges
    .filter((c) => c.status === 'COMPLETED')
    .reduce((acc, c) => acc + c.pointsValue, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onCreateDare(title, description, hours);
      setTitle('');
      setDescription('');
      setShowCreateModal(false);
    }
  };

  const handleGenerateAIDare = async () => {
    setIsGeneratingAI(true);
    const aiDare = await generateAIDare('SPICY', lang);
    setTitle(aiDare.title);
    setDescription(aiDare.description);
    setIsGeneratingAI(false);
  };

  const getLocalizedDare = (challenge: ChallengeItem) => {
    if (lang === 'he') {
      const trans = defaultDareTranslationsHe[challenge.title.trim()];
      if (trans) {
        return {
          ...challenge,
          title: trans.title,
          description: trans.description
        };
      }
    }
    return challenge;
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 space-y-4">
      {/* Top Banner: Rewards Ledger */}
      <div className="solid-card p-5 space-y-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#2b292f] border border-[#e8b4b8]/30 text-[#e8b4b8] flex items-center justify-center mx-auto shadow-md">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-headline">{t.challengesTitle}</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
            {t.challengesSub}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#36343a]">
          <div className="text-left px-4 py-2 rounded-2xl bg-[#141218] border border-[#36343a]">
            <span className="text-[10px] text-slate-400 block">{t.rewardPoints}</span>
            <span className="text-xl font-black text-[#e8b4b8] font-mono">{totalPoints} pts</span>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-rose px-4 py-2.5 text-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t.newChallengeBtn}</span>
          </button>
        </div>
      </div>

      {/* Challenges List */}
      {challenges.length > 0 ? (
        <div className="space-y-3">
          {challenges.map((rawChallenge) => {
            const challenge = getLocalizedDare(rawChallenge);
            const isCompleted = challenge.status === 'COMPLETED';
            const isExpired = challenge.status === 'EXPIRED';

            return (
              <div
                key={challenge.id}
                className="solid-card p-5 space-y-3 card-appear hover:border-[#e8b4b8]/40 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#e8b4b8]">
                    <Flame className="w-4 h-4" />
                    <span>+{challenge.pointsValue} pts</span>
                  </div>

                  {isCompleted && (
                    <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.statusCompleted}</span>
                    </span>
                  )}
                  {isExpired && (
                    <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400 text-xs font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{t.statusExpired}</span>
                    </span>
                  )}
                  {!isCompleted && !isExpired && (
                    <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t.statusPending}</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white font-headline">{challenge.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {challenge.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#36343a] flex items-center justify-between text-[11px] text-slate-400">
                  <span>{lang === 'he' ? 'זמן תפוגה:' : 'Expires:'} {new Date(challenge.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <Clock className="w-3.5 h-3.5 text-[#e8b4b8]" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="solid-card p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#2b292f] text-slate-500 flex items-center justify-center mx-auto">
            <Flame className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white font-headline">{t.noChallengesTitle}</h4>
          <p className="text-xs text-slate-300 max-w-sm mx-auto">
            {t.noChallengesSub}
          </p>
        </div>
      )}

      {/* Modal for Creating Challenge */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="solid-card p-6 max-w-md w-full space-y-4 card-appear">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-headline">{t.issueChallengeModalTitle}</h3>
              <button
                type="button"
                onClick={handleGenerateAIDare}
                disabled={isGeneratingAI}
                className="px-3 py-1 rounded-full bg-[#2b292f] border border-[#e8b4b8]/50 hover:border-[#e8b4b8] text-[#e8b4b8] text-[11px] font-bold flex items-center gap-1 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeneratingAI ? (lang === 'he' ? 'מייצר...' : 'Generating...') : (lang === 'he' ? 'חולל עם AI 🪄' : 'Generate with AI 🪄')}</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">{t.challengeTitleLabel}</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={lang === 'he' ? 'למשל: עיסוי ללא מגע 5 דקות' : 'e.g. 5 minute tease'}
                  className="w-full px-3 py-2.5 input-solid text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">{t.challengeDescLabel}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={lang === 'he' ? 'פרט את ההוראות לבן/בת הזוג...' : 'Detailed instructions...'}
                  rows={3}
                  className="w-full px-3 py-2.5 input-solid text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">{t.durationLabel}</label>
                <select
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full px-3 py-2.5 input-solid text-white bg-[#141218]"
                >
                  <option value={12}>{lang === 'he' ? '12 שעות (מהיר)' : '12 Hours (Fast Dare)'}</option>
                  <option value={24}>{lang === 'he' ? '24 שעות (רגיל)' : '24 Hours (Standard)'}</option>
                  <option value={48}>{lang === 'he' ? '48 שעות (סוף שבוע)' : '48 Hours (Weekend)'}</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-soft flex-1 py-2.5"
                >
                  {t.back}
                </button>
                <button type="submit" className="btn-rose flex-1 py-2.5">
                  {t.newChallengeBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
