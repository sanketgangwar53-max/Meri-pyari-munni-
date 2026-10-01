import React, { useState, useEffect } from 'react';
import { PhotoItem } from '../types';
import { Heart, Sparkles, X } from 'lucide-react';
import { getPhotoFromStorage, getCachedPhoto, isPhotoKnown } from '../utils/storage';
import { romanticAudio } from '../utils/audio';

interface PhotoCardProps {
  photo: PhotoItem;
  specialCaption?: string;
  refreshTrigger?: number;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, specialCaption, refreshTrigger }) => {
  const [imageError, setImageError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [storedSrc, setStoredSrc] = useState<string | null>(() => getCachedPhoto(photo.id));
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // If already in synchronous memory cache, set immediately
    const immediate = getCachedPhoto(photo.id);
    if (immediate) {
      setStoredSrc(immediate);
      setImageError(false);
      return;
    }

    let isMounted = true;
    getPhotoFromStorage(photo.id).then((data) => {
      if (isMounted && data) {
        setStoredSrc(data);
        setImageError(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [photo.id, refreshTrigger]);

  // If photo is known on server or storage, use it; otherwise avoid slow 404 network timeout
  const hasKnownSource = Boolean(storedSrc || isPhotoKnown(photo.id));
  const activeSrc = storedSrc || (hasKnownSource ? photo.src : null);
  const captionText = specialCaption || photo.caption;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    romanticAudio.playKeyNote(5);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="group relative flex flex-col items-center p-2 sm:p-2.5 rounded-2xl bg-[#191228]/70 border border-pink-500/20 hover:border-pink-400/50 shadow-md shadow-black/40 hover:shadow-pink-900/30 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer overflow-hidden backdrop-blur-md"
      >
        {/* Photo Container */}
        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#241a38]/80 flex items-center justify-center border border-white/5">
          {!imageError && activeSrc ? (
            <img
              src={activeSrc}
              alt={photo.alt}
              onError={() => {
                if (!storedSrc) setImageError(true);
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          ) : (
            // Elegant romantic placeholder
            <div className="flex flex-col items-center justify-center p-3 text-center">
              <div className="w-10 h-10 rounded-full bg-pink-500/10 border border-pink-400/20 flex items-center justify-center mb-1">
                <Heart className="w-5 h-5 text-pink-400 fill-pink-500/20" />
              </div>
              <span className="text-[11px] font-mono tracking-wider text-pink-300/80">Photo {photo.id}</span>
              <span className="text-[10px] text-pink-200/50 font-serif-romance italic mt-0.5">Munni ❤️</span>
            </div>
          )}

          {/* Photo number badge */}
          <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-mono text-pink-200/80 border border-white/10">
            #{photo.id}
          </div>

          {/* Interactive Heart Like Button */}
          <button
            onClick={handleLike}
            className={`absolute top-1.5 right-1.5 p-1.5 rounded-full backdrop-blur-md transition-all ${
              isLiked
                ? 'bg-rose-500 text-white scale-110 shadow-lg shadow-rose-900/50'
                : 'bg-black/50 text-pink-200 hover:bg-black/70 hover:scale-105'
            }`}
            title="Like this photo"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Caption */}
        {captionText && (
          <div className="mt-1.5 text-center px-1 w-full">
            <p className="text-[11px] sm:text-xs font-medium text-pink-100 tracking-wide font-sans truncate drop-shadow-sm">
              {captionText}
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative max-w-lg w-full p-4 rounded-3xl bg-[#1a1329] border border-pink-500/30 shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-mono text-pink-300">Photo #{photo.id}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`p-2 rounded-full border transition-all ${
                    isLiked
                      ? 'bg-rose-500 border-rose-400 text-white'
                      : 'bg-white/5 border-pink-500/20 text-pink-200 hover:bg-white/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-pink-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center border border-pink-500/20">
              {!imageError && activeSrc ? (
                <img src={activeSrc} alt={photo.alt} className="w-full h-full object-contain" />
              ) : (
                <div className="flex flex-col items-center text-center p-6">
                  <Heart className="w-12 h-12 text-pink-400 fill-pink-500/30 mb-3" />
                  <span className="text-lg font-mono text-pink-200">Photo {photo.id}</span>
                  <span className="text-sm text-pink-300/60 mt-1">Munni's precious capture</span>
                </div>
              )}
            </div>

            {captionText && (
              <p className="mt-3 text-sm sm:text-base font-medium text-pink-200 text-center font-serif-romance">
                {captionText}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
