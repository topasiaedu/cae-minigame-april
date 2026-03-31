# Implementation Agent Prompts — Result Screen v7

**Reference doc:** `docs/result-screen-v7.md`
**Run agents in order: Agent 1 → Agent 2 → Agent 3**
Each agent builds on files modified by the previous one. Always read the latest saved file before making changes.

---

## Coding Standards (include at the top of every agent prompt)

These rules are mandatory for all code produced:

1. **Completeness** — Generate full file contents with no placeholders or `// TODO` stubs. If something cannot be done, explain in a comment.
2. **Comments** — Include clear inline comments and JSDoc headers for functions and non-obvious logic. Do not write comments that just narrate what the code does line-by-line.
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

## Agent 1 — Content Layer (`src/data/content.ts`)

### Context

You are working on a React + TypeScript mini-game for a live webinar. The game shows players their decision-making pattern across 10 questions. After completing the game, the result screen shows them their dominant pattern and a narrative breakdown.

The result screen currently shows "chips" (pill labels) and "sliders" (static preset percentage bars) in its final phase. These are being removed and replaced with two narrative text sections that reference the player's actual answers. You are responsible for updating the data layer only.

### Files to read first

Read the full contents of these files before making any changes:
- `src/data/content.ts`

### Task

Rewrite `src/data/content.ts`. Keep every existing export that is NOT listed for removal below. Only the `ResultInterpretation` interface and the `resultInterpretations` object need to change.

---

#### 1A — Update the `ResultInterpretation` Interface

Replace the current `ResultInterpretation` interface with this exact definition:

```typescript
export interface ResultInterpretation {
  /**
   * Short pattern label. Used in the distribution bar (Phase 3) and the
   * "YOUR PATTERN" pill in Phase 1.
   */
  chip: string;

  /**
   * Two recognition/strength lines.
   * [0] = recognition sentence shown in Phase 1
   * [1] = strength sentence shown in Phase 2 (paragraph 1)
   *
   * The third shadow line that previously existed here has been moved into
   * pathWalked[2] where it is expanded into a full paragraph.
   */
  reflectionLines: [string, string];

  /**
   * Personalised callback question shown in Phase 2, tied to the player's
   * Q1 answer (their first three months decision context).
   */
  q1CostLine: string;

  /**
   * Three paragraphs for Section 1 "The Path You Walked" in Phase 3.
   * Uses {Q1}, {Q8}, {COST}, {COUNT} as interpolation tokens:
   *   {Q1}    = player's Q1 answer text
   *   {Q8}    = player's Q8 answer text
   *   {COST}  = player's Q5 answer text (what the pattern cost them)
   *   {COUNT} = number of scored questions where they chose this dimension
   */
  pathWalked: [string, string, string];

  /**
   * Three paragraphs for Section 2 "The Pattern You Rarely Used" in Phase 3.
   * Shown when THIS dimension is the player's weakest (lowest answerCount).
   * Uses {Q9}, {COUNT} as interpolation tokens:
   *   {Q9}    = player's Q9 answer text (cost they notice least)
   *   {COUNT} = number of times they chose this dimension (may be 0)
   */
  weaknessNarrative: [string, string, string];
}
```

**Remove from the interface:** `sliders`, `secondaryChips`. Do not include them anywhere.

---

#### 1B — Rewrite `resultInterpretations`

Replace the entire `resultInterpretations` object with the following. Every string must be copied exactly as written, including punctuation and token placeholders in curly braces.

