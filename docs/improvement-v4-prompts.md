# Implementation Agent Prompts — v4 Improvements

**Reference doc:** `docs/improvement-plan-v4.md`  
**Run agents in order: Agent 1 → Agent 2 → Agent 3 → Agent 4**  
Each agent builds on files modified by the previous one. Always pass the latest version of each file.

---

## Coding Standards (include at the top of every agent prompt)

These rules are mandatory for all code produced:

1. **Completeness** — Generate full code with no placeholders or `// TODO` stubs. If something cannot be done, explain in a comment.
2. **Comments** — Include clear inline comments and JSDoc headers describing the purpose of each function and non-obvious logic. Do not write comments that just narrate what the code does line-by-line.
3. **Error checking** — Implement type validation where appropriate.
4. **TypeScript** — Strict TypeScript throughout. No `any` type. No non-null assertion operator (`!`). No casting via `as unknown as T`. Define new interfaces/types as needed.
5. **Strings** — Use double quotes (`"`) for all strings. Use template literals or `.join()` instead of `+` concatenation.

**Tech stack:** React 18 + TypeScript + Vite. No external UI component libraries. Styling is done with plain CSS (global `src/index.css`) and inline `style` props. No CSS modules, no Tailwind.

**Design system in `src/index.css`:**
- Font: `'Cormorant Garamond'` (loaded from Google Fonts) — all text uses this
- CSS variables: `--color-text` (`#2c251d`), `--color-text-light` (`#5f5548`), `--color-gold-light` (`#fbe5b8`), `--color-gold-mid` (`#f3ce85`), `--color-gold-dark` (`#cc9938`), `--glass-bg`, `--glass-border`
- Animation classes: `animate-fade-up`, `delay-200` through `delay-1200`, `screen-enter`, `screen-exit`
- All screens use the `.glass-container` class as the root wrapper
- Primary button uses `.btn-primary` class

---

## Agent 1 — Readability Fixes + Question Rewrites + Ending Signal

### Files to read first
Read all four of these files in full before making any changes:
- `src/index.css`
- `src/components/QuestionScreen.tsx`
- `src/data/content.ts`
- `src/components/ResultScreen.tsx`

### Task

#### 1A — Fix `src/index.css`
In the `:root` block, darken `--color-text-light` from `#5f5548` to `#4a3f34`. This improves contrast for all secondary text across the app without changing any component files.

#### 1B — Fix `src/components/QuestionScreen.tsx`
There is a reversal hint paragraph (the text "Choose the one least like you" that appears on Q3, Q6, Q9). It currently has two problems:
1. Its `color` is set to `var(--color-gold-dark)` — change this to `var(--color-text)` so it reads as an instruction, not decoration.
2. It has `opacity: 0` as an **inline style** alongside the `animate-fade-up delay-400` class. Remove that inline `opacity: 0` — the animation class handles the initial hidden state, and the inline style can prevent the animation's `forwards` fill from showing the element.

Also in `QuestionScreen.tsx`, find the stage label element at the top of each question (the one rendering text like `"STAGE I · THE UNKNOWN"`). It currently has `opacity: 0.6` and `fontSize: "0.72rem"`. Change opacity to `0.8` and font size to `"0.8rem"`.

#### 1C — Rewrite two questions in `src/data/content.ts`

**Rewrite Q2 (id: 2)** — Change the scenario from "a chance at work with missing details" to a personal/interpersonal decision. The goal is to make Q2 feel clearly different in life domain from Q1 (which is a workplace scenario), while keeping the same four dimension options (A = act/move, B = wait, C = calculate/map risk, D = keep exits open). Use this exact content:

```
setup: "Someone important to you proposes a significant change — a move, a new direction, something with real stakes."
context: "The details are still unclear. You need to respond soon. You usually:"
options:
  A: "Agree to it — being in motion together feels right"
  B: "Ask for more time before committing to anything"
  C: "Map out what this would actually cost before deciding"
  D: "Stay non-committal until the picture gets clearer"
```

