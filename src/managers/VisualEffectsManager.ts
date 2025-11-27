import type { BreathingPhase } from '../types';
import { PHASE_COLORS, PHASE_GRADIENTS } from '../constants';

export class VisualEffectsManager {
  private circle: HTMLElement | null;
  private circleGlow: HTMLElement | null;
  private circleRipple: HTMLElement | null;
  private currentPhase: BreathingPhase | null = null;

  constructor(
    circle: HTMLElement | null,
    circleGlow: HTMLElement | null,
    circleRipple: HTMLElement | null
  ) {
    this.circle = circle;
    this.circleGlow = circleGlow;
    this.circleRipple = circleRipple;
  }

  updateCircleVisuals(phase: BreathingPhase, scale: number, triggerRipple: boolean = false): void {
    if (!this.circle || !this.circleGlow || !this.circleRipple) return;

    const color = this.getColorForPhase(phase);
    const glowIntensity = Math.min(scale * 0.3, 0.8);
    const gradient = this.getGradientForPhase(phase);
    
    // Smoothly transition colors - use CSS transitions for smooth color changes
    this.circle.style.borderColor = color;
    this.circle.style.background = gradient;
    
    // Update glow based on scale
    this.circleGlow.style.boxShadow = `
      0 0 ${20 + scale * 30}px ${color},
      0 0 ${40 + scale * 40}px ${color},
      inset 0 0 ${20 + scale * 20}px ${color}
    `;
    this.circleGlow.style.opacity = glowIntensity.toString();
    
    // Only trigger ripple on phase change, not on every update
    if (triggerRipple && this.currentPhase !== phase) {
      this.triggerRippleEffect(color);
      this.currentPhase = phase;
    }
  }

  resetVisuals(): void {
    if (!this.circle || !this.circleGlow) return;

    if (this.circleGlow) {
      this.circleGlow.style.opacity = '0';
    }
    if (this.circle) {
      this.circle.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    }
  }

  private triggerRippleEffect(color: string): void {
    if (!this.circleRipple) return;

    this.circleRipple.style.borderColor = color;
    this.circleRipple.style.animation = 'none';
    void this.circleRipple.offsetWidth; // Trigger reflow
    this.circleRipple.style.animation = 'ripple 2s ease-out';
  }

  private getColorForPhase(phase: BreathingPhase): string {
    return PHASE_COLORS[phase] || PHASE_COLORS.default;
  }

  private getGradientForPhase(phase: BreathingPhase): string {
    return PHASE_GRADIENTS[phase] || PHASE_GRADIENTS.default;
  }
}

