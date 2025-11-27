import type { BreathingPattern, BreathingCycle } from '../types';
import { PREDEFINED_PATTERNS } from '../constants';

export class PatternManager {
  static parsePattern(input: string): number[] | null {
    const parts = input.split('-').map(p => parseInt(p.trim()));
    
    if (parts.length < 2 || parts.length > 4 || parts.some(p => isNaN(p) || p < 0)) {
      return null;
    }
    
    // Pad to 4 elements if needed
    while (parts.length < 4) {
      parts.push(0);
    }
    
    return parts;
  }

  static createCustomPattern(pattern: number[]): BreathingPattern {
    return {
      name: 'Custom',
      pattern,
      description: pattern.join('-')
    };
  }

  static getPredefinedPattern(index: number): BreathingPattern {
    return PREDEFINED_PATTERNS[index];
  }

  static getAllPredefinedPatterns(): BreathingPattern[] {
    return PREDEFINED_PATTERNS;
  }

  static buildCycles(pattern: BreathingPattern): BreathingCycle[] {
    const [inhale, hold, exhale, holdAfterExhale] = pattern.pattern;
    const cycles: BreathingCycle[] = [];

    if (inhale > 0) {
      cycles.push({ phase: 'inhale', duration: inhale });
    }
    if (hold > 0) {
      cycles.push({ phase: 'hold', duration: hold });
    }
    if (exhale > 0) {
      cycles.push({ phase: 'exhale', duration: exhale });
    }
    if (holdAfterExhale > 0) {
      cycles.push({ phase: 'holdAfterExhale', duration: holdAfterExhale });
    }

    return cycles;
  }

  static validatePattern(pattern: BreathingPattern): boolean {
    return pattern.pattern.length === 4 && 
           pattern.pattern.every(p => p >= 0) &&
           pattern.pattern.some(p => p > 0);
  }
}

