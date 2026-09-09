import React from 'react';

export default function ByteMascot({ emotion = 'happy', dialog = '', size = 'md', className = '' }) {
    const sizeMap = {
        sm: { width: 64, height: 64 },
        md: { width: 100, height: 100 },
        lg: { width: 150, height: 150 },
        xl: { width: 200, height: 200 }
    };

    const dims = sizeMap[size] || sizeMap.md;

    return (
        <div className={`byte-mascot-container flex items-center gap-3 relative ${className}`}>
            {/* Speech Bubble */}
            {dialog && (
                <div className="byte-speech-bubble bg-slate-800/90 text-slate-100 border border-cyan-500/40 px-4 py-2.5 rounded-2xl shadow-lg backdrop-blur-md max-w-xs text-sm font-medium relative animate-bounce-short">
                    <span>{dialog}</span>
                    <div className="speech-arrow border-8 border-transparent border-r-slate-800/90 absolute -left-4 top-1/2 -translate-y-1/2"></div>
                </div>
            )}

            {/* Robot SVG Graphics */}
            <div className={`byte-robot-body relative animate-float emotion-${emotion}`} style={{ width: dims.width, height: dims.height }}>
                <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-neon">
                    {/* Antenna Glow */}
                    <circle cx="60" cy="18" r="7" fill="#06B6D4" className="animate-pulse" />
                    <line x1="60" y1="18" x2="60" y2="34" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />

                    {/* Robot Head Body */}
                    <rect x="25" y="34" width="70" height="58" rx="20" fill="url(#botHeadGrad)" stroke="#38BDF8" strokeWidth="3" />

                    {/* Visor Screen */}
                    <rect x="33" y="44" width="54" height="34" rx="12" fill="#0F172A" stroke="#0284C7" strokeWidth="2" />

                    {/* Eyes based on emotion */}
                    {emotion === 'happy' && (
                        <g fill="#38BDF8">
                            <circle cx="48" cy="60" r="5" className="animate-blink" />
                            <circle cx="72" cy="60" r="5" className="animate-blink" />
                        </g>
                    )}

                    {emotion === 'celebrate' || emotion === 'excited' ? (
                        <g stroke="#38BDF8" strokeWidth="3" strokeLinecap="round">
                            {/* Star / Sparkle Eyes */}
                            <path d="M43 60 L53 60 M48 55 L48 65" />
                            <path d="M67 60 L77 60 M72 55 L72 65" />
                        </g>
                    ) : null}

                    {emotion === 'thinking' && (
                        <g fill="#F59E0B">
                            <circle cx="48" cy="58" r="4" />
                            <rect x="67" y="58" width="10" height="4" rx="2" />
                        </g>
                    )}

                    {emotion === 'encouraging' && (
                        <g fill="#10B981">
                            <circle cx="48" cy="58" r="5" />
                            <circle cx="72" cy="58" r="5" />
                            <path d="M52 68 Q60 74 68 68" stroke="#10B981" strokeWidth="3" fill="none" strokeLinecap="round" />
                        </g>
                    )}

                    {/* Cute Smile for happy */}
                    {emotion === 'happy' && (
                        <path d="M53 66 Q60 71 67 66" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    )}

                    {/* Ear Bolts */}
                    <circle cx="21" cy="63" r="5" fill="#3B82F6" />
                    <circle cx="99" cy="63" r="5" fill="#3B82F6" />

                    {/* Body Base Collar */}
                    <path d="M40 92 Q60 98 80 92 L75 106 Q60 110 45 106 Z" fill="url(#botBodyGrad)" />

                    <defs>
                        <linearGradient id="botHeadGrad" x1="25" y1="34" x2="95" y2="92" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#1E293B" />
                            <stop offset="1" stopColor="#0F172A" />
                        </linearGradient>
                        <linearGradient id="botBodyGrad" x1="40" y1="92" x2="80" y2="108" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#38BDF8" />
                            <stop offset="1" stopColor="#3B82F6" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
}
