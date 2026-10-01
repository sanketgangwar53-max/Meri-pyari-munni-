import React, { useState, useEffect } from 'react';
import { Camera, Music, Upload, Check, X, Sparkles, Image, Gift } from 'lucide-react';
import {
  savePhotoToStorage,
  saveMusicToStorage,
  getAllSavedPhotos,
  saveSpecialAssetToStorage,
} from '../utils/storage';
import { romanticAudio } from '../utils/audio';

interface MediaManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotosUpdated: () => void;
}

export const MediaManager: React.FC<MediaManagerProps> = ({
  isOpen,
  onClose,
  onPhotosUpdated,
}) => {
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [savedPhotos, setSavedPhotos] = useState<Record<number, string>>({});

  useEffect(() => {
    if (isOpen) {
      getAllSavedPhotos().then((photos) => setSavedPhotos(photos));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Generic batch photo saver starting from a given slot
  const handleBatchPhotos = async (
    e: React.ChangeEvent<HTMLInputElement>,
    startSlot: number
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadStatus(`Saving ${files.length} photo(s)...`);
    const fileList = Array.from(files);

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const slot = startSlot + i;
      if (slot > 40) break;

      const reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onload = async (event) => {
          const dataUrl = event.target?.result as string;
          if (dataUrl) {
            // Save to browser IndexedDB
            await savePhotoToStorage(slot, dataUrl);

            // Also sync to server public/photos folder
            try {
              fetch('/api/upload-photo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slot, dataUrl }),
              }).catch(() => {});
            } catch {
              // fallback
            }
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    const updated = await getAllSavedPhotos();
    setSavedPhotos(updated);
    setUploadStatus(`Saved photos successfully! Total loaded: ${Object.keys(updated).length}/40 ❤️`);
    onPhotosUpdated();
  };

  // Handle single photo slot upload
  const handleSinglePhoto = (
    e: React.ChangeEvent<HTMLInputElement>,
    slot: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        await savePhotoToStorage(slot, dataUrl);
        try {
          fetch('/api/upload-photo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slot, dataUrl }),
          }).catch(() => {});
        } catch {}

        const updated = await getAllSavedPhotos();
        setSavedPhotos(updated);
        setUploadStatus(`Photo #${slot} updated! ✨`);
        onPhotosUpdated();
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle special assets (Gift or Lizard)
  const handleSpecialAsset = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: 'gift' | 'lizard'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        await saveSpecialAssetToStorage(key, dataUrl);
        try {
          fetch('/api/upload-asset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, dataUrl }),
          }).catch(() => {});
        } catch {}

        setUploadStatus(`${key === 'gift' ? 'Gift' : 'Lizard'} photo saved! 🎁`);
        onPhotosUpdated();
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle music file upload
  const handleMusicFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('Saving and playing your song "Malang Sajna"... 🎵');
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        // Save to IndexedDB
        await saveMusicToStorage(dataUrl);

        // Save to backend server public/music.mp3
        try {
          fetch('/api/upload-music', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl }),
          }).catch(() => {});
        } catch {}

        // Immediately update player and play!
        romanticAudio.setCustomAudio(dataUrl);
        setUploadStatus('Playing your uploaded song "Malang Sajna" now! ❤️🎵');
      }
    };
    reader.readAsDataURL(file);
  };

  const totalLoaded = Object.keys(savedPhotos).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 rounded-3xl bg-[#1b1328] border border-pink-500/30 shadow-2xl flex flex-col gap-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-pink-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center pt-1">
          <div className="w-11 h-11 rounded-full bg-pink-500/15 border border-pink-400/30 flex items-center justify-center mb-1">
            <Sparkles className="w-5 h-5 text-pink-300" />
          </div>
          <h3 className="text-xl font-bold font-serif-romance text-pink-100">
            Munni’s Photos & Music Sync 🌸
          </h3>
          <p className="text-xs text-pink-300/70 mt-1">
            {totalLoaded} of 40 photos loaded in authentic high-definition
          </p>
        </div>

        {/* Progress Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1 p-2 rounded-2xl bg-white/5 border border-pink-500/15 max-h-20 overflow-y-auto">
          {Array.from({ length: 40 }).map((_, idx) => {
            const num = idx + 1;
            const isFilled = !!savedPhotos[num];
            return (
              <span
                key={num}
                className={`w-5 h-5 rounded-full text-[9px] font-mono flex items-center justify-center transition-all ${
                  isFilled
                    ? 'bg-pink-500 text-white font-bold shadow-sm shadow-pink-500/50'
                    : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                }`}
                title={`Photo ${num}: ${isFilled ? 'Loaded' : 'Pending'}`}
              >
                {num}
              </span>
            );
          })}
        </div>

        {/* Quick Batch Upload Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Batch 1: Photos 1 to 18 */}
          <label className="flex items-center justify-between p-3.5 rounded-2xl border border-pink-500/25 bg-[#251939]/70 hover:bg-[#2e1f48] cursor-pointer transition-all text-left">
            <div className="flex items-center gap-2.5">
              <Camera className="w-5 h-5 text-pink-400" />
              <div>
                <p className="text-xs font-semibold text-pink-100">Batch 1 (Photos 1–18)</p>
                <p className="text-[10px] text-pink-300/60">Select initial 18 photos</p>
              </div>
            </div>
            <Upload className="w-4 h-4 text-pink-300" />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleBatchPhotos(e, 1)}
              className="hidden"
            />
          </label>

          {/* Batch 2: Photos 19 to 38 */}
          <label className="flex items-center justify-between p-3.5 rounded-2xl border border-rose-500/25 bg-[#251939]/70 hover:bg-[#2e1f48] cursor-pointer transition-all text-left">
            <div className="flex items-center gap-2.5">
              <Image className="w-5 h-5 text-rose-400" />
              <div>
                <p className="text-xs font-semibold text-rose-100">Batch 2 (Photos 19–38)</p>
                <p className="text-[10px] text-rose-300/60">Select recent 20 photos</p>
              </div>
            </div>
            <Upload className="w-4 h-4 text-rose-300" />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleBatchPhotos(e, 19)}
              className="hidden"
            />
          </label>
        </div>

        {/* Special Photos: 39 & 40 & Gift / Lizard */}
        <div className="grid grid-cols-2 gap-2 text-left">
          {/* Batch 3: Photos 39–40 */}
          <label className="flex items-center justify-between p-3 rounded-2xl border border-pink-500/20 bg-[#251939]/50 hover:bg-[#2e1f48] cursor-pointer transition-all">
            <div>
              <p className="text-xs font-semibold text-pink-100">Photos 39 & 40</p>
              <p className="text-[10px] text-pink-300/60">Special Babydoll</p>
            </div>
            <Upload className="w-3.5 h-3.5 text-pink-300" />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleBatchPhotos(e, 39)}
              className="hidden"
            />
          </label>

          {/* Gift Photo */}
          <label className="flex items-center justify-between p-3 rounded-2xl border border-amber-500/20 bg-[#251939]/50 hover:bg-[#2e1f48] cursor-pointer transition-all">
            <div className="flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-amber-300" />
              <div>
                <p className="text-xs font-semibold text-amber-100">Gift Photo</p>
                <p className="text-[10px] text-amber-300/60">For Page 12</p>
              </div>
            </div>
            <Upload className="w-3.5 h-3.5 text-amber-300" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleSpecialAsset(e, 'gift')}
              className="hidden"
            />
          </label>
        </div>

        {/* Upload Music Section */}
        <label className="flex items-center justify-between p-3.5 rounded-2xl border border-pink-500/25 bg-[#251939]/70 hover:bg-[#2e1f48] cursor-pointer transition-all text-left">
          <div className="flex items-center gap-3">
            <Music className="w-5 h-5 text-rose-400" />
            <div>
              <p className="text-xs font-semibold text-pink-100">Attach Song ("Malang Sajna")</p>
              <p className="text-[10px] text-pink-300/60">Audio file from your phone/device</p>
            </div>
          </div>
          <Upload className="w-4 h-4 text-pink-300" />
          <input
            type="file"
            accept="audio/*"
            onChange={handleMusicFile}
            className="hidden"
          />
        </label>

        {/* Status Notification */}
        {uploadStatus && (
          <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-400/30 text-xs text-pink-200 flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{uploadStatus}</span>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm shadow-lg shadow-pink-900/40 active:scale-98 cursor-pointer mt-1"
        >
          Back to Surprise Website ❤️
        </button>
      </div>
    </div>
  );
};
