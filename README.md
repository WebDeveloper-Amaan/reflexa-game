# 🎵 Reflexa — Simon Memory Game

A modern, fast and responsive memory game built with React, TypeScript and Tailwind CSS. Watch the color sequence, then repeat it perfectly. Each level adds one more step — how far can you go?

**Live Demo → [Play Reflexa](https://webdeveloper-amaan.github.io/Reflexa-game_Simon-game-minPRO/)**

---

## 📸 Preview

> 4 color buttons in a 2×2 grid with a glowing center display, particle effects on level up, and smooth animations throughout.

---

## 🎮 How to Play

1. Select a difficulty — Easy, Medium or Hard
2. Press **Start Game**
3. Watch the buttons flash in a sequence
4. Repeat the exact sequence by clicking or pressing keyboard keys
5. Each correct round adds one more color to the sequence
6. One wrong press = Game Over

---

## ⌨️ Keyboard Shortcuts

Play entirely with your keyboard on desktop/laptop:

| Key | Button |
|-----|--------|
| `A` | 🟢 Green (Top-left) |
| `W` | 🔴 Red (Top-right) |
| `S` | 🟡 Yellow (Bottom-left) |
| `D` | 🔵 Blue (Bottom-right) |

> Key labels are shown on the buttons on desktop and hidden on mobile automatically.

---

## ⚙️ Difficulty Levels

| Difficulty | Sequence Speed | Score Multiplier |
|------------|---------------|-----------------|
| Easy | 600ms per color | 1× |
| Medium *(default)* | 400ms per color | 1.5× |
| Hard | 250ms per color | 2× |

**Scoring formula:** `Level × 10 × Difficulty Multiplier`

Example at Level 5:
- Easy → 50 pts
- Medium → 75 pts
- Hard → 100 pts

---

## ✨ Features

- 🎵 **Web Audio API sounds** — unique musical tone per button, level-up melody, fail buzz — no audio files needed
- 💾 **Persistent high score & history** — saved to LocalStorage, survives page refresh
- 📊 **Game history panel** — view your last 20 games with score, level and date
- 🔥 **Streak tracker** — tracks consecutive levels completed
- 🎉 **Particle celebration** — 20 colored particles burst on every level up
- 🏆 **New high score banner** — animated trophy banner when you beat your best
- 📖 **Welcome tutorial** — 6-step onboarding modal on first visit (skippable)
- ⌨️ **Keyboard support** — full A/W/S/D keyboard controls with visual feedback
- 📱 **Fully responsive** — works on mobile, tablet and desktop
- ♿ **Accessible** — ARIA labels, live regions, semantic HTML

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.3 | UI framework |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.3.6 | Build tool |
| Tailwind CSS | 4.1.17 | Styling |
| Web Audio API | Browser built-in | Sound generation |
| LocalStorage API | Browser built-in | Data persistence |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── SimonButton.tsx      # Individual color button with glow & press effects
│   ├── CenterDisplay.tsx    # Center status circle (level, score, game state)
│   ├── GameControls.tsx     # Difficulty selector, start button, progress dots
│   ├── ScoreBoard.tsx       # Score cards and game history panel
│   └── WelcomeModal.tsx     # First-visit tutorial modal
├── hooks/
│   └── useSimonGame.ts      # All game logic and state management
├── utils/
│   ├── sounds.ts            # Web Audio API tone generator
│   ├── storage.ts           # LocalStorage read/write helpers
│   └── cn.ts                # Tailwind class merge utility
├── App.tsx                  # Root component, keyboard listener, particles
├── main.tsx                 # App entry point
└── index.css                # Global styles and custom animations
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install & Run

```bash
# Clone the repo
git clone https://github.com/WebDeveloper-Amaan/Reflexa-game_Simon-game-minPRO.git
cd Reflexa-game_Simon-game-minPRO

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build       # outputs to dist/
npm run preview     # preview the production build locally
```

### Deploy to GitHub Pages

```bash
npm run deploy      # builds and pushes to gh-pages branch automatically
```

---

## 🔊 Audio System

All sounds are generated in real-time using the **Web Audio API** — no audio files are loaded.

| Sound | Trigger | Notes |
|-------|---------|-------|
| Button tone | Button flash / press | Unique frequency per color (E4, C4, A3, E3) |
| Level up | Completing a sequence | 3 ascending triangle-wave notes (A4 → C#5 → E5) |
| Fail | Wrong button pressed | Descending sawtooth buzz (150Hz → 80Hz) |
| High score | New personal best | 4 ascending sine notes (C5 → E5 → G5 → C6) |

> Audio silently fails on browsers that don't support the Web Audio API — the game still works fully.

---

## 💾 Data Storage

Game data is saved to **LocalStorage** under two keys (configurable via `.env`):

| Key | Data |
|-----|------|
| `VITE_STORAGE_KEY` | Array of last 20 game records `{ score, level, date, streak }` |
| `VITE_HIGH_SCORE_KEY` | Single number — all-time high score |

---

## 🎨 Animations

| Animation | Where |
|-----------|-------|
| Glow + scale on press | All 4 color buttons |
| Pulse border | Center circle during sequence display |
| Particle burst (20 particles) | Level up celebration |
| Shimmer sweep | Start/Restart button |
| Bounce | New high score banner |
| Ambient blur orbs | Background |

---

## 📱 Responsive Design

| Screen | Button Size | Center Circle |
|--------|------------|---------------|
| Mobile (`< 640px`) | 130×130px | 70×70px |
| Tablet (`≥ 640px`) | 155×155px | 85×85px |
| Desktop (`≥ 768px`) | 165×165px | 95×95px |

Keyboard key labels on buttons are **hidden on mobile** and only shown on `sm:` and above.

---

## 🔒 Security

- Zero hardcoded secrets — storage keys loaded from environment variables
- All dependencies audited — `0 vulnerabilities` (`npm audit`)
- No external API calls — fully client-side

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Amaan Ahmed**

[![GitHub](https://img.shields.io/badge/GitHub-WebDeveloper--Amaan-181717?style=flat&logo=github)](https://github.com/WebDeveloper-Amaan)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-amaanahmedcoder-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/amaanahmedcoder)
[![Instagram](https://img.shields.io/badge/Instagram-coderamaan-E4405F?style=flat&logo=instagram)](https://www.instagram.com/coderamaan)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
