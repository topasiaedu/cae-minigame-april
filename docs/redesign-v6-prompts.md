# Implementation Agent Prompts — v6 Redesign

**Reference doc:** `docs/redesign-v6.md`
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
- CSS variables: `--color-text` (`#2c251d`), `--color-text-light` (`#4a3f34`), `--color-gold-light` (`#fbe5b8`), `--color-gold-mid` (`#f3ce85`), `--color-gold-dark` (`#cc9938`), `--glass-bg`, `--glass-border`
- Animation classes: `animate-fade-up`, `delay-200` through `delay-1800`, `screen-enter`, `screen-exit`
- All screens use the `.glass-container` class as the root wrapper
- Primary button uses `.btn-primary` class

---

## Agent 1 — Content & Data Architecture

### Files to read first
Read the full contents of these files before making any changes:
- `src/data/content.ts`
- `docs/redesign-v6.md` (sections 4, 5, 6, 7, 9, 10)

### Task

Rewrite `src/data/content.ts` completely. This file defines all game content: question data, reflection text, confrontation text helpers, and result interpretations.

#### 1A — New TypeScript Interfaces

Add a `BranchingSetup` interface:

```typescript
export interface BranchingSetup {
  /** 0-based index of the question whose answer determines which variant to show */
  branchesOn: number;
  /** One setup string per dimension — keyed by the previous answer's dimension */
  variants: Record<Dimension, string>;
}
```

Update the `Question` interface. The `setup` field becomes a union type: either a plain `string` (universal — same for all players) or a `BranchingSetup` (scenario adapts based on a previous answer). Add an optional `isCostQuestion` boolean:

```typescript
export interface Question {
  id: number;
  setup: string | BranchingSetup;
  context: string;
  options: Option[];
  isReversal?: boolean;
  isCostQuestion?: boolean;
}
```

Keep the existing `Dimension`, `Option`, and `ResultInterpretation` interfaces unchanged.

#### 1B — Rewrite All 10 Questions

Replace the `questions` array with the new content. Every piece of copy is specified below. Use it exactly as written.

**Q1 (id: 1) — universal:**
```
setup: "A new direction opens in your market. The information is incomplete. Others are watching the same space."
context: "What do you do?"
options:
  A: "Move in now and adjust as I learn"
  B: "Hold back until the picture is clearer"
  C: "Run the numbers before I decide"
  D: "Position myself without fully committing"
```

**Q2 (id: 2) — branches on Q1 (index 0):**
```
setup: BranchingSetup with branchesOn: 0
  A: "You moved first. Things are in motion — but a key detail surfaces that changes the picture. Something you would have caught with more time."
  B: "You held back. The space is clearer now, but two others have moved in. Your team is asking why you are still watching."
  C: "You ran the numbers. The data looks promising but not conclusive. A faster competitor has already launched while you were analysing."
  D: "You positioned yourself without committing. Both paths are still open, but your team is not sure which way you are heading."
context: "What do you do now?"
options:
  A: "Push forward — we will fix it as we go"
  B: "Pause and get clarity before the next move"
  C: "Map out exactly what changed before deciding"
  D: "Keep room to adjust — do not lock in yet"
```

**Q3 (id: 3) — branches on Q2 (index 1):**
```
setup: BranchingSetup with branchesOn: 1
  A: "You pushed through again. A partner now needs your answer by end of day. You have about 70% of the information. This is your third fast call."
  B: "You paused. The picture is sharper, but the deadline did not pause with you. A partner needs your answer by end of day. You have about 70%."
  C: "You mapped it out. The analysis helped, but took time. A partner needs your answer by end of day. You have about 70%."
  D: "You kept room to adjust. Flexible — but a partner now needs a firm answer by end of day. You have about 70%."
context: "What do you do?"
options:
  A: "Decide now — 70% is enough"
  B: "Push the deadline — a wrong call is worse than a late one"
  C: "Use what I have to work out the outcomes first"
  D: "Give a soft answer I can adjust later"
```

