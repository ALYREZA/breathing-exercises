import type { AppState, BreathingCycle } from '../types';

export class StateManager {
  private state: AppState = {
    isRunning: false,
    isPaused: false,
    currentCycleIndex: 0,
    remainingTime: 0,
    currentScale: 1
  };

  private cycles: BreathingCycle[] = [];
  private holdStartTime = 0;

  setCycles(cycles: BreathingCycle[]): void {
    this.cycles = cycles;
  }

  getCycles(): BreathingCycle[] {
    return this.cycles;
  }

  getCurrentCycle(): BreathingCycle | null {
    return this.cycles[this.state.currentCycleIndex] ?? null;
  }

  start(): void {
    this.state.isRunning = true;
    this.state.isPaused = false;
    this.state.currentCycleIndex = 0;
    this.state.remainingTime = 0;
  }

  pause(): void {
    this.state.isPaused = true;
  }

  resume(): void {
    this.state.isPaused = false;
  }

  stop(): void {
    this.state.isRunning = false;
    this.state.isPaused = false;
    this.state.remainingTime = 0;
    this.state.currentScale = 1;
    this.state.currentCycleIndex = 0;
  }

  nextCycle(): void {
    this.state.currentCycleIndex = (this.state.currentCycleIndex + 1) % this.cycles.length;
    this.state.remainingTime = 0;
  }

  setRemainingTime(time: number): void {
    this.state.remainingTime = time;
  }

  getRemainingTime(): number {
    return this.state.remainingTime;
  }

  setCurrentScale(scale: number): void {
    this.state.currentScale = scale;
  }

  getCurrentScale(): number {
    return this.state.currentScale;
  }

  setHoldStartTime(time: number): void {
    this.holdStartTime = time;
  }

  getHoldStartTime(): number {
    return this.holdStartTime;
  }

  isRunning(): boolean {
    return this.state.isRunning;
  }

  isPaused(): boolean {
    return this.state.isPaused;
  }

  getState(): Readonly<AppState> {
    return { ...this.state };
  }
}

