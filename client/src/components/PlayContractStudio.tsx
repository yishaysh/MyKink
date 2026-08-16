import React, { useState, useEffect } from 'react';
import { Shield, Lock, FileText, CheckCircle2, Award, Sparkles, AlertTriangle, Key, Edit3, Heart, Plus, Trash2 } from 'lucide-react';
import { Language, translations } from '../services/i18n';

interface PlayContractStudioProps {
  lang: Language;
  userAlias?: string;
}

interface ContractState {
  dynamic: string;
  safeword: string;
  yellowWord: string;
  hardLimits: string[];
  houseRules: string[];
  rewards: Array<{ title: string; cost: number }>;
  dominantSignature: string;
  submissiveSignature: string;
  isSigned: boolean;
  signedAt: string | null;
  obediencePoints: number;
}

const DEFAULT_LIMITS = [
  'ללא סימנים קבועים',
  'ללא מכות פנים',
  'ללא משחקי פומביות ללא הסכמה',
  'חובת Aftercare חם ומחבק בסיום',
  'כיבוד מיידי של מילת הביטחון'
];

const DEFAULT_LIMITS_EN = [
  'No permanent marks',
  'No face slaps',
  'No non-consensual public exposure',
  'Mandatory warm & caring aftercare',
  'Immediate absolute stop on safeword'
];

const DEFAULT_RULES = [
  'על הנשלט/ת לבקש אישור מפורש לפני מגע אינטימי',
  'חובת שמירה על קשר עין בעת קבלת פקודה',
  'עצימת עיניים מלאה בכל עת שמוענק פינוק או עונש שובב',
  'הפרת חוק גוררת 10 ספאנקים עדינים או מסאז\' רגליים'
];

const DEFAULT_RULES_EN = [
  'Must request explicit permission before initiating touch',
  'Maintain steady eye contact when receiving a command',
  'Surrender sensory vision whenever a reward or playful punishment is given',
  'Rule breach results in 10 gentle spanks or mandatory foot rub'
];

