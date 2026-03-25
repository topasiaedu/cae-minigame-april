# Game Flow & State Machine

## Overview

The game has exactly **4 stages** managed by the `useGameState` hook:

```
login → question (×15) → reflection (×3) → result
```

Each screen transition uses a **600ms micro-delay** (`isTransitioning` flag) to unmount the outgoing screen before mounting the incoming one. This prevents state from lingering visually between screens.

---

## Stage Map

```
[Login Screen]
      ↓  handleLogin()
[Q1]  [Q2]  [Q3]  [Q4]  [Q5]
      ↓  after Q5 answer
[Reflection Trigger 1]   ← personalized to dominant A/B/C/D in Q1–Q5
      ↓  proceedFromReflection()
[Q6]  [Q7]  [Q8]  [Q9]  [Q10]
      ↓  after Q10 answer
[Reflection Trigger 2]   ← personalized to dominant A/B/C/D in Q6–Q10
      ↓  proceedFromReflection()
[Q11] [Q12] [Q13] [Q14] [Q15]
      ↓  after Q15 answer  
[Reflection Trigger 3]   ← personalized to dominant A/B/C/D in Q11–Q15
      ↓  proceedFromReflection()
[Result Screen]          ← personalized to overall dominant A/B/C/D across all 15 Qs
```

---

## Question Auto-Advance

When a player taps an option card, a **900ms visual confirmation delay** triggers before `onAnswer()` is called. During this window:
- The selected card glows gold
- Unselected cards fade to 30% opacity

There is **no "Next" button**. The tap itself is the action.

---

## Back Navigation

Back navigation is fully supported across all stages:

| Current Stage | Back Goes To |
|---|---|
| `question` (Q1) | `login` |
| `question` (Q2–Q4, Q6–Q9, Q11–Q14) | Previous question (answer removed from array) |
| `question` (Q5 or Q10) | Reflection screen |
| `reflection` | Previous question (answer removed) |
| `result` | Reflection screen |

---

## Reflection Trigger Personalization

Each reflection trigger block is **dynamically selected** based on the dominant behavioral dimension `(A, B, C, or D)` from the preceding 5 questions.

```ts
// In App.tsx, this computes which reflection text to show:
computeDominantDimension(questionIndex - 5, questionIndex)
```

There are **3 trigger blocks × 4 dimensions = 12 unique reflection texts**.

---

## Result Personalization

The final result is computed from all 15 answers:

```ts
computeDominantDimension(0, 15) // scans all answers
```

The dominant dimension (whichever of A/B/C/D has the highest count among the 15 answers) maps to a complete result profile in `resultInterpretations`.

---

## Transition Timing Reference

| Event | Delay |
|---|---|
| Screen change (fade out → in) | 600ms |
| Option tap → auto-advance | 900ms |
| Slider animation on Result page | 1800ms (staggered per slider) |

---

## State Variables (useGameState)

| Variable | Type | Purpose |
|---|---|---|
| `stage` | `GameStage` | Current active screen |
| `user` | `{name, email}` | Player identity from login |
| `questionIndex` | `number` | 0–14 for questions, 5/10/15 for reflections |
| `answers` | `Dimension[]` | Array of all answers in order |
| `isTransitioning` | `boolean` | True during 600ms cross-fade window |
| `currentTriggerBlock` | `1 \| 2 \| 3 \| 0` | Which reflection block is active |
| `finalDominantDimension` | `Dimension` | Overall result dimension |
| `progressPercent` | `number` | 0–100 for the progress bar |
