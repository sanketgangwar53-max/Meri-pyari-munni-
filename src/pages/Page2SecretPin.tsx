import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CutePanda, PandaMood } from '../components/CutePanda';
import { Delete, Lock, HelpCircle } from 'lucide-react';
import { romanticAudio } from '../utils/audio';

interface Page2Props {
  onNext: () => void;
}

const CORRECT_PIN = '2612023';

export const Page2SecretPin: React.FC<Page2Props> = ({ onNext }) => {
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isShaking, setIsShaking] = useState(false);
  const [pandaMood, setPandaMood] = useState<PandaMood>('idle');
  const [danceStep, setDanceStep] = useState(0);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [pandaHint, setPandaHint] = useState(false);

  const handleKeyPress = (num: string) => {
    if (isUnlocking) return;
    if (errorMsg) setErrorMsg('');
    if (pandaMood === 'wrong') setPandaMood('idle');

    // Melodic sound & soft haptic
    romanticAudio.playKeyNote(Number(num));
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }

    if (pin.length < 7) {
      const nextPin = pin + num;
      setPin(nextPin);
      // Auto check when 7 digits reached
      if (nextPin.length === 7) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    if (isUnlocking) return;
    if (errorMsg) setErrorMsg('');
    if (pandaMood === 'wrong') setPandaMood('idle');
    romanticAudio.playKeyNote(1);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
    setPin((prev) => prev.slice(0, -1));
  };

  const handleManualUnlock = () => {
    if (isUnlocking) return;
    verifyPin(pin);
  };

  const handlePandaClick = () => {
    setPandaHint(true);
    romanticAudio.playKeyNote(7);
    setTimeout(() => setPandaHint(false), 3500);
  };

  const verifyPin = (candidatePin: string) => {
    if (candidatePin === CORRECT_PIN) {
      triggerUnlockDance();
    } else {
      // Wrong PIN
      setIsShaking(true);
      setErrorMsg("Hmm… that's not it, Munni 🐼💕");
      setPandaMood('wrong');
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 60, 40]);
      }
      setTimeout(() => {
        setIsShaking(false);
        setPin('');
      }, 700);
    }
  };

  // 16-step Panda Unlock Dance Choreography
  const triggerUnlockDance = () => {
    setIsUnlocking(true);
    setErrorMsg('');
    romanticAudio.playCelebrationChime();

    // Confetti celebration
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#fb7185', '#ec4899', '#fef08a'],
      });
    } catch {
      // fallback
    }

    // Step 1 - 4: Surprised & noticing
    setPandaMood('surprised');

    // Step 5 - 13: Dancing choreography
    let stepCount = 0;
    const danceInterval = setInterval(() => {
      stepCount++;
      setDanceStep(stepCount);
      if (stepCount >= 4) {
        setPandaMood('dancing');
      }
      if (stepCount >= 13) {
        clearInterval(danceInterval);
        // Step 14: Cute happy pose
        setPandaMood('happy_finish');

        // Step 15: Short pause
        setTimeout(() => {
          // Step 16: Move smoothly to Page 3
          onNext();
        }, 1200);
      }
    }, 240);
  };

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-between px-3 sm:px-4 py-3 sm:py-5 max-w-sm mx-auto select-none overflow-hidden">
      {/* Moonlit background accents */}
      <div className="absolute top-2 w-48 h-48 rounded-full bg-indigo-900/20 blur-3xl pointer-events-none" />
      <div className="absolute top-8 right-6 text-yellow-100/40 text-sm animate-pulse">✨</div>
      <div className="absolute top-10 left-6 text-yellow-100/30 text-xs animate-pulse delay-500">🌙</div>

      {/* Top Header */}
      <div className="text-center space-y-0.5 z-10 pt-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-500/10 border border-pink-400/20 text-[11px] font-medium text-pink-300">
          <Lock className="w-3 h-3 text-pink-400" />
          <span>Secret Room</span>
        </div>
        <h2 className="text-lg sm:text-2xl font-bold font-serif-romance text-pink-100 tracking-wide pt-0.5">
          Only my Munni can open this 🐼❤️
        </h2>
      </div>

      {/* Cute Cartoon Panda (Tap to get sweet hint) */}
      <div
        onClick={handlePandaClick}
        className="relative z-10 my-0.5 scale-90 sm:scale-100 cursor-pointer group"
        title="Tap panda for a sweet hint! 🐼"
      >
        <CutePanda mood={pandaMood} danceStep={danceStep} />

        {/* Floating Cute Speech Bubble */}
        {pandaHint && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-2xl bg-white text-zinc-900 font-medium text-[11px] shadow-xl border border-pink-300 animate-bounce whitespace-nowrap z-20">
            <span>Psst Munni: 26-12-2023 ❤️</span>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-pink-300" />
          </div>
        )}
      </div>

      {/* PIN Dots Display (7 max) */}
      <div className="w-full flex flex-col items-center gap-1 z-10">
        <div
          className={`flex items-center justify-center gap-2.5 py-1.5 px-4 rounded-2xl bg-white/5 border border-pink-500/20 backdrop-blur-md transition-all ${
            isShaking ? 'animate-shake border-rose-500 bg-rose-500/10' : ''
          }`}
        >
          {Array.from({ length: 7 }).map((_, idx) => {
            const isFilled = idx < pin.length;
            return (
              <div
                key={idx}
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'bg-gradient-to-r from-pink-400 to-rose-400 scale-110 shadow-[0_0_8px_rgba(244,114,182,0.8)]'
                    : 'bg-zinc-700/60 border border-zinc-600/50'
                }`}
              />
            );
          })}
        </div>

        {/* Error message */}
        <div className="min-h-[18px]">
          {errorMsg && (
            <p className="text-[11px] sm:text-xs font-medium text-rose-300 text-center tracking-wide animate-pulse">
              {errorMsg}
            </p>
          )}
        </div>
      </div>

      {/* Custom On-Screen Numeric Keypad (No native mobile keyboard!) */}
      <div className="w-full max-w-xs z-10 pb-1">
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              disabled={isUnlocking}
              className="h-11 sm:h-13 rounded-2xl bg-gradient-to-b from-[#231b38]/80 to-[#191228]/80 hover:from-[#31234f] hover:to-[#211636] border border-pink-500/20 hover:border-pink-400/50 active:scale-95 text-base sm:text-xl font-medium text-pink-100 shadow-md flex items-center justify-center transition-all cursor-pointer backdrop-blur-md active:bg-pink-600/30"
            >
              {digit}
            </button>
          ))}

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={isUnlocking || pin.length === 0}
            className="h-11 sm:h-13 rounded-2xl bg-[#231b38]/60 hover:bg-[#2e2148] border border-pink-500/20 active:scale-95 text-pink-200 flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Delete className="w-4 h-4 sm:w-5 sm:h-5 text-pink-300" />
          </button>

          {/* 0 Button */}
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            disabled={isUnlocking}
            className="h-11 sm:h-13 rounded-2xl bg-gradient-to-b from-[#231b38]/80 to-[#191228]/80 hover:from-[#31234f] hover:to-[#211636] border border-pink-500/20 hover:border-pink-400/50 active:scale-95 text-base sm:text-xl font-medium text-pink-100 shadow-md flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
          >
            0
          </button>

          {/* Unlock / Enter Button */}
          <button
            type="button"
            onClick={handleManualUnlock}
            disabled={isUnlocking || pin.length === 0}
            className="h-11 sm:h-13 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 border border-pink-400/40 active:scale-95 text-xs sm:text-sm font-semibold text-white flex items-center justify-center gap-1 shadow-md shadow-pink-900/40 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span>Unlock</span>
            <span>❤️</span>
          </button>
        </div>
      </div>

      {/* Subtle indicator */}
      <div className="text-[10px] font-mono tracking-widest text-pink-400/40 pb-1">
        02 / 13
      </div>
    </div>
  );
};
