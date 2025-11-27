import type { BreathingPhase } from '../types';

export class ChartManager {
  private canvas: HTMLCanvasElement | null;
  private ctx: CanvasRenderingContext2D | null = null;
  private dataPoints: Array<{ x: number; y: number }> = [];
  private maxDataPoints: number = 200;
  private animationFrameId: number | null = null;
  private currentPhase: BreathingPhase | null = null;
  private phaseStartTime: number = 0;
  private phaseDuration: number = 0;
  private startY: number = 0;
  private targetY: number = 0;
  private isPaused: boolean = false;
  private lastUpdateTime: number = 0;

  constructor(canvas: HTMLCanvasElement | null) {
    this.canvas = canvas;
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      if (!this.ctx) {
        console.error('Failed to get 2d context from canvas');
        return;
      }
      this.setupCanvas();
      // Initialize with center Y
      this.startY = this.getCenterY();
      this.targetY = this.getCenterY();
      // Add initial data point at center
      this.dataPoints.push({ x: 0, y: this.getCenterY() });
      this.startAnimation();
    } else {
      console.warn('ChartManager: canvas element is null');
    }
  }

  private setupCanvas(): void {
    if (!this.canvas || !this.ctx) return;

    const resizeCanvas = () => {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      
      this.canvas.width = rect.width * window.devicePixelRatio;
      this.canvas.height = rect.height * window.devicePixelRatio;
      this.ctx?.scale(window.devicePixelRatio, window.devicePixelRatio);
      this.draw();
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      resizeCanvas();
      // Also try after a small delay to ensure layout is complete
      setTimeout(() => {
        resizeCanvas();
        // Force a redraw after initialization
        if (this.dataPoints.length > 0) {
          this.draw();
        }
      }, 100);
    });
    
    window.addEventListener('resize', resizeCanvas);
  }

  startPhase(phase: BreathingPhase, duration: number, startY?: number): void {
    this.currentPhase = phase;
    this.phaseDuration = duration * 1000; // Convert to milliseconds
    this.phaseStartTime = Date.now();
    this.isPaused = false;
    // Ensure animation is running
    if (!this.animationFrameId) {
      this.startAnimation();
    }

    if (startY !== undefined) {
      this.startY = startY;
    } else if (this.dataPoints.length > 0) {
      this.startY = this.dataPoints[this.dataPoints.length - 1].y;
    } else {
      this.startY = this.getCenterY();
    }

    // Set target Y based on phase
    const centerY = this.getCenterY();
    const amplitude = this.getAmplitude();
    
    switch (phase) {
      case 'inhale':
        this.targetY = centerY - amplitude; // Go up
        break;
      case 'exhale':
        this.targetY = centerY + amplitude; // Go down
        break;
      case 'hold':
      case 'holdAfterExhale':
        this.targetY = this.startY; // Stay straight
        break;
    }
  }

  pause(): void {
    this.isPaused = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  resume(): void {
    if (this.currentPhase) {
      this.isPaused = false;
      // Ensure animation is running
      if (!this.animationFrameId) {
        this.startAnimation();
      }
    }
  }

  stop(): void {
    this.pause();
    this.dataPoints = [];
    this.currentPhase = null;
    if (this.canvas && this.ctx) {
      this.clear();
    }
  }

  reset(): void {
    this.stop();
    this.dataPoints = [];
    this.startY = this.getCenterY();
    this.targetY = this.getCenterY();
  }

  getCurrentY(): number {
    if (this.dataPoints.length > 0) {
      return this.dataPoints[this.dataPoints.length - 1].y;
    }
    return this.getCenterY();
  }

  private startAnimation(): void {
    if (this.animationFrameId) return;

    const animate = () => {
      if (!this.isPaused) {
        this.update();
        this.draw();
      }
      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.lastUpdateTime = Date.now();
    this.animationFrameId = requestAnimationFrame(animate);
  }

  private update(): void {
    if (!this.canvas) return;
    
    // If no phase is active, don't update but still draw
    if (!this.currentPhase) {
      this.draw();
      return;
    }

    const now = Date.now();
    const elapsed = now - this.phaseStartTime;
    const progress = Math.min(elapsed / this.phaseDuration, 1);

    let currentY: number;

    if (this.currentPhase === 'hold' || this.currentPhase === 'holdAfterExhale') {
      // Stay straight during hold
      currentY = this.startY;
    } else {
      // Smooth transition for inhale/exhale
      const easeProgress = this.easeInOutCubic(progress);
      currentY = this.startY + (this.targetY - this.startY) * easeProgress;
    }

    // Add new data point
    const x = this.dataPoints.length > 0 
      ? this.dataPoints[this.dataPoints.length - 1].x + 1 
      : 0;

    this.dataPoints.push({ x, y: currentY });

    // Remove old data points if we exceed max
    if (this.dataPoints.length > this.maxDataPoints) {
      // Shift all points left to keep the chart moving
      const shiftAmount = this.dataPoints.length - this.maxDataPoints;
      this.dataPoints = this.dataPoints.slice(shiftAmount).map(point => ({
        x: point.x - shiftAmount,
        y: point.y
      }));
    }

    this.lastUpdateTime = now;
  }

  private draw(): void {
    if (!this.canvas || !this.ctx) return;

    this.clear();

    const width = this.canvas.width / window.devicePixelRatio;
    const height = this.canvas.height / window.devicePixelRatio;
    const centerY = this.getCenterY();

    // Draw grid lines (subtle)
    this.ctx.strokeStyle = 'rgba(135, 206, 250, 0.2)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, centerY);
    this.ctx.lineTo(width, centerY);
    this.ctx.stroke();

    // Draw the line if we have at least 1 point
    if (this.dataPoints.length >= 1) {
      this.ctx.strokeStyle = 'rgba(135, 206, 250, 0.9)';
      this.ctx.lineWidth = 3;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';

      // Calculate scale to fit data points
      const maxX = Math.max(...this.dataPoints.map(p => p.x));
      const minX = Math.max(0, maxX - this.maxDataPoints);
      const xScale = width / this.maxDataPoints;

      this.ctx.beginPath();
      let isFirst = true;

      for (const point of this.dataPoints) {
        const x = (point.x - minX) * xScale;
        const y = point.y;

        if (isFirst) {
          this.ctx.moveTo(x, y);
          isFirst = false;
        } else {
          this.ctx.lineTo(x, y);
        }
      }

      this.ctx.stroke();

      // If we only have one point, draw it as a small circle to make it visible
      if (this.dataPoints.length === 1) {
        const point = this.dataPoints[0];
        const maxX = Math.max(...this.dataPoints.map(p => p.x));
        const minX = Math.max(0, maxX - this.maxDataPoints);
        const xScale = width / this.maxDataPoints;
        const x = (point.x - minX) * xScale;
        const y = point.y;
        
        this.ctx.fillStyle = 'rgba(135, 206, 250, 0.9)';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 3, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Draw gradient fill under the line (only if we have 2+ points)
      if (this.dataPoints.length >= 2) {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(135, 206, 250, 0.15)');
        gradient.addColorStop(1, 'rgba(135, 206, 250, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.lineTo((this.dataPoints[this.dataPoints.length - 1].x - minX) * xScale, height);
        this.ctx.lineTo((this.dataPoints[0].x - minX) * xScale, height);
        this.ctx.closePath();
        this.ctx.fill();
      }
    }
  }

  private clear(): void {
    if (!this.canvas || !this.ctx) return;
    const width = this.canvas.width / window.devicePixelRatio;
    const height = this.canvas.height / window.devicePixelRatio;
    this.ctx.clearRect(0, 0, width, height);
  }

  private getCenterY(): number {
    if (!this.canvas) return 150;
    return (this.canvas.height / window.devicePixelRatio) / 2;
  }

  private getAmplitude(): number {
    if (!this.canvas) return 50;
    return (this.canvas.height / window.devicePixelRatio) * 0.3; // 30% of canvas height
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
}

