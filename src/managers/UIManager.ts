import type { BreathingPattern, BreathingPhase } from '../types';
import { PHASE_LABELS, ANIMATION_CONFIG } from '../constants';

export class UIManager {
  private container: HTMLElement;
  private phaseText: HTMLElement | null = null;
  private timerText: HTMLElement | null = null;
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(patterns: BreathingPattern[], currentPattern: BreathingPattern): void {
    this.container.innerHTML = `
      <div class="breathing-app">
        <h1>Breathing Exercises</h1>
        
        <div class="pattern-selector">
          <label for="pattern-select">Choose a pattern:</label>
          <select id="pattern-select" class="pattern-select">
            ${patterns.map((p, i) => 
              `<option value="${i}">${p.name} (${p.description})</option>`
            ).join('')}
            <option value="custom">Custom Pattern</option>
          </select>
        </div>

        <div class="custom-pattern" id="custom-pattern" style="display: none;">
          <label for="pattern-input">Enter pattern (e.g., 4-4-4 or 4-7-8):</label>
          <input 
            type="text" 
            id="pattern-input" 
            class="pattern-input" 
            placeholder="4-4-4"
            pattern="[0-9-]+"
          />
          <small>Format: inhale-hold-exhale-holdAfterExhale (use 0 to skip a phase)</small>
        </div>

        <div class="animation-container">
          <div class="circle-ripple" id="circle-ripple"></div>
          <div class="breathing-circle" id="breathing-circle">
            <div class="circle-glow" id="circle-glow"></div>
            <div class="circle-content">
              <div class="phase-text" id="phase-text">Ready</div>
              <div class="timer-text" id="timer-text">--</div>
            </div>
          </div>
        </div>

        <div class="controls">
          <button id="start-btn" class="control-btn start-btn">Start</button>
          <button id="pause-btn" class="control-btn pause-btn" style="display: none;">Pause</button>
          <button id="resume-btn" class="control-btn resume-btn" style="display: none;">Resume</button>
          <button id="stop-btn" class="control-btn stop-btn" style="display: none;">Stop</button>
        </div>

        <div class="pattern-info" id="pattern-info">
          <p>Current Pattern: <strong>${currentPattern.description}</strong></p>
        </div>

        <div class="sound-control">
          <label class="sound-toggle">
            <input type="checkbox" id="sound-toggle" checked />
            <span class="sound-toggle-label">🔊 Sound</span>
          </label>
        </div>
      </div>
    `;

    this.phaseText = document.getElementById('phase-text');
    this.timerText = document.getElementById('timer-text');
  }

  getElementById(id: string): HTMLElement | null {
    return document.getElementById(id);
  }

  updatePatternInfo(pattern: BreathingPattern): void {
    const patternInfo = this.getElementById('pattern-info');
    if (patternInfo) {
      patternInfo.innerHTML = `<p>Current Pattern: <strong>${pattern.description}</strong></p>`;
    }
  }

  updatePhaseDisplay(phase: BreathingPhase, duration: number, startFrom: number, onTick?: (remaining: number) => void): void {
    this.clearCountdown();

    if (this.phaseText) {
      this.phaseText.style.opacity = '0';
      this.phaseText.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        if (this.phaseText) {
          this.phaseText.textContent = PHASE_LABELS[phase];
          this.phaseText.style.opacity = '1';
          this.phaseText.style.transform = 'translateY(0)';
        }
      }, ANIMATION_CONFIG.TEXT_TRANSITION_DELAY);
    }

    let countdown = Math.ceil(startFrom);
    
    if (this.timerText) {
      this.timerText.textContent = countdown.toString();
    }

    this.countdownInterval = setInterval(() => {
      countdown -= 1;
      
      if (this.timerText) {
        this.timerText.textContent = countdown > 0 ? countdown.toString() : '';
      }
      
      onTick?.(countdown);
      
      if (countdown <= 0) {
        this.clearCountdown();
      }
    }, 1000);
  }

  clearCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  showStartButton(): void {
    this.setButtonVisibility('start-btn', true);
    this.setButtonVisibility('pause-btn', false);
    this.setButtonVisibility('resume-btn', false);
    this.setButtonVisibility('stop-btn', false);
  }

  showRunningButtons(): void {
    this.setButtonVisibility('start-btn', false);
    this.setButtonVisibility('pause-btn', true);
    this.setButtonVisibility('resume-btn', false);
    this.setButtonVisibility('stop-btn', true);
  }

  showPausedButtons(): void {
    this.setButtonVisibility('pause-btn', false);
    this.setButtonVisibility('resume-btn', true);
  }

  resetDisplay(): void {
    if (this.phaseText) {
      this.phaseText.textContent = 'Ready';
    }
    if (this.timerText) {
      this.timerText.textContent = '--';
    }
    this.clearCountdown();
  }

  private setButtonVisibility(buttonId: string, visible: boolean): void {
    const button = this.getElementById(buttonId);
    if (button) {
      button.style.display = visible ? 'inline-block' : 'none';
    }
  }
}