**Rewrite Q5 (id: 5)** — Change the scenario from "someone else succeeded with the path you didn't take" (which is the same as Q4) to "you tried something and it didn't work out." This creates contrast between Q4 (other person succeeded with your discarded path) and Q5 (you yourself failed at something you tried). Keep the same four dimension options. Use this exact content:

```
setup: "You made a choice. You went for it. It didn't work out."
context: "Looking back on that moment, you:"
options:
  A: "Accept it — I'd rather fail moving than fail by standing still"
  B: "Think I rushed — I should have waited for clearer signs"
  C: "Want to understand exactly where the calculation broke down"
  D: "Feel like I committed too fully — I should have kept more room to pivot"
```

#### 1D — Add ending signal to `src/components/ResultScreen.tsx`

In Phase 4 (the `phase === 4` block), after the CAE GOH watermark `div`, add a new paragraph element that signals the experience is complete:

- Text: `"The speaker will continue from here."`
- Style: `fontSize: "0.78rem"`, `opacity: 0`, `letterSpacing: "1.5px"`, `textAlign: "center"`, `color: "var(--color-text-light)"`, `marginTop: "1rem"`
- Add `animate-fade-up` class with a `delay-1200` delay so it appears well after the main phase-4 content has settled.
- Do **not** add a button. This is purely a soft textual close.

### What NOT to touch
Do not modify any other questions, any component other than `QuestionScreen.tsx` and `ResultScreen.tsx`, and do not change any game flow logic.

---

## Agent 2 — Stage I & II Intro Screens + Flow Changes

### Files to read first
Read all three of these files in full before making any changes:
- `src/components/StageIntroScreen.tsx`
- `src/hooks/useGameState.ts`
- `src/App.tsx`

### Context
Currently there is one `StageIntroScreen` that only appears before Stage III ("This section is different…"). The boss requested similar framing screens before Stage I and Stage II so players know what kind of questions they are entering.

The new game flow is:
```
login → stageIntro1 → Q1–Q3 → reflection1 → stageIntro2 → Q4–Q6 → reflection2 → surprise → breathe → stageIntro3 → Q7–Q10 → result
```

### Task

#### 2A — Parameterize `src/components/StageIntroScreen.tsx`

Add a `stageNumber: 1 | 2 | 3` prop to the component interface. Based on `stageNumber`, render different copy. Keep all existing structure and animation classes — only the copy changes. The visual structure (roman numeral watermark, back button, staggered reveal, CTA button) stays the same for all three stages.

**Stage 1 copy:**
- Stage label text: `"STAGE I · THE UNKNOWN"`
- Watermark: `"I"`
- Headline: `"You are about to face a series of decisions."`
- Body line 1: `"There are no right answers."`
- Body line 2 (italic, `color-text-light`): `"Answer as you honestly would — not as you think you should."`
- CTA button: `"Begin"`

**Stage 2 copy:**
- Stage label text: `"STAGE II · THE AFTERMATH"`
- Watermark: `"II"`
- Headline: `"The questions shift now."`
- Body line 1: `"Not what you might do."`
- Body line 2 (italic, `color-text-light`): `"What you already did — and how you remember it."`
- CTA button: `"Continue"`

**Stage 3 copy (existing — keep as-is):**
- Stage label text: `"STAGE III · THE MIRROR"`
- Watermark: `"III"`
- Headline: `"This section is different."`
- Body line 1: `"The next questions are not about what might happen."`
- Body line 2 (italic): `"They are about what has already been happening — for a long time."`
- CTA button: `"I'm ready"`

Also update the `onProceed` prop name to stay generic (it already is), and add `stageNumber` to the `StageIntroScreenProps` interface with strict typing as `1 | 2 | 3`.

#### 2B — Update `src/hooks/useGameState.ts`

**Add two new stage types to `GameStage`:**
```
export type GameStage = "login" | "question" | "reflection" | "surprise" | "breathe" | "stageIntro1" | "stageIntro2" | "stageIntro3" | "result";
```

