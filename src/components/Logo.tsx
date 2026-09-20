import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true 
}) => {
  const sizeMap = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-24 w-24',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${sizeMap[size]} shrink-0 rounded-2xl overflow-hidden shadow-xs hover:scale-105 transition-transform duration-200 border border-[#86EFAC]/40 bg-white`}>
        <img
          src="/logo.svg"
          alt="Plant Track Logo"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // fallback to jpg if svg fails
            (e.currentTarget as HTMLImageElement).src = '/logo.jpg';
          }}
          className="w-full h-full object-contain p-0.5"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-baseline font-black tracking-tight leading-none text-[#0E4720]">
            <span className="text-lg sm:text-xl font-extrabold text-[#0E4720]">Plant</span>
            <span className="text-lg sm:text-xl font-extrabold text-[#16A34A]">Track</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#52796F] tracking-tight -mt-0.5">
            Plant Growth Monitoring
          </span>
        </div>
      )}
    </div>
  );
};
