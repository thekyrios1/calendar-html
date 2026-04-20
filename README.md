# Calendar

A modern calendar application with a distinctive tech aesthetic and dual theme support. Built for personal event tracking with precision and style.

## Features

### 🎨 Modern Tech Design
- **Electric teal accent** - Distinctive color palette that avoids generic AI aesthetics
- **OKLCH colors** - Perceptually uniform palettes for both light and dark themes
- **JetBrains Mono typography** - Technical monospace font paired with refined system fonts
- **Clean geometric forms** - Subtle border radius, directional shadows, intentional spacing

### 🌓 Dual Theme Support
- **Light mode** - Bright, daytime-friendly interface with warm-tinted neutrals
- **Dark mode** - Sleek evening view with proper contrast and reduced eye strain
- **Dark mode toggle** - Clean switch with localStorage persistence
- **Tinted neutrals** - Cohesive color system that adapts to theme

### 📅 Event Management
- **Type-based categorization**: Holiday, Personal, Work, Special, Fun
- **Color-coded events** - Each type has a distinct visual identity
- **Event limits** - Configurable events per day (1-5)
- **Overflow indicators** - See when days have more events than displayed

### 🎯 User Experience
- **Click-to-add** - Click any day to add or manage events
- **Today highlight** - Current date clearly marked with accent indicator
- **Weekend styling** - Visual distinction for Saturday/Sunday
- **Responsive layout** - Adapts seamlessly from mobile to desktop

### 💾 Data Persistence
- **localStorage** - Events and settings saved automatically
- **Year-based storage** - Separate data per calendar year
- **Theme memory** - Your theme preference is remembered

## Tech Stack

- **HTML5** - Semantic markup with accessibility attributes
- **CSS3** - Modern features: OKLCH colors, CSS variables, container queries
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **Google Fonts** - JetBrains Mono for display typography

## Design Principles

1. **Intentional minimalism** - Every pixel serves a purpose
2. **Theme-aware design** - Both modes feel equally polished
3. **Subtle sophistication** - Refined details over decorative flourishes
4. **Typography-driven hierarchy** - Clear visual weight differentiation
5. **Restraint in color** - Neutral foundations with strategic accents

## Usage

1. Open `calendar.html` in a web browser
2. Click any day to add an event
3. Choose event type and enter a name
4. Use navigation controls to switch months and years
5. Toggle dark mode using the switch in the header

### Navigation
- **Month controls** - Single arrows (⟨ ⟩) move one month
- **Year selector** - Dropdown menu to jump to any year (±10 years from current)
- **Current period** - Display shows active month and year

## Files

```
calendar.html   # Main HTML structure
calendar.js     # Application logic and event management
style.css       # Modern tech aesthetic styles
README.md       # This file
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 15+
- Edge 90+

Requires support for:
- OKLCH color space
- CSS custom properties
- ES6 JavaScript

## License

MIT License - Feel free to use, modify, and distribute.

---

Built with attention to aesthetic detail and technical precision.