Remove the old `"stageIntro"` string from the union — it is now split into `"stageIntro1"`, `"stageIntro2"`, `"stageIntro3"`.

**Update `handleLogin`:** Navigate to `"stageIntro1"` instead of `"question"` (keep `newIndex: 0`).

**Update `proceedFromReflection`:** 
- When `questionIndex === 3` (after block 1): navigate to `"stageIntro2"` instead of `"question"`.
- When `questionIndex === 6` (after block 2): navigate to `"surprise"` (unchanged).

**Rename `proceedFromStageIntro`** to `proceedFromStageIntro3` — its logic is unchanged (navigates to `"question"` at current `questionIndex`).

**Add two new action handlers:**
- `proceedFromStageIntro1`: navigates to `"question"` at `questionIndex 0`.
- `proceedFromStageIntro2`: navigates to `"question"` at `questionIndex 3`.

**Update `goBack`** to handle the new stages:
- `"stageIntro1"` back → `"login"` (no index change)
- `"stageIntro2"` back → `"reflection"` (no index change; `questionIndex` is still 3 here)
- `"stageIntro3"` back → `"breathe"` (unchanged, just renamed from `"stageIntro"`)
- `"question"` at index 0 back → `"stageIntro1"` (currently goes to `"login"`)
- `"question"` at index 3 back → `"stageIntro2"` (currently goes to `"reflection"`)
- `"question"` at index 6 back → `"stageIntro3"` (currently goes to `"stageIntro"`)

**Update the returned object** to export the three new handlers and remove the old `proceedFromStageIntro`.

#### 2C — Update `src/App.tsx`

Replace all references to the old `"stageIntro"` stage with the three new stages.

- Import `StageIntroScreen` is unchanged.
- Replace the single `stageIntro` render block with three separate render blocks, one for each `stageIntro1`, `stageIntro2`, `stageIntro3`.
- Pass `stageNumber={1}`, `stageNumber={2}`, `stageNumber={3}` to each respective `StageIntroScreen` instance.
- Wire `onProceed` to `gameState.proceedFromStageIntro1`, `gameState.proceedFromStageIntro2`, `gameState.proceedFromStageIntro3` respectively.
- `onBack` and `isTransitioning` props are unchanged for all three.
- Also remove `proceedFromStageIntro` from all references and replace with the correct new handler name.

### What NOT to touch
Do not modify any question components, `content.ts`, `index.css`, or any screen component other than `StageIntroScreen.tsx`. Do not change the `ReflectionScreen`, `SurpriseScreen`, `BreatheScreen`, `LoginScreen`, `ResultScreen`, or `QuestionScreen`.

---

## Agent 3 — Result Screen: Chips, Sliders, Dimension Name

### Files to read first
Read both of these files in full before making any changes:
- `src/components/ResultScreen.tsx` — use the version already updated by Agent 1 (which added the ending signal to Phase 4).
- `src/data/content.ts` — to understand the `resultInterpretations` data structure (chip, secondaryChips, sliders, reflectionLines).
- `src/index.css` — to see existing animation classes and CSS variables you can reuse.

### Context
The `resultInterpretations` export in `content.ts` already has all the data needed: a primary `chip` string, four `secondaryChips` strings, and five `sliders` (each with `label1`, `label2`, `title`, and `value: number` where 0–100, 50 = center). Currently `ResultScreen.tsx` only uses `reflectionLines` — chips and sliders are never rendered.

### Task

#### 3A — Phase 1: Show dimension name and chips

