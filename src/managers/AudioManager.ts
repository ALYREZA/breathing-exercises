import type { BreathingPhase } from '../types';
import { AUDIO_CONFIG } from '../constants';

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private currentOscillator: OscillatorNode | null = null;
  private currentGainNode: GainNode | null = null;
  private soundEnabled = true;

  initAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume().then(() => {
          console.log('Audio context resumed');
        }).catch((error) => {
          console.error('Failed to resume audio context:', error);
        });
      }
    } catch (error) {
      console.error('Audio context initialization failed:', error);
      this.soundEnabled = false;
    }
  }

  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    if (!enabled) {
      this.stopSound();
    } else if (!this.audioContext) {
      this.initAudioContext();
    }
  }

  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  hasAudioContext(): boolean {
    return this.audioContext !== null;
  }

  playSound(phase: BreathingPhase, duration: number): void {
    if (!this.soundEnabled) {
      return;
    }

    if (!this.audioContext) {
      this.initAudioContext();
      if (!this.audioContext) {
        return;
      }
    }

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.stopSound();

    if (phase === 'hold' || phase === 'holdAfterExhale') {
      this.playSteadyTone(AUDIO_CONFIG.HOLD_FREQ, duration, AUDIO_CONFIG.HOLD_VOLUME);
      return;
    }

    const startFreq = phase === 'inhale' 
      ? AUDIO_CONFIG.INHALE_START_FREQ 
      : AUDIO_CONFIG.EXHALE_START_FREQ;
    const endFreq = phase === 'inhale' 
      ? AUDIO_CONFIG.INHALE_END_FREQ 
      : AUDIO_CONFIG.EXHALE_END_FREQ;

    this.playSweepTone(startFreq, endFreq, duration);
  }

  stopSound(): void {
    if (this.currentOscillator) {
      try {
        this.currentOscillator.stop();
      } catch (e) {
        // Oscillator might already be stopped
      }
      this.currentOscillator = null;
    }
    if (this.currentGainNode) {
      this.currentGainNode = null;
    }
  }

  private playSweepTone(startFreq: number, endFreq: number, duration: number): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(
      endFreq,
      this.audioContext.currentTime + duration / 1000
    );

    const now = this.audioContext.currentTime;
    const durationSeconds = duration / 1000;
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(AUDIO_CONFIG.SWEEP_VOLUME, now + AUDIO_CONFIG.FADE_DURATION);
    gainNode.gain.linearRampToValueAtTime(AUDIO_CONFIG.SWEEP_VOLUME, now + durationSeconds - AUDIO_CONFIG.FADE_DURATION);
    gainNode.gain.linearRampToValueAtTime(0, now + durationSeconds);

    oscillator.start(now);
    oscillator.stop(now + durationSeconds);

    this.currentOscillator = oscillator;
    this.currentGainNode = gainNode;
  }

  private playSteadyTone(frequency: number, duration: number, volume: number): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    const now = this.audioContext.currentTime;
    const durationSeconds = duration / 1000;
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + AUDIO_CONFIG.FADE_DURATION);
    gainNode.gain.linearRampToValueAtTime(volume, now + durationSeconds - AUDIO_CONFIG.FADE_DURATION);
    gainNode.gain.linearRampToValueAtTime(0, now + durationSeconds);

    oscillator.start(now);
    oscillator.stop(now + durationSeconds);

    this.currentOscillator = oscillator;
    this.currentGainNode = gainNode;
  }
}

