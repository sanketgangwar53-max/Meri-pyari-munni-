import React, { useState, useEffect, useRef } from 'react';
import { PageNavigation } from '../components/PageIndicator';
import { LOVE_LETTER_TEXT } from '../data/letterData';
import { Sparkles, Heart } from 'lucide-react';

interface Page11Props {
  onNext: () => void;
}

export const Page11LoveLetter: React.FC<Page11Props> = ({ onNext }) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);
  const [photoError, setPhotoError] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let charIdx = 0;
    const speed = 12; // Fast, smooth typewriter cadence

    timerRef.current = window.setInterval(() => {
      charIdx += 3; // 3 characters per tick for swift reading
      if (charIdx <= LOVE_LETTER_TEXT.length) {
        setDisplayedText(LOVE_LETTER_TEXT.slice(0, charIdx));
        // Auto scroll letter as it types
        if (contentRef.current && charIdx % 30 === 0) {
          contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
      } else {
        setDisplayedText(LOVE_LETTER_TEXT);
        if (timerRef.current) clearInterval(timerRef.current);
        setIsTypingComplete(true);
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleReadInstantly = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayedText(LOVE_LETTER_TEXT);
    setIsTypingComplete(true);
  };

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] flex flex-col justify-between px-3 sm:px-6 py-2 sm:py-4 max-w-4xl mx-auto w-full overflow-hidden">
      {/* Warm lamp lighting background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-1 z-10 pt-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-500/10 border border-pink-400/20 text-[11px] tracking-wider uppercase text-pink-300 font-medium">
          <Heart className="w-3 h-3 text-rose-400 fill-rose-500/30" />
          <span>A Letter From My Soul</span>
          <Sparkles className="w-3 h-3 text-pink-300" />
        </div>

        <h2 className="text-xl sm:text-3xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-rose-200 to-amber-100 drop-shadow-md">
          My Love Letter To You 💌
        </h2>
      </div>

      {/* Spacious, Grand Romantic Letter Parchment with Internal Scroll */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-3xl mx-auto flex-1 my-2 rounded-3xl p-4 sm:p-7 bg-[#1f162d]/90 border border-amber-200/20 shadow-2xl shadow-black/60 backdrop-blur-xl overflow-y-auto max-h-[calc(100dvh-170px)] sm:max-h-[calc(100dvh-190px)]"
      >
        {/* Subtle romantic corner flower stamp */}
        <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-rose-500/10 border border-rose-400/20 flex items-center justify-center pointer-events-none">
          <span className="text-rose-300/40 text-xl font-script">Munni</span>
        </div>

        {/* Optional Love Letter Photo (if provided) */}
        {!photoError && (
          <div className="mb-3 max-w-xs mx-auto rounded-2xl overflow-hidden border border-pink-500/20 shadow-md">
            <img
              src="/love-letter.jpg"
              alt="Love Letter Keepsake"
              onError={() => setPhotoError(true)}
              className="w-full object-cover max-h-40"
            />
          </div>
        )}

        {/* Controls Bar: Read Instantly, Font Size & Copy */}
        <div className="flex items-center justify-between mb-3 sticky top-0 z-20 pb-1 backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(LOVE_LETTER_TEXT);
                  alert('Love letter copied to clipboard! ❤️💌');
                }
              }}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-pink-400/20 text-[10px] text-pink-200 transition-all cursor-pointer"
              title="Copy letter to your notes"
            >
              📋 Copy Letter
            </button>
          </div>

          {!isTypingComplete && (
            <button
              onClick={handleReadInstantly}
              className="px-3 py-1 rounded-full bg-pink-500/25 hover:bg-pink-500/35 border border-pink-400/40 text-[11px] font-medium text-pink-100 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <span>Read instantly</span>
              <span>→</span>
            </button>
          )}
        </div>

        {/* Letter Content */}
        <div className="relative">
          <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-pink-100 font-sans tracking-wide">
            {displayedText}
            {!isTypingComplete && (
              <span className="inline-block w-2 h-4 ml-1 bg-pink-400 animate-pulse" />
            )}
          </p>
        </div>

        {/* Cute decorative footer */}
        <div className="mt-4 pt-3 border-t border-pink-500/15 flex items-center justify-between text-xs text-pink-300/60 font-hand">
          <span>Written with endless love ❤️</span>
          <span className="text-base" title="Cute panda watching fondly">🐼🌷</span>
        </div>
      </div>

      {/* Navigation: Always docked and visible */}
      <div className="w-full z-10 pb-1">
        <PageNavigation currentPage={11} onContinue={onNext} />
      </div>
    </div>
  );
};
