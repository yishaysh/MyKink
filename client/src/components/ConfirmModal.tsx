import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Language } from '../services/i18n';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  lang: Language;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  lang
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md card-appear">
      <div className="solid-card max-w-sm w-full p-6 space-y-5 border border-[#36343a] shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-[#2b292f] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header & Warning Icon */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-500 flex items-center justify-center mx-auto shadow-lg shadow-red-900/30">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold text-white font-headline leading-tight">
            {title}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-2 border-t border-[#36343a]">
          <button
            type="button"
            onClick={onClose}
            className="btn-soft flex-1 py-3 text-xs font-semibold"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-red-900/40 transition flex-1"
          >
            <Trash2 className="w-4 h-4" />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
