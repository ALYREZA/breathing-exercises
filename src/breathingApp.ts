import type { BreathingPattern, BreathingCycle } from './types';
import { PatternManager } from './managers/PatternManager';
import { AudioManager } from './managers/AudioManager';
import { AnimationManager } from './managers/AnimationManager';
import { VisualEffectsManager } from './managers/VisualEffectsManager';
import { StateManager } from './managers/StateManager';
import { UIManager } from './managers/UIManager';
import { PREDEFINED_PATTERNS } from './constants';

export class BreathingApp {
  private uiManager: UIManager;
  private audioManager: AudioManager;
  private animationManager: AnimationManager;
  private visualEffectsManager: VisualEffectsManager;
  private stateManager: StateManager;
  private currentPattern: BreathingPattern;
  private holdTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(container: HTMLElement) {
    this.uiManager = new UIManager(container);
    this.audioManager = new AudioManager();
    this.stateManager = new StateManager();
    this.currentPattern = PREDEFINED_PATTERNS[0];
    
    this.uiManager.render(PREDEFINED_PATTERNS, this.currentPattern);
    
    const circle = this.uiManager.getElementById('breathing-circle');
    const circleGlow = this.uiManager.getElementById('circle-glow');
    const circleRipple = this.uiManager.getElementById('circle-ripple');
    
    this.animationManager = new AnimationManager(circle);
    this.visualEffectsManager = new VisualEffectsManager(circle, circleGlow, circleRipple);
    
    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    const patternSelect = this.uiManager.getElementById('pattern-select') as HTMLSelectElement;
    const customPatternDiv = this.uiManager.getElementById('custom-pattern') as HTMLElement;
    const patternInput = this.uiManager.getElementById('pattern-input') as HTMLInputElement;
    const startBtn = this.uiManager.getElementById('start-btn') as HTMLButtonElement;
    const pauseBtn = this.uiManager.getElementById('pause-btn') as HTMLButtonElement;
    const resumeBtn = this.uiManager.getElementById('resume-btn') as HTMLButtonElement;
    const stopBtn = this.uiManager.getElementById('stop-btn') as HTMLButtonElement;
    const soundToggle = this.uiManager.getElementById('sound-toggle') as HTMLInputElement;

    patternSelect?.addEventListener('change', () => {
      const value = patternSelect.value;
      if (value === 'custom') {
        customPatternDiv.style.display = 'block';
      } else {
        customPatternDiv.style.display = 'none';
        this.currentPattern = PatternManager.getPredefinedPattern(parseInt(value));
        this.uiManager.updatePatternInfo(this.currentPattern);
      }
    });

    patternInput?.addEventListener('input', () => {
      const pattern = PatternManager.parsePattern(patternInput.value);
      if (pattern) {
        this.currentPattern = PatternManager.createCustomPattern(pattern);
        this.uiManager.updatePatternInfo(this.currentPattern);
      }
    });

    startBtn?.addEventListener('click', () => this.start());
    pauseBtn?.addEventListener('click', () => this.pause());
    resumeBtn?.addEventListener('click', () => this.resume());
    stopBtn?.addEventListener('click', () => this.stop());

    soundToggle?.addEventListener('change', (e) => {
      const enabled = (e.target as HTMLInputElement).checked;
      this.audioManager.setSoundEnabled(enabled);
    });
  }

  private start(): void {
    if (this.stateManager.isRunning()) return;

    const cycles = PatternManager.buildCycles(this.currentPattern);
    if (cycles.length === 0) {
      alert('Please enter a valid pattern');
      return;
    }

    if (!PatternManager.validatePattern(this.currentPattern)) {
      alert('Please enter a valid pattern');
      return;
    }

    if (this.audioManager.isSoundEnabled() && !this.audioManager.hasAudioContext()) {
      this.audioManager.initAudioContext();
    }

    this.stateManager.setCycles(cycles);
    this.stateManager.start();
    this.uiManager.showRunningButtons();
    this.runCycle();
  }

  private runCycle(): void {
    if (!this.stateManager.isRunning() || this.stateManager.isPaused()) return;

    const cycle = this.stateManager.getCurrentCycle();
    if (!cycle) return;

    const duration = cycle.duration * 1000;
    const startTime = this.stateManager.getRemainingTime() > 0 
      ? this.stateManager.getRemainingTime() 
      : cycle.duration;
    
    this.uiManager.updatePhaseDisplay(cycle.phase, cycle.duration, startTime, (remaining) => {
      this.stateManager.setRemainingTime(remaining);
    });

    if (cycle.phase === 'hold' || cycle.phase === 'holdAfterExhale') {
      this.handleHoldPhase(cycle, duration);
      return;
    }

    this.handleAnimatedPhase(cycle, duration);
  }