```typescript
export const resultInterpretations: Record<Dimension, ResultInterpretation> = {
  A: {
    chip: "Early Movement",
    reflectionLines: [
      "You start before everything is clear.",
      "This keeps you in motion when others are still hesitating."
    ],
    q1CostLine: "In the first three months — was some of that motion actually just noise?",
    pathWalked: [
      "When the first question opened, you chose to \"{Q1}.\" Not because the picture was clear. Because waiting felt like falling behind.",
      "You told us how you made decisions in the first three months: \"{Q8}.\" That is consistent. Across {COUNT} out of 7 choices, you led with momentum. The instinct to move before full clarity is not something you were taught — it is how you are wired. You are the person who builds while others are still in the meeting.",
      "But this pattern carries a specific cost that rarely announces itself. You are always in the next chapter — the next deal, the next move, the next version of what you are building. And somewhere behind you, the present keeps passing. Work-life balance does not collapse at once. It goes quietly: a dinner half-attended, a conversation you were not fully in, a person who learned not to wait for you to arrive. You named it yourself — \"{COST}.\" The drive that builds things is the same drive that makes people feel invisible to you. You are always in the future. The question is what you are leaving in the present."
    ],
    weaknessNarrative: [
      "Early Movement showed up the least in your choices — just {COUNT} out of 7. You rarely chose speed over certainty. The impulse to move before everything was clear was the one you resisted most.",
      "That resistance has protected you. It has probably saved you from decisions you would have regretted more than the ones you delayed. But the cost of not starting is invisible in a way the cost of moving is not. A bad decision leaves a mark. A decision never made leaves nothing — no trace, no record, just a slightly smaller version of what could have existed.",
      "You told us the cost you notice least in yourself: \"{Q9}.\" Sit with that. There may be something you have been waiting to start that is already overdue — not because the conditions were not right, but because standing still has always felt safer than being wrong in motion."
    ]
  },
  B: {
    chip: "Seeking Clarity",
    reflectionLines: [
      "You prefer to wait until the picture is clearer.",
      "This protects you from early, costly mistakes."
    ],
    q1CostLine: "In the first three months — did some of that caution actually cost you a window?",
    pathWalked: [
      "When the first question opened, you chose to \"{Q1}.\" You needed the picture to be clearer before you moved. That is not hesitation — that is your standard.",
      "You described how you made the decisions that mattered most: \"{Q8}.\" Across {COUNT} out of 7 choices, you held back, waited, or protected your position. You are the person who asks the question everyone else skipped. Who sees the gap others did not check. Who would rather be late and right than first and wrong.",
      "But this pattern has a shadow that feels like wisdom. The goal has always been clear to you. The gap is the starting. You ask one more person, wait for one more signal, check one more detail. Stability and security matter deeply to you — and that is not weakness. But the market does not pause for comfort. Some windows close while you are still gathering certainty. You named the cost yourself — \"{COST}.\" The question is not whether caution is right. It is whether the next step is actually missing information — or whether you already know, and waiting feels safer than being wrong."
    ],
    weaknessNarrative: [
      "Seeking Clarity showed up the least in your choices — just {COUNT} out of 7. You rarely chose to wait, gather more, or hold back. The instinct to pause for a clearer signal was the one you used the least.",
      "That speed has built things. But speed without checkpoints also creates cleanup — decisions made quickly that required more correction than patience would have cost upfront. Not every move needs more data. But some do. And the ones that did may still be showing up in the results.",
      "You told us the cost you notice least in yourself: \"{Q9}.\" The question worth sitting with: is there a pattern from the first three months where going fast cost you something that only became visible later — and is it still costing you now?"
    ]
  },
  C: {
    chip: "Calculated Risk",
    reflectionLines: [
      "You measure before you move.",
      "This keeps you from wasting energy on things that do not add up."
    ],
    q1CostLine: "In the first three months — did some of that planning actually stop something from starting?",
    pathWalked: [
      "When the first question opened, you chose to \"{Q1}.\" Precision before movement. Logic before commitment. That was your first answer, and it echoed through {COUNT} out of 7 choices.",
      "You told us your key decisions were made: \"{Q8}.\" You are the analyst. The one who maps the risk before entering the room. Who knows the numbers before anyone else. Who does not waste resources on things that do not add up — and who protects others from doing so either.",
      "But this pattern has a blind spot that is invisible from the inside, because it always looks like thoroughness. You are so precise with the detail that the larger picture sometimes blurs. Opportunities you missed were not lost to bad luck — they were reviewed to death. Partnerships that could have changed everything received an analysis instead of a yes. Perfectionism does not feel like fear from the inside. It feels like standards. You named the cost yourself — \"{COST}.\" The skill waiting to be built is not more analysis. It is knowing when to stop."
    ],
    weaknessNarrative: [
      "Calculated Risk showed up the least in your choices — just {COUNT} out of 7. You rarely stopped to map the numbers, test the logic, or stress-test the plan before committing. That mode — precise, analytical, detail-first — was the one you used the least.",
      "You tend to trust feel over formula. In the right moments, that is an asset. But it may also mean some of your decisions were made without a full accounting of what they would actually cost — in time, in energy, in people.",
      "You told us the cost you notice least in yourself: \"{Q9}.\" The structure you have been skipping may not be caution — it may be the thing that makes everything else sustainable. What is one decision from the first three months where the numbers mattered more than you gave them credit for?"
    ]
  },
  D: {
    chip: "Preserving Options",
    reflectionLines: [
      "You protect your freedom to change direction.",
      "This keeps you from being trapped by choices that no longer fit."
    ],
    q1CostLine: "In the first three months — did some of that flexibility actually prevent you from building?",
    pathWalked: [
      "When the first question opened, you chose to \"{Q1}.\" Keep the exits open. Stay in the room without fully belonging to it. That was your first answer, and it appeared {COUNT} out of 7 times in your choices.",
      "You described your decisions as: \"{Q8}.\" You are responsive. Alive to what is around you. You read the room faster than most, and you want to be in everything — and often you are. Others see your energy and want to follow it.",
      "But this pattern is easily pulled. The next opportunity catches your eye before the current one is finished. Someone else's success lands differently on you — what they are doing suddenly seems more interesting than what you are doing. You want to show your best to the world, always. And that wanting can quietly replace the slower work of building something that does not need an audience. You named the cost yourself — \"{COST}.\" Nothing gets fully built when everything stays tentative. The freedom you are protecting may already be costing you the depth you actually want."
    ],
    weaknessNarrative: [
      "Preserving Options showed up the least in your choices — just {COUNT} out of 7. You rarely chose to keep an exit open or stay tentative. Flexibility — staying adaptive, avoiding lock-in — was the pattern you used the least.",
      "You tend to commit fully. That creates depth and loyalty, and it builds things that last. But full commitment also means you carry things longer than you should — out of principle, or loyalty, or because letting go feels like failure.",
      "You told us the cost you notice least in yourself: \"{Q9}.\" There may be a commitment in your life right now — a direction, a relationship, a plan — that you are still holding out of identity rather than wisdom. The question is not whether you are loyal. It is whether what you are loyal to is still worth the weight."
    ]
  }
};
```

