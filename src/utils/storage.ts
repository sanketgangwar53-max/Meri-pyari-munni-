/**
 * Local IndexedDB Storage & High-Speed Memory Cache for Munni's 40 Photos and Music
 * Provides 0ms instant photo rendering with client-side memory caching and compression.
 */

const DB_NAME = 'MeriPyaariMunniDB';
const DB_VERSION = 1;
const STORE_PHOTOS = 'photos';
const STORE_MEDIA = 'media';

// Fast In-Memory Cache for 0ms instant photo rendering
const photoMemoryCache = new Map<number, string>();
let isCacheLoaded = false;
const serverPhotosSet = new Set<number>();

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('Window not available'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_PHOTOS)) {
        db.createObjectStore(STORE_PHOTOS);
      }
      if (!db.objectStoreNames.contains(STORE_MEDIA)) {
        db.createObjectStore(STORE_MEDIA);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Resize & compress image using HTML5 Canvas so mobile devices load photos in <10ms
 */
export function compressImage(
  dataUrl: string,
  maxDimension = 1200,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(dataUrl);

    const img = document.createElement('img');
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(dataUrl);

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Preload all photos into memory cache on initial page load for instantaneous rendering
 */
export async function preloadAllPhotos(): Promise<Record<number, string>> {
  try {
    // 1. Check server media status
    try {
      const res = await fetch('/api/media-status');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.photos)) {
          data.photos.forEach((id: number) => serverPhotosSet.add(id));
        }
      }
    } catch {}

    // 2. Load all from IndexedDB into memory
    const all = await getAllSavedPhotos();
    Object.entries(all).forEach(([key, val]) => {
      photoMemoryCache.set(Number(key), val);
    });
    isCacheLoaded = true;
    return all;
  } catch {
    return {};
  }
}

export function getCachedPhoto(id: number): string | null {
  if (photoMemoryCache.has(id)) {
    return photoMemoryCache.get(id)!;
  }
  if (serverPhotosSet.has(id)) {
    return `/photos/photo-${id}.jpg`;
  }
  return null;
}

export function isPhotoKnown(id: number): boolean {
  return photoMemoryCache.has(id) || serverPhotosSet.has(id);
}

export async function savePhotoToStorage(id: number, dataUrl: string): Promise<void> {
  try {
    // Compress before storing to keep memory light and load times instantaneous
    const compressed = await compressImage(dataUrl);
    photoMemoryCache.set(id, compressed);

    const db = await openDB();
    const tx = db.transaction(STORE_PHOTOS, 'readwrite');
    tx.objectStore(STORE_PHOTOS).put(compressed, id);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Failed to save photo to IndexedDB:', err);
  }
}

export async function getPhotoFromStorage(id: number): Promise<string | null> {
  if (photoMemoryCache.has(id)) {
    return photoMemoryCache.get(id)!;
  }

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_PHOTOS, 'readonly');
    const req = tx.objectStore(STORE_PHOTOS).get(id);
    return new Promise((resolve) => {
      req.onsuccess = () => {
        const result = req.result || null;
        if (result) photoMemoryCache.set(id, result);
        resolve(result);
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function getAllSavedPhotos(): Promise<Record<number, string>> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_PHOTOS, 'readonly');
    const store = tx.objectStore(STORE_PHOTOS);
    const req = store.openCursor();
    const photos: Record<number, string> = {};

    return new Promise((resolve) => {
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          photos[cursor.key as number] = cursor.value;
          photoMemoryCache.set(cursor.key as number, cursor.value);
          cursor.continue();
        } else {
          resolve(photos);
        }
      };
      req.onerror = () => resolve({});
    });
  } catch {
    return {};
  }
}

export async function saveMusicToStorage(audioDataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_MEDIA, 'readwrite');
    tx.objectStore(STORE_MEDIA).put(audioDataUrl, 'music');
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Failed to save music to IndexedDB:', err);
  }
}

export async function getMusicFromStorage(): Promise<string | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_MEDIA, 'readonly');
    const req = tx.objectStore(STORE_MEDIA).get('music');
    return new Promise((resolve) => {
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function saveSpecialAssetToStorage(
  key: 'gift' | 'lizard' | 'love_letter',
  dataUrl: string
): Promise<void> {
  try {
    const compressed = await compressImage(dataUrl, 1400, 0.85);
    const db = await openDB();
    const tx = db.transaction(STORE_MEDIA, 'readwrite');
    tx.objectStore(STORE_MEDIA).put(compressed, key);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Failed to save special asset to IndexedDB:', err);
  }
}

export async function getSpecialAssetFromStorage(
  key: 'gift' | 'lizard' | 'love_letter'
): Promise<string | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_MEDIA, 'readonly');
    const req = tx.objectStore(STORE_MEDIA).get(key);
    return new Promise((resolve) => {
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}
