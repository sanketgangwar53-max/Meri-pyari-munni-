import React, { useState, useEffect } from 'react';
import { PageNavigation } from '../components/PageIndicator';
import { Sparkles, Clock, Calendar, Heart } from 'lucide-react';

interface Page4Props {
  onNext: () => void;
}

// User confirmed date of birth: 14 October 2007 (Turning 19 on 14 October)
const BIRTH_DATE = new Date('2007-10-14T00:00:00');

interface AgeBreakdown {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  daysUntilNextBirthday: number;
}

export const Page4LiveAge: React.FC<Page4Props> = ({ onNext }) => {
  const [age, setAge] = useState<AgeBreakdown>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
    daysUntilNextBirthday: 0,
  });

  useEffect(() => {
    const updateAge = () => {
      const now = new Date();
      let diffMs = now.getTime() - BIRTH_DATE.getTime();
      if (diffMs < 0) diffMs = 0;

      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      let years = now.getFullYear() - BIRTH_DATE.getFullYear();
      let months = now.getMonth() - BIRTH_DATE.getMonth();
      let days = now.getDate() - BIRTH_DATE.getDate();

      if (days < 0) {
        months -= 1;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }

      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      // Next birthday countdown (14 October)
      let nextBirthday = new Date(now.getFullYear(), 9, 14, 0, 0, 0); // 9 is October (0-indexed)
      if (now.getTime() > nextBirthday.getTime()) {
        nextBirthday = new Date(now.getFullYear() + 1, 9, 14, 0, 0, 0);
      }
      const diffNext = nextBirthday.getTime() - now.getTime();
      const daysUntilNextBirthday = Math.max(0, Math.ceil(diffNext / (1000 * 60 * 60 * 24)));

      setAge({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        totalDays,
        daysUntilNextBirthday,
      });
    };

    updateAge();
    const interval = setInterval(updateAge, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { label: 'Years', value: age.years },
    { label: 'Months', value: age.months },
    { label: 'Days', value: age.days },
    { label: 'Hours', value: String(age.hours).padStart(2, '0') },
    { label: 'Minutes', value: String(age.minutes).padStart(2, '0') },
    { label: 'Seconds', value: String(age.seconds).padStart(2, '0') },
  ];

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-between px-3 sm:px-6 py-2.5 sm:py-5 text-center max-w-xl mx-auto overflow-hidden">
      {/* Background starlight & glow */}
      <div className="absolute top-1/3 w-80 h-80 rounded-full bg-pink-700/15 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="space-y-1 z-10 pt-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-500/10 border border-pink-400/25 text-[11px] tracking-wider uppercase text-pink-300 font-medium">
          <Calendar className="w-3 h-3 text-pink-300" />
          <span>Born: 14 October 2007 🌸</span>
          <Sparkles className="w-3 h-3 text-pink-300" />
        </div>

        <h2 className="text-xl sm:text-3xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-rose-200 to-pink-300 drop-shadow-md">
          Munni's Live Age ✨
        </h2>

        <p className="text-[11px] sm:text-xs text-pink-200/80 font-hand tracking-wide">
          14 October ko 19th Birthday celebration! Har second tumhare saath anmol hai ❤️
        </p>
      </div>

      {/* Glowing Time Breakdown Grid */}
      <div className="w-full my-auto z-10 py-1">
        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-sm sm:max-w-md mx-auto">
          {timeUnits.map((unit) => (
            <div
              key={unit.label}
              className="group relative flex flex-col items-center justify-center p-2 sm:p-3 rounded-2xl bg-[#191228]/80 border border-pink-500/25 shadow-md shadow-black/40 backdrop-blur-md transition-all hover:border-pink-400/60"
            >
              {/* Glowing Number */}
              <span className="text-xl sm:text-3xl font-bold font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-100 to-rose-200 drop-shadow-[0_0_10px_rgba(244,114,182,0.5)]">
                {unit.value}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-pink-300/70 font-sans mt-0.5">
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        {/* Milestone badge with upcoming 19th birthday countdown */}
        <div className="mt-2.5 inline-flex flex-col sm:flex-row items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/20 text-xs text-pink-200 font-mono">
          <div className="flex items-center gap-1.5">
            <span>Total Journey:</span>
            <span className="text-rose-300 font-bold">{age.totalDays.toLocaleString()} Days</span>
            <span>🌸</span>
          </div>
          <span className="hidden sm:inline text-pink-500">•</span>
          <span className="text-amber-200 font-medium text-[11px]">
            {age.daysUntilNextBirthday === 0
              ? '🎉 Today is Munni’s 19th Birthday! 🎂'
              : `🎂 14 Oct (Turning 19!) in ${age.daysUntilNextBirthday} days!`}
          </span>
        </div>
      </div>

      {/* Romantic Atmosphere Subtext */}
      <div className="max-w-md z-10 px-4">
        <p className="text-[11px] sm:text-xs text-pink-200/70 font-sans leading-relaxed">
          Time moves, seconds tick, but my love for you only grows deeper with every heartbeat.
        </p>
      </div>

      {/* Navigation */}
      <div className="w-full z-10 pb-1">
        <PageNavigation currentPage={4} onContinue={onNext} />
      </div>
    </div>
  );
};
