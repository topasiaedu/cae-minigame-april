# Agent Implementation Prompts — Improvement Plan V3

Four self-contained prompts. Batches 1 and 2 can run in parallel (no shared files). Batch 3 runs after both. Batch 4 runs last.

---

## BATCH 1 — Surgical Fixes & Result Cleanup

```
You are implementing targeted fixes and cleanup to a React + TypeScript web app called "Predictable Destiny."

PROJECT OVERVIEW
A psychological minigame for live webinars. Players answer 10 questions across 3 stages (3 + 3 + 4). Their answers reveal one of 4 behavioural dimensions: A (Early Movement), B (Seeking Clarity), C (Calculated Risk), D (Preserving Options). The result page is a 4-phase staged reveal: Phase 1 shows the player's name, Phase 2 shows a mirror sentence + the player's own quoted answers, Phase 3 shows a benefit line + a "hidden cost" gold box, and Phase 4 shows a closing quote + question + the player's name with a breathing animation. Below Phase 4 there is currently an expandable detail section containing behavioural chips and spectrum sliders.

CORE DESIGN PRINCIPLE — MIRROR OVER LABEL
The app must never label who the player IS. It must show their behaviour and let them recognise themselves. Chips like "Early Movement" and spectrum sliders are personality-test-style outputs that sort rather than mirror. They contradict the phased reveal design.

CODING RULES — FOLLOW STRICTLY
- TypeScript strict mode. No `any` type. No non-null assertion (`!`). No `as unknown as T` casts.
- Use double quotes for all strings.
- Use template literals or .join() instead of string concatenation with +.
- Write clear JSDoc comments on functions and interfaces.
- Include clear inline comments describing each step.
- No placeholder comments — write complete code.
- Implement error checking and type validation.
- Do not change any file not listed in the CHANGES section below.

FILES TO READ BEFORE STARTING
1. src/components/StageIntroScreen.tsx — read the full component. Find the line that says "five questions."
2. src/components/ResultScreen.tsx — read the full component. Understand Phase 3 (hidden cost box) and Phase 4 (closing section, expandable detail).
3. src/index.css — read the full file. Understand the existing animation keyframes.

CHANGES TO MAKE

--- FILE: src/components/StageIntroScreen.tsx ---

Change 1: Fix the incorrect question count.
Find the line: "The next five questions are not about what might happen."
Stage III has 4 questions (Q7–Q10), not 5. This is a copy bug from the 15→10 restructure.
Change to: "The next questions are not about what might happen."
(Removing the specific count avoids the problem entirely and reads more naturally.)

--- FILE: src/components/ResultScreen.tsx ---

Change 2: Remove "The speaker will return shortly." from Phase 4.
In the Phase 4 closing section, find the <p> element that contains "The speaker will return shortly." and remove the entire element. The game should end on the emotional question "What has it cost you?" followed by the player's breathing name — not an operational announcement. The speaker's return should feel like a surprise, not an expectation.

Change 3: Remove the entire expandable detail section from Phase 4.
In the Phase 4 section, find the block that starts with a borderTop divider and contains:
  - The "See your detailed pattern" / "Hide detail" toggle button
  - The chips grid (resultData.chip and resultData.secondaryChips)
  - The sliders section (resultData.sliders with getModulatedSliderValue)
Remove this entire block, including the outer <div> with the borderTop style.
Also remove the `showDetail` state variable and its setter (useState) since it is no longer used.
Also remove the `getModulatedSliderValue` function since it is no longer used.
Keep the "CAE GOH" watermark div that sits below the expandable — move it to sit below the closing question block instead.

Change 4: Add a single gentle pulse animation to the hidden cost box in Phase 3.
The hidden cost box (the gold-bordered div containing resultData.reflectionLines[2]) is the emotional payload of the entire game. Add a single-fire scale pulse that draws attention after the box has faded in.

On the hidden cost box <div> in Phase 3, add a new className "hidden-cost-pulse" alongside the existing "animate-fade-up delay-400" class.

--- FILE: src/index.css ---

Change 5: Add the gentlePulse keyframe and the hidden-cost-pulse class.
Add at the end of the file (before any closing comments):

  @keyframes gentlePulse {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.018); }
    100% { transform: scale(1); }
  }

  .hidden-cost-pulse {
    animation: gentlePulse 0.8s ease 2s 1 both;
  }

The animation fires once, 2 seconds after the element mounts (allowing the animate-fade-up delay-400 to complete first). The scale change is intentionally tiny (1.018) — a felt emphasis, not a bounce.

WHAT NOT TO CHANGE
- Do not change Phases 1, 2, or the closing question/breathing name in Phase 4.
- Do not change the result-curtain div.
- Do not change the RevealWords component.
- Do not change App.tsx, useGameState.ts, content.ts, or any other component.
- Do not change any other CSS classes or keyframes.
```

