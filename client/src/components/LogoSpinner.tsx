import React from 'react';

interface LogoSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const LogoSpinner: React.FC<LogoSpinnerProps> = ({
  size = 'lg',
  fullScreen = false
}) => {
  const logoDimension = size === 'lg' ? 'w-20 h-20' : size === 'md' ? 'w-14 h-14' : 'w-10 h-10';

  const content = (
    <div className="flex items-center justify-center p-2">
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
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#141218]/70 backdrop-blur-sm flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return content;
};