**Q4 (id: 4) — universal:**
```
setup: "Think of a real decision from the first three months of this year. Someone you know took the path you passed on — and it worked for them."
context: "Looking back, you:"
options:
  A: "Think I should have moved sooner"
  B: "Still believe holding back was right at the time"
  C: "Want to understand exactly why it worked for them"
  D: "Think every business has its own timing"
```

**Q5 (id: 5) — branches on Q4 (index 3), isCostQuestion: true:**
```
setup: BranchingSetup with branchesOn: 3
  A: "You wish you had moved sooner. Speed matters to you, even in hindsight. But every default has a price."
  B: "You stand by the wait. Patience matters to you. But every default has a price."
  C: "You want to understand the logic. Clarity matters more to you than speed. But every default has a price."
  D: "You see your own timing as valid. Flexibility matters to you. But every default has a price."
context: "In the first three months — what did your pattern cost you most?"
isCostQuestion: true
options:
  A: "Relationships — people around me struggle to keep up or stay aligned"
  B: "Missed windows — some chances closed while I was still deciding"
  C: "Direction — I stay busy but not always heading the right way"
  D: "Energy — I keep running and it is starting to show"
```

**Q6 (id: 6) — reversal, branches on Q5 (index 4):**
```
setup: BranchingSetup with branchesOn: 4
  A: "You said your pattern costs you relationships. A trusted advisor is describing how you make decisions."
  B: "You said your pattern costs you timing. A trusted advisor is describing how you make decisions."
  C: "You said your pattern costs you direction. A trusted advisor is describing how you make decisions."
  D: "You said your pattern costs you energy. A trusted advisor is describing how you make decisions."
context: "Which would they least say about you?"
isReversal: true
options:
  A: "You move fast and fix later"
  B: "You wait until you are sure"
  C: "You need the data before you act"
  D: "You keep options open as long as possible"
```

**Q7 (id: 7) — universal:**
```
setup: "When a strategy is not working, your automatic response is usually to:"
context: ""
options:
  A: "Try something different immediately"
  B: "Step back and watch longer"
  C: "Analyse what went wrong before changing anything"
  D: "Pull back — keep room to shift"
```

**Q8 (id: 8) — branches on Q7 (index 6):**
```
setup: BranchingSetup with branchesOn: 6
  A: "You default to action. Be honest about the first three months of this year."
  B: "You default to watching. Be honest about the first three months of this year."
  C: "You default to analysis. Be honest about the first three months of this year."
  D: "You default to flexibility. Be honest about the first three months of this year."
context: "The decisions that mattered most were probably made:"
options:
  A: "Quickly — trusting instinct over data"
  B: "Slowly — waiting longer than I probably needed to"
  C: "Carefully — running the analysis until it felt safe enough"
  D: "Tentatively — committing just enough to stay flexible"
```

**Q9 (id: 9) — reversal, branches on Q8 (index 7):**
```
setup: BranchingSetup with branchesOn: 7
  A: "You move fast and trust instinct. Every decision habit has a cost."
  B: "You move slowly and wait for signals. Every decision habit has a cost."
  C: "You move carefully and trust analysis. Every decision habit has a cost."
  D: "You move tentatively and stay flexible. Every decision habit has a cost."
context: "Which cost do you notice least in yourself?"
isReversal: true
options:
  A: "Moving fast, then fixing avoidable mistakes"
  B: "Waiting until the best window quietly closes"
  C: "Over-planning until good ideas never start"
  D: "Keeping options open until nothing gets fully built"
```

**Q10 (id: 10) — branches on Q9 (index 8):**
```
setup: BranchingSetup with branchesOn: 8
  A: "The cost you notice least — wasted motion — might be running right now."
  B: "The cost you notice least — closed windows — might already be happening."
  C: "The cost you notice least — unlaunched ideas — might be piling up."
  D: "The cost you notice least — nothing fully built — might be the story of this year."
context: "The months ahead will amplify your pattern. If one thing needs to change, what is it?"
options:
  A: "Am I moving fast because it is right — or because standing still feels uncomfortable?"
  B: "Am I waiting for certainty — or just avoiding the risk of being wrong?"
  C: "Am I planning carefully — or hiding behind the analysis?"
  D: "Am I staying flexible — or afraid to fully commit?"
```

