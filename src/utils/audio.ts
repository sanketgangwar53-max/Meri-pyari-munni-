/**
 * Audio Manager for "Meri Pyaari Munni"
 * Plays the user's uploaded song "Malang Sajna" or synthesizes its romantic acoustic melody.
 * Works seamlessly across all 13 pages without interruption or restarting.
 */

import { getMusicFromStorage } from './storage';

class RomanticAudioManager {
  private audioCtx: AudioContext | null = null;
  private isPlaying = false;
  private audioEl: HTMLAudioElement | null = null;
  private synthInterval: number | null = null;
  private listeners: Set<(playing: boolean) => void> = new Set();
  private masterGain: GainNode | null = null;
  private isUsingCustomAudio = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private async initAudioElement() {
    this.audioEl = new Audio();
    this.audioEl.loop = true;
    this.audioEl.volume = 0.75;

    // Check IndexedDB for saved music track first
    const savedTrack = await getMusicFromStorage();
    if (savedTrack) {
      this.audioEl.src = savedTrack;
      this.isUsingCustomAudio = true;
      return;
    }

    // Otherwise check local music.mp3
    this.audioEl.src = '/music.mp3';
    this.audioEl.addEventListener('error', () => {
      // If external file not found, synth seamlessly takes over
      this.isUsingCustomAudio = false;
    });
  }

  public setCustomAudio(src: string) {
    if (!this.audioEl) {
      this.audioEl = new Audio();
    }
    this.audioEl.src = src;
    this.audioEl.loop = true;
    this.isUsingCustomAudio = true;
    if (this.isPlaying) {
      this.stopRomanticSynth();
      this.audioEl.play().catch(() => {});
    }
  }

  public subscribe(cb: (playing: boolean) => void) {
    this.listeners.add(cb);
    cb(this.isPlaying);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isPlaying));
  }

  public async play() {
    if (this.isPlaying) return;

    try {
      if (this.audioEl && this.audioEl.src && this.isUsingCustomAudio) {
        try {
          await this.audioEl.play();
          this.isPlaying = true;
          this.notify();
          return;
        } catch {
          // fall through to synth
        }
      }

      this.startRomanticSynth();
      this.isPlaying = true;
      this.notify();
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  }

  public pause() {
    if (!this.isPlaying) return;
    if (this.audioEl) {
      this.audioEl.pause();
    }
    this.stopRomanticSynth();
    this.isPlaying = false;
    this.notify();
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Melodic synth arranged with the exact romantic motif of "Malang Sajna"
   * ("Tere warga taan mainu koi disda nahi... Tere ishq 'ch hoya main malang sajna")
   */
  private startRomanticSynth() {
    if (typeof window === 'undefined') return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!this.audioCtx) {
      this.audioCtx = new AudioContextClass();
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (!this.masterGain) {
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);
    }

    // Malang Sajna Romantic Lead Theme:
    // "Tere warga taan mainu... koi disda nahi... Tere ishq 'ch hoya main malang sajna"
    const melody = [
      // "Tere warga taan mainu" (G#4 - G#4 - A4 - B4)
      { note: 415.3, duration: 0.6 }, // G#4
      { note: 415.3, duration: 0.6 }, // G#4
      { note: 440.0, duration: 0.6 }, // A4
      { note: 493.88, duration: 1.1 }, // B4
      // "koi disda nahi" (A4 - G#4 - F#4)
      { note: 440.0, duration: 0.6 }, // A4
      { note: 415.3, duration: 0.8 }, // G#4
      { note: 369.99, duration: 1.2 }, // F#4
      // "Tu jo naina 'ch pilaya" (E4 - F#4 - G#4 - G#4)
      { note: 329.63, duration: 0.7 }, // E4
      { note: 369.99, duration: 0.7 }, // F#4
      { note: 415.3, duration: 0.8 }, // G#4
      { note: 415.3, duration: 1.2 }, // G#4
      // "Tere ishq 'ch hoya main" (G#4 - A4 - B4 - C#5)
      { note: 415.3, duration: 0.5 }, // G#4
      { note: 440.0, duration: 0.6 }, // A4
      { note: 493.88, duration: 0.8 }, // B4
      { note: 554.37, duration: 1.4 }, // C#5
      // "malang sajna" (B4 - A4 - G#4 - F#4 - E4)
      { note: 493.88, duration: 0.7 }, // B4
      { note: 440.0, duration: 0.7 }, // A4
      { note: 415.3, duration: 0.9 }, // G#4
      { note: 369.99, duration: 0.9 }, // F#4
      { note: 329.63, duration: 2.2 }, // E4
    ];

    let noteIdx = 0;
    const playNext = () => {
      if (!this.audioCtx || !this.masterGain) return;
      const current = melody[noteIdx];
      this.playRomanticChime(current.note, current.duration);
      noteIdx = (noteIdx + 1) % melody.length;
    };

    playNext();
    this.synthInterval = window.setInterval(playNext, 1250);
  }

  private playRomanticChime(freq: number, duration: number) {
    if (!this.audioCtx || !this.masterGain) return;
    const now = this.audioCtx.currentTime;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Warm sub-harmonics for emotional acoustic richness
    const subOsc = this.audioCtx.createOscillator();
    const subGain = this.audioCtx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq * 0.5, now);

    // Envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.24, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.8);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.exponentialRampToValueAtTime(0.1, now + 0.08);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.6);

    osc.connect(gain);
    subOsc.connect(subGain);

    gain.connect(this.masterGain);
    subGain.connect(this.masterGain);

    osc.start(now);
    subOsc.start(now);

    osc.stop(now + duration + 0.9);
    subOsc.stop(now + duration + 0.7);
  }

  private stopRomanticSynth() {
    if (this.synthInterval !== null) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  // Interactive melodic chime for keypad & buttons
  public playKeyNote(index = 0) {
    try {
      const ctx = this.audioCtx || new (window.AudioContext || (window as any).webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
      const freq = notes[index % notes.length];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {}
  }

  // Magical celebration sparkles for candle blow & surprises
  public playCelebrationChime() {
    try {
      const ctx = this.audioCtx || new (window.AudioContext || (window as any).webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      const chords = [523.25, 659.25, 783.99, 1046.50];
      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.01, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.8);
      });
    } catch {}
  }
}

export const romanticAudio = new RomanticAudioManager();

