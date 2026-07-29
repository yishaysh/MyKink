import React from 'react';

interface LogoSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  label?: string;
  sublabel?: string;
  progress?: number;
}

export const LogoSpinner: React.FC<LogoSpinnerProps> = ({
  size = 'lg',
  fullScreen = false,
  label,
  sublabel,
  progress
}) => {
  const logoDimension = size === 'lg' ? 'w-20 h-20' : size === 'md' ? 'w-14 h-14' : 'w-10 h-10';

  const content = (
    <div className="flex flex-col items-center justify-center p-4 space-y-2 text-center">
      <div className="relative flex items-center justify-center">
        <img
          src="/logo.png"
          alt="MyKink Loading"
          className={`${logoDimension} rounded-2xl object-cover animate-pulse shadow-2xl ring-2 ring-[#e8b4b8]/30`}
          style={{ animationDuration: '1.2s' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      {label && (
        <p className="text-sm font-semibold text-white tracking-wide">{label}</p>
      )}
      {sublabel && (
        <p className="text-xs text-[#a09fa6] max-w-xs">{sublabel}</p>
      )}
      {typeof progress === 'number' && (
        <div className="w-48 bg-[#25232a] rounded-full h-1.5 overflow-hidden mt-2 border border-[#36343a]">
          <div
            className="bg-gradient-to-r from-rose-500 to-amber-400 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#141218]/80 backdrop-blur-md flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return content;
};
