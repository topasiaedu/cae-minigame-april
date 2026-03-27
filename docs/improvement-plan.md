# Improvement Plan — Predictable Destiny

## What We Are Doing

Following a full audit of the codebase, UX, psychological mechanics, and content quality, this document describes all agreed changes and how they are batched for implementation. Changes are divided into two categories:

- **Category A — Foundation Fixes:** Correctness issues that affect trust, quality, and psychological integrity regardless of production value.
- **Category B — Wow Factor:** Targeted moments that transform the experience from a well-designed quiz into a genuinely memorable psychological event.

---

## Why These Changes Matter

The game's core intent — to leave the player with a question only the speaker can answer — is architecturally sound. These improvements are not about changing the idea. They are about closing the gap between what the game *intends* to do to a player and what it actually *does* in the moment.

The most critical failures, in order of psychological impact:

1. **Stage 2 reflection triggers label the player instead of mirroring them** — a direct violation of the app's own copywriting principles ("Mirror over Label").
2. **Silent tie-breaking defaults to Dimension A** with no acknowledgment — some players receive a result that doesn't match their dominant pattern, which quietly breaks credibility.
3. **The "Still here." / "Something has shifted." moment in Stage III** — the single most powerful interaction in the entire game — is currently displayed as small italic muted text and given only 850ms before auto-advancing. It is massively underplayed.
4. **Result sliders show identical preset values** to every player in a given dimension, regardless of whether their dominance was strong (12/15) or marginal (6/15). The personal recognition breaks.
5. **Accessibility gaps** (missing form labels, no focus-visible states, low-contrast stage counter) most severely affect the 40–65 target audience.

---

## The 6 Implementation Batches

### Batch 1 — Copy & Language Fixes

**Files to edit:** `src/data/content.ts`, `src/components/LoginScreen.tsx`

| Change | Reason |
|---|---|
| Stage 2 reflection triggers rewritten to mirror behavior, not label it | Violates "Mirror over Label" principle |
| Result chip for Dimension B: remove "Risk averse" (label) → replace with behavioral description | Personality adjective, not a behavior |
| Result chip for Dimension C: remove "Analytical" (label) → replace with behavioral description | Same issue |
| Q4 context ending changed to match the standard pattern (`"You usually:"`) | Inconsistent with all other questions |
| Q10 setup sentence rewritten as a proper scene (not a subordinate clause) | Content system rule: setup must "set the scene" |
| Login closing line `"Let's look in the mirror."` rewritten | Too casual; breaks tone register |
| Email field given a one-line disclosure subtext | 40–65 audience is privacy-conscious; silent collection creates friction |
| `CAE GOH` wordmark removed from LoginScreen | Premature brand insertion before player has context; keep only on ResultScreen |

**Dependencies:** None. Safe to run first or in parallel.

---

### Batch 2 — Scoring Logic & Slider Personalization

**Files to edit:** `src/hooks/useGameState.ts`, `src/components/ResultScreen.tsx`, `src/App.tsx`

| Change | Reason |
|---|---|
| Tie-breaking: when two dimensions are tied, use the dimension with the longest recent streak (last 3 answers) as tiebreaker | Silent default to A is wrong and damages credibility |
| If still tied after streak check, expose a `isTied: boolean` flag to ResultScreen | Player with genuinely split pattern deserves an acknowledgment |
| ResultScreen: if `isTied`, show a subtitle line below the result name: *"Your pattern was closely divided."* | Honest, not alarming |
| Track `dominantCount` (how many of 15 answers matched the final dimension) and pass to ResultScreen | Required for slider personalization |
| Slider value modulation based on dominance strength: ≥10/15 → keep base value; 7–9/15 → pull 20% toward center (toward 50); 5–6/15 → pull 35% toward center | Makes sliders feel earned and personal, not a lookup table |

**Dependencies:** None. Safe to run in parallel with Batch 1, 3, 4.

---

### Batch 3 — Accessibility & UX Polish

**Files to edit:** `src/components/LoginScreen.tsx`, `src/index.css`, `src/components/QuestionScreen.tsx`, `src/components/ResultScreen.tsx`

| Change | Reason |
|---|---|
| LoginScreen: replace placeholder-only inputs with proper `<label>` elements visually hidden off-screen + keep placeholder | Accessibility: placeholder is not a label |
| LoginScreen: add `aria-label` to input fields | Screen reader support |
| `index.css`: add `:focus-visible` styles to `.btn-primary` and option card buttons | Keyboard navigation has no visible indicator |
| QuestionScreen: raise stage counter secondary span opacity from `0.35` to `0.55` | Fails WCAG AA contrast; target audience is 40–65 |
| QuestionScreen: progress bar minimum value set to `8%` on Q1 | Bar starts at ~6.7%, reads as "this is going to take forever" |
| ResultScreen: clamp slider dot `left` CSS value between `2%` and `98%` | Values at 0 or 100 clip outside the track boundary |

**Dependencies:** None. Safe to run in parallel with Batches 1, 2, 4.

---

### Batch 4 — Stage III Echo Moment

**Files to edit:** `src/components/QuestionScreen.tsx`, `src/index.css`

This batch upgrades the single most psychologically powerful interaction in the game: when a Stage III answer matches the player's corresponding Stage I answer ("Still here.") or differs from it ("Something has shifted."). Currently it is rendered as small italic muted text and auto-advances in 850ms. It needs room to breathe.

