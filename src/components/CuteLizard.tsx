import React, { useEffect, useState } from 'react';

interface CuteLizardProps {
  onDismiss?: () => void;
}

export const CuteLizard: React.FC<CuteLizardProps> = ({ onDismiss }) => {
  const [wiggle, setWiggle] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWiggle((prev) => (prev + 1) % 4);
    }, 200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center animate-bounce duration-700">
      {/* Funny popup text */}
      <div className="mb-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold tracking-wider animate-pulse flex items-center gap-1 shadow-lg">
        <span>🦎</span>
        <span>BOO! Munni darr gayi? 😂❤️</span>
      </div>

      {/* Cute cartoon gecko/lizard */}
      <svg
        viewBox="0 0 200 180"
        className="w-44 h-40 sm:w-52 sm:h-48 drop-shadow-[0_15px_25px_rgba(16,185,129,0.35)]"
        style={{
          transform: `rotate(${wiggle === 0 ? -6 : wiggle === 2 ? 6 : 0}deg) scale(1.05)`,
          transition: 'transform 0.15s ease-in-out',
        }}
      >
        <defs>
          <radialGradient id="lizardSkin" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="60%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </radialGradient>
          <radialGradient id="lizardBelly" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#bef264" />
          </radialGradient>
        </defs>

        {/* Tail (curly, cute wiggle) */}
        <path
          d={
            wiggle % 2 === 0
              ? 'M 100 120 Q 80 155 50 145 Q 30 135 45 118 Q 55 125 70 130 Z'
              : 'M 100 120 Q 120 155 150 145 Q 170 135 155 118 Q 145 125 130 130 Z'
          }
          fill="url(#lizardSkin)"
        />

        {/* Back Feet */}
        <ellipse cx="60" cy="115" rx="14" ry="9" fill="url(#lizardSkin)" transform="rotate(-30 60 115)" />
        <ellipse cx="140" cy="115" rx="14" ry="9" fill="url(#lizardSkin)" transform="rotate(30 140 115)" />
        {/* Cute suction toes */}
        <circle cx="48" cy="110" r="4.5" fill="#10b981" />
        <circle cx="46" cy="118" r="4.5" fill="#10b981" />
        <circle cx="50" cy="125" r="4.5" fill="#10b981" />
        <circle cx="152" cy="110" r="4.5" fill="#10b981" />
        <circle cx="154" cy="118" r="4.5" fill="#10b981" />
        <circle cx="150" cy="125" r="4.5" fill="#10b981" />

        {/* Front Hands waving */}
        <ellipse cx="50" cy="75" rx="13" ry="8" fill="url(#lizardSkin)" transform="rotate(-40 50 75)" />
        <ellipse cx="150" cy="75" rx="13" ry="8" fill="url(#lizardSkin)" transform="rotate(40 150 75)" />
        <circle cx="40" cy="68" r="4" fill="#10b981" />
        <circle cx="38" cy="75" r="4" fill="#10b981" />
        <circle cx="160" cy="68" r="4" fill="#10b981" />
        <circle cx="162" cy="75" r="4" fill="#10b981" />

        {/* Plump Chubby Body */}
        <ellipse cx="100" cy="95" rx="38" ry="42" fill="url(#lizardSkin)" />
        {/* Belly */}
        <ellipse cx="100" cy="100" rx="24" ry="28" fill="url(#lizardBelly)" />

        {/* Spots on body */}
        <circle cx="88" cy="85" r="4" fill="#047857" opacity="0.6" />
        <circle cx="112" cy="82" r="3.5" fill="#047857" opacity="0.6" />
        <circle cx="82" cy="105" r="3" fill="#047857" opacity="0.6" />
        <circle cx="118" cy="108" r="4" fill="#047857" opacity="0.6" />

        {/* Head */}
        <ellipse cx="100" cy="55" rx="34" ry="28" fill="url(#lizardSkin)" />

        {/* Googly big eyes on top of head */}
        <circle cx="80" cy="38" r="14" fill="#ffffff" stroke="#059669" strokeWidth="2.5" />
        <circle cx="120" cy="38" r="14" fill="#ffffff" stroke="#059669" strokeWidth="2.5" />
        {/* Pupils looking silly/cute */}
        <circle cx="82" cy="38" r="6" fill="#1e293b" />
        <circle cx="118" cy="38" r="6" fill="#1e293b" />
        {/* Catchlights */}
        <circle cx="80" cy="35" r="2.5" fill="#ffffff" />
        <circle cx="116" cy="35" r="2.5" fill="#ffffff" />

        {/* Blushing cheeks */}
        <circle cx="76" cy="62" r="7" fill="#f43f5e" opacity="0.4" />
        <circle cx="124" cy="62" r="7" fill="#f43f5e" opacity="0.4" />

        {/* Silly happy smile */}
        <path
          d="M 88 64 Q 100 76 112 64"
          fill="none"
          stroke="#064e3b"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Cute pink forked tongue stick-out (blep!) */}
        <path
          d="M 100 70 Q 100 82 96 86 M 100 70 Q 100 82 104 86"
          stroke="#f43f5e"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Tiny cute pink party hat on lizard */}
        <polygon points="100,10 90,32 110,32" fill="#ec4899" />
        <circle cx="100" cy="9" r="3" fill="#fef08a" />
        <line x1="93" y1="22" x2="107" y2="22" stroke="#fbcfe8" strokeWidth="2" />
      </svg>
    </div>
  );
};
