# Wow Factor V2 — Implementation Plan

## What This Is

A second round of improvements to Predictable Destiny. The first round (improvement-plan.md, wow-factor-plan.md) fixed correctness and added targeted theatrical moments. This round addresses the three remaining gaps:

1. **The game is too long.** 15 questions drains attention. By Q7, players stop reflecting and start pattern-matching the UI.
2. **The interaction never changes.** Every question uses the same 2×2 card grid, same tap mechanic, same confirmation delay. 15 identical interactions creates autopilot.
3. **The result page sorts instead of mirrors.** Chips, sliders, and a dimension name ("Early Movement") look like a personality test output. The emotional payload (reflection lines, hidden cost) is buried below the analytical content.

---

## Guiding Filters

Every decision below passed three tests:

1. **Mirror over Label** — does this make the player feel *seen* or *sorted*?
2. **Target audience** — would a 60-year-old non-native English speaker on their phone in a webinar know what to do without instruction?
3. **Not a personality quiz** — does this move us closer to MBTI or further from it?

---

## New Game Flow

```
[Login Screen]
      ↓  handleLogin()
[Q1]  [Q2]  [Q3 reversal]
      ↓  after Q3 answer
[Reflection 1]         ← dominant dim from Q1–Q3
      ↓  proceedFromReflection()
[Q4]  [Q5]  [Q6 reversal]
      ↓  after Q6 answer
[Reflection 2]         ← dominant dim from Q4–Q6
      ↓  proceedFromReflection()
[Surprise Screen]      ← 4s auto-advance
      ↓  proceedFromSurprise()
[Stage III Intro]
      ↓  proceedFromStageIntro()
[Q7]  [Q8]  [Q9 reversal]  [Q10 final — visually distinct]
      ↓  after Q10 answer → straight to result (no Reflection 3)
[Result Screen]        ← staged 4-phase reveal
```

Key changes from current flow:
- 10 questions instead of 15
- 2 reflections instead of 3 (after Stage I and Stage II only)
- After Q10 → straight to result (no Reflection 3)
- Result page is a 4-phase staged reveal with continue buttons, not a single scroll

---

## Question Mapping (Old → New)

| New # | Index | Old # | Source | Stage | Notes |
|-------|-------|-------|--------|-------|-------|
| Q1 | 0 | Q1 | Keep as-is | I | Company new project |
| Q2 | 1 | Q2 | Keep as-is | I | Chance appears, details missing |
| Q3 | 2 | — | Write new | I | **Reversal**: "which response is most unlike you?" |
| Q4 | 3 | Q6 | Keep as-is | II | Watch someone else succeed |
| Q5 | 4 | Q7 | Keep as-is | II | Remember a path not taken |
| Q6 | 5 | — | Write new | II | **Reversal**: "which perspective would you almost never take?" |
| Q7 | 6 | Q11 | Keep as-is | III | What most often stops you |
| Q8 | 7 | Q12 | Keep as-is | III | What makes you feel safe |
| Q9 | 8 | — | Write new | III | **Reversal**: "which hidden cost is least like your experience?" |
| Q10 | 9 | Q15 | Keep as-is | III | **Final question** — "what question must you ask yourself?" Visually distinct (single column, staggered reveal) |

Questions cut: old Q3, Q4, Q5, Q8, Q9, Q10, Q13, Q14 (8 removed, 3 new reversals written)

---

## The 14 Changes

### 1. Cut to 10 questions (3 + 3 + 4)
See question mapping above. Reflections reduce to 2. Stage III keeps 4 questions because confrontation earns its length.

### 2. Add one reversal question per stage
Final question of each stage asks "which of these is most unlike you?" Same 4 option dimensions (A/B/C/D), framed as rejections. What you refuse reveals your pattern more sharply than what you choose.

### 3. Make Q10 visually distinct
Single column layout. Each option fades in one at a time (~0.8s apart). No grid, no position numbers. Question text at 1.6rem (larger than other questions). This is the question that gets quoted back on the result page — it should feel different.