| Change | Reason |
|---|---|
| Auto-advance delay for **Stage III selections** extended from 850ms to **1600ms** | The echo needs time to land |
| Echo text container for Stage III made larger: `1.5rem`, full dark color (not muted), centered prominently | Currently `1.1rem` italic muted — barely readable |
| "Still here." gains a second line: *"You chose the same pattern five questions ago."* | Makes the comparison explicit without lecturing |
| "Something has shifted." gains a second line: *"You answered differently this time."* | Acknowledges the change without judging it |
| A thin gold horizontal line animates out (width 0 → 60px) beneath the echo text block in Stage III | Visual "weight" to signal this moment matters |
| Stage III card selection: remove `scale(1.02)` transform on the selected card | Stage III should feel heavier, not celebratory |
| Stage I & II cards keep the existing 850ms delay and `scale(1.02)` | Only Stage III changes behavior |

**Dependencies:** None. Safe to run in parallel with Batches 1, 2, 3.

---

### Batch 5 — Surprise Screen & Game Flow Changes

**Files to edit:** `src/hooks/useGameState.ts`, `src/App.tsx`, new file: `src/components/SurpriseScreen.tsx`

This batch adds one unexpected moment to the game flow — a full-screen pause that auto-advances without player input, inserted between Reflection 2 and the Stage III intro. Its purpose is to break the player's expectation of control before Stage III, which always asks "what you already know."

| Change | Reason |
|---|---|
| Create `src/components/SurpriseScreen.tsx`: full-screen, no back button, no manual advance | Forces the player to sit — the only screen they cannot skip |
| SurpriseScreen auto-advances after **4000ms** via `useEffect` + `setTimeout` | Long enough to land, short enough not to feel like a bug |
| SurpriseScreen content: *"You've been making the same choice."* (large, centered) + *"Have you noticed?"* (smaller, italic, below) | Confrontational without labeling; opens the Stage III question |
| SurpriseScreen uses `screen-enter` / `screen-exit` CSS transitions; no ambient header; no progress bar | Intentionally minimal — the blankness is the point |
| Add `"surprise"` to `GameStage` union type in `useGameState.ts` | Required for type safety |
| `proceedFromReflection()`: when `triggerBlock === 2`, route to `"surprise"` instead of `"stageIntro"` | Surprise fires after Reflection 2, before Stage III intro |
| Add `proceedFromSurprise()` handler: routes to `"stageIntro"` | Completes the new flow segment |
| Back navigation from SurpriseScreen: **no back button**. The screen simply doesn't have one | You cannot un-see a confrontation |
| Update `App.tsx` to render `<SurpriseScreen>` when `stage === "surprise"` | Wires the new component into the app |

**Dependencies:** Must run **before** Batch 6. Both batches touch `useGameState.ts` and `App.tsx`. Run them in the same session or confirm Batch 5's changes are in place before running Batch 6.

---

### Batch 6 — Result Page Personal Quote-Back

**Files to edit:** `src/hooks/useGameState.ts`, `src/App.tsx`, `src/components/ResultScreen.tsx`

The result page currently shows three generic sentences that every player in a given dimension receives. This batch adds one line of genuinely personal content: the player's own Q15 answer, quoted back to them. Q15 asks "what question must you ask yourself right now?" — the player chose one. That choice is already in the data. Using it transforms Section 03 from a template into a mirror.

| Change | Reason |
|---|---|
| `useGameState.ts`: compute `q15AnswerText` by looking up `answers[14]` against `questions[14].options` | Q15 answer is already stored; just needs to be surfaced as readable text |
| Expose `q15AnswerText: string` from `useGameState` | Makes the data accessible to the component tree |
| `App.tsx`: pass `q15AnswerText` as a prop to `ResultScreen` | Wires the data down |
| `ResultScreen.tsx`: add `q15AnswerText` prop (type: `string`) | Type-safe prop |
| In Section 03, between the second muted observation line and the gold hidden-cost box, insert a quote-back block | Sequence: observation → benefit → **[quote-back]** → hidden cost |
| Quote-back block copy: *"When asked what question you most needed to ask yourself — you chose:"* + the player's exact Q15 answer text in a distinct style (slightly larger, left-aligned, gold-left-border treatment) | The distinction between template and personal |
| If `q15AnswerText` is an empty string (edge case: player somehow completed without Q15 answer), the quote-back block is not rendered | Defensive guard for impossible-but-possible edge case |

**Dependencies:** Run after Batch 5 (shares files). Read Batch 5's final versions of `useGameState.ts` and `App.tsx` before starting.

---

## Deliberately Excluded Items

These issues were identified in the audit but are **not** included in the agent batches for the stated reasons:

| Item | Reason Excluded |
|---|---|
| Dimension C vs D behavioral distinction in question options | Too subjective for autonomous implementation — requires deep content judgment about behavioral psychology |
| Reduce from 15 to 10 questions | Structural decision that changes the speaker's facilitation arc; author must decide first |
| Background image sourcing | Creative/design asset decision; not a code task |
| Favicon and Open Graph meta tags | 10-minute manual task; not worth a dedicated agent batch |
| Result page converted from scroll to paginated sections | Large UX architecture change with uncertain payoff; scope risk too high |
| `StageIntroScreen` back navigation verification | Verification task, not a code change |
| Audio/haptic atmosphere | Platform constraints vary; out of scope for this round |

---

## Parallel Execution Map

Batches with no shared files can run simultaneously:

| Group | Batches | Can run in parallel? |
|---|---|---|
| Group A | 1, 2, 3, 4 | Yes — no shared files |
| Group B | 5, then 6 | Sequential — both touch `useGameState.ts` and `App.tsx` |

Group A must be complete before Group B begins, because Batch 5 touches `useGameState.ts` which Batches 1–4 do not touch — but it's cleaner to confirm all copy and scoring changes are stable before altering the game flow.
