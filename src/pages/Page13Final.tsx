import React, { useState } from 'react';
import { Heart, Sparkles, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { romanticAudio } from '../utils/audio';

interface Page13Props {
  onRestart: () => void;
}

export const Page13Final: React.FC<Page13Props> = ({ onRestart }) => {
  const [hugSent, setHugSent] = useState(false);

  const triggerHearts = () => {
    romanticAudio.playCelebrationChime();
    setHugSent(true);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([40, 80, 50, 80]);
    }
    try {
      confetti({
        particleCount: 70,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#fb7185', '#ec4899', '#fda4af', '#fef08a'],
      });
    } catch {}
  };

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-between px-4 sm:px-6 py-3 sm:py-5 text-center max-w-xl mx-auto select-none overflow-hidden">
      {/* Slow moving warm background glow */}
      <div className="absolute top-1/3 w-96 h-96 rounded-full bg-gradient-to-tr from-pink-600/20 via-rose-500/15 to-purple-600/10 blur-[110px] pointer-events-none animate-warm-pulse" />

      {/* Top romantic sparkles */}
      <div className="flex items-center gap-3 animate-gentle-float z-10 pt-2">
        <Sparkles className="w-4 h-4 text-pink-300" />
        <Heart className="w-6 h-6 text-rose-500 fill-rose-500/40" />
        <Sparkles className="w-4 h-4 text-pink-300" />
      </div>

      {/* Main Final Message Block */}
      <div className="space-y-4 z-10 max-w-lg my-auto">
        <h1 className="text-2xl sm:text-4xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-rose-200 to-pink-300 drop-shadow-lg leading-tight">
          Happy Birthday, Meri Pyaari Munni ❤️
        </h1>

        <p className="text-sm sm:text-base text-pink-100/90 leading-relaxed font-sans font-light">
          Thank you for being such a beautiful part of my life.
        </p>

        {/* Highlighted core promise */}
        <div className="py-3 px-5 rounded-3xl bg-[#1d142d]/80 border border-pink-500/25 shadow-xl backdrop-blur-md">
          <p className="text-sm sm:text-base font-serif-romance italic text-rose-200 leading-relaxed">
            And this isn't the end…
            <br />
            it’s just another beautiful memory we’ll keep. ❤️
          </p>
        </div>

        {/* Interactive Virtual Hug Button */}
        <div className="pt-1 flex flex-col items-center gap-2">
          <button
            onClick={triggerHearts}
            className="group px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-400 hover:to-pink-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-pink-900/40 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span>Send a Virtual Hug & Kiss</span>
            <span className="group-hover:scale-125 transition-transform">🤗💋</span>
          </button>

          {hugSent && (
            <div className="text-xs text-emerald-300 font-medium animate-bounce">
              ✨ 10,000 warm hugs & love sent to Munni! ❤️🐼
            </div>
          )}
        </div>

        {/* I Love You */}
        <div className="pt-1">
          <span
            onClick={triggerHearts}
            className="inline-block text-xl sm:text-2xl font-bold font-hand text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-400 drop-shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          >
            I Love You, Munni ❤️
          </span>
          <p className="text-[11px] text-pink-400/60 font-sans mt-1">
            The website ended, but the love story continues. ❤️
          </p>
        </div>
      </div>

      {/* Action / Revisit Buttons */}
      <div className="w-full flex flex-col items-center gap-2 z-10 pb-2">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 hover:bg-pink-500/20 border border-pink-400/30 text-xs font-medium text-pink-200 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <RotateCcw className="w-3.5 h-3.5 text-pink-300" />
          <span>Replay From Beginning ↺</span>
        </button>

        {/* Page indicator: 13 / 13 */}
        <div className="text-[10px] font-mono tracking-widest text-pink-400/50">
          13 / 13
        </div>
      </div>
    </div>
  );
};
