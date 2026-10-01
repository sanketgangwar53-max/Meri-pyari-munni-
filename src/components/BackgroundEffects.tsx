import React, { useMemo } from 'react';

interface Particle {
  id: number;
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  type: 'heart' | 'star' | 'glow';
}

export const BackgroundEffects: React.FC<{ theme?: string }> = ({ theme }) => {
  // Stable particle positions
  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${(i * 17) % 96 + 2}%`,
      top: `${(i * 23) % 94 + 3}%`,
      size: (i % 3) + 2,
      duration: 10 + (i % 8) * 2,
      delay: (i % 6) * 1.5,
      opacity: 0.15 + (i % 5) * 0.1,
      type: i % 4 === 0 ? 'heart' : i % 3 === 0 ? 'star' : 'glow',
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Cinematic subtle ambient lighting gradients */}
      <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-pink-900/15 via-purple-900/10 to-transparent blur-3xl animate-warm-pulse pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-rose-950/20 via-pink-950/10 to-transparent blur-3xl animate-warm-pulse pointer-events-none delay-1000" />
      <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-pink-800/8 via-rose-600/5 to-transparent blur-[120px] pointer-events-none" />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute transition-opacity duration-1000"
          style={{
            left: p.left,
            top: p.top,
            animation: `gentleFloat ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        >
          {p.type === 'heart' ? (
            <svg
              className="text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]"
              width={p.size * 4}
              height={p.size * 4}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : p.type === 'star' ? (
            <div
              className="rounded-full bg-amber-200 shadow-[0_0_10px_#fde047]"
              style={{ width: p.size * 1.5, height: p.size * 1.5 }}
            />
          ) : (
            <div
              className="rounded-full bg-pink-300 shadow-[0_0_12px_#f472b6]"
              style={{ width: p.size * 2, height: p.size * 2 }}
            />
          )}
        </div>
      ))}
    </div>
  );
};