  private handleHoldPhase(cycle: BreathingCycle, duration: number): void {
    const waitDuration = this.stateManager.getRemainingTime() > 0 
      ? this.stateManager.getRemainingTime() * 1000 
      : duration;
    
    // Ensure animation is paused and scale is maintained
    this.animationManager.pause();
    
    // Keep current scale during hold phase - get it from the actual element state
    const holdScale = this.animationManager.getCurrentScale();
    
    // Update visuals with ripple effect for phase change
    // Don't trigger ripple on every update, only on phase change
    this.visualEffectsManager.updateCircleVisuals(cycle.phase, holdScale, true);
    this.audioManager.playSound(cycle.phase, waitDuration);
    this.stateManager.setHoldStartTime(Date.now());

    this.holdTimeout = setTimeout(() => {
      if (!this.stateManager.isPaused() && this.stateManager.isRunning()) {
        this.stateManager.setRemainingTime(0);
        this.stateManager.nextCycle();
        // Ensure smooth transition to next phase
        this.runCycle();
      }
    }, waitDuration);
  }

  private handleAnimatedPhase(cycle: BreathingCycle, duration: number): void {
    const animationDuration = this.stateManager.getRemainingTime() > 0 
      ? this.stateManager.getRemainingTime() * 1000 
      : duration;

    // Get the actual current scale from the element - this ensures accuracy
    // especially when transitioning from hold phase
    const startScale = this.animationManager.getCurrentScale();
    
    // Update visuals to match the starting scale BEFORE starting animation
    // This prevents flickering by ensuring visuals match the animation start point
    this.visualEffectsManager.updateCircleVisuals(cycle.phase, startScale, true);
    
    // Small delay to ensure DOM is updated before starting animation
    // This prevents visual flicker during transition
    setTimeout(() => {
      this.audioManager.playSound(cycle.phase, animationDuration);

      // Animate with continuous visual updates
      // Pass startScale explicitly to ensure smooth transition
      this.animationManager.animateToPhase(
        cycle.phase, 
        animationDuration, 
        startScale,
        () => {
          // Animation complete - ensure final visuals are set
          const finalScale = this.animationManager.getCurrentScale();
          this.visualEffectsManager.updateCircleVisuals(cycle.phase, finalScale, false);
          
          if (!this.stateManager.isPaused() && this.stateManager.isRunning()) {
            this.stateManager.setRemainingTime(0);
            this.stateManager.nextCycle();
            this.runCycle();
          }
        },
        (currentScale) => {
          // Update visuals continuously during animation
          this.visualEffectsManager.updateCircleVisuals(cycle.phase, currentScale, false);
          this.stateManager.setCurrentScale(currentScale);
        }
      );
    }, 0);
  }

  private pause(): void {
    if (!this.stateManager.isRunning() || this.stateManager.isPaused()) return;

    this.stateManager.pause();
    this.audioManager.stopSound();
    
    const cycle = this.stateManager.getCurrentCycle();
    if (!cycle) return;

    if (cycle.phase === 'hold' || cycle.phase === 'holdAfterExhale') {
      this.pauseHoldPhase(cycle);
    } else {
      this.pauseAnimatedPhase(cycle);
    }

    this.uiManager.showPausedButtons();
  }

  private pauseHoldPhase(cycle: BreathingCycle): void {
    if (this.holdTimeout) {
      clearTimeout(this.holdTimeout);
      this.holdTimeout = null;
      const elapsed = (Date.now() - this.stateManager.getHoldStartTime()) / 1000;
      const remaining = Math.max(0, cycle.duration - elapsed);
      this.stateManager.setRemainingTime(remaining);
    }
  }

  private pauseAnimatedPhase(cycle: BreathingCycle): void {
    this.animationManager.pause();
    const progress = this.animationManager.getProgress();
    const remaining = cycle.duration * (1 - progress);
    this.stateManager.setRemainingTime(remaining);
  }

  private resume(): void {
    if (!this.stateManager.isRunning() || !this.stateManager.isPaused()) return;

    this.stateManager.resume();
    this.uiManager.showRunningButtons();
    
    const cycle = this.stateManager.getCurrentCycle();
    if (!cycle) return;

    // For animated phases, resume the animation
    if (cycle.phase !== 'hold' && cycle.phase !== 'holdAfterExhale') {
      this.animationManager.resume();
      // Restart audio for the remaining duration
      const remainingDuration = this.stateManager.getRemainingTime() * 1000;
      if (remainingDuration > 0) {
        this.audioManager.playSound(cycle.phase, remainingDuration);
      }
    } else {
      // For hold phases, restart the timeout
      const remainingDuration = this.stateManager.getRemainingTime() * 1000;
      if (remainingDuration > 0) {
        this.audioManager.playSound(cycle.phase, remainingDuration);
        this.stateManager.setHoldStartTime(Date.now());
        this.holdTimeout = setTimeout(() => {
          if (!this.stateManager.isPaused() && this.stateManager.isRunning()) {
            this.stateManager.setRemainingTime(0);
            this.stateManager.nextCycle();
            this.runCycle();
          }
        }, remainingDuration);
      }
    }
  }

  private stop(): void {
    this.stateManager.stop();
    this.audioManager.stopSound();
    this.clearTimers();
    this.animationManager.stop();
    this.animationManager.reset(() => {
      this.stateManager.setCurrentScale(1);
    });
    this.visualEffectsManager.resetVisuals();
    this.uiManager.showStartButton();
    this.uiManager.resetDisplay();
  }

  private clearTimers(): void {
    if (this.holdTimeout) {
      clearTimeout(this.holdTimeout);
      this.holdTimeout = null;
    }
    this.uiManager.clearCountdown();
  }
}