#### 1C — Update Reflection Text Constants

Update `reflectionObservations` to reference the connected story:

```typescript
export const reflectionObservations = {
  stage1: {
    A: "Three decisions in one story. Each time — you moved first.",
    B: "Three decisions in one story. Each time — you held back.",
    C: "Three decisions in one story. Each time — you ran the numbers.",
    D: "Three decisions in one story. Each time — you kept a way out."
  },
  stage2: {
    A: "Even in hindsight — you would still move first.",
    B: "Even in hindsight — you would still wait.",
    C: "Even in hindsight — you would still want the numbers.",
    D: "Even in hindsight — you would still keep an exit open."
  }
} as const;
```

Update `reflectionFriction` — replace "Q1" references:

```typescript
export const reflectionFriction = {
  stage1Clear: "How many times did this happen in the first three months?",
  stage1Balanced: "In the first three months — was it this mixed, or did one instinct take over?",
  stage2Clear: "Is this the price you want to keep paying?",
  stage2Balanced: "Even without a clear pattern — is the cost adding up?"
} as const;
```

Keep `reflectionBalancedLines` as-is (the copy is still correct).

#### 1D — Add Contradiction Text Constants

Add new exports for contradiction surfacing on Reflection 2 and the Confrontation screen:

```typescript
export const stageIBehaviorText: Record<Dimension, string> = {
  A: "moved first",
  B: "held back",
  C: "ran the numbers",
  D: "kept your options open"
};

export const q4DescriptionText: Record<Dimension, string> = {
  A: "you should have moved sooner",
  B: "holding back was still right",
  C: "you wanted to understand the logic",
  D: "the timing was just different"
};
```

#### 1E — Update Result Interpretations

Update the `q1CostLine` strings to replace "Q1" with "the first three months":

```
A: "In the first three months — was some of that motion actually just noise?"
B: "In the first three months — did some of that caution actually cost you a window?"
C: "In the first three months — did some of that planning actually stop something from starting?"
D: "In the first three months — did some of that flexibility actually prevent you from building?"
```

Keep all other `resultInterpretations` fields (chip, secondaryChips, sliders, reflectionLines) unchanged.

#### 1F — Add Helper Function

Add a pure utility function to resolve a branching setup:

```typescript
/**
 * Resolves the setup text for a question. If the setup is a plain string, returns it directly.
 * If it is a BranchingSetup, looks up the previous answer and returns the matching variant.
 */
export function resolveSetup(question: Question, answers: Dimension[]): string {
  if (typeof question.setup === "string") {
    return question.setup;
  }
  const previousAnswer = answers[question.setup.branchesOn];
  if (previousAnswer === undefined) {
    return question.setup.variants.A;
  }
  return question.setup.variants[previousAnswer];
}
```

### What NOT to touch
Do not modify any component files, `useGameState.ts`, `App.tsx`, or `index.css`. This agent ONLY modifies `src/data/content.ts`.

---

## Agent 2 — Game State & App Wiring

### Files to read first
Read the full contents of these files before making any changes:
- `src/data/content.ts` — **use the version already updated by Agent 1**
- `src/hooks/useGameState.ts`
- `src/App.tsx`

### Context

The question data in `content.ts` now supports branching setups and a cost question (Q5). The game state hook needs to: (a) resolve branching setups into plain strings, (b) exclude Q5 from scoring, (c) expose new data for contradiction detection, and (d) expose the player's Q5 cost text. `App.tsx` needs to pass new props to the Confrontation and Result screens.

### Task

#### 2A — Update `src/hooks/useGameState.ts`

**Rename `REVERSAL_INDICES` to `NON_SCORED_INDICES`** and add index 4 (Q5 cost question):

```typescript
const NON_SCORED_INDICES: ReadonlySet<number> = new Set([4, 5, 8]);
```

Update all references from `REVERSAL_INDICES` to `NON_SCORED_INDICES` — this is used in `getScoredCounts` to exclude certain answers from dimension counting.

