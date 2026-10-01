import React, { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX, Music, Upload, Link as LinkIcon, Check, Sparkles, X } from 'lucide-react';
import { romanticAudio } from '../utils/audio';
import { saveMusicToStorage } from '../utils/storage';

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [driveUrl, setDriveUrl] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = romanticAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return unsub;
  }, []);

  const handleToggle = () => {
    romanticAudio.toggle();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusMsg('Loading your audio file...');
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        // Save locally to storage
        await saveMusicToStorage(dataUrl);

        // Upload to server so it's permanent for everyone
        try {
          fetch('/api/upload-music', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl }),
          }).catch(() => {});
        } catch {}

        // Set to audio manager and play immediately!
        romanticAudio.setCustomAudio(dataUrl);
        romanticAudio.play();
        setStatusMsg('Song attached and playing! ❤️🎵');
        setTimeout(() => setShowModal(false), 1200);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDriveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveUrl.trim()) return;

    setIsLoading(true);
    setStatusMsg('Downloading song from Google Drive link...');

    try {
      const res = await fetch('/api/download-drive-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: driveUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg('Downloaded successfully! Playing now... 🎵');
        romanticAudio.setCustomAudio('/music.mp3');
        romanticAudio.play();
        setTimeout(() => setShowModal(false), 1200);
      } else {
        setStatusMsg(`Failed: ${data.error || 'Please make sure Drive link is public ("Anyone with link")'}`);
      }
    } catch (err) {
      setStatusMsg('Network error downloading link. Try selecting the audio file directly.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {/* Main Audio Toggle Button */}
        <button
          onClick={handleToggle}
          aria-label={isPlaying ? 'Mute Music' : 'Play Music'}
          className="group relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#181128]/80 hover:bg-[#25173e]/90 text-pink-200 border border-pink-500/25 backdrop-blur-md shadow-lg shadow-pink-950/40 transition-all active:scale-95 cursor-pointer"
        >
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            {isPlaying && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isPlaying ? 'bg-pink-400' : 'bg-zinc-500'
              }`}
            ></span>
          </span>

          {isPlaying ? (
            <>
              <Volume2 className="w-4 h-4 text-pink-400 animate-pulse" />
              <span className="text-xs font-medium tracking-wider text-pink-200 uppercase">Music ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-medium tracking-wider text-zinc-400 uppercase">Music OFF</span>
            </>
          )}

          {/* Floating animated note when playing */}
          {isPlaying && (
            <div className="absolute -bottom-4 right-2 pointer-events-none opacity-60">
              <Music className="w-3 h-3 text-pink-300 animate-bounce" />
            </div>
          )}
        </button>

        {/* Change/Attach Song Button */}
        <button
          onClick={() => setShowModal(true)}
          className="p-2 rounded-full bg-[#181128]/80 hover:bg-[#25173e]/90 text-pink-300 border border-pink-500/25 backdrop-blur-md shadow-lg shadow-pink-950/40 transition-all active:scale-95 cursor-pointer"
          title="Attach or change song file"
        >
          <Music className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Music Selector Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative max-w-sm w-full p-6 rounded-3xl bg-[#1b1328] border border-pink-500/30 shadow-2xl flex flex-col gap-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-pink-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-pink-500/15 border border-pink-400/30 flex items-center justify-center mb-2">
                <Sparkles className="w-6 h-6 text-pink-300" />
              </div>
              <h3 className="text-lg font-bold font-serif-romance text-pink-100">
                Attach Song: Malang Sajna 🎵
              </h3>
              <p className="text-xs text-pink-300/70 mt-1">
                Choose the audio file you uploaded or paste its Google Drive link!
              </p>
            </div>

            {/* Option 1: Pick local audio file */}
            <input
              type="file"
              ref={fileInputRef}
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-medium text-xs sm:text-sm shadow-lg shadow-pink-900/40 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Select Audio File from Phone / Device</span>
            </button>

            <div className="flex items-center gap-2 text-zinc-500 text-xs my-1">
              <div className="flex-1 h-px bg-zinc-800" />
              <span>OR</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            {/* Option 2: Paste Google Drive link */}
            <form onSubmit={handleDriveSubmit} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-pink-500/20 text-xs">
                <LinkIcon className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <input
                  type="url"
                  placeholder="Paste Google Drive Audio Link"
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                  className="w-full bg-transparent text-pink-100 placeholder:text-pink-300/40 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !driveUrl.trim()}
                className="py-2.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/30 text-pink-200 text-xs font-medium cursor-pointer disabled:opacity-40"
              >
                {isLoading ? 'Downloading...' : 'Load from Link'}
              </button>
            </form>

            {statusMsg && (
              <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-400/30 text-xs text-pink-200 flex items-center justify-center gap-1.5 animate-pulse">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{statusMsg}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