export const PlayContractStudio: React.FC<PlayContractStudioProps> = ({ lang, userAlias }) => {
  const t = translations[lang];

  const [contract, setContract] = useState<ContractState>(() => {
    try {
      const saved = localStorage.getItem('mykink_play_contract');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      dynamic: 'Brat / Tamer',
      safeword: lang === 'he' ? 'אננס אדום' : 'Red Pineapple',
      yellowWord: lang === 'he' ? 'צהוב מאט' : 'Slow Yellow',
      hardLimits: lang === 'he' ? DEFAULT_LIMITS : DEFAULT_LIMITS_EN,
      houseRules: lang === 'he' ? DEFAULT_RULES : DEFAULT_RULES_EN,
      rewards: [
        { title: lang === 'he' ? 'עיסוי שמנים חושני של 30 דקות' : '30-min Sensual Warm Oil Massage', cost: 50 },
        { title: lang === 'he' ? 'הגשמת הפנטזיה הכי פרועה שלך מההתאמות' : "Fulfill your wildest match fantasy", cost: 100 },
        { title: lang === 'he' ? 'ערב חילופי תפקידים מלא (Role Reversal)' : '24-hour Role Reversal Pass', cost: 150 }
      ],
      dominantSignature: '',
      submissiveSignature: '',
      isSigned: false,
      signedAt: null,
      obediencePoints: 35
    };
  });

  const [newRuleInput, setNewRuleInput] = useState('');
  const [newLimitInput, setNewLimitInput] = useState('');
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('mykink_play_contract', JSON.stringify(contract));
    } catch (e) {
      console.warn('Failed to save contract state', e);
    }
  }, [contract]);

  const handleAddRule = () => {
    if (newRuleInput.trim()) {
      setContract(prev => ({
        ...prev,
        houseRules: [...prev.houseRules, newRuleInput.trim()]
      }));
      setNewRuleInput('');
    }
  };

  const handleRemoveRule = (index: number) => {
    setContract(prev => ({
      ...prev,
      houseRules: prev.houseRules.filter((_, i) => i !== index)
    }));
  };

  const handleAddLimit = () => {
    if (newLimitInput.trim()) {
      setContract(prev => ({
        ...prev,
        hardLimits: [...prev.hardLimits, newLimitInput.trim()]
      }));
      setNewLimitInput('');
    }
  };

  const handleRemoveLimit = (index: number) => {
    setContract(prev => ({
      ...prev,
      hardLimits: prev.hardLimits.filter((_, i) => i !== index)
    }));
  };

  const handleSignContract = () => {
    if (!contract.dominantSignature.trim() || !contract.submissiveSignature.trim()) {
      alert(lang === 'he' ? 'אנא הזינו חתימות של שני בני הזוג כדי לאשר את החוזה' : 'Please provide signatures for both partners to seal the contract');
      return;
    }
    setContract(prev => ({
      ...prev,
      isSigned: true,
      signedAt: new Date().toLocaleDateString('he-IL')
    }));
    setShowCertificateModal(true);
  };

  const handleAddObediencePoints = (amount: number) => {
    setContract(prev => ({
      ...prev,
      obediencePoints: Math.max(0, prev.obediencePoints + amount)
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 px-2 pb-14 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#211a28] via-[#1a1722] to-[#251e2e] border border-[#e8b4b8]/30 rounded-2xl p-4 shadow-xl text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7d5c7e]/25 border border-[#7d5c7e]/40 text-[#fad0f8] text-xs font-bold mb-2">
          <Shield className="w-3.5 h-3.5 text-[#e8b4b8]" />
          <span>{lang === 'he' ? 'סטודיו חוזי שליטה ומשחקי כוח' : 'Power Play & BDSM Contract Studio'}</span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-white">
          {lang === 'he' ? 'הסכם אינטימיות ודינמיקת שליטה' : 'Intimate Power Exchange Contract'}
        </h2>
        <p className="text-xs text-[#d1c5b2] max-w-md mx-auto mt-1">
          {lang === 'he'
            ? 'הגדירו מראש חוקי בית, מילות ביטחון, פרוטוקול ציות וגבולות קשיחים — להעצמת התשוקה בביטחון מלא.'
            : 'Establish consensual boundaries, house rules, safewords and playful rewards for high-voltage intimacy.'}
        </p>

        {contract.isSigned && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40 text-green-300 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            <span>{lang === 'he' ? `חוזה חתום ומאושר (${contract.signedAt})` : `Signed & Sealed (${contract.signedAt})`}</span>
          </div>
        )}
      </div>

      {/* Dynamic Role Selection */}
      <div className="bg-[#181520] border border-[#e8b4b8]/20 rounded-2xl p-4 shadow-md space-y-3">
        <h3 className="text-xs font-bold text-[#ffd2d5] flex items-center gap-1.5">
          <Key className="w-3.5 h-3.5 text-[#e8b4b8]" />
          <span>{lang === 'he' ? 'דינמיקת המשחק הנבחרת' : 'Chosen Power Dynamic'}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { id: 'Dominant / Submissive', he: '👑 שולט/ת ונשלט/ת', en: 'Dominant / Submissive' },
            { id: 'Brat / Tamer', he: '😈 בראט ומאלף/ת', en: 'Brat & Tamer' },
            { id: 'Master / Slave', he: '⛓️ מאסטר ושפחה/עבד', en: 'Master & Slave' },
            { id: 'Switch', he: '🔄 חילופי תפקידים (Switch)', en: 'Switch Dynamic' },
            { id: 'Equal Explorers', he: '🌹 שותפים שווים לחקירה', en: 'Equal Explorers' }
          ].map(dyn => (
            <button
              key={dyn.id}
              onClick={() => setContract(prev => ({ ...prev, dynamic: dyn.id }))}
              className={`p-2 rounded-xl text-xs font-semibold border transition text-center ${
                contract.dynamic === dyn.id
                  ? 'bg-[#291f2e] border-[#e8b4b8] text-white shadow-xs'
                  : 'bg-[#141218] border-[#36343a] text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'he' ? dyn.he : dyn.en}
            </button>
          ))}
        </div>
      </div>

      {/* Safeword & Traffic Light Protocol */}
      <div className="bg-[#181520] border border-[#e8b4b8]/20 rounded-2xl p-4 shadow-md space-y-3">
        <h3 className="text-xs font-bold text-[#ffd2d5] flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>{lang === 'he' ? 'פרוטוקול בטיחות ומילות מפתח (Traffic Light Protocol)' : 'Safeword & Traffic Protocol'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="bg-[#1e2a1e] border border-green-500/30 rounded-xl p-2.5">
            <span className="font-bold text-green-400 block mb-0.5">🟢 {lang === 'he' ? 'ירוק (המשך)' : 'Green (Go)'}</span>
            <span className="text-[11px] text-slate-300">{lang === 'he' ? 'הכל מושלם, ניתן להעמיק' : 'Everything is great, go deeper'}</span>
          </div>

          <div className="bg-[#2a271e] border border-amber-500/30 rounded-xl p-2.5">
            <span className="font-bold text-amber-400 block mb-0.5">🟡 {lang === 'he' ? 'צהוב (האטה)' : 'Yellow (Slow)'}</span>
            <input
              type="text"
              value={contract.yellowWord}
              onChange={e => setContract(prev => ({ ...prev, yellowWord: e.target.value }))}
              className="w-full bg-[#141218] border border-[#36343a] rounded px-2 py-1 text-white text-[11px] mt-1"
              placeholder={lang === 'he' ? 'מילת צהוב...' : 'Yellow word...'}
            />
          </div>

          <div className="bg-[#2a1e1e] border border-red-500/30 rounded-xl p-2.5">
            <span className="font-bold text-red-400 block mb-0.5">🔴 {lang === 'he' ? 'אדום (עצירה מיידית)' : 'Red (Full Stop)'}</span>
            <input
              type="text"
              value={contract.safeword}
              onChange={e => setContract(prev => ({ ...prev, safeword: e.target.value }))}
              className="w-full bg-[#141218] border border-[#36343a] rounded px-2 py-1 text-white text-[11px] mt-1 font-bold"
              placeholder={lang === 'he' ? 'מילת אדום...' : 'Safeword...'}
            />
          </div>
        </div>
      </div>

      {/* Hard Limits Checklist */}
      <div className="bg-[#181520] border border-[#e8b4b8]/20 rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#ffd2d5] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#e8b4b8]" />
            <span>{lang === 'he' ? 'גבולות קשיחים שאינם ניתנים למשא ומתן (Hard Limits)' : 'Non-Negotiable Hard Limits'}</span>
          </h3>
        </div>

        <div className="space-y-1.5">
          {contract.hardLimits.map((limit, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-[#141218] border border-[#36343a] text-xs text-slate-200">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span>{limit}</span>
              </span>
              <button onClick={() => handleRemoveLimit(idx)} className="text-slate-500 hover:text-red-400 p-1">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-1">
          <input
            type="text"
            value={newLimitInput}
            onChange={e => setNewLimitInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddLimit()}
            placeholder={lang === 'he' ? 'הוסף גבול קשיח חדש...' : 'Add custom hard limit...'}
            className="flex-1 bg-[#141218] border border-[#36343a] rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e8b4b8]"
          />
          <button
            onClick={handleAddLimit}
            className="px-3 py-1.5 bg-[#2b292f] hover:bg-[#e8b4b8] hover:text-[#141218] text-slate-300 font-bold text-xs rounded-xl transition"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* House Rules & Daily Duties */}
      <div className="bg-[#181520] border border-[#e8b4b8]/20 rounded-2xl p-4 shadow-md space-y-3">
        <h3 className="text-xs font-bold text-[#ffd2d5] flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#e8b4b8]" />
          <span>{lang === 'he' ? 'חוקי הבית ופרוטוקול משחק (House Rules)' : 'House Rules & Play Protocol'}</span>
        </h3>

        <div className="space-y-1.5">
          {contract.houseRules.map((rule, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-[#141218] border border-[#36343a] text-xs text-[#d1c5b2]">
              <span className="flex items-center gap-2">
                <span className="font-bold text-[#e8b4b8]">#{idx + 1}</span>
                <span>{rule}</span>
              </span>
              <button onClick={() => handleRemoveRule(idx)} className="text-slate-500 hover:text-red-400 p-1">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-1">
          <input
            type="text"
            value={newRuleInput}
            onChange={e => setNewRuleInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddRule()}
            placeholder={lang === 'he' ? 'הוסף חוק בית או עונש שובב...' : 'Add house rule or playful penalty...'}
            className="flex-1 bg-[#141218] border border-[#36343a] rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e8b4b8]"
          />
          <button
            onClick={handleAddRule}
            className="px-3 py-1.5 bg-[#2b292f] hover:bg-[#e8b4b8] hover:text-[#141218] text-slate-300 font-bold text-xs rounded-xl transition"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Brat & Obedience Points System */}
      <div className="bg-[#181520] border border-[#e8b4b8]/20 rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#ffd2d5] flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'he' ? 'נקודות ציות ופרסים (Brat & Reward Points)' : 'Obedience & Brat Rewards'}</span>
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
              {contract.obediencePoints} pts
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 py-1">
          <button
            onClick={() => handleAddObediencePoints(-5)}
            className="px-2.5 py-1 rounded-lg bg-red-900/30 border border-red-500/30 text-red-300 text-xs font-bold hover:bg-red-900/50"
          >
            -5 (הפרת חוק 😈)
          </button>
          <button
            onClick={() => handleAddObediencePoints(10)}
            className="px-3 py-1 rounded-lg bg-green-900/30 border border-green-500/30 text-green-300 text-xs font-bold hover:bg-green-900/50"
          >
            +10 (ציות מושלם ✨)
          </button>
        </div>

        {/* Claimable Rewards */}
        <div className="space-y-1.5 pt-1">
          {contract.rewards.map((reward, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-[#141218] border border-[#36343a] text-xs">
              <span className="text-white font-medium">{reward.title}</span>
              <button
                onClick={() => {
                  if (contract.obediencePoints >= reward.cost) {
                    handleAddObediencePoints(-reward.cost);
                    alert(lang === 'he' ? `מזל טוב! פדית את הפרס: "${reward.title}"` : `Reward claimed: "${reward.title}"`);
                  } else {
                    alert(lang === 'he' ? `דרושות ${reward.cost} נקודות לפדיון פרס זה` : `Requires ${reward.cost} points`);
                  }
                }}
                disabled={contract.obediencePoints < reward.cost}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                  contract.obediencePoints >= reward.cost
                    ? 'bg-amber-400 text-[#141218] hover:bg-amber-300'
                    : 'bg-[#211f25] text-slate-500'
                }`}
              >
                {reward.cost} pts
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Signatures & Seal */}
      <div className="bg-gradient-to-b from-[#1c1824] to-[#121017] border-2 border-[#e8b4b8]/30 rounded-2xl p-4 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
          <Edit3 className="w-3.5 h-3.5 text-[#e8b4b8]" />
          <span>{lang === 'he' ? 'חתימה דיגיטלית של שני בני הזוג' : 'Dual Digital E-Signatures'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-[#ffd2d5] font-semibold block mb-1">
              {lang === 'he' ? 'חתימת הצד השולט / המוביל:' : 'Dominant Signature:'}
            </label>
            <input
              type="text"
              value={contract.dominantSignature}
              onChange={e => setContract(prev => ({ ...prev, dominantSignature: e.target.value }))}
              placeholder={lang === 'he' ? 'שם / כינוי מלא...' : 'Full Alias...'}
              className="w-full bg-[#141218] border border-[#36343a] rounded-xl px-3 py-2 text-xs text-white font-serif italic"
            />
          </div>

          <div>
            <label className="text-[11px] text-[#f4e7d3] font-semibold block mb-1">
              {lang === 'he' ? 'חתימת הצד הנשלט / המובל:' : 'Submissive Signature:'}
            </label>
            <input
              type="text"
              value={contract.submissiveSignature}
              onChange={e => setContract(prev => ({ ...prev, submissiveSignature: e.target.value }))}
              placeholder={lang === 'he' ? 'שם / כינוי מלא...' : 'Full Alias...'}
              className="w-full bg-[#141218] border border-[#36343a] rounded-xl px-3 py-2 text-xs text-white font-serif italic"
            />
          </div>
        </div>

        <button
          onClick={handleSignContract}
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#e8b4b8] via-[#ffd2d5] to-[#e8b4b8] text-[#141218] font-black text-xs transition shadow-lg hover:brightness-110 active:scale-98 flex items-center justify-center gap-2"
        >
          <Shield className="w-4 h-4" />
          <span>{lang === 'he' ? 'חתום ונעל חוזה אינטימיות דיגיטלי' : 'Seal & Validate Digital Contract'}</span>
        </button>
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-[#15121b] border-2 border-[#e8b4b8] rounded-3xl p-6 max-w-lg w-full text-center space-y-4 shadow-2xl relative">
            <div className="w-12 h-12 rounded-full bg-[#e8b4b8]/20 border border-[#e8b4b8] flex items-center justify-center mx-auto text-2xl">
              📜
            </div>

            <h3 className="text-xl font-black text-white font-serif">
              {lang === 'he' ? 'תעודת חוזה אינטימיות רשמית' : 'Official Play Contract Certificate'}
            </h3>

            <div className="bg-[#100d14] border border-[#e8b4b8]/30 rounded-2xl p-4 text-xs space-y-2 text-right">
              <div className="flex justify-between border-b border-[#36343a] pb-1.5">
                <span className="text-slate-400">{lang === 'he' ? 'דינמיקה:' : 'Dynamic:'}</span>
                <span className="font-bold text-[#ffd2d5]">{contract.dynamic}</span>
              </div>
              <div className="flex justify-between border-b border-[#36343a] pb-1.5">
                <span className="text-slate-400">{lang === 'he' ? 'מילת ביטחון (אדום):' : 'Safeword:'}</span>
                <span className="font-bold text-red-400">{contract.safeword}</span>
              </div>
              <div className="flex justify-between border-b border-[#36343a] pb-1.5">
                <span className="text-slate-400">{lang === 'he' ? 'חוקי בית פעילים:' : 'Rules Count:'}</span>
                <span className="font-bold text-white">{contract.houseRules.length}</span>
              </div>
              <div className="pt-2 flex justify-between font-serif italic text-sm text-[#e8b4b8]">
                <span>{contract.dominantSignature}</span>
                <span>{contract.submissiveSignature}</span>
              </div>
            </div>

            <button
              onClick={() => setShowCertificateModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#e8b4b8] text-[#141218] font-bold text-xs shadow-md"
            >
              {lang === 'he' ? 'סגור תעודה ונעל במערכת' : 'Close & Store in Vault'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
