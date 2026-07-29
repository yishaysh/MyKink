import React from 'react';

interface LogoSpinnerProps {
  progress?: number; // 0 to 100 (optional)
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const LogoSpinner: React.FC<LogoSpinnerProps> = ({
  progress,
  label = 'מעבד בקשה ברקע...',
  sublabel,
  size = 'lg',
  fullScreen = false
}) => {
  const isIndeterminate = progress === undefined || progress === null;
  const clampedProgress = Math.min(100, Math.max(0, progress || 0));

  const logoDimension = size === 'lg' ? 'w-16 h-16' : size === 'md' ? 'w-12 h-12' : 'w-9 h-9';

  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 card-appear">
      {/* Center App Logo Image with Glowing pulse */}
      <div className="relative z-10 p-2 rounded-2xl bg-[#141218] border border-[#e8b4b8]/30 shadow-2xl">
        <img
          src="/logo.png"
          alt="MyKink Loading"
          className={`${logoDimension} rounded-xl object-cover animate-pulse`}
          style={{ animationDuration: '1.5s' }}
          onError={(e) => {
            // Fallback to stylized text if logo image is missing
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* Status Text & Progress Percentage */}
      <div className="space-y-1 max-w-xs">
        <div className="text-sm font-bold text-white font-headline leading-tight flex items-center justify-center gap-1.5">
          <span>{label}</span>
          {!isIndeterminate && (
            <span className="text-xs font-mono text-[#e8b4b8]">({Math.round(clampedProgress)}%)</span>
          )}
        </div>
        {sublabel && (
          <p className="text-xs text-slate-400 leading-tight">{sublabel}</p>
        )}
      </div>

      {/* Linear progress bar line if progress is provided */}
      {!isIndeterminate && (
        <div className="w-48 h-1.5 bg-[#26232c] rounded-full overflow-hidden border border-[#36343a]">
          <div
            className="h-full bg-gradient-to-r from-[#e8b4b8] via-[#f472b6] to-[#e11d48] transition-all duration-300 rounded-full"
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#141218]/95 backdrop-blur-md flex items-center justify-center p-4">
        <div className="solid-card p-6 border border-[#e8b4b8]/30 shadow-2xl max-w-sm w-full mx-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