---

#### 1C — Keep Everything Else Unchanged

Do NOT modify any of the following exports. Leave them exactly as they are:
- `Dimension` type
- `BranchingSetup` interface
- `Option` interface
- `Question` interface
- `questions` array (all 10 questions)
- `reflectionObservations`
- `reflectionBalancedLines`
- `reflectionFriction`
- `stageIBehaviorText`
- `q4DescriptionText`
- `resolveSetup` function

### Output

Produce the complete, final `src/data/content.ts` file. Do not abbreviate or truncate any section.

---

## Agent 2 — Data Wiring (`useGameState.ts`, `App.tsx`, `ResultScreen.tsx` interface)

### Context

You are working on a React + TypeScript mini-game. A previous agent has already updated `src/data/content.ts` to add new fields (`pathWalked`, `weaknessNarrative`) to the `ResultInterpretation` interface and removed `sliders` and `secondaryChips`.

Your job is to wire a new data value (`q9AnswerText`) from the game state hook through to the result screen component. You will also update the `ResultScreen` component's props interface to declare the new prop (but do NOT touch the rendering logic — that is Agent 3's job).

### Files to read first

Read the full contents of ALL of these files before making any changes:
- `src/hooks/useGameState.ts`
- `src/App.tsx`
- `src/components/ResultScreen.tsx`
- `src/data/content.ts` (read to understand the current `questions` array and `Dimension` type)

### Background: what is Q9?

Q9 is question index 8 (0-based) in the `questions` array. It is tagged `NON_SCORED` (alongside indices 4 and 5), meaning it does not count toward the player's dominant dimension. Its prompt is: *"Which cost do you notice least in yourself?"* Its options are:
- A: `"Moving fast, then fixing avoidable mistakes"`
- B: `"Waiting until the best window quietly closes"`
- C: `"Over-planning until good ideas never start"`
- D: `"Keeping options open until nothing gets fully built"`

The player's Q9 answer text is the most powerful personalisation for Section 2 of the result screen, because it is the cost they admitted they cannot see in themselves. It needs to flow as a string from the game state to the result screen.

### Task

#### 2A — `src/hooks/useGameState.ts`

Add a new computed value `q9AnswerText` using the exact same pattern used for `q1AnswerText`, `q8AnswerText`, and `q10AnswerText`. Q9 is at `answers[8]` and its options are in `questions[8]`.

Add it to the `return` object of `useGameState` alongside the other answer text values.

Do NOT change anything else in this file.

#### 2B — `src/App.tsx`

In the `ResultScreen` JSX block (search for `gameState.stage === "result"`), add the new prop:

