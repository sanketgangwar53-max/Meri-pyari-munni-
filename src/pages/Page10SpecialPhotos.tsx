import React from 'react';
import { PageNavigation } from '../components/PageIndicator';
import { PhotoCard } from '../components/PhotoCard';
import { getPhotosForPage, SPECIAL_CAPTIONS } from '../data/photosData';
import { Sparkles, Heart } from 'lucide-react';

interface Page10Props {
  onNext: () => void;
  refreshTrigger?: number;
}

export const Page10SpecialPhotos: React.FC<Page10Props> = ({ onNext, refreshTrigger }) => {
  const photos = getPhotosForPage(10); // Photos 33 to 40

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] flex flex-col justify-between px-3 sm:px-6 py-2 sm:py-4 max-w-5xl mx-auto w-full overflow-hidden">
      {/* Intimate floral glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />

      {/* Floating flower petals */}
      <div className="absolute top-6 left-4 text-pink-300/40 text-base animate-gentle-float">🌸</div>
      <div className="absolute top-12 right-6 text-rose-300/40 text-base animate-gentle-float delay-700">🌷</div>

      {/* Header */}
      <div className="text-center space-y-1 z-10 pt-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/15 border border-rose-400/30 text-[11px] tracking-wider uppercase text-rose-300 font-medium">
          <Heart className="w-3 h-3 text-rose-400 fill-rose-500/40" />
          <span>Special Nicknames & Keepsakes</span>
          <Sparkles className="w-3 h-3 text-rose-300" />
        </div>

        <h2 className="text-xl sm:text-3xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-rose-200 to-pink-300 drop-shadow-md">
          Special Photos 33–40 🌷
        </h2>

        <p className="text-[11px] sm:text-xs text-pink-200/80 font-hand tracking-wide">
          Har naam ke peeche sirf aur sirf mera bepanah pyaar hai ❤️
        </p>
      </div>

      {/* Photo Grid with internal scroll container so Continue button is ALWAYS visible */}
      <div className="flex-1 my-2 z-10 w-full overflow-y-auto px-1 max-h-[calc(100dvh-170px)] sm:max-h-[calc(100dvh-190px)] rounded-2xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 py-1">
          {photos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              specialCaption={SPECIAL_CAPTIONS[photo.id]}
              refreshTrigger={refreshTrigger}
            />
          ))}
        </div>
      </div>

      {/* Navigation: Fixed & visible at bottom without scrolling */}
      <div className="w-full z-10 pb-1">
        <PageNavigation currentPage={10} onContinue={onNext} />
      </div>
    </div>
  );
};