**Add `playerCostText` memo** — looks up the verbatim text of the Q5 answer:

```typescript
const playerCostText = useMemo((): string => {
  const answer = answers[4];
  if (answer === undefined) return "";
  const option = questions[4].options.find((item) => item.id === answer);
  return option === undefined ? "" : option.text;
}, [answers]);
```

**Add `stageIDominant` memo** — dominant dimension from Q1–Q3 only:

```typescript
const stageIDominant = useMemo((): Dimension => {
  if (answers.length < 3) return "A";
  return computeDominantDimension(0, 3);
}, [answers, computeDominantDimension]);
```

**Add `hasContradiction` memo** — true when Stage I dominant differs from Q4 answer:

```typescript
const hasContradiction = useMemo((): boolean => {
  const q4Answer = answers[3];
  if (q4Answer === undefined) return false;
  return stageIDominant !== q4Answer;
}, [stageIDominant, answers]);
```

**Add `currentResolvedSetup` memo** — resolves branching question setup to a plain string:

```typescript
import { questions, Dimension, resolveSetup } from "../data/content";

const currentResolvedSetup = useMemo((): string => {
  const question = questions[Math.min(questionIndex, questions.length - 1)];
  return resolveSetup(question, answers);
}, [questionIndex, answers]);
```

**Update the returned object** to include the new values:

```typescript
return {
  // ... all existing fields ...
  playerCostText,
  stageIDominant,
  hasContradiction,
  currentResolvedSetup
};
```

#### 2B — Update `src/App.tsx`

**Import the new text constants** from `content.ts`:

```typescript
import { questions, Dimension, stageIBehaviorText, q4DescriptionText } from "./data/content";
```

**Pass `resolvedSetup` to QuestionScreen:**

In the question render block, add the `resolvedSetup` prop:

```tsx
<QuestionScreen
  question={gameState.currentQuestion}
  resolvedSetup={gameState.currentResolvedSetup}
  // ... all other existing props ...
/>
```

**Pass new props to ConfrontationScreen:**

```tsx
<ConfrontationScreen
  onProceed={gameState.proceedFromConfrontation}
  isTransitioning={gameState.isTransitioning}
  onBack={gameState.goBack}
  stageIDominant={gameState.stageIDominant}
  hasContradiction={gameState.hasContradiction}
  stageIBehaviorText={stageIBehaviorText[gameState.stageIDominant]}
  q4DescriptionText={gameState.answers[3] !== undefined ? q4DescriptionText[gameState.answers[3]] : ""}
  playerCostText={gameState.playerCostText}
/>
```

**Pass new props to ReflectionScreen:**

Add `stageIDominant` and `playerCostText` to the reflection render block:

```tsx
<ReflectionScreen
  // ... all existing props ...
  stageIDominant={gameState.stageIDominant}
  playerCostText={gameState.playerCostText}
/>
```

**Pass `playerCostText` to ResultScreen:**

```tsx
<ResultScreen
  // ... all existing props ...
  playerCostText={gameState.playerCostText}
/>
```

### What NOT to touch
Do not modify `content.ts`, `index.css`, or any component files other than `App.tsx`. Do not modify `QuestionScreen.tsx`, `ReflectionScreen.tsx`, `ConfrontationScreen.tsx`, or `ResultScreen.tsx` — those are handled by Agents 3 and 4.

---

## Agent 3 — Question Screen, Login, StageIntro

### Files to read first
Read the full contents of these files before making any changes:
- `src/components/QuestionScreen.tsx`
- `src/components/LoginScreen.tsx`
- `src/components/StageIntroScreen.tsx`
- `src/data/content.ts` — **use the version updated by Agent 1** — to understand the `BranchingSetup` type and `isCostQuestion` flag

### Task

#### 3A — Update `QuestionScreen.tsx`

**Add `resolvedSetup` prop** to the `QuestionScreenProps` interface:

```typescript
interface QuestionScreenProps {
  // ... all existing props ...
  /** Pre-resolved setup text — handles branching questions transparently */
  resolvedSetup: string;
}
```

