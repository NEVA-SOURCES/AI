import React from "react";

// === MOTION === Hand-crafted custom SVG icons themed for AI/Coding/Images (No phone emojis)

/**
 * Animated/Interactive NEVA Logo Mark
 */
export const NevaLogo = ({ className, animate = false }: { className?: string; animate?: boolean }) => (
  <svg viewBox="0 0 40 40" className={className} fill="none" style={{ willChange: "transform" }}>
    <defs>
      <linearGradient id="nevaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00F5FF" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
    {/* Outer hexagon ring */}
    <path 
      d="M20 2 L36 11 L36 29 L20 38 L4 29 L4 11 Z" 
      stroke="url(#nevaGrad)" 
      strokeWidth="1.5" 
      fill="none"
      className={animate ? "animate-[spin_20s_linear_infinite]" : ""}
    />
    {/* Inner N letter */}
    <path 
      d="M14 12 L14 28 L20 20 L26 28 L26 12" 
      stroke="url(#nevaGrad)" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill="none"
    />
    {/* Center dot */}
    <circle cx="20" cy="20" r="3" fill="#00F5FF" className={animate ? "animate-pulse" : ""} />
  </svg>
);

/**
 * AI Brain Network Icon
 */
export const AIBrainIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    {/* Brain hemisphere left */}
    <path d="M12 4C8 4 5 7 5 11C5 15 8 18 12 18" strokeLinecap="round" />
    {/* Brain hemisphere right */}
    <path d="M12 4C16 4 19 7 19 11C19 15 16 18 12 18" strokeLinecap="round" />
    {/* Neural connections */}
    <circle cx="8" cy="9" r="1" fill="currentColor" />
    <circle cx="16" cy="9" r="1" fill="currentColor" />
    <circle cx="10" cy="14" r="1" fill="currentColor" />
    <circle cx="14" cy="14" r="1" fill="currentColor" />
    <circle cx="12" cy="11" r="1.5" fill="currentColor" className="animate-pulse" />
    {/* Connection lines */}
    <path d="M8 9L12 11L16 9" strokeDasharray="2 2" opacity="0.5" />
    <path d="M10 14L12 11L14 14" strokeDasharray="2 2" opacity="0.5" />
  </svg>
);

/**
 * Code Matrix Icon
 */
export const CodeMatrixIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    {/* Terminal window frame */}
    <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" />
    {/* Code brackets */}
    <path d="M7 8L4 12L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 8L20 12L17 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Slash */}
    <path d="M10 18L14 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Blinking cursor */}
    <rect x="11" y="15" width="2" height="4" fill="#00F5FF" className="animate-[blink_1s_step-end_infinite]" />
  </svg>
);

/**
 * Image Canvas Icon
 */
export const ImageCanvasIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    {/* Canvas frame */}
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
    {/* Mountain/landscape */}
    <path d="M3 17L8 11L12 15L16 9L21 14V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V17Z" 
      fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" />
    {/* Sun/moon */}
    <circle cx="17" cy="8" r="2" fill="currentColor" className="animate-[pulse_3s_ease-in-out_infinite]" />
    {/* Sparkle */}
    <path d="M8 6L8.5 7.5L10 8L8.5 8.5L8 10L7.5 8.5L6 8L7.5 7.5Z" fill="#f59e0b" className="animate-[spin_4s_linear_infinite]" />
  </svg>
);

/**
 * DeepThink Search Icon
 */
export const DeepThinkIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    {/* Magnifying glass */}
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path d="M15 15L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Orbital rings around search */}
    <ellipse cx="10" cy="10" rx="9" ry="4" stroke="currentColor" strokeWidth="0.5" opacity="0.3" 
      className="animate-[spin_8s_linear_infinite]" />
    <ellipse cx="10" cy="10" rx="4" ry="9" stroke="currentColor" strokeWidth="0.5" opacity="0.3" 
      className="animate-[spin_12s_linear_infinite_reverse]" />
    {/* Brain nodes */}
    <circle cx="10" cy="10" r="1.5" fill="#f59e0b" className="animate-pulse" />
  </svg>
);

/**
 * Live Monitor Icon
 */
export const LiveMonitorIcon = ({ className, active = false }: { className?: string; active?: boolean }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    {/* Monitor frame */}
    <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 21H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 17V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Waveform */}
    <path 
      d="M5 10L7 10L8 7L9 13L10 10L12 10L13 6L14 14L15 10L17 10L19 10" 
      stroke={active ? "#00F5FF" : "currentColor"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={active ? "animate-[pulse_1.5s_ease-in-out_infinite]" : ""}
    />
    {/* Live dot */}
    {active && <circle cx="19" cy="5" r="2" fill="#ef4444" className="animate-pulse" />}
  </svg>
);

/**
 * Mission Rocket Icon
 */
export const MissionIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    {/* Rocket body */}
    <path d="M12 2C12 2 8 6 8 12V16L5 19V21H19V19L16 16V12C16 6 12 2 12 2Z" 
      stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    {/* Window */}
    <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
    {/* Flame */}
    <path d="M9 21C9 21 10 23 12 23C14 23 15 21 15 21" 
      stroke="#f97316" strokeWidth="1.5" strokeLinecap="round"
      className="animate-[pulse_1s_ease-in-out_infinite]" />
    {/* Exhaust particles */}
    <circle cx="10" cy="22" r="0.5" fill="#f97316" className="animate-[bounce_1s_infinite]" />
    <circle cx="14" cy="22" r="0.5" fill="#f97316" className="animate-[bounce_1.2s_infinite]" />
  </svg>
);

/**
 * Memory Crystal Icon
 */
export const MemoryIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    {/* Crystal shape */}
    <path d="M12 2L20 8L12 14L4 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M4 8V16L12 22L20 16V8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 14V22" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
    {/* Inner glow */}
    <circle cx="12" cy="10" r="2" fill="currentColor" fillOpacity="0.3" className="animate-pulse" />
  </svg>
);
