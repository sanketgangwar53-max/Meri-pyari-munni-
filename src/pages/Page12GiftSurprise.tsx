import React, { useState, useEffect } from 'react';
import { PageNavigation } from '../components/PageIndicator';
import { CuteLizard } from '../components/CuteLizard';
import { Sparkles, Gift } from 'lucide-react';
import { getSpecialAssetFromStorage } from '../utils/storage';

interface Page12Props {
  onNext: () => void;
}

type GiftStage =
  | 'idle' // Gift closed, waiting for tap
  | 'spotlight' // Spotlight focuses, background darkens
  | 'opening' // Gift box opens slowly, warm glow
  | 'photo_revealed' // Gift photo revealed
  | 'lizard_pop' // Lizard pops out! Funny surprise
  | 'romantic_return'; // Romantic atmosphere returns

export const Page12GiftSurprise: React.FC<Page12Props> = ({ onNext }) => {
  const [stage, setStage] = useState<GiftStage>('idle');
  const [giftImgError, setGiftImgError] = useState(false);
  const [storedGiftSrc, setStoredGiftSrc] = useState<string | null>(null);
  const [storedLizardSrc, setStoredLizardSrc] = useState<string | null>(null);

  useEffect(() => {
    getSpecialAssetFromStorage('gift').then((data) => {
      if (data) {
        setStoredGiftSrc(data);
        setGiftImgError(false);
      }
    });
    getSpecialAssetFromStorage('lizard').then((data) => {
      if (data) {
        setStoredLizardSrc(data);
      }
    });
  }, []);

  const activeGiftSrc = storedGiftSrc || '/gift.jpg';
  const activeLizardSrc = storedLizardSrc || '/lizard.jpg';

  const startSequence = () => {
    if (stage !== 'idle') return;

    // Sequence 1: Background becomes slightly darker, spotlight focuses
    setStage('spotlight');

    // Sequence 2: Gift opens slowly & warm glow
    setTimeout(() => {
      setStage('opening');
    }, 900);

    // Sequence 3: Gift photo reveals
    setTimeout(() => {
      setStage('photo_revealed');
    }, 2000);

    // Sequence 4: Short pause, then lizard suddenly pops out!
    setTimeout(() => {
      setStage('lizard_pop');
    }, 3800);

    // Sequence 5: Romantic atmosphere returns
    setTimeout(() => {
      setStage('romantic_return');
    }, 7000);
  };

  return (
    <div
      className={`relative h-[100dvh] max-h-[100dvh] flex flex-col justify-between px-3 sm:px-6 py-2 sm:py-4 max-w-2xl mx-auto overflow-hidden transition-colors duration-1000 ${
        stage === 'spotlight' || stage === 'opening' ? 'bg-black/60' : ''
      }`}
    >
      {/* Dynamic Spotlight */}
      <div
        className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-1000 ${
          stage !== 'idle'
            ? 'w-80 h-80 bg-radial from-amber-300/25 via-pink-500/20 to-transparent blur-2xl scale-125'
            : 'w-48 h-48 bg-pink-500/10 blur-3xl'
        }`}
      />

      {/* Header */}
      <div className="text-center space-y-2 z-10 pt-2 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-400/20 text-xs tracking-wider uppercase text-pink-300 font-medium">
          <Gift className="w-3.5 h-3.5 text-pink-300" />
          <span>A Special Gesture</span>
          <Sparkles className="w-3.5 h-3.5 text-pink-300" />
        </div>

        <h2 className="text-2xl sm:text-4xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-rose-200 to-amber-100 drop-shadow-md">
          There is still one more thing I want to give you… 🎁
        </h2>
      </div>

      {/* Central Interactive Gift Stage */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center min-h-[340px]">
        {/* Stage 1: Closed Gift Box */}
        {stage === 'idle' && (
          <div
            onClick={startSequence}
            className="group cursor-pointer flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
          >
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700 p-1 shadow-2xl shadow-pink-600/40 flex items-center justify-center border border-pink-300/40 animate-gentle-float">
              {/* Ribbon cross */}
              <div className="absolute inset-y-0 w-8 bg-amber-300/90 shadow-sm" />
              <div className="absolute inset-x-0 h-8 bg-amber-300/90 shadow-sm" />

              {/* Ribbon Bow on top */}
              <div className="absolute -top-6 flex items-center justify-center">
                <div className="w-12 h-10 rounded-full border-4 border-amber-300 bg-amber-400/80 -rotate-25 shadow-md" />
                <div className="w-12 h-10 rounded-full border-4 border-amber-300 bg-amber-400/80 rotate-25 shadow-md" />
                <div className="absolute w-5 h-5 rounded-full bg-amber-300 shadow-inner" />
              </div>

              <div className="relative z-10 text-center">
                <span className="text-3xl">🎁</span>
              </div>
            </div>

            <p className="mt-6 text-sm font-medium text-pink-200/90 bg-pink-500/15 px-4 py-1.5 rounded-full border border-pink-400/30 animate-pulse">
              Tap to unwrap your gift ✨
            </p>
          </div>
        )}

        {/* Stage 2 & 3: Opening & Warm Glow / Photo Revealed */}
        {(stage === 'spotlight' || stage === 'opening' || stage === 'photo_revealed') && (
          <div className="flex flex-col items-center animate-in zoom-in-95 duration-500 max-w-sm w-full">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden bg-[#241a38] border-2 border-amber-300/50 shadow-[0_0_40px_rgba(251,191,36,0.35)] flex items-center justify-center">
              {!giftImgError ? (
                <img
                  src={activeGiftSrc}
                  alt="Special Birthday Gift"
                  onError={() => {
                    if (!storedGiftSrc) setGiftImgError(true);
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-6 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center mb-3">
                    <Gift className="w-8 h-8 text-amber-300" />
                  </div>
                  <h3 className="text-lg font-serif-romance text-amber-100 font-bold">
                    For My Munni ❤️
                  </h3>
                  <p className="text-xs text-pink-200/70 mt-1">
                    Wrapped with all my heart and endless blessings!
                  </p>
                </div>
              )}
            </div>
            <p className="mt-4 text-xs font-mono text-amber-200/80 tracking-widest uppercase">
              ✨ Unwrapping Munni’s Surprise…
            </p>
          </div>
        )}

        {/* Stage 4: Funny Cute Lizard Pop Out! */}
        {stage === 'lizard_pop' && (
          <div className="flex flex-col items-center animate-in zoom-in-110 duration-300 max-w-xs">
            {storedLizardSrc ? (
              <div className="flex flex-col items-center">
                <div className="mb-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold tracking-wider animate-pulse flex items-center gap-1 shadow-lg">
                  <span>🦎</span>
                  <span>BOO! Munni darr gayi? 😂❤️</span>
                </div>
                <div className="w-52 h-64 rounded-3xl overflow-hidden border-2 border-emerald-400/50 shadow-2xl shadow-emerald-900/40 animate-bounce">
                  <img
                    src={activeLizardSrc}
                    alt="Funny cute lizard"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <CuteLizard />
            )}
            <p className="mt-3 text-sm text-pink-200 font-hand text-center">
              Aapka sabse bada fear, par mere saath sabse cute! 😂🦎❤️
            </p>
          </div>
        )}

        {/* Stage 5: Romantic Atmosphere Returns */}
        {stage === 'romantic_return' && (
          <div className="flex flex-col items-center text-center animate-in fade-in duration-700 max-w-md">
            <div className="relative w-56 h-56 rounded-3xl overflow-hidden bg-[#241a38] border border-pink-400/30 shadow-2xl mb-4">
              {!giftImgError ? (
                <img
                  src={activeGiftSrc}
                  alt="Special Birthday Gift"
                  onError={() => {
                    if (!storedGiftSrc) setGiftImgError(true);
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                  <span className="text-4xl mb-2">🎁</span>
                  <span className="text-sm font-serif-romance text-pink-200">Precious Gift</span>
                </div>
              )}
            </div>
            <p className="text-base font-medium text-pink-100 font-sans">
              Mazaak aside, you deserve every happiness and gift in this universe! ❤️
            </p>
            <p className="text-xs text-pink-300/70 font-hand mt-1">
              Romantic ❤️ → Surprise 😳 → 😂🦎 → Romantic ❤️
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="w-full z-10">
        <PageNavigation
          currentPage={12}
          onContinue={onNext}
          continueText="Continue to Final Message → ❤️"
          disabled={stage === 'spotlight' || stage === 'opening'}
        />
      </div>
    </div>
  );
};