**Use `resolvedSetup` instead of `question.setup`** in the rendering. Find the paragraph that renders `question.setup` and `question.context` (the question text area). Replace `question.setup` with the `resolvedSetup` prop. The `question.context` stays as-is from the question object.

Currently the code has something like:
```tsx
<p>
  {question.setup}{" "}
  <span>{question.context}</span>
</p>
```

Change `question.setup` to `resolvedSetup`:
```tsx
<p>
  {resolvedSetup}{" "}
  <span>{question.context}</span>
</p>
```

**Handle cost question echo.** Currently, when a player selects an option, an echo appears (e.g. "Moving first."). For cost questions (Q5), the standard dimension echo does not make sense. Check if the current question has `isCostQuestion === true`. If so, show a different echo text: `"You named it."` instead of the standard `DIMENSION_ECHOES[selected]`.

In the echo logic (`echoContent` memo), add a check at the top:

```typescript
const echoContent = useMemo((): EchoContent | null => {
  if (selected === null) return null;
  // Cost question — show acknowledgment instead of dimension echo
  if (question.isCostQuestion === true) {
    return { type: "simple", text: "You named it." };
  }
  // ... rest of existing echo logic ...
}, [selected, questionIndex, answers, question.isCostQuestion]);
```

#### 3B — Update `LoginScreen.tsx`

Replace the "Q1" / "Q2" language in the login screen copy:

| Old | New |
|-----|-----|
| "Q1 is done." | "The first three months are done." |
| "Before Q2 begins, this shows how you have been deciding." | "Before April begins — this will show you how you have been deciding." |

Find the exact `<p>` elements containing these strings and update them.

#### 3C — Update `StageIntroScreen.tsx`

In the `STAGE_COPY` object, update the copy to remove "Q1" references:

**Stage 1:**
- `line1`: change to `"These situations involve uncertainty."`  (unchanged — no Q1 reference)
- `line2`: change from `"Think of your Q1 as you answer."` to `"Think of your first three months as you answer."`

**Stage 2:**
- `line1`: unchanged (`"Now we look back."`)
- `line2`: change from `"Not to judge your Q1 — to see it clearly."` to `"Not to judge your first three months — to see them clearly."`

### What NOT to touch
Do not modify `content.ts`, `useGameState.ts`, `App.tsx`, or any component other than `QuestionScreen.tsx`, `LoginScreen.tsx`, `StageIntroScreen.tsx`. Do not modify `ReflectionScreen.tsx`, `ConfrontationScreen.tsx`, or `ResultScreen.tsx`.

---

## Agent 4 — Reflection, Confrontation, Result

### Files to read first
Read the full contents of these files before making any changes:
- `src/components/ReflectionScreen.tsx`
- `src/components/ConfrontationScreen.tsx`
- `src/components/ResultScreen.tsx`
- `src/data/content.ts` — **use the version updated by Agent 1** — to understand `stageIBehaviorText`, `q4DescriptionText`, and the updated reflection text constants
- `src/index.css`

### Context

Reflection 2 now surfaces contradictions between Stage I behavior and Stage II retrospection. The Confrontation screen now uses the player's own data (Stage I dominant, Q4 description, player-named cost) to create a personalised confrontation. The Result screen adds the player-named cost and a bridge line for the speaker.

### Task

#### 4A — Update `ReflectionScreen.tsx`

**Add new props** to the `ReflectionScreenProps` interface:

```typescript
interface ReflectionScreenProps {
  // ... all existing props ...
  /** Dominant dimension from Stage I (Q1-Q3). Used for contradiction detection in block 2. */
  stageIDominant: Dimension;
  /** The player's Q5 cost text. Shown in block 2 reflection. Empty string if not yet answered. */
  playerCostText: string;
}
```

**Import the new text constants:**

```typescript
import {
  // ... existing imports ...
  stageIBehaviorText,
  q4DescriptionText
} from "../data/content";
```

**Add contradiction detection for block 2.** Only applies when `triggerBlock === 2`:

Compute whether there is a contradiction between Stage I dominant and Q4 answer. Q4 is the first answer of Stage II (at global index 3). The first item in `stageAnswers` for block 2 is Q4, so `stageAnswers[0]` is the Q4 answer.

```typescript
const hasContradiction = useMemo((): boolean => {
  if (triggerBlock !== 2) return false;
  const q4Answer = stageAnswers[0];
  if (q4Answer === undefined) return false;
  return stageIDominant !== q4Answer;
}, [triggerBlock, stageAnswers, stageIDominant]);
```

**Update the observation text for block 2.** When `triggerBlock === 2` and `hasContradiction` is true, replace the standard observation with a contradiction message:

```typescript
const observationText = useMemo((): string => {
  if (triggerBlock === 1) {
    // Stage I — no contradiction surfacing (same as before)
    if (dominantCount === 3) return reflectionObservations.stage1[dominantDimension];
    if (dominantCount === 2) return reflectionBalancedLines.stage1Moderate;
    return reflectionBalancedLines.stage1;
  }
  // Stage II — check for contradiction
  if (hasContradiction) {
    const q4Answer = stageAnswers[0];
    if (q4Answer !== undefined) {
      return `In the first story, you ${stageIBehaviorText[stageIDominant]} every time. But looking back — you said ${q4DescriptionText[q4Answer]}.`;
    }
  }
  if (dominantCount === 3) return reflectionObservations.stage2[dominantDimension];
  if (dominantCount === 2) return reflectionBalancedLines.stage2Moderate;
  return reflectionBalancedLines.stage2;
}, [dominantCount, dominantDimension, triggerBlock, hasContradiction, stageAnswers, stageIDominant]);
```

**Show player-named cost in block 2.** After the observation text and before the friction question, if `triggerBlock === 2` and `playerCostText` is not empty, render:

```tsx
{triggerBlock === 2 && playerCostText.trim().length > 0 && (
  <div
    className="animate-fade-up delay-1000"
    style={{
      borderLeft: "3px solid var(--color-gold-dark)",
      paddingLeft: "1rem",
      marginTop: "1.2rem",
      maxWidth: "320px"
    }}
  >
    <p style={{ fontSize: "0.9rem", color: "var(--color-text-light)", marginBottom: "0.3rem" }}>
      You said this costs you:
    </p>
    <p style={{ fontSize: "1.05rem", color: "var(--color-text)", fontStyle: "italic", lineHeight: 1.6, margin: 0 }}>
      {playerCostText}
    </p>
  </div>
)}
```

Place this between the observation text `<p>` and the friction text section.

#### 4B — Update `ConfrontationScreen.tsx`

**Add new props** to the interface:

```typescript
interface ConfrontationScreenProps {
  onProceed: () => void;
  isTransitioning: boolean;
  onBack: () => void;
  /** Dominant dimension from Stage I */
  stageIDominant: Dimension;
  /** Whether Stage I dominant differs from Q4 answer */
  hasContradiction: boolean;
  /** Human-readable Stage I behavior, e.g. "moved first" */
  stageIBehaviorText: string;
  /** Human-readable Q4 description, e.g. "you should have moved sooner" */
  q4DescriptionText: string;
  /** Player's Q5 cost answer text */
  playerCostText: string;
}
```

Import `Dimension` from content:
```typescript
import { Dimension } from "../data/content";
```

**Replace the hardcoded confrontation copy** with dynamic, data-driven text:

Line 1 (immediate): "You have been making the same call."

Line 2 (1s delay) — varies based on contradiction:
- If `hasContradiction && q4DescriptionText.length > 0`: render `"In the first story, you ${stageIBehaviorText}. But looking back at a real moment — you said ${q4DescriptionText}."`
- Else: render `"In the first story and in hindsight — the same instinct."`

Line 3 (2s delay) — only if `playerCostText` is not empty: "And you already named what it costs you."

Line 4 (2.5s delay, italic): "The next questions are not about what might happen. They are about what is already running."

CTA button appears after 3.5s: "I'm ready"