```tsx
q9AnswerText={gameState.q9AnswerText}
```

Add it alongside the existing `q1AnswerText`, `q8AnswerText`, and `q10AnswerText` props. Do NOT change anything else in this file.

#### 2C — `src/components/ResultScreen.tsx` — props interface only

Add `q9AnswerText: string` to the `ResultScreenProps` interface. Add it after `q8AnswerText`.

Also add `q9AnswerText` to the destructured props in the component function signature.

Do NOT modify any rendering logic, state, or JSX in this file. That is for Agent 3. Leave the rest of `ResultScreen.tsx` exactly as it is.

### Output

Produce the complete, final contents of all three files:
1. `src/hooks/useGameState.ts`
2. `src/App.tsx`
3. `src/components/ResultScreen.tsx`

Do not abbreviate or truncate any section. All three files must compile cleanly with no TypeScript errors.

---

## Agent 3 — Result Screen Visual Overhaul (`ResultScreen.tsx`, `index.css`)

### Context

You are working on a React + TypeScript mini-game. Previous agents have:
1. Updated `src/data/content.ts` — `ResultInterpretation` now has `pathWalked: [string, string, string]` and `weaknessNarrative: [string, string, string]`; `sliders` and `secondaryChips` have been removed; `reflectionLines` is now `[string, string]` (only 2 items).
2. Updated `src/hooks/useGameState.ts`, `src/App.tsx`, and `src/components/ResultScreen.tsx` — a new prop `q9AnswerText: string` is now available in `ResultScreen`.

Your job is to rewrite the rendering logic of `ResultScreen.tsx` and add new CSS to `src/index.css`.

### Files to read first

Read the full contents of ALL of these files before making any changes:
- `src/components/ResultScreen.tsx` (read the latest version — it now has `q9AnswerText` in props)
- `src/data/content.ts` (read to understand `pathWalked`, `weaknessNarrative`, and the updated `reflectionLines`)
- `src/index.css` (read to understand existing styles before adding new ones)

### Task

#### 3A — Remove from `ResultScreen.tsx`

1. Remove the `slidersVisible` state variable and its `useEffect`.
2. Remove the `useEffect` that sets `slidersVisible` based on `phase`.
3. In the component body, **Phase 3 only**: remove the following render blocks entirely:
   - Primary dominant-pattern chips (the `span` elements styled with gold border/background that show `item.chip`)
   - Secondary trait chips (the `span` elements styled with lighter gold border that show `resultData.secondaryChips`)
   - The entire sliders section (the `div` with `animate-fade-up delay-600` that maps over `resultData.sliders`)
4. In **Phase 2**: remove the `hidden-cost-pulse` div (the gold gradient box that renders `resultData.reflectionLines[2]`). The box currently has `className="hidden-cost-pulse"`. Remove the entire div. **Leave all other Phase 2 content untouched.**

#### 3B — Add Token Interpolation Helper

Add this helper function inside the component file (outside the component function, at module scope, before the component declaration):

```typescript
/**
 * Replaces {TOKEN} placeholders in a template string with provided values.
 * Used to inject player-specific data into narrative copy stored in content.ts.
 */
function interpolate(template: string, tokens: Record<string, string>): string {
  return Object.entries(tokens).reduce(
    (result, [key, value]) => result.replace(new RegExp(`\\{${key}\\}`, "g"), value),
    template
  );
}
```

#### 3C — Compute `weakestDimensions` in Phase 3

Before the return statement (or inside the component, before the JSX), add this computation. Use it only when rendering Phase 3:

```typescript
/** The minimum non-zero score across all dimensions, or 0 if all are zero. */
const minCount = Math.min(
  answerCounts.A,
  answerCounts.B,
  answerCounts.C,
  answerCounts.D
);

/**
 * All dimensions that share the lowest answer count.
 * There may be more than one if the player's answers are evenly spread.
 */
const weakestDimensions: Dimension[] = (["A", "B", "C", "D"] as Dimension[]).filter(
  (dimension) => answerCounts[dimension] === minCount
);
```

Place this computation at the top of the component body (alongside the existing `tieDimensionData`, `distributionOrder`, etc.), not inside the JSX.

#### 3D — Add Section 1 "The Path You Walked" in Phase 3

In Phase 3, after the distribution bars block and before Zone B (the closing copy), insert Section 1.

**Build the interpolation token map for `pathWalked`:**

