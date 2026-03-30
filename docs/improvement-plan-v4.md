# Improvement Plan v4 — Boss Playtest Feedback

**Date:** March 2026  
**Source:** Boss playtest session  
**Status:** Planned — see `improvement-v4-prompts.md` for implementation agent prompts

---

## Background

After a boss playtest session, six pieces of feedback were collected. This document explains the root cause of each issue, the agreed fix, and how the fix connects back to the original design intent in `minigame context brief.txt`.

---

## Feedback 1 — Some subtext is hard to read

### What happened
Several secondary text elements are hard to read on the glassmorphic background:
- The reversal hint "Choose the one least like you" uses `color: var(--color-gold-dark)` (`#cc9938`) at `0.85rem` — a low-contrast gold on frosted white. It also has `opacity: 0` as an inline style alongside the `animate-fade-up` class, which in some browsers suppresses the animation's `forwards` fill state, meaning this instruction may sometimes never appear at all.
- The stage label (`STAGE I · THE UNKNOWN`) renders at `0.72rem` with `opacity: 0.6`.
- The `--color-text-light` variable (`#5f5548`) used for most secondary copy is too dim at small sizes on a light glass background.

### Fix
- Change reversal hint color from `var(--color-gold-dark)` to `var(--color-text)`. It is an instruction, not decoration — it must be legible.
- Remove the redundant `opacity: 0` inline style from the reversal hint element (the CSS animation handles the initial hidden state).
- Increase the stage label opacity from `0.6` to `0.8` and font size from `0.72rem` to `0.8rem`.
- Darken `--color-text-light` from `#5f5548` to `#4a3f34` globally in `:root`.

### Why this matters
The brief says: "Tension over fluff — avoid vague, sounds deep but means nothing language." Instructions that are invisible produce confusion, not tension.

---

## Feedback 2 — Player didn't know the game had ended

### What happened
Phase 4 of `ResultScreen.tsx` has no Continue button by design (it is the intended final resting state). But there is no visual or textual signal that the experience is complete. The player sits on the last screen wondering if something is broken.

### Fix
Add a small, low-opacity completion cue at the very bottom of Phase 4 — below the CAE GOH watermark — that reads:

> *"The speaker will continue from here."*

Style: `fontSize: "0.8rem"`, `opacity: 0.35`, `letterSpacing: "1.5px"`, with an `animate-fade-up` class carrying a `2.5s` delay so it appears after the main content has settled.

This closes the loop for the player without adding a button and without breaking the "open loop for the speaker" principle from the brief.

---

## Feedback 3 — Wants chips, sliders, and dimension name back

### What happened
`content.ts` defines for each dimension: a primary `chip` label ("Early Movement", "Seeking Clarity", etc.), four `secondaryChips`, and five `sliders` with spectrum values. None of these are rendered in the current `ResultScreen.tsx`. The dimension name is never shown — Phase 1 only says "A familiar way you tend to respond."

The boss confirmed it is okay to use the dimension name directly.

### Fix
Update `ResultScreen.tsx` to show:

**Phase 1 (after player name):**
- A small label like `"Your recurring tendency:"` at `0.8rem` above the chip.
- The primary chip (`resultData.chip`) as a styled pill/badge with a gold border and subtle background.
- The four `secondaryChips` as smaller pill tags below the primary chip, appearing with staggered delays.

**Phase 3 (after the benefit line, before the hidden cost box):**
- The five sliders, each showing: `title`, left label (`label1`), right label (`label2`), and a filled bar that animates to the `value` position on mount.
- Slider design: a thin track with a filled portion that animates left-to-right over ~0.8s. The filled color should be `var(--color-gold-mid)`. The `value` is 0–100 (50 = center).

### Why this matters
The brief says the result page should "interpret the pattern just enough." Chips and sliders give a concrete portrait of the pattern without being verbose — they surface the shape of the tendency visually, not through more explanation.

---

## Feedback 4 — Didn't feel like she did any reflection

### What happened
The two `ReflectionScreen` instances are fully passive: the player reads a paragraph, waits 3.5 seconds, taps "I see it." / "Keep going." There is no active engagement or personal confrontation with what they answered.

### Fix — Two-part enhancement

**Part A: Quote-back of stage answers**

On each reflection screen, show the player's own three answers from the just-completed stage as quoted cards before the trigger text, so the pattern is visible in their own words before it is named. Example on Reflection 1:

> *You just answered:*  
> "Join first and figure it out later"  
> "Grab it first, just to secure the spot"  
> "Jump straight in before thinking it through"  
>
> *[trigger text below]*

This means `ReflectionScreen` needs to receive the raw `answers` array from `App.tsx`, compute the 3 relevant verbatim texts, and render them as quote-style cards with staggered reveal.

**Part B: Growing pattern visualization ("the pattern shape")**

Add a `PatternViz` SVG component that renders a 4-axis diamond shape where each axis represents one dimension (A = top, B = right, C = bottom, D = left). Each axis extends from the center outward proportional to the count of that dimension in the scored answers so far. The shape is filled with a semi-transparent gold gradient.

- On **Reflection 1**: shows the shape from 3 Stage I answers (1–3 scored, since Q3 is reversal).
- On **Reflection 2**: shows the cumulative shape from all 6 answers so far (Q1–Q6, excluding reversals Q3 and Q6).
- On **Result screen Phase 1**: shows the complete shape from all 10 answers (excluding reversals Q3, Q6, Q9).

