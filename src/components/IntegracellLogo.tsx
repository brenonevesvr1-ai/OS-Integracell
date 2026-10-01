import React from 'react';

interface IntegracellLogoProps {
  className?: string;
  size?: number;
  variant?: 'emblem' | 'horizontal' | 'badge-full';
  theme?: 'light' | 'dark' | 'auto';
}

export const IntegracellLogo: React.FC<IntegracellLogoProps> = ({
  className = '',
  size = 48,
  variant = 'horizontal',
  theme = 'auto',
}) => {
  const isDark = theme === 'dark' || className.includes('text-white') || className.includes('dark');
  if (variant === 'badge-full') {
    // Full standalone emblem exactly mirroring the user's uploaded logo
    return (
      <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
        <svg
          width={size}
          height={size * 1.05}
          viewBox="0 0 200 210"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md"
        >
          <defs>
            {/* Background circular gradient */}
            <radialGradient id="badgeSphere" cx="50%" cy="45%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="45%" stopColor="#0284c7" />
              <stop offset="85%" stopColor="#0c4a6e" />
              <stop offset="100%" stopColor="#082f49" />
            </radialGradient>

            {/* Orange dynamic arcs */}
            <linearGradient id="arcOrange" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>

            {/* Orange handle gradient */}
            <linearGradient id="handleGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="25%" stopColor="#fb923c" />
              <stop offset="70%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#9a3412" />
            </linearGradient>

            {/* Chrome shaft gradient */}
            <linearGradient id="chromeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="40%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            {/* Phone Screen reflection */}
            <linearGradient id="phoneScreen" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>

            {/* Drop shadow filter */}
            <filter id="shadow3D" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#091326" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Deep Navy outer rim */}
          <ellipse cx="100" cy="95" rx="72" ry="72" fill="#091836" stroke="#1d4ed8" strokeWidth="2.5" />
          {/* Inner royal blue orb */}
          <circle cx="100" cy="95" r="66" fill="url(#badgeSphere)" />

          {/* Orange swooshes around sides */}
          <path
            d="M 38 78 C 42 42, 70 28, 120 32 C 85 40, 58 56, 46 92 Z"
            fill="url(#arcOrange)"
          />
          <path
            d="M 162 108 C 158 144, 130 158, 80 154 C 115 146, 142 130, 154 94 Z"
            fill="url(#arcOrange)"
          />

          {/* Smartphone */}
          <g filter="url(#shadow3D)">
            {/* Phone case */}
            <rect x="74" y="38" width="52" height="96" rx="10" fill="#090d16" stroke="#38bdf8" strokeWidth="2" />
            {/* Screen */}
            <rect x="78" y="44" width="44" height="84" rx="6" fill="url(#phoneScreen)" />
            {/* Speaker notch */}
            <rect x="94" y="41" width="12" height="2" rx="1" fill="#475569" />
            {/* Screen reflections / stars */}
            <path d="M 88 56 L 90 50 L 92 56 L 98 58 L 92 60 L 90 66 L 88 60 L 82 58 Z" fill="#ffffff" opacity="0.9" />
            <path d="M 112 68 L 113.5 64 L 115 68 L 119 69.5 L 115 71 L 113.5 75 L 112 71 L 108 69.5 Z" fill="#ffffff" opacity="0.85" />
          </g>

          {/* Screwdriver 1: Left-to-right diagonal */}
          <g transform="rotate(45 100 95)" filter="url(#shadow3D)">
            {/* Shaft */}
            <rect x="98.5" y="32" width="3.5" height="48" fill="url(#chromeGrad)" />
            {/* Tip */}
            <polygon points="97,32 103,32 101,24 99,24" fill="#f1f5f9" />
            {/* Handle */}
            <rect x="95" y="80" width="10.5" height="34" rx="5" fill="url(#handleGrad)" stroke="#7c2d12" strokeWidth="0.8" />
            {/* Contoured grip bands */}
            <rect x="95" y="88" width="10.5" height="2" fill="#7c2d12" />
            <rect x="95" y="96" width="10.5" height="2" fill="#7c2d12" />
            <rect x="95" y="104" width="10.5" height="2" fill="#7c2d12" />
          </g>

          {/* Screwdriver 2: Right-to-left diagonal */}
          <g transform="rotate(-45 100 95)" filter="url(#shadow3D)">
            {/* Shaft */}
            <rect x="98.5" y="32" width="3.5" height="48" fill="url(#chromeGrad)" />
            {/* Tip (Phillips) */}
            <polygon points="97,32 103,32 101,24 99,24" fill="#f1f5f9" />
            {/* Handle */}
            <rect x="95" y="80" width="10.5" height="34" rx="5" fill="url(#handleGrad)" stroke="#7c2d12" strokeWidth="0.8" />
            {/* Contoured grip bands */}
            <rect x="95" y="88" width="10.5" height="2" fill="#7c2d12" />
            <rect x="95" y="96" width="10.5" height="2" fill="#7c2d12" />
            <rect x="95" y="104" width="10.5" height="2" fill="#7c2d12" />
          </g>

          {/* Main Typography Plaque: ÍNTEGRACELL */}
          <g filter="url(#shadow3D)">
            {/* Dark navy plaque border */}
            <path
              d="M 24 136 C 30 128, 48 126, 100 126 C 152 126, 170 128, 176 136 C 182 144, 180 156, 172 162 C 160 166, 135 168, 100 168 C 65 168, 40 166, 28 162 C 20 156, 18 144, 24 136 Z"
              fill="#0b1736"
              stroke="#1e40af"
              strokeWidth="2.5"
            />
            {/* Text: Íntegra in White */}
            <text
              x="32"
              y="156"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontStyle="italic"
              fontSize="24"
              fill="#ffffff"
            >
              Íntegra
            </text>
            {/* Text: cell in Orange */}
            <text
              x="122"
              y="156"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontStyle="italic"
              fontSize="24"
              fill="#f97316"
            >
              cell
            </text>
          </g>

          {/* Secondary Ribbon: REPARO DE CELULAR */}
          <g>
            <rect x="44" y="166" width="112" height="18" rx="9" fill="#08142c" stroke="#3b82f6" strokeWidth="1" />
            <text
              x="100"
              y="179"
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="800"
              fontSize="9.5"
              letterSpacing="1"
              fill="#f8fafc"
            >
              REPARO DE CELULAR
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (variant === 'emblem') {
    // Round circular emblem icon (ideal for navbars, avatars, stamps)
    return (
      <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 drop-shadow-sm"
        >
          <defs>
            <radialGradient id="sphereGrad" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="90%" stopColor="#0c4a6e" />
              <stop offset="100%" stopColor="#082f49" />
            </radialGradient>

            <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>

            <linearGradient id="handleSmall" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#9a3412" />
            </linearGradient>

            <linearGradient id="shaftSmall" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>

          {/* Deep Navy outer rim */}
          <circle cx="60" cy="60" r="58" fill="#08142c" stroke="#1d4ed8" strokeWidth="2.5" />
          <circle cx="60" cy="60" r="52" fill="url(#sphereGrad)" />

          {/* Orange swooshes */}
          <path d="M 20 54 C 24 30, 46 18, 76 20 C 52 26, 32 38, 24 64 Z" fill="url(#arcGrad)" />
          <path d="M 100 66 C 96 90, 74 102, 44 100 C 68 94, 88 82, 96 56 Z" fill="url(#arcGrad)" />

          {/* Smartphone */}
          <rect x="42" y="24" width="36" height="72" rx="7" fill="#090d16" stroke="#38bdf8" strokeWidth="1.8" />
          <rect x="45" y="29" width="30" height="62" rx="4" fill="#0284c7" />
          {/* Glint */}
          <path d="M 50 38 L 52 34 L 54 38 L 58 40 L 54 42 L 52 46 L 50 42 L 46 40 Z" fill="#ffffff" opacity="0.9" />

          {/* Crossed Screwdrivers */}
          <g transform="rotate(45 60 60)">
            <rect x="58.5" y="16" width="3" height="38" fill="url(#shaftSmall)" />
            <polygon points="57,16 63,16 61,11 59,11" fill="#f8fafc" />
            <rect x="55.5" y="52" width="9" height="26" rx="4.5" fill="url(#handleSmall)" stroke="#7c2d12" strokeWidth="0.8" />
          </g>

          <g transform="rotate(-45 60 60)">
            <rect x="58.5" y="16" width="3" height="38" fill="url(#shaftSmall)" />
            <polygon points="57,16 63,16 61,11 59,11" fill="#f8fafc" />
            <rect x="55.5" y="52" width="9" height="26" rx="4.5" fill="url(#handleSmall)" stroke="#7c2d12" strokeWidth="0.8" />
          </g>

          <circle cx="60" cy="60" r="4.5" fill="#f97316" stroke="#090d16" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  // Default: Horizontal brand layout with emblem + stylized typography
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Emblem Icon */}
      <div className="shrink-0 relative">
        <IntegracellLogo variant="emblem" size={size} />
      </div>

      {/* Typography Lockup */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline">
          <span 
            className={`font-black italic tracking-tight text-lg sm:text-xl drop-shadow-xs ${
              isDark 
                ? 'text-white' 
                : 'text-slate-900 in-[.bg-slate-900]:text-white in-[.text-white]:text-white'
            }`}
          >
            Íntegra<span className={isDark ? 'text-orange-400' : 'text-orange-500 in-[.bg-slate-900]:text-orange-400'}>cell</span>
          </span>
          <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
            isDark 
              ? 'bg-orange-500/25 text-orange-300 border border-orange-400/40' 
              : 'bg-orange-500/10 text-orange-600 border border-orange-500/20 in-[.bg-slate-900]:bg-orange-500/25 in-[.bg-slate-900]:text-orange-300 in-[.bg-slate-900]:border-orange-400/40'
          }`}>
            OS
          </span>
        </div>

        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider font-sans ${
            isDark ? 'text-sky-300' : 'text-sky-800 in-[.bg-slate-900]:text-sky-300 in-[.text-white]:text-sky-300'
          }`}>
            Reparo de Celular
          </span>
          <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-orange-400' : 'bg-orange-500 in-[.bg-slate-900]:bg-orange-400'}`} />
          <span className={`text-[10px] font-medium ${
            isDark ? 'text-slate-300' : 'text-slate-500 in-[.bg-slate-900]:text-slate-300 in-[.text-white]:text-slate-300'
          }`}>
            Ordem de Serviço
          </span>
        </div>
      </div>
    </div>
  );
};
