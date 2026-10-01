import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PageNavigation } from '../components/PageIndicator';
import { Sparkles, Heart } from 'lucide-react';
import { romanticAudio } from '../utils/audio';

interface Page3Props {
  onNext: () => void;
}

export const Page3Birthday: React.FC<Page3Props> = ({ onNext }) => {
  const [candlesBlown, setCandlesBlown] = useState(false);

  const handleBlowCandles = () => {
    if (candlesBlown) return;
    setCandlesBlown(true);
    romanticAudio.playCelebrationChime();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([30, 70, 50]);
    }
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#f472b6', '#fb7185', '#fef08a', '#e879f9', '#ffffff'],
      });
    } catch {
      // fallback
    }
  };

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-between px-4 sm:px-6 py-3 sm:py-5 text-center max-w-xl mx-auto overflow-hidden">
      {/* Warm celebratory background glow */}
      <div className="absolute top-1/4 w-72 h-72 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="space-y-1.5 z-10 pt-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-400/25 text-[11px] tracking-wider uppercase text-pink-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-pink-300" />
          <span>Special Celebration</span>
          <Sparkles className="w-3.5 h-3.5 text-pink-300" />
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-rose-200 to-pink-300 drop-shadow-md leading-tight">
          Happy Birthday, Meri Pyaari Munni ❤️
        </h1>

        <p className="text-xs sm:text-base text-pink-200/80 font-hand tracking-wide">
          Today is all about celebrating the sweetest smile in the world 🌷✨
        </p>
      </div>

      {/* Cute Birthday Cake Illustration */}
      <div className="relative my-auto z-10 flex flex-col items-center scale-90 sm:scale-100">
        {/* Soft floating balloons on sides */}
        <div className="absolute -top-8 -left-8 sm:-left-16 animate-gentle-float pointer-events-none">
          <div className="w-10 h-12 rounded-full bg-gradient-to-b from-pink-400 to-rose-500 opacity-80 shadow-lg shadow-pink-500/30 flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-white/70" />
          </div>
          <div className="w-0.5 h-8 bg-pink-300/40 mx-auto" />
        </div>

        <div className="absolute -top-6 -right-8 sm:-right-16 animate-gentle-float pointer-events-none delay-500">
          <div className="w-9 h-11 rounded-full bg-gradient-to-b from-purple-400 to-pink-500 opacity-80 shadow-lg shadow-purple-500/30 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white/70" />
          </div>
          <div className="w-0.5 h-8 bg-pink-300/40 mx-auto" />
        </div>

        {/* The Romantic Birthday Cake */}
        <div
          onClick={handleBlowCandles}
          className="relative cursor-pointer group p-2"
          title="Tap to make a wish and blow candle!"
        >
          <svg viewBox="0 0 200 200" className="w-40 h-40 sm:w-52 sm:h-52 drop-shadow-2xl">
            <defs>
              <linearGradient id="cakeBase" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#db2777" />
              </linearGradient>
              <linearGradient id="frosting" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#fdf2f8" />
              </linearGradient>
              <radialGradient id="flame" cx="50%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#fde047" />
                <stop offset="85%" stopColor="#f97316" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* Stand / Plate */}
            <ellipse cx="100" cy="180" rx="75" ry="14" fill="#3b2d54" />
            <ellipse cx="100" cy="177" rx="70" ry="11" fill="#4c3a6b" />

            {/* Cake Bottom Tier */}
            <rect x="45" y="125" width="110" height="45" rx="8" fill="url(#cakeBase)" />
            {/* Bottom tier frosting drippings */}
            <path
              d="M 45 130 C 55 142, 65 130, 75 140 C 85 148, 95 132, 105 142 C 115 148, 125 132, 135 142 C 145 130, 155 135, 155 130 L 155 125 L 45 125 Z"
              fill="url(#frosting)"
            />

            {/* Cake Top Tier */}
            <rect x="62" y="85" width="76" height="42" rx="6" fill="#f43f5e" />
            {/* Top tier frosting drippings */}
            <path
              d="M 62 90 C 70 100, 80 92, 88 100 C 96 104, 104 92, 114 100 C 122 104, 130 92, 138 90 L 138 85 L 62 85 Z"
              fill="url(#frosting)"
            />

            {/* Cute heart toppers on cake */}
            <circle cx="80" cy="115" r="3" fill="#fef08a" />
            <circle cx="100" cy="118" r="3" fill="#fef08a" />
            <circle cx="120" cy="115" r="3" fill="#fef08a" />
            <circle cx="65" cy="155" r="3" fill="#fef08a" />
            <circle cx="100" cy="158" r="3" fill="#fef08a" />
            <circle cx="135" cy="155" r="3" fill="#fef08a" />

            {/* Candle Stick */}
            <rect x="96" y="52" width="8" height="34" rx="2" fill="#fbcfe8" />
            <path d="M 96 60 L 104 56 M 96 72 L 104 68" stroke="#ec4899" strokeWidth="1.5" />

            {/* Candle Wick */}
            <line x1="100" y1="52" x2="100" y2="44" stroke="#4a044e" strokeWidth="2" />

            {/* Candle Flame (Interactive!) */}
            {!candlesBlown ? (
              <g className="animate-pulse">
                {/* Glow ring */}
                <circle cx="100" cy="38" r="14" fill="#fbbf24" opacity="0.3" />
                {/* Flame tear shape */}
                <path
                  d="M 100 24 C 95 32, 94 38, 100 44 C 106 38, 105 32, 100 24 Z"
                  fill="url(#flame)"
                />
              </g>
            ) : (
              // Sweet smoke puff when blown
              <g className="animate-bounce">
                <circle cx="100" cy="38" r="3" fill="#e2e8f0" opacity="0.6" />
                <circle cx="103" cy="30" r="4" fill="#cbd5e1" opacity="0.4" />
                <circle cx="98" cy="22" r="5" fill="#94a3b8" opacity="0.2" />
              </g>
            )}
          </svg>

          {/* Prompt to tap candle */}
          <div className="mt-1 text-xs text-pink-300/80 font-medium">
            {!candlesBlown ? (
              <span className="inline-flex items-center gap-1 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
                ✨ Tap the cake to blow the candle! 🎂
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-emerald-300 font-medium">
                🎉 Wish granted for Munni! 💖
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Romantic Birthday Message */}
      <div className="max-w-md z-10 px-4">
        <p className="text-sm sm:text-base text-pink-100/90 leading-relaxed font-sans font-light">
          May your year be as radiant, joyful, and deeply cherished as you make my world every single day.
        </p>
      </div>

      {/* Navigation */}
      <div className="w-full z-10">
        <PageNavigation currentPage={3} onContinue={onNext} />
      </div>
    </div>
  );
};