The visualization makes the reflection moment active: the player literally sees the shape of their decision habit forming. It directly supports the brief's goal: *"The game should feel like a mirror, not a quiz."*

`PatternViz` should be a standalone SVG component in `src/components/PatternViz.tsx`.

---

## Feedback 5 — Stage I and II have no context brief like Stage III

### What happened
`StageIntroScreen.tsx` exists only for Stage III ("This section is different. The next questions are not about what might happen…"). Stages I and II begin cold — immediately after login / reflection with no framing of what is about to happen or what kind of questions they are.

### Fix

Add stage intro screens for Stage I and Stage II by parameterizing the existing `StageIntroScreen.tsx` with a `stageNumber: 1 | 2 | 3` prop, and updating the game flow.

**New game flow:**
```
login → stageIntro1 → Q1–Q3 → reflection1 → stageIntro2 → Q4–Q6 → reflection2 → surprise → breathe → stageIntro3 → Q7–Q10 → result
```

**Stage I intro copy:**
- Label: `STAGE I · THE UNKNOWN`
- Headline: `"You are about to face a series of decisions."`
- Body: `"There are no right answers."`
- Subline: `"Answer as you honestly would — not as you think you should."`
- CTA: `"Begin"`

**Stage II intro copy:**
- Label: `STAGE II · THE AFTERMATH`
- Headline: `"The questions shift now."`
- Body: `"Not what you might do."`
- Subline: `"What you already did — and how you remember it."`
- CTA: `"Continue"`

**Stage III intro copy (unchanged):**
- `"This section is different."` / `"They are about what has already been happening — for a long time."` / `"I'm ready"`

**Changes required in `useGameState.ts`:**
- Add `"stageIntro1"` and `"stageIntro2"` to the `GameStage` union type.
- `handleLogin` navigates to `"stageIntro1"` instead of `"question"`.
- `proceedFromReflection` (block 1) navigates to `"stageIntro2"` instead of `"question"`.
- Add `proceedFromStageIntro1` and `proceedFromStageIntro2` handlers.
- Update `goBack` to handle the two new stage types.

**Back navigation updates:**
- `stageIntro1` back → `login`
- `question[0]` back → `stageIntro1` (currently goes to `login`)
- `stageIntro2` back → `reflection` (block 1)
- `question[3]` back → `stageIntro2` (currently goes to `reflection`)
- `stageIntro3` back → `breathe` (unchanged)
- `question[6]` back → `stageIntro3` (unchanged)

---

## Feedback 6 — Questions too similar (Q1/Q2 and Q4/Q5)

### What happened
Q1 and Q2 present the same core scenario: *new opportunity + incomplete information + decide now*. Their four option texts differ only in phrasing, not in meaning.

Q4 and Q5 both present: *someone else took the path you passed on, and they succeeded*.

This feels redundant and reduces the sense that the game is learning anything new about the player.

### Fix — Rewrite Q2 and Q5

**Q2 new scenario** — shift from workplace to a personal/interpersonal context so the domain is clearly different from Q1, while still testing the same four dimensions:

> **Setup:** Someone important to you proposes a significant change — a move, a new direction, something with real stakes. The details are still unclear. You need to respond soon.
>
> **Context:** You usually:
> - A: "Agree to it — being in motion together feels right"
> - B: "Ask for more time to think before committing"
> - C: "Map out what this would actually cost before deciding"
> - D: "Stay non-committal until the picture gets clearer"

**Q5 new scenario** — shift from *someone else succeeded* to *you failed at something you did try*, so Q4 and Q5 now create contrast (other person succeeded vs you yourself stumbled):

> **Setup:** You made a choice. You went for it. It didn't work out.
>
> **Context:** Looking back on that moment, you usually:
> - A: "Accept it — I'd rather fail moving than fail by standing still"
> - B: "Think I rushed — I should have held back and waited for clearer signs"
> - C: "Want to understand exactly where the calculation broke down"
> - D: "Feel like I had committed too fully — I should have kept more room to pivot"

This preserves the scoring logic (same A/B/C/D mapping) while making Stage II feel like a genuinely different emotional terrain.

---

## Implementation Order

Run the four agent prompts in this order. Each builds on the files modified by the previous:

| Agent | Scope | Files touched |
|---|---|---|
| **1** | Readability fixes + question rewrites + ending signal | `src/index.css`, `src/components/QuestionScreen.tsx`, `src/data/content.ts`, `src/components/ResultScreen.tsx` |
| **2** | Stage I & II intro screens + flow changes | `src/components/StageIntroScreen.tsx`, `src/hooks/useGameState.ts`, `src/App.tsx` |
| **3** | Result screen chips + sliders + dimension name | `src/components/ResultScreen.tsx`, `src/index.css` |
| **4** | Reflection quote-back + growing pattern visualization | `src/components/ReflectionScreen.tsx`, new `src/components/PatternViz.tsx`, `src/App.tsx`, `src/index.css` |

> **Important:** Before running Agent 3, use the `ResultScreen.tsx` as modified by Agent 1. Before running Agent 4, use the `App.tsx` and `useGameState.ts` as modified by Agent 2.
