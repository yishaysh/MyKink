import React, { useState } from 'react';
import { Flame, Clock, Award, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

export interface ChallengeItem {
  id: string;
  coupleId: string;
  title: string;
  description: string;
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'EXPIRED' | 'DECLINED';
  pointsValue: number;
  expiresAt: string;
}

interface DaresViewProps {
  challenges: ChallengeItem[];
  onCreateDare: (title: string, description: string, hours: number) => void;
}

export const DaresView: React.FC<DaresViewProps> = ({ challenges, onCreateDare }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState(24);

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Banner: Rewards Ledger */}
      <div className="glass-card p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-700/80">
        <div>
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Award className="w-6 h-6" />
            <h2 className="text-xl font-bold text-white">אתגרים זוגיים וניקוד פרסים</h2>
          </div>
          <p className="text-xs text-slate-400">
            שלחו משימות ואתגרים מוגבלי זמן (24-48 שעות). השלמת אתגרים מעניקה נקודות פרס זוגיות!
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-xs text-slate-400 block">נקודות שנצברו:</span>
            <span className="text-2xl font-black text-amber-400 font-mono">{totalPoints} pts</span>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-neon px-5 py-2.5 text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>אתגר חדש</span>
          </button>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        {challenges.length > 0 ? (
          challenges.map((c) => {
            const isExpired = new Date(c.expiresAt) < new Date() && c.status === 'PENDING';
            const status = isExpired ? 'EXPIRED' : c.status;

            return (
              <div key={c.id} className="glass-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-700/70">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shrink-0 mt-0.5">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-white">{c.title}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 text-[11px] font-bold font-mono">
                        +{c.pointsValue} pts
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mb-2 leading-relaxed">{c.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-pink-400" />
                        בתוקף עד: {new Date(c.expiresAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div>
                  {status === 'PENDING' && (
                    <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> ממתין לביצוע
                    </span>
                  )}
                  {status === 'COMPLETED' && (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> הושלם בהצלחה!
                    </span>
                  )}
                  {status === 'EXPIRED' && (
                    <span className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> פג תוקף האתגר
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="glass-card p-10 text-center text-slate-400">
            <Flame className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h3 className="text-base font-bold text-white mb-1">אין אתגרים פעילים כרגע</h3>
            <p className="text-xs max-w-sm mx-auto mb-4">
              לחץ על "אתגר חדש" כדי לשלוח לבן/בת הזוג משימה אינטימית מוגבלת בזמן.
            </p>
          </div>
        )}
      </div>

      {/* Modal for Creating New Challenge */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card max-w-md w-full p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">יצירת אתגר זוגי חדש</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">כותרת האתגר:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="למשל: עיסוי כתפיים מפנק של 15 דקות"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">תיאור והנחיות מפורטות:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="הסבר מה נדרש לעשות, היכן ואיך..."
                  rows={3}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">משך זמן האתגר:</label>
                <select
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500"
                >
                  <option value={24}>24 שעות (15 נקודות פרס)</option>
                  <option value={48}>48 שעות (25 נקודות פרס)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-neon flex-1 py-2 text-xs">
                  שלח אתגר
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