Keep the existing structure (roman watermark "III", back button, glass-container, screen-enter/exit transitions, timed reveal using `useState` + `useEffect` timers). Replace the three hardcoded `<p>` elements with the new dynamic content.

The existing three-line structure with `delay-200`, `delay-400`, `delay-600` classes can be kept, but you will need to add Line 3 as a new element. Use `delay-200` for Line 1, `delay-400` for Line 2, `delay-600` for Line 3, and `delay-800` for Line 4 (italic). Adjust the `showButton` timer from `3500` to `4000` to account for the extra line.

#### 4C — Update `ResultScreen.tsx`

**Add `playerCostText` prop** to `ResultScreenProps`:

```typescript
interface ResultScreenProps {
  // ... all existing props ...
  /** Player's Q5 cost answer text */
  playerCostText: string;
}
```

**Phase 1 addition — after Q10 quote-back, before the Continue button:**

If `playerCostText` is not empty, render:

```tsx
{playerCostText.trim().length > 0 && (
  <div className="animate-fade-up delay-1200" style={{ width: "100%", maxWidth: "340px", marginTop: "1rem" }}>
    <p style={{ fontSize: "1rem", color: "var(--color-text)", marginBottom: "0.4rem" }}>
      You said your pattern costs you:
    </p>
    <div style={{ borderLeft: "3px solid var(--color-gold-dark)", paddingLeft: "1rem" }}>
      <p style={{ fontSize: "1rem", color: "var(--color-text)", lineHeight: 1.5, fontStyle: "italic" }}>
        {playerCostText}
      </p>
    </div>
  </div>
)}
```

**Phase 3 updates — Q2 closing question text:**

Replace the existing closing question text. Find the `<p>` that contains "Q2 will accelerate whatever direction you are already in." and change it to:

```
"The months ahead will amplify whatever direction you are already in."
```

(Keep the second line "Is this the pattern you want running it?" unchanged.)

**Phase 3 additions — after the CAE GOH watermark div:**

Add the bridge line and ending signal:

```tsx
<p
  className="animate-fade-up delay-1200"
  style={{
    fontSize: "0.9rem",
    color: "var(--color-text)",
    textAlign: "center",
    marginTop: "1rem",
    lineHeight: 1.7,
    maxWidth: "320px",
    margin: "1rem auto 0"
  }}
>
  This game shows you the pattern. It cannot show you why it runs, or how the months ahead will change it.
</p>

<p
  className="animate-fade-up delay-1800"
  style={{
    fontSize: "0.78rem",
    opacity: 0,
    letterSpacing: "1.5px",
    textAlign: "center",
    color: "var(--color-text-light)",
    marginTop: "1rem"
  }}
>
  The speaker will continue from here.
</p>
```

**Phase 1 label update:**

Find the label text "Your Q1 pattern" (or "YOUR Q1 PATTERN") and change it to "YOUR PATTERN" — remove the "Q1" reference.

#### 4D — No CSS changes needed

All new elements use existing animation classes and inline styles. No new CSS is required.

### What NOT to touch
Do not modify `content.ts`, `useGameState.ts`, `App.tsx`, `QuestionScreen.tsx`, `LoginScreen.tsx`, or `StageIntroScreen.tsx`.

---

## Notes for Running Agents

- Pass each agent the **current state of the repo** at the time you run it, not the state from before previous agents ran.
- If an agent asks a clarifying question, refer it back to `docs/redesign-v6.md` for full context.
- After all 4 agents complete, do a full play-through to verify:
  - Q2, Q3 setup text changes based on Q1, Q2 answers
  - Q5 shows cost options and the echo says "You named it."
  - Q6 setup references the cost the player named
  - Reflection 2 surfaces a contradiction (if present) and shows the player's cost text
  - Confrontation uses dynamic text with Stage I behavior, Q4 description, and cost text
  - Result Phase 1 shows the player-named cost
  - Result Phase 3 shows the bridge line and ending signal
  - All "Q1" references replaced with "first three months"
  - No TypeScript errors, no broken transitions, no missing props