In the Phase 1 block (where the player's name and subtitle are shown), add the following after the name `<h1>` and before the subtitle paragraph:

1. A small label above the chip: `"Your recurring tendency:"` — style as `fontSize: "0.8rem"`, `letterSpacing: "1.5px"`, `color: "var(--color-text-light)"`, `textTransform: "uppercase"`. Use `animate-fade-up delay-400` class.

2. The primary chip (`resultData.chip`) rendered as a styled pill:
   - Inline `<span>` or `<div>` with: `border: "1.5px solid var(--color-gold-dark)"`, `borderRadius: "100px"`, `padding: "0.4rem 1.2rem"`, `fontSize: "1.1rem"`, `fontWeight: 600`, `color: "var(--color-text)"`, `background: "rgba(243,206,133,0.15)"`, `letterSpacing: "0.5px"`.
   - Use `animate-fade-up delay-600` class.

3. Four secondary chip pills from `resultData.secondaryChips`, rendered in a flex row with `flexWrap: "wrap"`, `justifyContent: "center"`, `gap: "0.5rem"`. Each pill: `fontSize: "0.82rem"`, `padding: "0.25rem 0.75rem"`, `borderRadius: "100px"`, `border: "1px solid rgba(204,153,56,0.4)"`, `color: "var(--color-text-light)"`, `background: "rgba(251,229,184,0.1)"`.
   - Wrap the secondary chips container in `animate-fade-up delay-800` class.

#### 3B — Phase 3: Add sliders

In the Phase 3 block, after the benefit line (`resultData.reflectionLines[1]`) and **before** the hidden cost box, render the five sliders from `resultData.sliders`.

Each slider item renders:
- A `title` string at `fontSize: "0.78rem"`, `letterSpacing: "1px"`, `color: "var(--color-text-light)"`, `textTransform: "uppercase"`, `marginBottom: "0.4rem"`.
- A row with `label1` on the left and `label2` on the right, both at `fontSize: "0.8rem"`, `color: "var(--color-text-light)"`.
- Between the labels, a track: `height: "3px"`, `borderRadius: "2px"`, `background: "rgba(0,0,0,0.06)"`, `position: "relative"`, `flex: 1`, `margin: "0 0.6rem"`. Inside the track, a filled portion `div` that animates its `width` from `0%` to `${value}%` over `0.8s` using a CSS transition. The fill color is `var(--color-gold-mid)`. The filled div should start at `width: 0` and transition to the target value — use a `useEffect` on `phase` to trigger the animation after Phase 3 mounts.
- Add `marginBottom: "1.2rem"` between each slider item.

Wrap all 5 sliders in a container with `animate-fade-up delay-400` class, `marginBottom: "2.5rem"`.

Use a `useState<boolean>` called `slidersVisible` in `ResultScreen` that gets set to `true` inside a `useEffect` that fires when `phase === 3`. Wire `slidersVisible` to the filled bar width transitions: when `slidersVisible` is `false`, width is `"0%"`; when `true`, width is `"${slider.value}%"`. Add `transition: "width 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)"` to each filled bar.

Reset `slidersVisible` to `false` whenever phase changes away from 3.

#### 3C — Add CSS for slider track in `src/index.css`

Add a `.slider-track` class:
```css
.slider-track {
  flex: 1;
  height: 3px;
  background: rgba(0,0,0,0.06);
  border-radius: 2px;
  position: relative;
  margin: 0 0.6rem;
  overflow: hidden;
}
```

### What NOT to touch
Do not modify Phases 2 or 4 of the result screen. Do not modify `content.ts`. Do not modify any component other than `ResultScreen.tsx`.

---

## Agent 4 — Reflection Quote-back + Growing Pattern Visualization

### Files to read first
Read all of these files in full before making any changes:
- `src/components/ReflectionScreen.tsx`
- `src/App.tsx` — use the version already updated by Agent 2 (which added `stageIntro1`/`stageIntro2` and updated the flow).
- `src/hooks/useGameState.ts` — use the version already updated by Agent 2.
- `src/data/content.ts` — to understand the `questions` array structure (you need to look up option text from answers).
- `src/index.css` — to understand existing animation classes you can reuse.

### Context
The two `ReflectionScreen` instances feel passive — the player reads text and taps through with no active confrontation. Two things will make them feel like genuine reflection moments:
1. Showing the player their own three answers from the just-completed stage as quoted cards.
2. Showing a visual "pattern shape" that grows and shifts based on the player's running choices.

### Task

#### 4A — Create `src/components/PatternViz.tsx`

Create a new standalone SVG component that renders a 4-axis diamond shape. Each axis represents one behavioural dimension (A, B, C, D). The length of each axis reflects how many of the passed answers scored that dimension (reversal questions excluded from scoring).

**Props interface:**
```typescript
interface PatternVizProps {
  /** All answers collected so far (Dimension[]). Reversal indices are excluded from scoring inside this component. */
  answers: Dimension[];
  /** The set of 0-based indices that are reversal questions and should be excluded from scoring. Pass new Set([2, 5, 8]). */
  reversalIndices: ReadonlySet<number>;
  /** Diameter of the SVG canvas in px. Default 200. */
  size?: number;
}
```

**Rendering logic:**
- SVG viewBox is `"0 0 {size} {size}"`. Center point is `(size/2, size/2)`.
- Axes: A = up (top), B = right, C = down (bottom), D = left. This is a 4-axis diamond.
- Count non-reversal answers for each dimension. Get the total scored answer count.
- Each axis extends from the center outward by `(count / maxPossible) * maxRadius` where `maxRadius = size * 0.38` and `maxPossible = 4` (max scored answers per stage is ~3 for reflection 1, ~6 cumulative for reflection 2, but normalize against the total non-reversal answers passed so the shape always fits).
  - Actually: normalize each dimension count against the **total scored answers** (not a fixed max), so the shape always fills proportionally. Each axis length = `(dimCount / totalScored) * maxRadius * 2`. Minimum axis length = `maxRadius * 0.12` so no axis is ever zero-length (prevents a completely invisible shape when count is 0).
- Compute 4 points — one per axis — using the axis directions. Then draw a closed `<polygon>` connecting A→B→C→D.
- Fill the polygon: `fill="rgba(243,206,133,0.28)"`, `stroke="rgba(204,153,56,0.55)"`, `strokeWidth="1.5"`.
- Draw 4 thin axis guide lines from center to max extent (at `opacity 0.12`, color `var(--color-text)`).
- Draw 4 small dimension labels at the tip of each axis: `"A"`, `"B"`, `"C"`, `"D"` at `fontSize="9"`, `fill="var(--color-text-light)"`, `opacity="0.5"`. These are tiny and subtle — not prominently labeled.
- Add a `<circle>` at the center: `r={3}`, `fill="var(--color-gold-dark)"`, `opacity={0.4}`.
- Animate the polygon fill on mount using a CSS animation: the polygon should fade in over 1.2s. Add `className="pattern-viz-polygon"` to the polygon and add the CSS in `index.css`.
- The component must be a pure functional component with no side effects other than the mount animation.

#### 4B — Update `src/components/ReflectionScreen.tsx`

**Update `ReflectionScreenProps`:**
Add two new props:
- `stageAnswers: Dimension[]` — the raw array of the 3 answers from the stage that just finished (Q1–Q3 for reflection 1, Q4–Q6 for reflection 2). Used to look up verbatim option text for the quote-back.
- `allAnswers: Dimension[]` — the full answers array from `useGameState` (all answers collected so far). Passed to `PatternViz`.

**Add a `REVERSAL_INDICES` constant** at the top of the file (module-level):
```typescript
const REVERSAL_INDICES: ReadonlySet<number> = new Set([2, 5, 8]);
```

**Look up verbatim answer texts:**
Inside the component, compute a `stageAnswerTexts: string[]` by mapping over `stageAnswers` with their corresponding question index. For reflection block 1, the stage answers are at global indices 0, 1, 2 (Q1–Q3). For reflection block 2, they are at global indices 3, 4, 5 (Q4–Q6). Use `triggerBlock` to determine the starting question index offset (`triggerBlock === 1 ? 0 : 3`). Look up `questions[offset + i].options.find(opt => opt.id === stageAnswers[i])?.text ?? ""` for each answer.

Import `questions` from `"../data/content"`.

**Render the quote-back section** — place this above the `<h2>` header text, before everything else in the main content area:

A small label: `"You just answered:"` at `fontSize: "0.78rem"`, `letterSpacing: "1.5px"`, `color: "var(--color-text-light)"`, `textTransform: "uppercase"`, `marginBottom: "1rem"`. Add `animate-fade-up delay-200` class.

Three quoted answer cards, each with `animate-fade-up` and staggered delays (delay-400, delay-600, delay-800). Each card:
- Container: `borderLeft: "2px solid var(--color-gold-mid)"`, `paddingLeft: "1rem"`, `marginBottom: "0.75rem"`.
- Text: `fontSize: "0.95rem"`, `color: "var(--color-text)"`, `fontStyle: "italic"`, `lineHeight: 1.6`.
- Render as a `<p>` with the verbatim answer text. If the text is empty (edge case), render nothing for that card.

After the three quote cards, add the `PatternViz` component:
- `answers={allAnswers}`, `reversalIndices={REVERSAL_INDICES}`, `size={160}`.
- Center it: wrap in a `div` with `display: "flex"`, `justifyContent: "center"`, `marginTop: "1.5rem"`, `marginBottom: "1.5rem"`. Add `animate-fade-up delay-1000` class.

Then render the existing `<h2>` header and reflection text below, with their delays increased by ~800ms to push them further down after the quote-back:
- `<h2>` delay: change from `delay-200` / `delay-200` to `delay-1200`.
- Reflection `<p>` text: change from `delay-400` to `delay-1400`. Add `delay-1400` to `index.css` if it doesn't already exist.
- The `dominantCount` sub-line and `reflection-timer-line` keep their existing classes but also need to start later — add `delay-1600` and `delay-1800` respectively. Add those to `index.css` as well.
- The `showButton` timer (currently `3500ms`) should be extended to `6000ms` to account for the longer content.

#### 4C — Update `src/App.tsx`

In the `<ReflectionScreen>` render block (the `gameState.stage === "reflection"` section), add the two new required props:

- `stageAnswers={gameState.answers.slice(gameState.questionIndex - 3, gameState.questionIndex)}` — this is already computed as `reflectionSlice`, so just pass `stageAnswers={reflectionSlice}`.
- `allAnswers={gameState.answers}`

#### 4D — Add CSS to `src/index.css`

Add the following:

```css
/* Delay classes for extended stagger on reflection screen */
.delay-1400 { animation-delay: 1.4s; }
.delay-1600 { animation-delay: 1.6s; }
.delay-1800 { animation-delay: 1.8s; }

/* Pattern visualization polygon fade-in */
@keyframes patternReveal {
  0%   { opacity: 0; }
  100% { opacity: 1; }
}
.pattern-viz-polygon {
  animation: patternReveal 1.2s ease forwards;
}
```

> Note: `delay-1400` may already exist in `index.css` — check before adding it.

### What NOT to touch
Do not modify `StageIntroScreen.tsx`, `QuestionScreen.tsx`, `ResultScreen.tsx`, `LoginScreen.tsx`, `SurpriseScreen.tsx`, or `BreatheScreen.tsx`. Do not modify `content.ts`. Only touch `ReflectionScreen.tsx`, the new `PatternViz.tsx`, `App.tsx` (only the reflection render block and any needed imports), and `index.css`.

---

## Notes for Running Agents

- Pass each agent the **current state of the repo** at the time you run it, not the state from before previous agents ran.
- If an agent asks a clarifying question, refer it back to `docs/improvement-plan-v4.md` for full context on the intent behind each change.
- The game's overall design intent is documented in `minigame context brief.txt` at the repo root — if an agent seems confused about tone or copy direction, point it there.
- After all 4 agents complete, do a full play-through to verify: readability, the two new stage intro screens, chips/sliders on result, quoted answers + pattern visualization on reflections, and the ending signal on Phase 4.
