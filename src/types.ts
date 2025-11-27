export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale';

export interface BreathingPattern {
  name: string;
  pattern: number[];
  description: string;
  benefit?: string;
}

export interface BreathingCycle {
  phase: BreathingPhase;
  duration: number;
}

export interface AppState {
  isRunning: boolean;
  isPaused: boolean;
  currentCycleIndex: number;
  remainingTime: number;
  currentScale: number;
}

