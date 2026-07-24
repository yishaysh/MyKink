import React, { useState } from 'react';
import { Calendar, Plus, Clock, Smile, ShieldCheck, MapPin } from 'lucide-react';

export interface IntimacyLogItem {
  id: string;
  activityType: string;
  durationMinutes: number;
  location: string;
  protectionUsed: boolean;
  moodRating: number;
  loggedAt: string;
}

interface IntimacyTrackerProps {
  logs: IntimacyLogItem[];
  metrics: { totalSessions: number; avgDuration: number; avgMood: string };
  onLogSession: (
    activityType: string,
    duration: number,
    location: string,
    protection: boolean,
    mood: number
  ) => void;
}

export const IntimacyTracker: React.FC<IntimacyTrackerProps> = ({ logs, metrics, onLogSession }) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [activityType, setActivityType] = useState('Sensual Massage');
  const [duration, setDuration] = useState(30);
  const [location, setLocation] = useState('Bedroom');
  const [protection, setProtection] = useState(true);
  const [mood, setMood] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogSession(activityType, duration, location, protection, mood);
    setShowLogModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Banner & Analytics Cards */}
      <div className="glass-card p-6 mb-6 border border-slate-700/80">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Calendar className="w-6 h-6" />
              <h2 className="text-xl font-bold text-white">יומן ומעקב אינטימיות זוגי</h2>
            </div>
            <p className="text-xs text-slate-400">
              תיעוד פרטי ומוצפן של המפגשים האינטימיים, תדירות, משך זמן ומדדי שביעות רצון הדדיים.
            </p>
          </div>

          <button
            onClick={() => setShowLogModal(true)}
            className="btn-neon px-5 py-2.5 text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>תעד מפגש חדש</span>
          </button>
        </div>

        {/* Analytics Statistics Row */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">סך מפגשים</span>
            <span className="text-2xl font-black text-pink-400 font-mono">{metrics.totalSessions}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">משך ממוצע</span>
            <span className="text-2xl font-black text-purple-400 font-mono">{metrics.avgDuration} דק'</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">דירוג חוויה</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">{metrics.avgMood} / 5</span>
          </div>
        </div>
      </div>

      {/* Logged Sessions List */}
      <div className="space-y-3">
        {logs.length > 0 ? (
          logs.map((item) => (
            <div key={item.id} className="glass-card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border border-slate-700/60">
              <div>
                <h4 className="text-base font-bold text-white mb-1">{item.activityType}</h4>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-pink-400" />
                    {item.durationMinutes} דקות
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    {item.location}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {item.protectionUsed ? 'עם אמצעי הגנה' : 'ללא אמצעי הגנה'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">דירוג:</span>
                <div className="flex items-center gap-1 text-amber-400 font-bold text-sm bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                  <Smile className="w-4 h-4 text-amber-400" />
                  <span>{item.moodRating} / 5</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card p-8 text-center text-slate-400">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h3 className="text-base font-bold text-white mb-1">טרם תועדו מפגשים אינטימיים</h3>
            <p className="text-xs max-w-sm mx-auto">
              לחץ על "תעד מפגש חדש" כדי לשמור את המפגש הראשון ביומן הזוגי המוצפן.
            </p>
          </div>
        )}
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card max-w-md w-full p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">תיעוד מפגש אינטימי</h3>
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">סוג הפעילות:</label>
                <input
                  type="text"
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">משך זמן בדקות:</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min={5}
                  max={300}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">מיקום המפגש:</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">דירוג חוויה (1-5):</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={mood}
                  onChange={(e) => setMood(Number(e.target.value))}
                  className="w-full text-pink-500"
                />
                <div className="text-center font-bold text-pink-400 text-sm">{mood} מתוך 5</div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="prot"
                  checked={protection}
                  onChange={(e) => setProtection(e.target.checked)}
                  className="rounded text-pink-500"
                />
                <label htmlFor="prot" className="text-xs text-slate-300">נעשה שימוש באמצעי הגנה (Protection)</label>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-neon flex-1 py-2 text-xs">
                  שמור תיעוד
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
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
