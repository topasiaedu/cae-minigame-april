# Architecture

## File Structure

```
cae-minigame-april/
├── docs/                        ← Project documentation (you are here)
├── public/
├── src/
│   ├── App.tsx                  ← Root orchestrator. Renders the correct screen based on game stage.
│   ├── main.tsx                 ← Vite entry point.
│   ├── index.css                ← ALL global styles, CSS variables, animations.
│   │
│   ├── data/
│   │   └── content.ts           ← Single source of truth for ALL game content.
│   │
│   ├── hooks/
│   │   └── useGameState.ts      ← Central state machine. The brain of the app.
│   │
│   └── components/
│       ├── LoginScreen.tsx      ← Entry screen (name + optional email)
│       ├── QuestionScreen.tsx   ← 2×2 card grid, auto-advance, stage backgrounds
│       ├── ReflectionScreen.tsx ← Interstitial pause screen after Q5, Q10, Q15
│       └── ResultScreen.tsx     ← Personalized result with chips, sliders, reflection
│
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Component Tree

```
App.tsx
├── .ambient-orb-1 (CSS div — decorative floating gold orb)
├── .ambient-orb-2 (CSS div — decorative floating gold orb)
└── <main>
    ├── <LoginScreen>        stage === 'login'
    ├── <QuestionScreen>     stage === 'question'
    ├── <ReflectionScreen>   stage === 'reflection'
    └── <ResultScreen>       stage === 'result'
```

Only **one screen renders at a time**. `App.tsx` uses conditional rendering (`&&`) — not routing. There is no React Router.

---

## Data Flow

```
content.ts (static data)
    ↓
useGameState.ts (runtime logic)
    ↓
App.tsx (selects which component to render)
    ↓
LoginScreen / QuestionScreen / ReflectionScreen / ResultScreen
```

All state lives in `useGameState`. Components are **pure display layers** — they receive props and call callbacks. No component holds meaningful state of its own (except local UI state like `selected` in QuestionScreen).

---

## Key Interfaces

```ts
// content.ts
type Dimension = 'A' | 'B' | 'C' | 'D';

interface Question {
  id: number;
  setup: string;    // The bold sentence (the scenario hook)
  context: string;  // The follow-up sentence (the decision framing)
  options: Option[];
}

interface Option {
  id: Dimension;
  text: string;
}

// useGameState.ts
type GameStage = 'login' | 'question' | 'reflection' | 'result';
```

---

## Adding a New Screen

1. Create `src/components/NewScreen.tsx`
2. Add `'newscreen'` to the `GameStage` union type in `useGameState.ts`
3. Add a transition action in `useGameState.ts` that calls `handleTransition('newscreen')`
4. Add `{gameState.stage === 'newscreen' && <NewScreen ... />}` in `App.tsx`

---

## Dependencies

| Package | Purpose |
|---|---|
| `react` / `react-dom` | UI framework |
| `lucide-react` | Thin-stroke SVG icons (ChevronLeft, Compass, Hourglass, Scale) |
| `vite` | Build tool and dev server |
| `typescript` | Type safety |
