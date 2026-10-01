import { PhotoItem } from '../types';

export const SPECIAL_CAPTIONS: Record<number, string> = {
  33: 'Meri Pyaari Munni😘',
  34: 'Meri Pyaari Gadhi💕',
  35: 'Meri Pyaari Dhanno🌷',
  36: 'Meri Pyaari Baby🩷',
  37: 'Meri Pyaari Chudail 🌺',
  38: 'My Sweetheart 🪷',
  39: 'My Baby Girl 🌸🫶🏻',
  40: 'My Baby Doll 💐',
};

// Generates the 40 photo objects
export const ALL_PHOTOS: PhotoItem[] = Array.from({ length: 40 }).map((_, index) => {
  const id = index + 1;
  const caption = SPECIAL_CAPTIONS[id] || undefined;
  return {
    id,
    alt: `Munni Photo ${id}`,
    // Candidate local paths when files are provided
    src: `/photos/photo-${id}.jpg`,
    caption,
  };
});

export const getPhotosForPage = (pageIndex: number): PhotoItem[] => {
  // Page 6: 1-8
  // Page 7: 9-16
  // Page 8: 17-24
  // Page 9: 25-32
  // Page 10: 33-40
  const start = (pageIndex - 6) * 8;
  return ALL_PHOTOS.slice(start, start + 8);
};