---

## BATCH 2 — Reversal Scoring & Visual Distinction

```
You are fixing a scoring flaw and adding visual distinction to reversal questions in a React + TypeScript web app called "Predictable Destiny."

PROJECT OVERVIEW
A psychological minigame for live webinars. Players answer 10 questions. 3 of them (Q3, Q6, Q9) are "reversal" questions — instead of asking "what would you do?", they ask "which of these is most unlike you?" or "which cost do you notice least?" The player picks the option they REJECT. However, the scoring system currently records the selected dimension as a positive match. This means a player who consistently rejects Dimension A may receive an A result. This is a correctness flaw that damages credibility.

The fix: exclude reversal question answers from the dominant dimension computation entirely. Reversal questions serve as psychological pattern-breaks, not scoring inputs. The 7 remaining standard answers provide sufficient signal.

CODING RULES — FOLLOW STRICTLY
- TypeScript strict mode. No `any` type. No non-null assertion (`!`). No `as unknown as T` casts.
- Use double quotes for all strings.
- Use template literals or .join() instead of string concatenation with +.
- Write clear JSDoc comments on functions and interfaces.
- Include clear inline comments describing each step.
- No placeholder comments — write complete code.
- Implement error checking and type validation.
- Do not change any file not listed in the CHANGES section below.

FILES TO READ BEFORE STARTING
1. src/data/content.ts — read the Question interface and the questions array. Identify Q3 (id:3, index 2), Q6 (id:6, index 5), and Q9 (id:9, index 8). Note that their context text contains "almost never" or "least" phrasing.
2. src/hooks/useGameState.ts — read the entire file. Key areas:
   - computeDominantDimension function (how it counts answers)
   - finalDominantDimension / finalDominantCount / finalResultIsTied computation
   - The answers array and how it accumulates
3. src/components/QuestionScreen.tsx — read the entire file. Key areas:
   - How the question object is used in the template
   - Where the options grid is rendered (the section between the question text and the echo block)

CHANGES TO MAKE

--- FILE: src/data/content.ts ---

Change 1: Add the isReversal flag to the Question interface.
Add an optional boolean field:
  export interface Question {
    id: number;
    setup: string;
    context: string;
    options: Option[];
    /** When true, this question asks the player to pick the option LEAST like them.
     *  Reversal answers are excluded from the dominant dimension scoring. */
    isReversal?: boolean;
  }

Change 2: Mark the three reversal questions.
Add isReversal: true to the question objects with id 3, id 6, and id 9.
Do NOT change any question text, options, or ordering. Only add the flag.

--- FILE: src/hooks/useGameState.ts ---

Change 3: Define the set of reversal question indices.
At the top of the useGameState function (or as a module-level constant), add:
  /** Indices of reversal questions whose answers are excluded from dominant
   *  dimension scoring. These questions ask "least like you" — recording
   *  the selected dimension as a positive match would invert the signal. */
  const REVERSAL_INDICES: ReadonlySet<number> = new Set([2, 5, 8]);

Change 4: Update computeDominantDimension to skip reversal answers.
In the forEach loop that counts dimension occurrences, add a guard:
  subset.forEach((ans, localIdx) => {
    const globalIdx = startIndex + localIdx;
    if (!REVERSAL_INDICES.has(globalIdx)) {
      counts[ans]++;
    }
  });
The rest of the function (tie-breaking logic) remains unchanged. It will now operate on the filtered counts.

Change 5: Update the finalDominantDimension computation.
The useMemo that computes the final result also has its own counting loop (separate from computeDominantDimension). Apply the same REVERSAL_INDICES guard there:
  answers.forEach((ans, idx) => {
    if (!REVERSAL_INDICES.has(idx)) {
      counts[ans]++;
    }
  });

IMPORTANT: The reversal answers must remain in the answers array. They are used by:
  - The echo comparison (Q7 vs Q1, Q8 vs Q2, Q9 vs Q3) — which compares raw answers
  - The q10AnswerText, q1AnswerText, q7AnswerText computations — which use specific indices
Do NOT filter the answers array itself. Only filter within the counting logic.

--- FILE: src/components/QuestionScreen.tsx ---

Change 6: Add a visual cue for reversal questions.
Import the Question type if not already imported (it should already be available via the question prop).

Between the question text <div> and the options grid, add a conditional label that appears only for reversal questions:

  {question.isReversal === true && (
    <p
      className="animate-fade-up delay-400"
      style={{
        fontSize: "0.85rem",
        fontStyle: "italic",
        color: "var(--color-gold-dark)",
        textAlign: "center",
        marginBottom: "0.75rem",
        opacity: 0
      }}
    >
      Choose the one least like you
    </p>
  )}

This reinforces the reversal framing visually. The question text already says it, but the visual sameness of all questions means players may not notice the inversion.

WHAT NOT TO CHANGE
- Do not change any question text, setup, context, or options.
- Do not change the echo comparison logic (it should still compare raw answers).
- Do not change the q10AnswerText, q1AnswerText, or q7AnswerText computations.
- Do not change the option card rendering, styling, or shuffle logic.
- Do not change App.tsx, ResultScreen.tsx, ReflectionScreen.tsx, or any other component.
- Do not change index.css.
```

