# Breathing Exercises App 🌬️

A beautiful, interactive web application designed to guide you through various breathing exercises for stress relief, focus, relaxation, and overall well-being.

## The Story Behind This App

In our fast-paced digital world, stress and anxiety have become constant companions for many. Breathing exercises have been scientifically proven to activate the parasympathetic nervous system, reduce cortisol levels, and promote a sense of calm and focus. However, finding a simple, distraction-free tool to guide breathing exercises can be challenging.

This app was born from a desire to create something beautiful and functional—a tool that combines modern web technologies with ancient wisdom. The goal was to build an application that:

- **Guides without overwhelming**: Simple, intuitive interface that doesn't distract from the breathing practice
- **Visualizes the rhythm**: An animated circle that expands and contracts to match your breathing pattern, making it easier to follow along
- **Provides audio feedback**: Subtle sound cues that help maintain rhythm even when you close your eyes
- **Offers flexibility**: Multiple predefined patterns for different needs, plus the ability to create custom patterns
- **Tracks progress**: Real-time visualization chart showing your breathing rhythm over time

The app uses a modular architecture with separate managers for different concerns (animation, audio, state, UI, etc.), making it maintainable and extensible. Every visual effect, animation timing, and audio cue has been carefully tuned to create a meditative, calming experience.

## Features

### 🎯 Predefined Breathing Patterns

Choose from 12 scientifically-backed breathing patterns:

- **Box Breathing** (4-4-4-4) - Great for stress relief and improving focus
- **4-7-8 Breathing** (4-7-8) - Excellent for falling asleep faster and reducing anxiety
- **Equal Breathing** (4-4) - Perfect for beginners and maintaining calm
- **Deep Breathing** (6-2-6-2) - Ideal for increasing lung capacity
- **Triangle Breathing** (4-4-4) - Helps with grounding and emotional balance
- **Coherent Breathing** (5-5) - Promotes heart rate variability
- **Lion's Breath** (3-5) - Releases tension and energizes the body
- **Alternate Nostril** (4-4-4-4) - Balances brain hemispheres
- **Belly Breathing** (4-6) - Strengthens diaphragm
- **Power Breathing** (2-2) - Increases energy and alertness
- **Relaxing Breath** (4-8) - Activates parasympathetic nervous system
- **Ocean Breath** (5-5) - Creates calming sound effect

### ✨ Custom Patterns

Create your own breathing patterns using the format: `inhale-hold-exhale-holdAfterExhale` (e.g., `4-4-4-4` or `4-7-8`). Use `0` to skip any phase.

### 🎨 Visual Features

- **Animated Circle**: Expands and contracts smoothly to match your breathing rhythm
- **Color-Coded Phases**: 
  - 🟢 Green for inhale
  - 🔵 Blue for exhale
  - 🟠 Orange for hold phases
- **Visual Effects**: Glowing effects and ripple animations for phase transitions
- **Real-Time Chart**: Canvas-based visualization showing your breathing pattern over time

### 🔊 Audio Feedback

- Frequency sweeps that rise during inhale and fall during exhale
- Subtle tones during hold phases
- Toggle sound on/off as needed

### ⏯️ Control Features

- **Start**: Begin your breathing exercise
- **Pause**: Pause at any time (remembers your position)
- **Resume**: Continue from where you paused
- **Stop**: Reset and return to the beginning

## Technology Stack

- **TypeScript** - Type-safe JavaScript for better code quality
- **Vite** - Fast build tool and development server
- **Anime.js** - Smooth, performant animations
- **Web Audio API** - Real-time audio synthesis for breathing cues
- **Canvas API** - Real-time chart visualization
- **Vanilla JavaScript** - No framework dependencies, pure and lightweight

## Architecture

The app follows a modular architecture with separate manager classes:

- **BreathingApp** - Main orchestrator class
- **PatternManager** - Handles pattern parsing, validation, and cycle building
- **StateManager** - Manages app state (running, paused, current cycle, etc.)
- **AnimationManager** - Handles circle animations using Anime.js
- **VisualEffectsManager** - Manages glow, ripple, and color effects
- **AudioManager** - Generates and plays breathing audio cues
- **ChartManager** - Renders real-time breathing pattern visualization
- **UIManager** - Handles all UI rendering and updates

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

The app will be available at `http://localhost:5173` (or the port shown in your terminal).

## Usage

1. **Select a Pattern**: Choose from the dropdown menu or create a custom pattern
2. **Start**: Click the "Start" button to begin
3. **Follow the Circle**: Watch the circle expand (inhale) and contract (exhale)
4. **Listen**: Audio cues help maintain rhythm (toggle with the sound button)
5. **Pause/Resume**: Take breaks as needed
6. **Stop**: End your session anytime

## Browser Compatibility

Works best in modern browsers that support:
- ES6+ JavaScript
- Web Audio API
- Canvas API
- CSS Animations

Tested and working in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

We welcome contributions! Please see [CONTRIBUTOR.md](./CONTRIBUTOR.md) for guidelines on how to contribute to this project.

## License

This project is private and not licensed for public use.

## Acknowledgments

Breathing exercises are based on techniques from various traditions including:
- Pranayama (Yoga)
- Mindfulness meditation practices
- Clinical breathing therapy techniques

The app is designed to be a helpful tool, but it's not a substitute for professional medical advice. If you have respiratory conditions or concerns, please consult with a healthcare provider.

---

**Breathe in. Breathe out. Find your calm.** 🧘‍♀️

