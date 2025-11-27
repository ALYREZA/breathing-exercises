import type { BreathingPattern } from './types';

export const PREDEFINED_PATTERNS: BreathingPattern[] = [
  {
    name: 'Box Breathing',
    pattern: [4, 4, 4, 4],
    description: 'Inhale-Hold-Exhale-Hold (4-4-4-4)'
  },
  {
    name: '4-7-8 Breathing',
    pattern: [4, 7, 8, 0],
    description: 'Inhale-Hold-Exhale (4-7-8)'
  },
  {
    name: 'Equal Breathing',
    pattern: [4, 0, 4, 0],
    description: 'Inhale-Exhale (4-4)'
  },
  {
    name: 'Deep Breathing',
    pattern: [6, 2, 6, 2],
    description: 'Inhale-Hold-Exhale-Hold (6-2-6-2)'
  }
];

export const PHASE_SCALES = {
  inhale: 1.6,
  exhale: 0.75,
  hold: 1.3,
  holdAfterExhale: 1.3,
  default: 1
} as const;

export const PHASE_EASING = {
  inhale: 'easeOutCubic',
  exhale: 'easeInCubic',
  hold: 'linear',
  holdAfterExhale: 'linear',
  default: 'easeInOutCubic'
} as const;

export const PHASE_COLORS = {
  inhale: 'rgba(76, 175, 80, 0.6)',
  exhale: 'rgba(33, 150, 243, 0.6)',
  hold: 'rgba(255, 152, 0, 0.6)',
  holdAfterExhale: 'rgba(255, 152, 0, 0.6)',
  default: 'rgba(255, 255, 255, 0.3)'
} as const;

export const PHASE_GRADIENTS = {
  inhale: 'linear-gradient(135deg, rgba(76, 175, 80, 0.4), rgba(76, 175, 80, 0.2))',
  exhale: 'linear-gradient(135deg, rgba(33, 150, 243, 0.4), rgba(33, 150, 243, 0.2))',
  hold: 'linear-gradient(135deg, rgba(255, 152, 0, 0.4), rgba(255, 152, 0, 0.2))',
  holdAfterExhale: 'linear-gradient(135deg, rgba(255, 152, 0, 0.4), rgba(255, 152, 0, 0.2))',
  default: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))'
} as const;

export const PHASE_LABELS = {
  inhale: 'Inhale',
  hold: 'Hold',
  exhale: 'Exhale',
  holdAfterExhale: 'Hold'
} as const;

export const AUDIO_CONFIG = {
  INHALE_START_FREQ: 200,
  INHALE_END_FREQ: 400,
  EXHALE_START_FREQ: 400,
  EXHALE_END_FREQ: 200,
  HOLD_FREQ: 200,
  HOLD_VOLUME: 0.12,
  SWEEP_VOLUME: 0.15,
  FADE_DURATION: 0.1
} as const;

export const ANIMATION_CONFIG = {
  RESET_DURATION: 500,
  RESET_EASING: 'easeOutCubic',
  TEXT_TRANSITION_DELAY: 150
} as const;

