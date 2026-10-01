import React, { useState } from 'react';
import { PageNavigation } from '../components/PageIndicator';
import { Heart, Sparkles } from 'lucide-react';

interface Page5Props {
  onNext: () => void;
}

interface LittleThing {
  id: number;
  text: string;
  subtext: string;
}

const THINGS: LittleThing[] = [
  { id: 1, text: 'Tumhari Aankhen 👀❤️', subtext: 'Inme poori duniya bhool jaane ka dil karta hai.' },
  { id: 2, text: 'Tumhari Smile 😊❤️', subtext: 'Wo smile jo mere sabse cloudy din ko roshan kar de.' },
  { id: 3, text: 'Tumhari Bak Bak 😭❤️', subtext: 'Jab bina ruke bolti ho, bas sunte rehne ka mann karta hai.' },
  { id: 4, text: 'Tumhara Pyaar Karna 🫶🏻❤️', subtext: 'Itna sachha aur masoom pyaar jo sirf tum kar sakti ho.' },
  { id: 5, text: 'The Way You Make Me Happy 🥹❤️', subtext: 'Sirf tumhari ek jhalak se dil khush ho jaata hai.' },
  { id: 6, text: 'Your Cheeks 🥰❤️', subtext: 'Chubby, cute and the softest cheeks in the entire universe.' },
];

export const Page5LittleThings: React.FC<Page5Props> = ({ onNext }) => {
  const [revealedCount, setRevealedCount] = useState<number>(6); // Show all 6 so everything is instantly visible as requested!

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] flex flex-col justify-between px-3 sm:px-6 py-3 sm:py-5 text-center max-w-4xl mx-auto overflow-hidden">
      {/* Background floral glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="space-y-1 z-10 pt-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-400/25 text-[11px] tracking-wider uppercase text-pink-300 font-medium">
          <Heart className="w-3 h-3 text-rose-400 fill-rose-500/30" />
          <span>From My Heart</span>
          <Sparkles className="w-3 h-3 text-pink-300" />
        </div>

        <h2 className="text-xl sm:text-3xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-rose-200 to-pink-300 drop-shadow-md">
          Little Things I Love About You ❤️
        </h2>
      </div>

      {/* 6 Cards in a clean, all-visible 2x3 or 3x2 grid */}
      <div className="w-full my-auto z-10 py-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-w-3xl mx-auto">
          {THINGS.map((thing) => (
            <div
              key={thing.id}
              className="relative p-2.5 sm:p-3.5 rounded-2xl border text-left bg-[#1a1228]/85 border-pink-500/25 shadow-md shadow-black/30 backdrop-blur-md transition-all hover:border-pink-400/50 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-1.5">
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-pink-100 font-sans tracking-wide">
                    {thing.text}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-pink-300/80 font-hand mt-0.5 line-clamp-2">
                    {thing.subtext}
                  </p>
                </div>
                <span className="text-pink-400/70 text-xs">🌷</span>
              </div>
            </div>
          ))}
        </div>

        {/* Final statement right in the view */}
        <div className="pt-2 text-center">
          <p className="text-xs sm:text-sm font-serif-romance italic text-rose-200">
            And honestly… I could keep going. ❤️
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="w-full z-10 pb-1">
        <PageNavigation currentPage={5} onContinue={onNext} />
      </div>
    </div>
  );
};
