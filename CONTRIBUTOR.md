# Contributing to Breathing Exercises App

Thank you for your interest in contributing to the Breathing Exercises App! This document provides guidelines and information for contributors.

## The Vision

This app aims to be a beautiful, accessible, and scientifically-backed tool for breathing exercises. Our goal is to help people find calm, reduce stress, and improve their well-being through guided breathing practices.

## Code of Conduct

- Be respectful and inclusive
- Focus on improving user experience
- Write clear, maintainable code
- Test your changes thoroughly
- Document your contributions

## Development Setup

### Prerequisites

- Node.js v16 or higher
- pnpm (preferred) or npm/yarn
- A modern code editor (VS Code recommended)

### Getting Started

```bash
# Clone the repository (if applicable)
# git clone <repository-url>

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run type checking
pnpm build
```

## Project Structure

```
breathing/
├── src/
│   ├── breathingApp.ts          # Main app orchestrator
│   ├── main.ts                   # Entry point
│   ├── types.ts                  # TypeScript type definitions
│   ├── constants.ts              # App constants and configurations
│   ├── style.css                 # Global styles
│   └── managers/                 # Manager classes
│       ├── AnimationManager.ts   # Handles circle animations
│       ├── AudioManager.ts       # Audio synthesis and playback
│       ├── ChartManager.ts       # Canvas chart rendering
│       ├── PatternManager.ts     # Pattern parsing and validation
│       ├── StateManager.ts       # App state management
│       ├── UIManager.ts          # UI rendering and updates
│       └── VisualEffectsManager.ts # Visual effects (glow, ripple)
├── public/                       # Static assets
├── index.html                    # HTML entry point
├── package.json                  # Dependencies and scripts
└── tsconfig.json                 # TypeScript configuration
```

## Architecture Principles

### Manager Pattern

The app uses a manager pattern where each concern is separated into its own class:

- **Single Responsibility**: Each manager handles one specific concern
- **Loose Coupling**: Managers communicate through the main `BreathingApp` class
- **Testability**: Each manager can be tested independently

### State Management

- `StateManager` is the single source of truth for app state
- State includes: running status, pause status, current cycle, remaining time, scale
- State changes trigger UI updates through the main app class

### Animation System

- Uses Anime.js for smooth, performant animations
- Animations are phase-based (inhale, exhale, hold)
- Supports pause/resume with progress tracking
- Smooth transitions between phases

## Contribution Guidelines

### Adding a New Breathing Pattern

1. Add the pattern to `src/constants.ts` in the `PREDEFINED_PATTERNS` array:

```typescript
{
  name: 'Your Pattern Name',
  pattern: [inhale, hold, exhale, holdAfterExhale],
  description: 'Brief description',
  benefit: 'What this pattern helps with'
}
```

2. Ensure the pattern follows the format: `[number, number, number, number]`
3. Use `0` to skip phases that don't apply
4. Provide a meaningful benefit description

### Modifying Animations

- Animation scales are defined in `PHASE_SCALES` in `constants.ts`
- Easing functions are in `PHASE_EASING`
- Animation logic is in `AnimationManager.ts`
- Test animations with different patterns to ensure smooth transitions

### Adding Features

1. **Plan First**: Consider how your feature fits into the existing architecture
2. **Use Managers**: If your feature is substantial, consider creating a new manager class
3. **Update Types**: Add necessary types to `types.ts`
4. **Update UI**: Modify `UIManager.ts` if UI changes are needed
5. **Test Thoroughly**: Test with different patterns, pause/resume, and edge cases

### Code Style

- Use TypeScript with strict type checking
- Follow existing naming conventions:
  - Classes: `PascalCase` (e.g., `AnimationManager`)
  - Methods: `camelCase` (e.g., `startCycle`)
  - Constants: `UPPER_SNAKE_CASE` (e.g., `PHASE_SCALES`)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and small

### Testing Your Changes

Before submitting:

1. **Test All Patterns**: Try each predefined pattern
2. **Test Custom Patterns**: Create various custom patterns (including edge cases)
3. **Test Controls**: Verify start, pause, resume, and stop work correctly
4. **Test Audio**: Check audio feedback with sound on/off
5. **Test Visuals**: Ensure animations are smooth and colors are correct
6. **Test Chart**: Verify the chart visualization updates correctly
7. **Test Edge Cases**: 
   - Pause during different phases
   - Resume after pause
   - Stop mid-cycle
   - Switch patterns while running

## Common Tasks

### Adding a New Visual Effect

1. Add effect logic to `VisualEffectsManager.ts`
2. Update `PHASE_COLORS` or `PHASE_GRADIENTS` in `constants.ts` if needed
3. Call the effect from `BreathingApp.ts` at appropriate times

### Modifying Audio

1. Update `AUDIO_CONFIG` in `constants.ts` for frequency/volume changes
2. Modify `AudioManager.ts` for synthesis changes
3. Test audio across different browsers (Web Audio API support varies)

### Improving Performance

- Use `requestAnimationFrame` for smooth animations
- Debounce/throttle frequent updates
- Avoid unnecessary DOM queries (cache elements)
- Use CSS transforms instead of position changes when possible

## Reporting Issues

When reporting issues, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: How to trigger the issue
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Browser/Environment**: Browser version, OS, device type
6. **Console Errors**: Any errors in the browser console

## Feature Requests

We welcome feature requests! When suggesting features:

1. **Describe the Use Case**: Why would this feature be useful?
2. **Propose Implementation**: How might this be implemented?
3. **Consider Impact**: How does this affect existing functionality?
4. **Think About UX**: How does this improve the user experience?

## Pull Request Process

1. **Fork and Branch**: Create a feature branch from `main`
2. **Make Changes**: Implement your changes following the guidelines
3. **Test**: Thoroughly test your changes
4. **Document**: Update documentation if needed
5. **Submit**: Create a pull request with a clear description

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Performance improvement
- [ ] Documentation update

## Testing
How you tested the changes

## Screenshots (if applicable)
Visual changes if any
```

## Areas for Contribution

### High Priority

- **Accessibility**: Improve keyboard navigation, screen reader support, ARIA labels
- **Mobile Optimization**: Better touch interactions, responsive design improvements
- **Pattern Library**: Add more scientifically-backed breathing patterns
- **Localization**: Support for multiple languages

### Medium Priority

- **Progress Tracking**: Session history, statistics
- **Customization**: User preferences (colors, themes, default patterns)
- **Export/Share**: Share patterns, export session data
- **Offline Support**: Service worker for offline use

### Nice to Have

- **Breathing Reminders**: Notifications for regular practice
- **Guided Sessions**: Pre-recorded guided sessions
- **Integration**: Calendar integration, health app integration
- **Advanced Visualizations**: More chart types, pattern analysis

## Questions?

If you have questions about contributing:

1. Check existing code for examples
2. Review the architecture principles above
3. Look at similar implementations in the codebase
4. Ask in discussions or issues

## Recognition

Contributors will be recognized in the project documentation. Thank you for helping make this app better for everyone!

---

**Together, we can help more people find their calm through breathing.** 🌬️✨

