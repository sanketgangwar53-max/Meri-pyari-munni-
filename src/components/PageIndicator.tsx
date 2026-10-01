import React, { useRef } from 'react';
import { Heart } from 'lucide-react';
import { PageId } from '../types';

interface PageNavigationProps {
  currentPage: PageId;
  onContinue: () => void;
  showContinue?: boolean;
  continueText?: string;
  disabled?: boolean;
}

export const PageNavigation: React.FC<PageNavigationProps> = ({
  currentPage,
  onContinue,
  showContinue = true,
  continueText = 'Continue → ❤️',
  disabled = false,
}) => {
  const lastTapRef = useRef<number>(0);

  const handleSafeTap = () => {
    const now = Date.now();
    // Rapid tap protection: minimum 500ms between page switches
    if (now - lastTapRef.current < 500 || disabled) {
      return;
    }
    lastTapRef.current = now;
    onContinue();
  };

  const formattedCurrent = String(currentPage).padStart(2, '0');
  const totalPages = '13';

  return (
    <div className="w-full flex flex-col items-center gap-3 pt-6 pb-4">
      {showContinue && (
        <button
          onClick={handleSafeTap}
          disabled={disabled}
          className={`relative group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-base font-medium tracking-wide text-white transition-all duration-300 shadow-lg cursor-pointer ${
            disabled
              ? 'opacity-40 cursor-not-allowed bg-zinc-800'
              : 'bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-400 hover:to-pink-500 shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          <span className="relative z-10">{continueText}</span>
          <Heart className="w-4 h-4 text-pink-200 fill-pink-300/40 group-hover:scale-110 transition-transform" />
          <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      )}

      {/* Page indicator: 01 / 13 */}
      <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-pink-300/50 select-none">
        <span>{formattedCurrent}</span>
        <span className="text-pink-500/40">/</span>
        <span>{totalPages}</span>
      </div>
    </div>
  );
};
