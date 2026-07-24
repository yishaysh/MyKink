import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, QrCode, Link2, Shield } from 'lucide-react';

interface PairingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pairCode: string | null;
  onCreateCouple: () => void;
  onJoinCouple: (code: string) => void;
}

export const PairingModal: React.FC<PairingModalProps> = ({
  isOpen,
  onClose,
  pairCode,
  onCreateCouple,
  onJoinCouple
}) => {
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (pairCode) {
      navigator.clipboard.writeText(pairCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onJoinCouple(inputCode.trim());
      setInputCode('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card max-w-md w-full p-6 relative border border-slate-700/80 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center mx-auto mb-3">
            <Link2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">צימוד אנונימי בין בני הזוג</h2>
          <p className="text-xs text-slate-400 mt-1">
            הקוד מייצר מפתח salt זוגי יחידני המוצפן מקומית על המכשירים שלכם בלבד.
          </p>
        </div>

        {/* Option 1: Display Current Pair Code */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-400 block mb-1">הקוד הזוגי שלך:</span>
          {pairCode ? (
            <div className="flex items-center justify-center gap-3 my-2">
              <span className="text-3xl font-black tracking-widest text-pink-400 font-mono">
                {pairCode}
              </span>
              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                title="העתק קוד"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <button
              onClick={onCreateCouple}
              className="btn-neon px-5 py-2 text-xs mt-2"
            >
              צור קוד צימוד חדש
            </button>
          )}

          {pairCode && (
            <div className="mt-4 flex flex-col items-center">
              <div className="p-3 bg-white rounded-2xl shadow-inner">
                <QRCodeSVG value={`mykink://${pairCode}`} size={130} />
              </div>
              <span className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                <QrCode className="w-3 h-3" /> סרוק קוד זה מהמכשיר השני לחיבור מהיר
              </span>
            </div>
          )}
        </div>

        {/* Option 2: Enter Partner's Pair Code */}
        <form onSubmit={handleJoin} className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 block">
            הזן קוד צימוד שקיבלת מבן/בת הזוג:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="למשל: AB12CD"
              maxLength={8}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-center tracking-widest placeholder:text-slate-600 focus:outline-none focus:border-pink-500 transition"
            />
            <button type="submit" className="btn-neon px-5 py-2.5 text-xs">
              חבר זוג
            </button>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-emerald-400">
          <Shield className="w-3.5 h-3.5" />
          <span>התשובות מוגנות בהצפנת Zero-Knowledge כפולה סמויה</span>
        </div>
      </div>
    </div>
  );
};
