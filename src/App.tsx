import React, { useState, useEffect } from 'react';
import { PageId } from './types';
import { AudioPlayer } from './components/AudioPlayer';
import { BackgroundEffects } from './components/BackgroundEffects';
import { MediaManager } from './components/MediaManager';
import { Page1CinematicIntro } from './pages/Page1CinematicIntro';
import { Page2SecretPin } from './pages/Page2SecretPin';
import { Page3Birthday } from './pages/Page3Birthday';
import { Page4LiveAge } from './pages/Page4LiveAge';
import { Page5LittleThings } from './pages/Page5LittleThings';
import { PagePhotoBatch } from './pages/PagePhotoBatch';
import { Page10SpecialPhotos } from './pages/Page10SpecialPhotos';
import { Page11LoveLetter } from './pages/Page11LoveLetter';
import { Page12GiftSurprise } from './pages/Page12GiftSurprise';
import { Page13Final } from './pages/Page13Final';
import { Camera } from 'lucide-react';
import { preloadAllPhotos } from './utils/storage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(1);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isMediaManagerOpen, setIsMediaManagerOpen] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Preload all saved photos into fast memory cache on app start
  useEffect(() => {
    preloadAllPhotos().catch(() => {});
  }, []);

  // Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleNextPage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentPage((prev) => {
        if (prev < 13) return (prev + 1) as PageId;
        return 13;
      });
      setIsTransitioning(false);
    }, 280);
  };

  const handleRestart = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(1);
      setIsTransitioning(false);
    }, 280);
  };

  const handlePhotosUpdated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Render current active page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return <Page1CinematicIntro onNext={handleNextPage} />;
      case 2:
        return <Page2SecretPin onNext={handleNextPage} />;
      case 3:
        return <Page3Birthday onNext={handleNextPage} />;
      case 4:
        return <Page4LiveAge onNext={handleNextPage} />;
      case 5:
        return <Page5LittleThings onNext={handleNextPage} />;
      case 6:
      case 7:
      case 8:
      case 9:
        return (
          <PagePhotoBatch
            pageNumber={currentPage}
            onNext={handleNextPage}
            refreshTrigger={refreshTrigger}
          />
        );
      case 10:
        return (
          <Page10SpecialPhotos
            onNext={handleNextPage}
            refreshTrigger={refreshTrigger}
          />
        );
      case 11:
        return <Page11LoveLetter onNext={handleNextPage} />;
      case 12:
        return <Page12GiftSurprise onNext={handleNextPage} />;
      case 13:
        return <Page13Final onRestart={handleRestart} />;
      default:
        return <Page1CinematicIntro onNext={handleNextPage} />;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0b0816] text-white overflow-x-hidden flex flex-col justify-between selection:bg-pink-500/30">
      {/* Ambient background particles & lighting */}
      <BackgroundEffects />

      {/* Top Controls: Music toggle & Media Manager */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <button
          onClick={() => setIsMediaManagerOpen(true)}
          className="group flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#181128]/80 hover:bg-[#25173e]/90 text-pink-200 border border-pink-500/25 backdrop-blur-md shadow-lg shadow-pink-950/40 transition-all active:scale-95 cursor-pointer text-xs"
          title="Upload or sync Munni's photos & song"
        >
          <Camera className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform" />
          <span className="font-medium tracking-wide">Photos & Music</span>
        </button>
      </div>

      <AudioPlayer />

      {/* Media Manager Modal */}
      <MediaManager
        isOpen={isMediaManagerOpen}
        onClose={() => setIsMediaManagerOpen(false)}
        onPhotosUpdated={handlePhotosUpdated}
      />

      {/* Main Page Stage with smooth fade & scale transitions */}
      <main
        className={`relative z-10 flex-1 flex flex-col justify-center transition-all duration-300 ease-out ${
          isTransitioning
            ? 'opacity-0 scale-[0.98] blur-[2px]'
            : 'opacity-100 scale-100 blur-0'
        }`}
      >
        {renderCurrentPage()}
      </main>
    </div>
  );
}

