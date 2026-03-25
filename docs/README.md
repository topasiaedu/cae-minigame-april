# Predictable Destiny — Project Documentation

## What is this?

**Predictable Destiny** is a premium, mobile-first psychological minigame designed for a live webinar audience. Participants receive a link and play through it independently during a 10–15 minute speaker absence.

The game is **not a personality quiz**. It is a carefully engineered **behavioural mirror** — the goal is to surface a player's habitual decision-making patterns using their own choices as evidence, then leave an open-ended question that only the speaker can answer when they return.

---

## Core Psychological Goal

> **Mirror over Label. Reflection over Explanation. Tension over Fluff. Open Loop over Closure.**

The game must never feel like a quiz or a test. It should feel like a quiet conversation with yourself.

By the end of the 15 questions, the player should feel:
1. *"I recognise this pattern in myself."*
2. *"I never knew this had a name."*
3. *"I wonder what this has cost me."*

The speaker then returns and fills in the final answer — completing the open loop.

---

## Target Audience

Business owners and senior decision-makers, aged 40–65. Many are non-native English speakers. All copy must be written at an **8th-grade reading level** — short sentences, visceral language, zero corporate jargon.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vite + React (TypeScript) |
| Styling | Vanilla CSS (glassmorphism, custom keyframes) |
| Icons | `lucide-react` |
| State | Custom hook (`useGameState`) — no external state library |
| Build | `npm run build` (Vite) |
| Deploy | Any static host (Vercel, Netlify, GitHub Pages) |

---

## Documentation Index

| File | Contents |
|---|---|
| [game-flow.md](./game-flow.md) | Complete user journey, screen transitions, state machine |
| [architecture.md](./architecture.md) | File structure, component tree, data flow |
| [content-system.md](./content-system.md) | How questions, scoring, and results are structured |
| [design-system.md](./design-system.md) | CSS variables, animations, colour palette, glassmorphism |
| [copywriting-guide.md](./copywriting-guide.md) | Psychological copywriting framework and rules |

---

## Quick Start

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Production build
npm run build
```

The app runs at `http://localhost:5173` by default.
