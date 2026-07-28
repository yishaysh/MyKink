import React, { useState } from 'react';
import { X, Copy, Check, QrCode, Share2, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Language, translations } from '../services/i18n';

interface PairingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pairCode: string | null;
  onCreateCouple: () => void;
  onJoinCouple: (code: string) => void;
  lang?: Language;
}

export const PairingModal: React.FC<PairingModalProps> = ({
  isOpen,
  onClose,
  pairCode,
  onCreateCouple,
  onJoinCouple,
  lang = 'he'
}) => {
  const t = translations[lang];
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = pairCode
    ? `${window.location.origin}/?pair=${pairCode}`
    : window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onJoinCouple(inputCode.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="solid-card bg-[#1c1a22] max-w-md w-full p-6 border border-[#36343a] shadow-2xl relative card-appear">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-[#2b292f] transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#e8b4b8]/10 text-[#e8b4b8] border border-[#e8b4b8]/30 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-headline">
              {lang === 'he' ? 'צימוד קוד זוגי' : 'Partner Pairing Code'}
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-[#d1c5b2]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.digitalSanctuary}</span>
            </div>
          </div>
        </div>

        {/* Display Pair Code & QR */}
        <div className="p-4 rounded-2xl bg-[#1d1b21] border border-[#36343a] text-center space-y-3 mb-4">
          <span className="text-xs text-slate-400 font-semibold block">{t.yourCoupleCode}</span>
          <div className="text-3xl font-black text-[#e8b4b8] font-mono tracking-widest">
            {pairCode || '...'}
          </div>

          <button
            onClick={handleCopy}
            className="btn-rose px-5 py-2 text-xs flex items-center justify-center gap-2 mx-auto"
          >
            {copied ? <Check className="w-4 h-4 text-[#48272a]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? t.linkCopied : t.copyInviteLink}</span>
          </button>

          {pairCode && (
            <div className="pt-2 flex flex-col items-center">
              <div className="p-2.5 bg-white rounded-2xl">
                <QRCodeSVG value={shareUrl} size={110} />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <QrCode className="w-3 h-3 text-[#e8b4b8]" /> {t.scanQR}
              </span>
            </div>
          )}
        </div>

        {/* Enter Partner's Code */}
        <form onSubmit={handleJoin} className="space-y-2 pt-2 border-t border-[#2b292f]">
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
              className="flex-1 px-4 py-2.5 rounded-2xl bg-[#141218] border border-[#36343a] text-white font-mono text-center tracking-widest text-xs focus:outline-none focus:border-[#e8b4b8]"
            />
            <button type="submit" className="btn-rose px-5 py-2.5 text-xs">
              {t.connect}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