```typescript
const pathWalkedTokens: Record<string, string> = {
  Q1: q1AnswerText,
  Q8: q8AnswerText,
  COST: playerCostText,
  COUNT: String(answerCounts[finalDimension])
};
```

**Section 1 JSX structure:**

```tsx
{/* ─ Section 1: The Path You Walked ─ */}
<div
  className="animate-fade-up delay-400"
  style={{
    borderTop: "1px solid rgba(204,153,56,0.2)",
    marginTop: "1.2rem",
    paddingTop: "1.6rem"
  }}
>
  <p
    style={{
      fontSize: "0.7rem",
      letterSpacing: "3px",
      textTransform: "uppercase",
      color: "var(--color-text-light)",
      marginBottom: "1.2rem"
    }}
  >
    The Path You Walked
  </p>

  {resultData.pathWalked.map((paragraph, index) => (
    <p
      key={index}
      style={{
        fontSize: "1rem",
        lineHeight: 1.8,
        color: "var(--color-text)",
        marginBottom: "1.2rem"
      }}
    >
      {interpolate(paragraph, pathWalkedTokens)}
    </p>
  ))}
</div>
```

#### 3E — Add Section 2 "The Pattern You Rarely Used" in Phase 3

Directly after Section 1, add Section 2. This uses the `weakestDimensions` array computed in step 3C.

**Build the interpolation token map for `weaknessNarrative`:**

```typescript
const weaknessTokens = (dimension: Dimension): Record<string, string> => ({
  Q9: q9AnswerText,
  COUNT: String(answerCounts[dimension])
});
```

**Section 2 JSX structure:**

```tsx
{/* ─ Section 2: The Pattern You Rarely Used ─ */}
<div
  className="animate-fade-up delay-600"
  style={{
    marginTop: "1.6rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  }}
>
  {weakestDimensions.map((weakDimension) => {
    const weakData = resultInterpretations[weakDimension];
    return (
      <div key={weakDimension} className="warning-box">
        <p className="warning-label">⚠ Blind Spot</p>
        <p
          style={{
            fontSize: "0.7rem",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "var(--color-text-light)",
            marginBottom: "1.2rem"
          }}
        >
          The Pattern You Rarely Used
        </p>
        {weakData.weaknessNarrative.map((paragraph, index) => (
          <p
            key={index}
            style={{
              fontSize: "1rem",
              lineHeight: 1.8,
              color: "var(--color-text)",
              marginBottom: index < 2 ? "1.2rem" : 0
            }}
          >
            {interpolate(paragraph, weaknessTokens(weakDimension))}
          </p>
        ))}
      </div>
    );
  })}
</div>
```

#### 3F — CSS additions in `src/index.css`

**Remove these CSS blocks** (search for them and delete):
- `.slider-track` and all its child selectors
- Any CSS block whose selector contains `slider`

**Add these new CSS blocks** at the end of `src/index.css`, before any final closing rules:

```css
/* ── Warning box — Section 2 "The Pattern You Rarely Used" ── */
.warning-box {
  background: rgba(180, 50, 30, 0.06);
  border: 1px solid rgba(180, 50, 30, 0.3);
  border-radius: 16px;
  padding: 1.4rem 1.2rem;
}

.warning-label {
  font-size: 0.7rem;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: rgba(180, 50, 30, 0.85);
  margin-bottom: 0.8rem;
  font-family: 'Cormorant Garamond', serif;
}
```

### Important Rules

- **Do not rename or reorder any existing props.** Only add the `q9AnswerText` usages.
- **Do not touch Phase 1 or Phase 2** beyond removing the `hidden-cost-pulse` gold box from Phase 2.
- **Do not remove Zone B or Zone C** (the closing copy and sign-off at the bottom of Phase 3).
- **Do not remove the distribution bars** at the top of Phase 3.
- **Do not remove the `slidersVisible` useEffect** that already existed for phase tracking — wait, actually, do remove it. See step 3A.
- **The `chip` field is still used** in the distribution bars and Phase 1 chip display. Do not remove those references.
- After removing `sliders` and `secondaryChips` from content.ts (done by Agent 1), any TypeScript references to `resultData.sliders` or `resultData.secondaryChips` in the component will be compile errors. Remove those references.

### Output

Produce the complete, final contents of both files:
1. `src/components/ResultScreen.tsx`
2. `src/index.css`

Do not abbreviate or truncate any section. Both files must compile cleanly with no TypeScript errors or linter errors.
