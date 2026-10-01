import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { romanticAudio } from '../utils/audio';

interface Page1Props {
  onNext: () => void;
}

export const Page1CinematicIntro: React.FC<Page1Props> = ({ onNext }) => {
  const handleOpen = () => {
    // Start music on first user interaction as specified
    romanticAudio.play();
    onNext();
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-12">
      {/* Central warm glow sphere */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-pink-600/20 via-rose-500/15 to-purple-600/10 blur-3xl pointer-events-none animate-warm-pulse" />

      {/* Decorative tiny top hearts */}
      <div className="flex items-center gap-3 mb-6 animate-gentle-float">
        <Sparkles className="w-4 h-4 text-pink-300" />
        <Heart className="w-5 h-5 text-rose-400 fill-rose-500/40" />
        <Sparkles className="w-4 h-4 text-pink-300" />
      </div>

      {/* Header */}
      <div className="relative z-10 space-y-4 max-w-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-pink-300/70 font-mono">
          A Special Birthday Tale
        </p>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-rose-200 to-pink-300 font-serif-romance drop-shadow-md leading-tight">
          For My Pyaari Munni ❤️
        </h1>

        <p className="text-lg sm:text-xl text-pink-200/80 font-hand tracking-wide pt-2">
          I made something special for you…
        </p>
      </div>

      {/* Premium Open Surprise Button */}
      <div className="relative z-10 mt-12 flex flex-col items-center gap-3">
        <button
          onClick={handleOpen}
          className="group relative inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full text-lg font-medium text-white transition-all duration-300 bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-400 hover:to-pink-500 shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span className="relative z-10 tracking-wide font-sans">Open Your Surprise ❤️</span>
          <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        <p className="text-[11px] text-pink-300/60 font-sans tracking-wide">
          🎵 Song: "Malang Sajna" (Tap 🎶 on top-right to attach audio file or Google Drive link)
        </p>
      </div>

      {/* Subtle indicator */}
      <div className="absolute bottom-6 text-xs font-mono tracking-widest text-pink-400/40">
        01 / 13
      </div>
    </div>
  );
};
