import React from 'react';
import { PageNavigation } from '../components/PageIndicator';
import { PhotoCard } from '../components/PhotoCard';
import { getPhotosForPage } from '../data/photosData';
import { PageId } from '../types';
import { Sparkles } from 'lucide-react';

interface PagePhotoBatchProps {
  pageNumber: PageId; // 6, 7, 8, or 9
  onNext: () => void;
  refreshTrigger?: number;
}

export const PagePhotoBatch: React.FC<PagePhotoBatchProps> = ({
  pageNumber,
  onNext,
  refreshTrigger,
}) => {
  const photos = getPhotosForPage(pageNumber);

  const pageTitles: Record<number, { title: string; subtitle: string }> = {
    6: { title: 'Precious Moments', subtitle: 'Every snapshot reflects pure grace and beauty ✨' },
    7: { title: 'Sweetest Glimpses', subtitle: 'Capturing the charm that lights up every room 🌸' },
    8: { title: 'Unfiltered Beauty', subtitle: 'Munni in her most natural and lovely self 🌷' },
    9: { title: 'Timeless Radiance', subtitle: 'A gentle reminder of how wonderfully special you are 💖' },
  };

  const currentInfo = pageTitles[pageNumber] || {
    title: 'Munni’s Gallery',
    subtitle: 'Celebrating your unique radiance ❤️',
  };

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] flex flex-col justify-between px-3 sm:px-6 py-2 sm:py-4 max-w-5xl mx-auto w-full overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-pink-800/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-1 z-10 pt-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-500/10 border border-pink-400/20 text-[11px] tracking-wider uppercase text-pink-300 font-medium">
          <Sparkles className="w-3 h-3 text-pink-300" />
          <span>Photos #{photos[0]?.id} – #{photos[photos.length - 1]?.id}</span>
          <Sparkles className="w-3 h-3 text-pink-300" />
        </div>

        <h2 className="text-xl sm:text-3xl font-bold font-serif-romance text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-rose-200 to-pink-300 drop-shadow-md">
          {currentInfo.title}
        </h2>

        <p className="text-[11px] sm:text-xs text-pink-200/70 font-sans tracking-wide">
          {currentInfo.subtitle}
        </p>
      </div>

      {/* Photo Grid with internal scroll so Continue button is ALWAYS visible on screen */}
      <div className="flex-1 my-2 z-10 w-full overflow-y-auto px-1 max-h-[calc(100dvh-170px)] sm:max-h-[calc(100dvh-190px)] rounded-2xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 py-1">
          {photos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              refreshTrigger={refreshTrigger}
            />
          ))}
        </div>
      </div>

      {/* Navigation: Fixed & visible at bottom without scrolling */}
      <div className="w-full z-10 pb-1">
        <PageNavigation currentPage={pageNumber} onContinue={onNext} />
      </div>
    </div>
  );
};
