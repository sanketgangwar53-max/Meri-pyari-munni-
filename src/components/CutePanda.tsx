import React, { useEffect, useState } from 'react';

export type PandaMood = 'idle' | 'curious' | 'wrong' | 'surprised' | 'dancing' | 'happy_finish';

interface CutePandaProps {
  mood: PandaMood;
  danceStep?: number; // 0 to 16
}

export const CutePanda: React.FC<CutePandaProps> = ({ mood, danceStep = 0 }) => {
  const [blink, setBlink] = useState(false);

  // Natural blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  // Determine dynamic dance transforms based on danceStep and mood
  let headTransform = 'rotate(0deg)';
  let bodyTransform = 'translateY(0px)';
  let leftArmTransform = 'rotate(0deg)';
  let rightArmTransform = 'rotate(0deg)';
  let leftEarTransform = 'scale(1)';
  let rightEarTransform = 'scale(1)';
  let mouthType: 'smile' | 'surprised' | 'laugh' | 'shy' = 'smile';
  let eyesSparkle = false;
  let showSparkles = false;
  let showHearts = false;

  if (mood === 'wrong') {
    headTransform = 'rotate(-4deg)';
    bodyTransform = 'translateY(2px)';
    leftArmTransform = 'rotate(15deg)';
    rightArmTransform = 'rotate(-15deg)';
    mouthType = 'shy';
  } else if (mood === 'surprised') {
    headTransform = 'translateY(-6px) scale(1.04)';
    bodyTransform = 'translateY(-2px)';
    leftArmTransform = 'rotate(-45deg)';
    rightArmTransform = 'rotate(45deg)';
    leftEarTransform = 'scale(1.15) rotate(-10deg)';
    rightEarTransform = 'scale(1.15) rotate(10deg)';
    mouthType = 'surprised';
    eyesSparkle = true;
  } else if (mood === 'dancing') {
    eyesSparkle = true;
    showSparkles = true;
    showHearts = true;
    mouthType = 'laugh';

    // Rhythmic steps:
    const stepMod = danceStep % 4;
    if (stepMod === 0) {
      headTransform = 'rotate(6deg) translateY(-4px)';
      bodyTransform = 'translateY(-6px) rotate(2deg)';
      leftArmTransform = 'rotate(-55deg) translateY(-6px)';
      rightArmTransform = 'rotate(20deg)';
      leftEarTransform = 'scale(1.1) rotate(6deg)';
      rightEarTransform = 'scale(0.95)';
    } else if (stepMod === 1) {
      headTransform = 'rotate(-6deg) translateY(2px)';
      bodyTransform = 'translateY(0px) rotate(-2deg)';
      leftArmTransform = 'rotate(10deg)';
      rightArmTransform = 'rotate(55deg) translateY(-6px)';
      leftEarTransform = 'scale(0.95)';
      rightEarTransform = 'scale(1.1) rotate(-6deg)';
    } else if (stepMod === 2) {
      headTransform = 'rotate(8deg) translateY(-8px)';
      bodyTransform = 'translateY(-8px) scale(1.02)';
      leftArmTransform = 'rotate(-70deg) translateY(-8px)';
      rightArmTransform = 'rotate(70deg) translateY(-8px)';
      leftEarTransform = 'scale(1.12) rotate(12deg)';
      rightEarTransform = 'scale(1.12) rotate(-12deg)';
    } else {
      headTransform = 'rotate(-4deg) translateY(-2px)';
      bodyTransform = 'translateY(-2px) rotate(3deg)';
      leftArmTransform = 'rotate(-30deg)';
      rightArmTransform = 'rotate(40deg)';
      leftEarTransform = 'scale(1.05)';
      rightEarTransform = 'scale(1.05)';
    }
  } else if (mood === 'happy_finish') {
    headTransform = 'rotate(4deg) scale(1.05)';
    bodyTransform = 'translateY(-4px)';
    leftArmTransform = 'rotate(-65deg)';
    rightArmTransform = 'rotate(65deg)';
    mouthType = 'laugh';
    eyesSparkle = true;
    showHearts = true;
  }

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-56 h-64 sm:w-64 sm:h-72 my-2 transition-all">
      {/* Floating Sparkles & Hearts when dancing */}
      {showHearts && (
        <div className="absolute inset-0 pointer-events-none z-30">
          <span className="absolute top-2 left-6 text-xl animate-bounce text-pink-400">❤️</span>
          <span className="absolute top-4 right-6 text-2xl animate-pulse text-rose-500 delay-150">💖</span>
          <span className="absolute bottom-12 left-2 text-lg animate-bounce text-pink-300 delay-300">💕</span>
          <span className="absolute top-0 right-16 text-sm animate-ping text-pink-400">✨</span>
          <span className="absolute bottom-16 right-4 text-sm animate-pulse text-yellow-300">✨</span>
        </div>
      )}

      {/* Soft spotlight pool beneath the panda */}
      <div className="absolute -bottom-2 w-48 h-8 rounded-full bg-pink-500/15 blur-lg" />
      <div className="absolute -bottom-1 w-36 h-5 rounded-full bg-black/40 blur-sm" />

      {/* Main SVG Cute Cartoon Panda */}
      <svg
        viewBox="0 0 240 260"
        className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)]"
        style={{
          transition: 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: bodyTransform,
        }}
      >
        <defs>
          {/* Gradients for stylized 3D cartoon depth */}
          <radialGradient id="bodyFur" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="75%" stopColor="#f3f4f8" />
            <stop offset="100%" stopColor="#e2e5ee" />
          </radialGradient>

          <radialGradient id="darkFur" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#3d374e" />
            <stop offset="60%" stopColor="#221e2d" />
            <stop offset="100%" stopColor="#14111c" />
          </radialGradient>

          <radialGradient id="earPink" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbb6ce" />
            <stop offset="100%" stopColor="#f472b6" />
          </radialGradient>

          <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(244, 114, 182, 0.65)" />
            <stop offset="70%" stopColor="rgba(244, 114, 182, 0.25)" />
            <stop offset="100%" stopColor="rgba(244, 114, 182, 0)" />
          </radialGradient>

          <radialGradient id="eyeGlow" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#3b2b48" />
            <stop offset="75%" stopColor="#191322" />
            <stop offset="100%" stopColor="#0a0710" />
          </radialGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- PANDA BODY (Chubby, soft) --- */}
        <g id="bodyGroup">
          {/* Chubby tummy */}
          <ellipse cx="120" cy="180" rx="66" ry="60" fill="url(#bodyFur)" />
          {/* Subtle tummy shadow */}
          <ellipse cx="120" cy="192" rx="48" ry="38" fill="#e9ecf3" opacity="0.6" />

          {/* Left Foot */}
          <g transform="translate(75, 222)">
            <ellipse cx="0" cy="0" rx="20" ry="14" fill="url(#darkFur)" />
            {/* Foot pads */}
            <circle cx="0" cy="-2" r="7" fill="#f472b6" opacity="0.85" />
            <circle cx="-7" cy="-7" r="3" fill="#f472b6" opacity="0.85" />
            <circle cx="0" cy="-10" r="3.2" fill="#f472b6" opacity="0.85" />
            <circle cx="7" cy="-7" r="3" fill="#f472b6" opacity="0.85" />
          </g>

          {/* Right Foot */}
          <g transform="translate(165, 222)">
            <ellipse cx="0" cy="0" rx="20" ry="14" fill="url(#darkFur)" />
            {/* Foot pads */}
            <circle cx="0" cy="-2" r="7" fill="#f472b6" opacity="0.85" />
            <circle cx="-7" cy="-7" r="3" fill="#f472b6" opacity="0.85" />
            <circle cx="0" cy="-10" r="3.2" fill="#f472b6" opacity="0.85" />
            <circle cx="7" cy="-7" r="3" fill="#f472b6" opacity="0.85" />
          </g>

          {/* Left Arm / Paw */}
          <g
            style={{
              transformOrigin: '72px 145px',
              transform: leftArmTransform,
              transition: 'transform 0.22s ease-out',
            }}
          >
            <ellipse cx="64" cy="160" rx="16" ry="24" fill="url(#darkFur)" transform="rotate(22 64 160)" />
            {/* Paw pad */}
            <circle cx="56" cy="172" r="6" fill="#f472b6" opacity="0.8" />
          </g>

          {/* Right Arm / Paw */}
          <g
            style={{
              transformOrigin: '168px 145px',
              transform: rightArmTransform,
              transition: 'transform 0.22s ease-out',
            }}
          >
            <ellipse cx="176" cy="160" rx="16" ry="24" fill="url(#darkFur)" transform="rotate(-22 176 160)" />
            {/* Paw pad */}
            <circle cx="184" cy="172" r="6" fill="#f472b6" opacity="0.8" />
          </g>
        </g>

        {/* --- PANDA HEAD (Oversized, super cute, expressive) --- */}
        <g
          id="headGroup"
          style={{
            transformOrigin: '120px 115px',
            transform: headTransform,
            transition: 'transform 0.22s ease-out',
          }}
        >
          {/* Left Ear */}
          <g
            style={{
              transformOrigin: '68px 52px',
              transform: leftEarTransform,
              transition: 'transform 0.2s ease',
            }}
          >
            <circle cx="68" cy="52" r="26" fill="url(#darkFur)" />
            <circle cx="68" cy="52" r="14" fill="url(#earPink)" opacity="0.7" />
          </g>

          {/* Right Ear */}
          <g
            style={{
              transformOrigin: '172px 52px',
              transform: rightEarTransform,
              transition: 'transform 0.2s ease',
            }}
          >
            <circle cx="172" cy="52" r="26" fill="url(#darkFur)" />
            <circle cx="172" cy="52" r="14" fill="url(#earPink)" opacity="0.7" />
          </g>

          {/* Head Shape - chubby rounded cheeks */}
          <path
            d="M 58 112 C 54 80, 80 50, 120 50 C 160 50, 186 80, 182 112 C 188 132, 178 156, 154 162 C 136 166, 104 166, 86 162 C 62 156, 52 132, 58 112 Z"
            fill="url(#bodyFur)"
          />

          {/* Cheeks blush (chubby adorable glow) */}
          <ellipse cx="74" cy="128" rx="18" ry="12" fill="url(#cheekBlush)" />
          <ellipse cx="166" cy="128" rx="18" ry="12" fill="url(#cheekBlush)" />

          {/* --- EYE PATCHES (Signature cute tilted ovals) --- */}
          {/* Left Eye Patch */}
          <ellipse
            cx="88"
            cy="104"
            rx="20"
            ry="25"
            fill="url(#darkFur)"
            transform="rotate(-16 88 104)"
          />
          {/* Right Eye Patch */}
          <ellipse
            cx="152"
            cy="104"
            rx="20"
            ry="25"
            fill="url(#darkFur)"
            transform="rotate(16 152 104)"
          />

          {/* --- EYES (Big, sparkling, expressive) --- */}
          {blink ? (
            // Cute blinking line
            <g stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round">
              <path d="M 78 106 Q 88 112 98 106" />
              <path d="M 142 106 Q 152 112 162 106" />
            </g>
          ) : (
            <g>
              {/* Left Eye Ball */}
              <circle cx="90" cy="105" r="13.5" fill="url(#eyeGlow)" />
              {/* Left Catchlights (big anime-style sparkle highlights) */}
              <circle cx="87" cy="100" r="5" fill="#ffffff" />
              <circle cx="94" cy="108" r="2.2" fill="#ffffff" />
              {eyesSparkle && (
                <polygon
                  points="90,96 92,100 96,100 93,102 94,106 90,103 86,106 87,102 84,100 88,100"
                  fill="#fef08a"
                  transform="scale(0.8) translate(22, 22)"
                />
              )}

              {/* Right Eye Ball */}
              <circle cx="150" cy="105" r="13.5" fill="url(#eyeGlow)" />
              {/* Right Catchlights */}
              <circle cx="147" cy="100" r="5" fill="#ffffff" />
              <circle cx="154" cy="108" r="2.2" fill="#ffffff" />
              {eyesSparkle && (
                <polygon
                  points="150,96 152,100 156,100 153,102 154,106 150,103 146,106 147,102 144,100 148,100"
                  fill="#fef08a"
                  transform="scale(0.8) translate(37, 22)"
                />
              )}
            </g>
          )}

          {/* --- NOSE (Tiny, soft rounded triangle) --- */}
          <path
            d="M 115 120 C 117 117, 123 117, 125 120 C 126 123, 121 126, 120 126 C 119 126, 114 123, 115 120 Z"
            fill="#1e1828"
          />
          {/* Nose highlight */}
          <circle cx="118" cy="119" r="1.2" fill="#ffffff" opacity="0.7" />

          {/* --- MOUTH (Expressive based on mood) --- */}
          {mouthType === 'smile' && (
            <path
              d="M 114 129 Q 120 133 126 129"
              stroke="#241e30"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {mouthType === 'surprised' && (
            <ellipse
              cx="120"
              cy="133"
              rx="5"
              ry="7"
              fill="#d946ef"
              stroke="#241e30"
              strokeWidth="1.8"
            />
          )}

          {mouthType === 'laugh' && (
            <g>
              <path
                d="M 110 128 Q 120 144 130 128 Z"
                fill="#ec4899"
                stroke="#241e30"
                strokeWidth="1.8"
              />
              <path d="M 114 133 Q 120 139 126 133" fill="#f472b6" />
            </g>
          )}

          {mouthType === 'shy' && (
            <path
              d="M 115 131 Q 120 128 125 131"
              stroke="#241e30"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Tiny red hair bow / cute flower on left ear */}
          <g transform="translate(86, 64) scale(0.7)">
            <circle cx="0" cy="0" r="4" fill="#fb7185" />
            <circle cx="-5" cy="-3" r="3.5" fill="#f43f5e" />
            <circle cx="5" cy="-3" r="3.5" fill="#f43f5e" />
            <circle cx="-4" cy="4" r="3.5" fill="#f43f5e" />
            <circle cx="4" cy="4" r="3.5" fill="#f43f5e" />
            <circle cx="0" cy="0" r="2.2" fill="#fef08a" />
          </g>
        </g>
      </svg>
    </div>
  );
};
