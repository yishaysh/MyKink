import React, { useState } from 'react';
import { Flame, Clock, Award, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { ChallengeItem } from '../services/api';

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
      <div className="glass-card p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-[#36343a]">
        <div>
          <div className="flex items-center gap-2 text-[#d1c5b2] mb-1">
            <Award className="w-6 h-6 text-[#e8b4b8]" />
            <h2 className="text-2xl font-bold text-white font-headline">Intimacy Challenges & Rewards</h2>
          </div>
          <p className="text-xs text-slate-400">
            Issue timed dares (24-48 hours). Completing dares earns reward points on your couple ledger!
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center px-4 py-2 rounded-2xl bg-[#1d1b21] border border-[#36343a]">
            <span className="text-xs text-slate-400 block">Reward Points:</span>
            <span className="text-2xl font-black text-[#e8b4b8] font-mono">{totalPoints} pts</span>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-rose px-5 py-2.5 text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Challenge</span>
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
              <div key={c.id} className="glass-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#36343a]">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#e8b4b8] to-[#ffd2d5] flex items-center justify-center text-[#48272a] font-bold shrink-0 mt-0.5 shadow-md shadow-[#e8b4b8]/20">
                    <Flame className="w-5 h-5 fill-[#48272a]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white font-headline">{c.title}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1d1b21] text-[#e8b4b8] text-[11px] font-bold font-mono">
                        +{c.pointsValue} pts
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mb-2 leading-relaxed">{c.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#e8b4b8]" />
                        Expires: {new Date(c.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div>
                  {status === 'PENDING' && (
                    <span className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> Pending Execution
                    </span>
                  )}
                  {status === 'COMPLETED' && (
                    <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Completed!
                    </span>
                  )}
                  {status === 'EXPIRED' && (
                    <span className="px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> Expired
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="glass-card p-10 text-center text-slate-400 space-y-2">
            <Flame className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white font-headline">No Active Challenges</h3>
            <p className="text-xs max-w-sm mx-auto text-slate-300">
              Click "New Challenge" to issue a timed dare to your partner.
            </p>
          </div>
        )}
      </div>

      {/* Modal for Creating New Challenge */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="glass-card max-w-md w-full p-6 border border-[#36343a]">
            <h3 className="text-xl font-bold text-white mb-4 font-headline">Issue New Intimacy Challenge</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Challenge Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 15-Minute Sensual Shoulder Massage"
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#141218] border border-[#36343a] text-white text-xs focus:outline-none focus:border-[#e8b4b8]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Description & Guidelines:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the instructions and setup..."
                  rows={3}
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#141218] border border-[#36343a] text-white text-xs focus:outline-none focus:border-[#e8b4b8]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Duration Limit:</label>
                <select
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#141218] border border-[#36343a] text-white text-xs focus:outline-none focus:border-[#e8b4b8]"
                >
                  <option value={24}>24 Hours (15 Reward Points)</option>
                  <option value={48}>48 Hours (25 Reward Points)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-rose flex-1 py-2.5 text-xs">
                  Issue Challenge
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-soft px-4 py-2.5 text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