### 4. Ambient orbs shift based on answer pattern
After each answer, the dominant dimension so far drives subtle orb changes. A (action) = faster float + warmer gold. B (waiting) = slower + cooler. C (calculating) = medium + sharper edges. D (preserving) = orbs drift apart. Subliminal — the player won't consciously notice.

### 5. Stage III removes entry animation
Stage I/II use the existing `screen-enter` (0.8s fade/slide/blur). Stage III questions appear instantly — no animation. The sudden absence of ceremony signals weight.

### 6. Result page Phase 2 shows Q1 vs Q7 answers side by side
After the mirror sentence, show: *"At the start, you said:"* [Q1 text] / *"Just now, you said:"* [Q7 text]. No commentary. Just the player's own two choices as a mirror.

### 7. Delay continue button on reflections by 5 seconds
Button doesn't appear until 5s after text has faded in. No countdown, no indicator. Forces the player to sit with the text instead of tapping through.

### 8. Staged result reveal — 4 phases with continue buttons
- **Phase 1:** Player's name alone. Continue button after 3s.
- **Phase 2:** Mirror sentence + Q1/Q7 comparison + Q10 quote-back. Continue after 3s.
- **Phase 3:** Benefit line + hidden cost box. Continue after 3s.
- **Phase 4:** Bigger picture quote (word-by-word) + closing question. No continue — this is the end. "See more detail" expandable at bottom (chips, sliders).

Each phase has a visible continue button (matching the pattern the player learned from reflection screens). Back button within phases goes to previous phase.

### 9. End with a question, not a statement
Replace "Sit with this." with "What has it cost you?" Open loop, not closed instruction.

### 10. Keep Surprise Screen at 4 seconds with progress bar
Reversing the earlier suggestion to remove the progress bar. The target audience needs visual reassurance that the app is working. The content is confrontational enough on its own.

### 11. Add a single ambient tone on the Surprise Screen
A low, soft resonant hum (~65Hz) that fades in over 2s and out over 1s. No other sounds anywhere in the game. One sound, one moment.

### 12. Scroll-to-top on every screen transition
`window.scrollTo({ top: 0, behavior: "instant" })` when the stage or question index changes.

### 13. Scroll-triggered fade-in on result page
Replace time-based `delay-*` classes with Intersection Observer. Each section reveals when the player scrolls to it, not on a fixed timer.

### 14. Raise stage label opacity to 0.6
From `0.45` to `0.6`. At 0.72rem on cream background, the current value fails WCAG AA for the 40–65 audience.

---

## Implementation Batches

| Batch | Description | Files Changed | Run After |
|-------|-------------|---------------|-----------|
| 1 | Content restructuring | `content.ts` | — (first) |
| 2 | State & flow restructuring | `useGameState.ts`, `App.tsx` | Batch 1 |
| 3 | QuestionScreen changes | `QuestionScreen.tsx`, `index.css` | Batch 2 |
| 4 | ReflectionScreen changes | `ReflectionScreen.tsx` | Batch 2 |
| 5 | Result page overhaul | `ResultScreen.tsx`, `index.css` | Batch 2 (run last for stability) |
| 6 | Ambient orbs | `App.tsx`, `index.css` | Batch 2 |
| 7 | Sound research + implementation | `SurpriseScreen.tsx`, audio file | Batch 2 |

**Parallel groups:**
- Batch 1 first
- Batch 2 after 1
- Batches 3, 4, 6, 7 in parallel after 2
- Batch 5 last (biggest change, needs everything else stable)

---

## Deliberately Excluded

| Item | Reason |
|------|--------|
| "1 in 4 players share your pattern" | Categorizes — that's sorting, not mirroring |
| Radar chart / behavioral fingerprint | Maps to 4 types = a personality badge |
| Raw answer sequence display | Too analytical — data inspection, not reflection |
| Dimension name as standalone reveal | "Early Movement" displayed prominently is a label |
| Tap-to-advance (no visible button) | Target audience won't understand the mechanic |
| Reduce Surprise Screen to no progress bar | Target audience will think app is broken |
| Audio throughout the game | One sound in one moment is more powerful than ambient music |
