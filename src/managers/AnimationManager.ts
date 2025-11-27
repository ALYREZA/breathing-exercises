import { animate } from 'animejs';
import type { JSAnimation } from 'animejs';
import type { BreathingPhase } from '../types';
import { PHASE_SCALES, PHASE_EASING, ANIMATION_CONFIG } from '../constants';

export class AnimationManager {
  private circle: HTMLElement | null;
  private currentAnimation: JSAnimation | null = null;
  private currentScale = 1;
  private currentPhase: BreathingPhase | null = null;
  private startScale = 1;
  private targetScale = 1;
  private onUpdateCallback: ((scale: number) => void) | null = null;

  constructor(circle: HTMLElement | null) {
    this.circle = circle;
  }

  animateToPhase(
    phase: BreathingPhase, 
    duration: number, 
    startScale?: number, 
    onComplete?: () => void,
    onUpdate?: (scale: number) => void
  ): void {
    if (!this.circle) return;

    this.targetScale = this.getScaleForPhase(phase);
    this.startScale = startScale ?? this.currentScale;
    this.currentPhase = phase;
    this.onUpdateCallback = onUpdate || null;
    const easing = this.getEasingForPhase(phase);

    // Stop any existing animation cleanly and ensure scale is synced
    if (this.currentAnimation) {
      try {
        this.currentAnimation.pause();
        // Get the actual current scale from the element if animation was running
        const currentTransform = getComputedStyle(this.circle).transform;
        if (currentTransform && currentTransform !== 'none') {
          const matrix = currentTransform.match(/matrix\(([^)]+)\)/);
          if (matrix) {
            const values = matrix[1].split(',');
            const scaleX = parseFloat(values[0]) || this.currentScale;
            this.currentScale = scaleX;
            this.startScale = scaleX;
          }
        }
      } catch (e) {
        // Animation might already be stopped
      }
      this.currentAnimation = null;
    }

    // Ensure startScale matches current visual state
    if (startScale === undefined) {
      this.startScale = this.currentScale;
    }

    this.currentAnimation = animate(this.circle, {
      scale: [this.startScale, this.targetScale],
      duration,
      ease: easing,
      onUpdate: (anim) => {
        // Calculate current scale based on animation progress
        const progress = anim.progress / 100;
        this.currentScale = this.startScale + (this.targetScale - this.startScale) * progress;
        this.onUpdateCallback?.(this.currentScale);
      },
      onComplete: () => {
        this.currentScale = this.targetScale;
        this.onUpdateCallback?.(this.currentScale);
        onComplete?.();
      }
    });
  }

  pause(): void {
    if (this.currentAnimation) {
      this.currentAnimation.pause();
    }
  }

  resume(): void {
    if (this.currentAnimation) {
      this.currentAnimation.resume();
    }
  }

  stop(): void {
    if (this.currentAnimation) {
      try {
        this.currentAnimation.pause();
      } catch (e) {
        // Animation might already be stopped
      }
      this.currentAnimation = null;
    }
    this.onUpdateCallback = null;
    this.currentPhase = null;
  }

  reset(onComplete?: () => void): void {
    if (!this.circle) return;

    this.stop();

    animate(this.circle, {
      scale: 1,
      duration: ANIMATION_CONFIG.RESET_DURATION,
      ease: ANIMATION_CONFIG.RESET_EASING,
      onComplete: () => {
        this.currentScale = 1;
        this.startScale = 1;
        this.targetScale = 1;
        onComplete?.();
      }
    });
  }

  getCurrentScale(): number {
    // If we have a circle element, try to get the actual scale from the DOM
    // This ensures accuracy especially after hold phases
    if (this.circle) {
      const transform = getComputedStyle(this.circle).transform;
      if (transform && transform !== 'none') {
        const matrix = transform.match(/matrix\(([^)]+)\)/);
        if (matrix) {
          const values = matrix[1].split(',');
          const scaleX = parseFloat(values[0]);
          if (!isNaN(scaleX) && scaleX > 0) {
            this.currentScale = scaleX;
            return scaleX;
          }
        }
      }
    }
    return this.currentScale;
  }

  getProgress(): number {
    return this.currentAnimation?.progress ?? 0;
  }

  getCurrentPhase(): BreathingPhase | null {
    return this.currentPhase;
  }

  private getScaleForPhase(phase: BreathingPhase): number {
    return PHASE_SCALES[phase] ?? PHASE_SCALES.default;
  }

  private getEasingForPhase(phase: BreathingPhase): string {
    return PHASE_EASING[phase] ?? PHASE_EASING.default;
  }
}

