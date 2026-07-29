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

  // SVG circle calculations
  const strokeWidth = size === 'lg' ? 4 : 3;
  const radius = size === 'lg' ? 44 : size === 'md' ? 34 : 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  const logoDimension = size === 'lg' ? 'w-16 h-16' : size === 'md' ? 'w-12 h-12' : 'w-9 h-9';
  const containerSize = size === 'lg' ? 'w-28 h-28' : size === 'md' ? 'w-20 h-20' : 'w-16 h-16';
  const svgSize = size === 'lg' ? 112 : size === 'md' ? 80 : 64;
  const centerPos = svgSize / 2;

  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 card-appear">
      {/* Animated Logo Container with Circular Ring */}
      <div className={`relative ${containerSize} flex items-center justify-center`}>
        {/* SVG Progress Ring */}
        <svg
          className={`absolute inset-0 w-full h-full ${isIndeterminate ? 'animate-spin' : ''}`}
          style={{ animationDuration: '2s' }}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
        >
          {/* Background Track Circle */}
          <circle
            cx={centerPos}
            cy={centerPos}
            r={radius}
            fill="none"
            stroke="#26232c"
            strokeWidth={strokeWidth}
          />
          {/* Animated Gradient Progress Stroke */}
          <circle
            cx={centerPos}
            cy={centerPos}
            r={radius}
            fill="none"
            stroke="url(#roseGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={isIndeterminate ? circumference * 0.3 : strokeDashoffset}
            strokeLinecap="round"
            style={{
              transformOrigin: 'center',
              transform: 'rotate(-90deg)',
              transition: isIndeterminate ? 'none' : 'stroke-dashoffset 0.3s ease-out'
            }}
          />
          <defs>
            <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e8b4b8" />
              <stop offset="50%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center App Logo Image with Glowing pulse */}
        <div className="relative z-10 p-1 rounded-2xl bg-[#141218] border border-[#e8b4b8]/30 shadow-xl">
          <img
            src="/logo.png"
            alt="MyKink Loading"
            className={`${logoDimension} rounded-xl object-cover animate-pulse`}
            style={{ animationDuration: '1.8s' }}
            onError={(e) => {
              // Fallback to stylized text if logo image is missing
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
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
