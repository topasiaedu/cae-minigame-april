# Improvement Plan V3 — Audit Response

## What This Is

A third round of improvements based on a comprehensive audit of UI/UX quality, goal achievement, engagement risk, and wow-factor potential. Previous rounds (improvement-plan.md, wow-factor-plan.md, wow-factor-v2-plan.md) fixed correctness, added theatrical moments, cut to 10 questions, and restructured the result page into a phased reveal. This round addresses the remaining gaps between what the game **intends** to do and what it **actually does** in the player's hands.

---

## Why These Changes Matter

The game's psychological architecture is sound. The content quality is high. But the audit surfaced five issues that quietly undermine the experience, ordered by psychological impact:

1. **Reversal questions corrupt the scoring.** Q3, Q6, and Q9 ask "which is least like you?" — the player picks the behaviour they *reject*. But the scoring system records the selected dimension as a positive match. A player who consistently rejects Dimension A may receive an A result. This silently breaks credibility.

2. **The player never sees their own pattern forming.** The game observes the pattern internally (dominant dimension computation) but never surfaces it. The reflection screens show personalized text, but the player doesn't realise they're being shown their own data. The audit's #1 suggestion: make the mirror visible during play, not only at the end.

3. **The 5-second reflection delay has no visual cue.** Players stare at a static screen for 5 seconds with no indication that a button will appear. Some think the app is broken. The delay is psychologically correct, but it needs a signal.

4. **Stage III has no physical feedback.** The shift from hypothetical questions (Stage I–II) to self-confrontation (Stage III) is felt in the copy but not in the body. A single haptic vibration on selection would mark the moment without explanation.

5. **Two intense screens back-to-back with no breathing room.** The Surprise Screen ("You've been making the same choice.") auto-advances into the Stage III Intro ("This section is different.") — two heavy moments with no pause between them. A brief "Take a breath." screen restores agency before the confrontation begins.

Additionally, three smaller fixes close remaining rough edges:

6. **StageIntroScreen says "five questions"** but Stage III has 4 questions. Copy bug from the 15→10 restructure.
7. **"The speaker will return shortly."** is the last thing the player reads. Operational text at the emotional climax breaks the spell.
8. **The expandable chips/sliders section** re-introduces personality-test labelling that the phased reveal was designed to avoid. Chips like "Early Movement" and spectrum sliders are MBTI-style output — they sort rather than mirror.

---

## Guiding Principles

Every change below passed three filters:

1. **Mirror over Label** — does this make the player feel *seen* or *sorted*?
2. **Target audience** — would a 60-year-old non-native English speaker on their phone know what to do without instruction?
3. **Not a personality quiz** — does this move us closer to MBTI or further from it?

---

## The 4 Implementation Batches

### Batch 1 — Surgical Fixes & Result Cleanup

**Files:** `src/components/StageIntroScreen.tsx`, `src/components/ResultScreen.tsx`, `src/index.css`

| Change | Reason |
|---|---|
| StageIntroScreen: "The next five questions" → "The next questions" | Factually wrong — Stage III has 4 questions |
| ResultScreen Phase 4: remove "The speaker will return shortly." | Operational text at the emotional climax breaks the mirror |
| ResultScreen Phase 4: remove the entire expandable detail section (chips, sliders, "See your detailed pattern" button) | Chips and sliders re-label the player — contradicts the phased reveal design that prioritises mirror over label |
| ResultScreen Phase 3: add a single gentle pulse animation to the hidden cost box after it fades in | The hidden cost is the emotional payload of the entire game — it deserves a moment of emphasis |
| index.css: add `@keyframes gentlePulse` | Required for the above |

---

### Batch 2 — Reversal Scoring & Visual Distinction

**Files:** `src/data/content.ts`, `src/hooks/useGameState.ts`, `src/components/QuestionScreen.tsx`