---

## BATCH 3 — Reflection UX & Haptic Feedback

```
You are improving the reflection screen experience and adding physical feedback to Stage III in a React + TypeScript web app called "Predictable Destiny."

PROJECT OVERVIEW
A psychological minigame for live webinars. After every stage of questions (Q1–Q3, Q4–Q6), a reflection screen fires showing personalized text based on the player's dominant behavioural dimension from those 3 answers. The reflection screens have a 5-second delay before a Continue button appears — this forces players to read the text. The problem: there is no visual cue that the button will appear. Players think the screen is broken.

Additionally, the reflection screens show personalized text but never explicitly tell the player "you showed a pattern." The player receives the observation without context. Adding a single observational line — "Two of your last three answers leaned the same way." — makes the mirror visible without naming what the pattern is.

Stage III (Q7–Q10) is the self-confrontation stage. It currently looks and feels identical to Stages I and II at the interaction level. Adding a brief haptic vibration on card selection signals physically that something has changed.

CODING RULES — FOLLOW STRICTLY
- TypeScript strict mode. No `any` type. No non-null assertion (`!`). No `as unknown as T` casts.
- Use double quotes for all strings.
- Use template literals or .join() instead of string concatenation with +.
- Write clear JSDoc comments on functions and interfaces.
- Include clear inline comments describing each step.
- No placeholder comments — write complete code.
- Implement error checking and type validation.
- Do not change any file not listed in the CHANGES section below.

FILES TO READ BEFORE STARTING
1. src/components/ReflectionScreen.tsx — read the full component. Note:
   - The showButton state and 5-second useEffect timer
   - The static gold divider div (40px wide, 1px tall, gold-mid color)
   - The existing props interface
2. src/components/QuestionScreen.tsx — read the full component. Note:
   - The handleSelect function
   - The stage computation (stage === 3 for indices >= 6)
3. src/App.tsx — read how ReflectionScreen is rendered (around line 110–123). Note:
   - The dominantDimension computation passed as a prop
   - The answer slice used (questionIndex - 3 to questionIndex)
4. src/index.css — read the existing animation keyframes.

CHANGES TO MAKE

--- FILE: src/index.css ---

Change 1: Add the goldLineExtend keyframe and the reflection-timer-line class.
Add at the end of the file:

  @keyframes goldLineExtend {
    0%   { width: 0;    opacity: 0; }
    8%   { opacity: 1; }
    100% { width: 60px; opacity: 1; }
  }

  .reflection-timer-line {
    height: 1px;
    background: var(--color-gold-mid);
    margin: 2.5rem auto 0;
    width: 0;
    opacity: 0;
    animation: goldLineExtend 5s ease-out forwards;
  }

The 5-second duration matches the button delay timer. The line starts invisible (opacity 0) to avoid a flash during screen transition, fades in quickly, then extends from 0 to 60px. When the line reaches full width, the Continue button appears — the visual and the timer are synchronised.

--- FILE: src/components/ReflectionScreen.tsx ---

Change 2: Add dominantCount to the props interface.
  interface ReflectionScreenProps {
    triggerBlock: number;
    dominantDimension: Dimension;
    /** How many of the last 3 answers matched the dominant dimension (1–3) */
    dominantCount: number;
    onProceed: () => void;
    isTransitioning: boolean;
    onBack: () => void;
    name: string;
  }

Destructure dominantCount in the component function parameters.

Change 3: Replace the static gold divider with the animated timer line.
Find the current static gold divider element — it looks like this:
  <div
    className="animate-fade-up delay-600"
    style={{
      width: "40px",
      height: "1px",
      background: "var(--color-gold-mid)",
      margin: "2.5rem auto 0"
    }}
  />

Replace it with:
  <div className="reflection-timer-line" />

Remove the animate-fade-up and delay-600 classes — the timer line has its own animation.

Change 4: Add the pattern observation line.
Below the reflection text <p> and ABOVE the timer line, insert a conditional block that shows only when dominantCount >= 2:

  {dominantCount >= 2 && (
    <p
      className="animate-fade-up delay-600"
      style={{
        fontSize: "1rem",
        color: "var(--color-text-light)",
        fontStyle: "italic",
        marginTop: "1.5rem",
        textAlign: "center",
        opacity: 0
      }}
    >
      {dominantCount === 3
        ? "Each of your last three answers pointed in the same direction."
        : "Two of your last three answers leaned the same way."}
    </p>
  )}

This makes the mirror explicit without naming the pattern. "Leaned the same way" is observational — the player fills in the meaning. When dominantCount === 1 (all 3 answers were different dimensions — no clear pattern), the line is not shown. The absence is itself meaningful.

--- FILE: src/App.tsx ---

Change 5: Compute dominantCount and pass it to ReflectionScreen.
In the ReflectionScreen render block, the dominantDimension is already computed inline:
  dominantDimension={gameState.computeDominantDimension(
    gameState.questionIndex - 3,
    gameState.questionIndex
  )}

Add a dominantCount computation. The cleanest approach: compute it inline or add a local variable above the return statement. Here is the inline approach — add this prop to the ReflectionScreen render:

Before the return statement, compute:
  const reflectionSlice = gameState.answers.slice(
    gameState.questionIndex - 3,
    gameState.questionIndex
  );
  const reflectionDominant = gameState.computeDominantDimension(
    gameState.questionIndex - 3,
    gameState.questionIndex
  );
  const reflectionDominantCount = reflectionSlice.filter(
    (a) => a === reflectionDominant
  ).length;

IMPORTANT: This computation must only run when stage === "reflection". Wrap it in a conditional or place it inside a useMemo gated by stage === "reflection". The simplest approach: compute it inside the render conditional. Since the ReflectionScreen render block is already inside {gameState.stage === "reflection" && (...)}, you can safely compute the values there.

However, since JSX expressions do not allow const declarations, the cleanest pattern is to declare the variables before the return:

  // Reflection-specific computations (only meaningful when stage is "reflection")
  const reflectionSlice = gameState.stage === "reflection"
    ? gameState.answers.slice(gameState.questionIndex - 3, gameState.questionIndex)
    : [];
  const reflectionDominant = gameState.stage === "reflection"
    ? gameState.computeDominantDimension(gameState.questionIndex - 3, gameState.questionIndex)
    : "A" as Dimension;
  const reflectionDominantCount = reflectionSlice.filter(
    (a) => a === reflectionDominant
  ).length;

Then in the ReflectionScreen render:
  dominantDimension={reflectionDominant}
  dominantCount={reflectionDominantCount}

NOTE: The "A" as Dimension fallback will never be used since ReflectionScreen only renders when stage === "reflection". But the TypeScript compiler needs a valid Dimension value for the non-reflection code path.

--- FILE: src/components/QuestionScreen.tsx ---

Change 6: Add haptic feedback on Stage III card selections.
In the handleSelect function, add a vibration pulse before the setTimeout:

  const handleSelect = (dim: Dimension): void => {
    if (selected !== null || isTransitioning) return;
    setSelected(dim);

    // Haptic pulse on Stage III selections — the sudden physical feedback
    // signals the stage shift in a way no visual can. Stage I and II are
    // silent; the absence-to-presence of vibration is the signal.
    if (questionIndex >= 6 && typeof navigator.vibrate === "function") {
      navigator.vibrate(30);
    }

    const advanceDelay = questionIndex >= 6 ? 1600 : 850;
    setTimeout(() => onAnswer(dim), advanceDelay);
  };

The check `typeof navigator.vibrate === "function"` prevents errors on browsers/devices that don't support the Vibration API (Safari, some desktop browsers). If vibration is unavailable, the game continues without it.

WHAT NOT TO CHANGE
- Do not change the 5-second button delay timer (the timer itself stays at 5000ms in the useEffect).
- Do not change the character-by-character reveal on Reflection 2.
- Do not change the reflection text content (dynamicTriggers).
- Do not change the Roman numeral watermark.
- Do not change the echo comparison logic in QuestionScreen.
- Do not change ResultScreen, LoginScreen, StageIntroScreen, SurpriseScreen, or content.ts.
- Do not change useGameState.ts.
```

