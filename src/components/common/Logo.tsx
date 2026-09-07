/**
 * SEVAMITRA - Official Brand Logo & App Icon
 * Based on the official SevaMitra identity:
 * - Two people united in solidarity (green & orange) forming a shelter home
 * - Supported by a protective helping hand
 * - Sprouting leaves of prosperity and collective growth
 * - Motto: "Together • Serve • Empower"
 */

import React from 'react';

const officialLogoImg = '/sevamitra_logo.png';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  variant?: 'light' | 'dark';
  displayMode?: 'badge' | 'icon-text' | 'image-only';
}

export const SevaMitraLogo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  variant = 'light',
  displayMode = 'icon-text',
}) => {
  const iconDimensions = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }[size];

  const titleSizes = {
    xs: 'text-sm font-black',
    sm: 'text-base sm:text-lg font-black',
    md: 'text-lg sm:text-xl font-black',
    lg: 'text-2xl sm:text-3xl font-black',
    xl: 'text-3xl sm:text-4xl font-black',
  }[size];

  if (displayMode === 'image-only') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <img
          src={officialLogoImg}
          alt="SevaMitra - Together • Serve • Empower"
          referrerPolicy="no-referrer"
          className={`${iconDimensions} object-contain drop-shadow-sm`}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official SevaMitra App Icon Emblem */}
      <div
        className={`${iconDimensions} relative flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105`}
      >
        <img
          src={officialLogoImg}
          alt="SevaMitra App Icon"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain drop-shadow-xs"
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5 leading-tight">
          <span
            className={`${titleSizes} tracking-tight font-sans ${
              variant === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            SEVA<span className="text-emerald-600">MITRA</span>
          </span>
          <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 border border-emerald-300/60 hidden sm:inline-block">
            CO-OP
          </span>
        </div>
        {showSubtitle && (
          <p
            className={`text-[10px] font-semibold tracking-normal leading-none mt-1 ${
              variant === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Together • Serve • Empower
          </p>
        )}
      </div>
    </div>
  );
};

export const SevaMitraOfficialBadge: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-28 sm:w-36',
    md: 'w-40 sm:w-48',
    lg: 'w-56 sm:w-64',
  }[size];

  return (
    <div className={`inline-block ${className}`}>
      <img
        src={officialLogoImg}
        alt="SevaMitra Official App Icon - Together • Serve • Empower"
        referrerPolicy="no-referrer"
        className={`${sizeClasses} h-auto aspect-square object-contain drop-shadow-md transition-transform duration-200 hover:scale-[1.02]`}
      />
    </div>
  );
};