| Change | Reason |
|---|---|
| content.ts: add optional `isReversal` flag to the `Question` interface | Needed to identify reversal questions in scoring logic |
| content.ts: mark Q3 (index 2), Q6 (index 5), Q9 (index 8) with `isReversal: true` | These three questions ask "least like you" — they must be handled differently |
| useGameState.ts: exclude reversal-indexed answers from `computeDominantDimension` | A reversal answer represents what the player is NOT — counting it as what they ARE inverts the signal |
| useGameState.ts: update `finalDominantDimension`/`finalDominantCount` computation to also exclude reversals | Consistency — the final result must use the same scoring logic |
| QuestionScreen: show a brief italic label above the options grid on reversal questions: "Choose the one least like you" | The reversal framing is in the question text, but the visual layout is identical to standard questions — the player may not notice the inversion |

---

### Batch 3 — Reflection UX & Haptic Feedback

**Files:** `src/components/ReflectionScreen.tsx`, `src/components/QuestionScreen.tsx`, `src/App.tsx`, `src/index.css`

| Change | Reason |
|---|---|
| index.css: add `@keyframes goldLineExtend` and `.reflection-timer-line` class | CSS animation for the visual timer on reflection screens |
| ReflectionScreen: replace the static gold divider with an animated line that extends from 0 to 60px over 5 seconds | Signals to the player that waiting is intentional — the button will appear when the line is done |
| ReflectionScreen: add `dominantCount` prop | Required for the pattern observation line |
| ReflectionScreen: show a pattern observation line when `dominantCount >= 2` | Makes the mirror visible: "Two of your last three answers leaned the same way." — the player sees their pattern forming without being told what it is |
| App.tsx: compute `dominantCount` from the reflection answer slice and pass it to ReflectionScreen | Provides the data needed for the observation line |
| QuestionScreen: add `navigator.vibrate?.(30)` on Stage III card selections | A single 30ms vibration pulse marks the stage shift physically — no vibration in Stage I/II makes the absence-to-presence meaningful |

---

### Batch 4 — BreatheScreen & Game Flow

**Files:** `src/components/BreatheScreen.tsx` (new), `src/hooks/useGameState.ts`, `src/App.tsx`

| Change | Reason |
|---|---|
| Create `BreatheScreen.tsx`: full-screen, "Take a breath." centered, Continue button appears after 3 seconds | Restores player agency between two auto-advancing/confrontational screens — the player chooses when to proceed |
| useGameState.ts: add `"breathe"` to `GameStage` union type | Required for type safety |
| useGameState.ts: update `proceedFromSurprise` to route to `"breathe"` instead of `"stageIntro"` | Inserts the new screen into the flow |
| useGameState.ts: add `proceedFromBreathe` handler routing to `"stageIntro"` | Completes the forward path |
| useGameState.ts: update back navigation — `stageIntro → breathe`, `breathe → surprise` | Preserves correct back-traversal through the new flow segment |
| App.tsx: import and render `BreatheScreen` when `stage === "breathe"` | Wires the new component into the app |

---

## Running Order

| Group | Batches | Notes |
|---|---|---|
| Group A | 1 and 2 in parallel | No shared files |
| Group B | 3 after Group A | Touches QuestionScreen (shared with 2) and index.css (shared with 1) |
| Group C | 4 after Batch 3 | Touches App.tsx (shared with 3) and useGameState.ts (shared with 2) |

If running sequentially: **1 → 2 → 3 → 4**.

---

## Deliberately Excluded Items

| Item | Reason |
|---|---|
| Drag-to-rank interaction for Q10 | High implementation risk, uncertain UX for target audience on mobile |
| Particle/ember effects on Surprise Screen | Hard to get right without looking cheap; the text + sound + breathing animation are sufficient |
| Word-by-word typing on all reflection text | Already exists for Reflection 2 header; extending to body text would slow reading and may frustrate fast readers |
| Segmented progress bar (3 visual segments) | Cosmetic benefit unclear — current continuous bar is sufficient |
| Show pattern percentage in real-time | Showing "66% of your answers" is diagnostic, not reflective — violates mirror-over-label |
| Different interaction mechanic (swipe-to-dismiss) on reversal questions | Target audience may not understand the gesture; the italic label is safer |
| Hover effects on desktop option cards | Mobile-first app — hover is an edge case. The `cursor: pointer` property is sufficient for desktop |
| Audio changes beyond existing ambient tone | The single sound on the Surprise Screen is deliberately singular — adding more reduces its weight |
| Reduce to fewer than 10 questions | Author/speaker decision — affects the facilitation arc |