---

## BATCH 4 — BreatheScreen & Game Flow

```
You are adding a new transitional screen to the game flow of a React + TypeScript web app called "Predictable Destiny."

PROJECT OVERVIEW
A psychological minigame for live webinars. The current flow after Stage II is:
  Reflection 2 → Surprise Screen (4s auto-advance) → Stage III Intro → Q7–Q10

The Surprise Screen says "You've been making the same choice. Have you noticed?" and auto-advances after 4 seconds. The Stage III Intro says "This section is different." and has a manual "I'm ready" button.

The problem: two intense psychological moments fire back-to-back with no breathing room. The Surprise Screen confronts the player, then the Stage III Intro immediately escalates. The player has no moment to settle.

The fix: insert a "BreatheScreen" between the Surprise Screen and the Stage III Intro. It shows "Take a breath." centered on screen, with a Continue button that appears after 3 seconds. Unlike the Surprise Screen (which auto-advances and has no back button), the BreatheScreen restores agency — the player chooses when to proceed.

New flow:
  Reflection 2 → Surprise Screen (4s auto) → BreatheScreen (button after 3s) → Stage III Intro → Q7–Q10

CODING RULES — FOLLOW STRICTLY
- TypeScript strict mode. No `any` type. No non-null assertion (`!`). No `as unknown as T` casts.
- Use double quotes for all strings.
- Use template literals or .join() instead of string concatenation with +.
- Write clear JSDoc comments on all new functions, components, and interfaces.
- Include clear inline comments describing each step.
- No placeholder comments — write complete code.
- Implement error checking and type validation.
- Do not change any file not listed in the CHANGES section below.

FILES TO READ BEFORE STARTING
1. src/hooks/useGameState.ts — read the full file. Key areas:
   - The GameStage union type
   - The proceedFromSurprise function
   - The goBack function (the stage === "stageIntro" and stage === "surprise" cases)
   - The returned state object
2. src/App.tsx — read the full file. Note:
   - How the Surprise Screen and Stage III Intro are rendered and wired
   - The import block at the top
3. src/components/SurpriseScreen.tsx — read as a structural reference. The BreatheScreen is similar (glass container, centered text, transition classes) but has a Continue button instead of auto-advance, and has no sound.
4. src/components/ReflectionScreen.tsx — read the delayed button pattern (showButton state + 5-second useEffect timer). The BreatheScreen uses a similar pattern with a 3-second delay.

CHANGES TO MAKE

--- NEW FILE: src/components/BreatheScreen.tsx ---

Create this component from scratch. Full specification:

Props interface:
  interface BreatheScreenProps {
    onProceed: () => void;
    isTransitioning: boolean;
  }

Component behaviour:
  - Uses the glass-container class with screen-enter / screen-exit transition pattern (same as all other screens).
  - No back button. No header. No stage label. No progress bar.
  - Content is vertically and horizontally centred.
  - Primary text: "Take a breath." at 1.8rem, fontWeight 400, color var(--color-text), textAlign center. Apply animate-fade-up delay-400.
  - A Continue button that appears 3 seconds after mount (when not transitioning). Use a useState boolean (showButton) and a useEffect with setTimeout(3000), following the same pattern as ReflectionScreen's delayed button.
  - The Continue button uses className="btn-primary" and calls onProceed on click. Wrap it in an animate-fade-up div.
  - No auto-advance — the player must tap the button.
  - Named export: BreatheScreen

--- FILE: src/hooks/useGameState.ts ---

Change 1: Add "breathe" to the GameStage union type.
  export type GameStage = "login" | "question" | "reflection" | "surprise" | "breathe" | "stageIntro" | "result";

Change 2: Update proceedFromSurprise to route to "breathe" instead of "stageIntro".
  Current: handleTransition("stageIntro");
  New:     handleTransition("breathe");

Change 3: Add the proceedFromBreathe handler.
  /** Proceed from the Breathe screen → show Stage III intro */
  const proceedFromBreathe = (): void => {
    handleTransition("stageIntro");
  };

Expose proceedFromBreathe in the returned state object.

Change 4: Update back navigation.
In the goBack function:

  a) Change the stageIntro case to go to "breathe" instead of "surprise":
     Current: } else if (stage === "stageIntro") { setStage("surprise"); }
     New:     } else if (stage === "stageIntro") { setStage("breathe"); }

  b) Add a new case for the breathe stage:
     } else if (stage === "breathe") {
       setStage("surprise");
     }

Place this case BEFORE the surprise case in the if/else chain to maintain correct ordering.

--- FILE: src/App.tsx ---

Change 5: Import the BreatheScreen component.
Add to the import block at the top:
  import { BreatheScreen } from "./components/BreatheScreen";

Change 6: Add the BreatheScreen render block.
Between the Surprise Screen block and the Stage III Intro block, add:

  {/* Breathe Screen (shown once, between Surprise and Stage III Intro) */}
  {gameState.stage === "breathe" && (
    <BreatheScreen
      onProceed={gameState.proceedFromBreathe}
      isTransitioning={gameState.isTransitioning}
    />
  )}

WHAT NOT TO CHANGE
- Do not change the Surprise Screen component, its auto-advance timer, or its sound logic.
- Do not change the Stage III Intro component.
- Do not change any question content, reflection triggers, or result content.
- Do not change the scoring logic.
- Do not change ResultScreen, QuestionScreen, ReflectionScreen, or LoginScreen.
- Do not change index.css (the BreatheScreen uses only existing CSS classes).
```

---

## Running Order Reference

| Batch | Description | Files Changed | Run After | Can Parallel With |
|-------|-------------|---------------|-----------|-------------------|
| 1 | Surgical fixes & result cleanup | `StageIntroScreen.tsx`, `ResultScreen.tsx`, `index.css` | — (first) | Batch 2 |
| 2 | Reversal scoring & visual distinction | `content.ts`, `useGameState.ts`, `QuestionScreen.tsx` | — (first) | Batch 1 |
| 3 | Reflection UX & haptic feedback | `ReflectionScreen.tsx`, `QuestionScreen.tsx`, `App.tsx`, `index.css` | Batches 1 and 2 | — |
| 4 | BreatheScreen & game flow | `BreatheScreen.tsx` (new), `useGameState.ts`, `App.tsx` | Batch 3 | — |
