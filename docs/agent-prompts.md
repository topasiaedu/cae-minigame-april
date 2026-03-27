# Agent Implementation Prompts — Predictable Destiny

Six self-contained prompts. Each can be copy-pasted directly into a new agent session.
Run Batches 1–4 in any order (or in parallel sessions). Run Batch 5 first, then Batch 6.

---

## BATCH 1 — Copy & Language Fixes

```
You are implementing specific copy and language fixes to a React + TypeScript web app called "Predictable Destiny."

PROJECT OVERVIEW
This is a psychological minigame used during live webinars. Players answer 15 questions across 3 stages. Their answers reveal one of 4 behavioral dimensions: A (Early Movement), B (Seeking Clarity), C (Calculated Risk), D (Preserving Options). After every 5 questions, a personalized reflection screen fires. The final screen shows a result profile. The speaker returns after players finish and closes the psychological "open loop." The app is built with Vite + React + TypeScript + vanilla CSS. All game content lives in src/data/content.ts.

CORE DESIGN PRINCIPLE — MIRROR OVER LABEL
The app must never label who the player IS. It must show their behavior and let them recognise themselves. "You start before everything is clear." = good (mirror). "You are impulsive." = bad (label). Every piece of copy must pass this test.

CODING RULES — FOLLOW STRICTLY
- TypeScript strict mode. No `any` type. No non-null assertion (`!`). No `as unknown as T` casts.
- Use double quotes for all strings.
- Use template literals or .join() instead of string concatenation with +.
- Write clear JSDoc comments on functions and interfaces.
- No placeholder comments like "// TODO" — write complete code.
- Do not change any file not listed in the CHANGES section below.

FILES TO READ BEFORE STARTING
1. src/data/content.ts — all questions, reflection triggers, result interpretations
2. src/components/LoginScreen.tsx — the entry screen
3. docs/copywriting-guide.md — the tone and copy principles for this project

CHANGES TO MAKE

--- FILE: src/data/content.ts ---

Change 1: Rewrite ALL FOUR Stage 2 (dynamicTriggers.stage2) reflection triggers.
The current versions name the decision style explicitly, which violates "Mirror over Label."
The new versions must describe the pattern of the habit over time without naming what the style IS.
They should follow the 3-sentence reflection trigger structure: (1) name the behavior obliquely, (2) describe how it plays out over time, (3) end with a question, not a statement.
Current versions for reference:
  A: "Many realize later that their familiar way of deciding — like leaping before looking — wasn't just a style. It was a hidden habit."
  B: "Many realize later that their familiar way of deciding — like constantly waiting for a better view — wasn't just cautious. It was a hidden habit."
  C: "Many realize later that their familiar way of deciding — like endlessly trusting the math — wasn't just rational. It was a hidden habit."
  D: "Many realize later that their familiar way of deciding — like keeping an exit nearby at all times — wasn't just flexible. It was a hidden habit."
Replace all four with versions that mirror without labeling. Keep them at 8th-grade reading level. Maximum 3 sentences each. End each with a question.

Change 2: Fix result chips for Dimension B and Dimension C.
In resultInterpretations.B.secondaryChips, remove "Risk averse" — this is a personality label. Replace it with a behavioral phrase that describes what the player DOES, not who they ARE (e.g., "Waits for the picture" or "Holds for more signal").
In resultInterpretations.C.secondaryChips, remove "Analytical" — same problem. Replace it with a behavioral phrase (e.g., "Counts before moving" or "Maps the risk first").
Keep all other chips unchanged.

Change 3: Fix Q4 context ending.
Current: "How do you make the call?"
Every other question context ends with "You usually:" or "You decide to:" — Q4 must match this pattern.
Rewrite the Q4 context ending to use consistent phrasing. The full context currently reads: "This direction may bring great rewards, but it requires significant time and resources with no obvious short-term return. How do you make the call?" — rewrite the final clause to end with "You usually:" or equivalent.

Change 4: Fix Q10 setup sentence.
The content system rule says the setup must "set the scene" — it should be a complete, bold declarative sentence.
Current Q10 setup: "When you look back at chances you didn't take,"
This is a subordinate clause — it cannot stand alone as a scene.
Rewrite it as a complete sentence that sets a scene, then adjust the context clause to follow naturally.

--- FILE: src/components/LoginScreen.tsx ---

Change 5: Rewrite the login screen closing italic line.
Current: "There are no right answers — only your natural habits. Let's look in the mirror."
"Let's look in the mirror." is too casual and implies the app is accompanying the player. The tone should feel like a quiet, empty room — not a guide. Rewrite the closing italic line to be more austere. It should not use "Let's" or any first-person plural. It should feel like a statement about what is about to happen, not an invitation. Keep it one short sentence.

Change 6: Add a one-line disclosure below the email input field.
Add a small-text line underneath the email input group that reads something like: "So Cae can follow up with you after the session." Style it at 0.8rem, color var(--color-text-light), opacity 0.7, text-align center. This removes the friction caused by collecting an email with no stated purpose.

Change 7: Remove the "CAE GOH" watermark from the bottom of LoginScreen.tsx.
The current LoginScreen renders a small "CAE GOH" text at the bottom (opacity 0.35, fontSize 0.8rem, letterSpacing 2px). Remove this entire div. The watermark already appears on the ResultScreen where it functions as an author credit — it does not belong on the login screen where it means nothing to a player who received a link without context.

WHAT NOT TO CHANGE
- Do not modify any questions other than Q4 and Q10.
- Do not modify Stage 1 or Stage 3 reflection triggers.
- Do not modify any result interpretation content other than the specific chips listed above.
- Do not change any component other than LoginScreen.tsx.
- Do not change any CSS files.
- Do not modify the scoring logic or game state.
```

---

## BATCH 2 — Scoring Logic & Slider Personalization

```
You are implementing scoring and result personalization fixes to a React + TypeScript web app called "Predictable Destiny."

PROJECT OVERVIEW
This is a psychological minigame for live webinars. Players answer 15 questions. Each answer maps to one of 4 behavioral dimensions: A (Early Movement), B (Seeking Clarity), C (Calculated Risk), D (Preserving Options). The dimension with the highest count across all 15 answers determines the final result. The app is Vite + React + TypeScript + vanilla CSS. State lives in src/hooks/useGameState.ts. The result profile data (including slider values) lives in src/data/content.ts. The result display is in src/components/ResultScreen.tsx.

CODING RULES — FOLLOW STRICTLY
- TypeScript strict mode. No `any` type. No non-null assertion (`!`). No `as unknown as T` casts.
- Use double quotes for all strings.
- Use template literals or .join() instead of string concatenation with +.
- Write clear JSDoc comments on functions and interfaces.
- No placeholder comments — write complete code.
- Do not change any file not listed in the CHANGES section below.

FILES TO READ BEFORE STARTING
1. src/hooks/useGameState.ts — the full state machine
2. src/data/content.ts — specifically the resultInterpretations structure and slider value fields
3. src/components/ResultScreen.tsx — how sliders are currently rendered
4. src/App.tsx — how state is passed to components

CHANGES TO MAKE

--- FILE: src/hooks/useGameState.ts ---

Change 1: Fix the tie-breaking logic in computeDominantDimension.
Current behavior: when two or more dimensions are tied for highest count, the function returns whichever dimension was encountered first during object iteration — which in practice always defaults to A.
New behavior:
  Step 1: Find all dimensions that share the maximum count.
  Step 2: If only one dimension has the max count, return it (no change from current behavior).
  Step 3: If two or more are tied, find the dimension with the longest consecutive streak at the END of the answers slice (i.e., scan from the last answer backwards and count the most recent unbroken run for each tied dimension). Return the tied dimension with the longest recent streak.
  Step 4: If the streak check is also tied, return the tied dimension that appeared most recently (i.e., whichever tied dimension has the highest index in the answers slice).
  This logic must be deterministic — no random selection.

Change 2: Track dominant dimension count.
After computing the final dominant dimension for the result screen, also compute and store the count of how many of the 15 answers matched that dimension. Call this value `finalDominantCount`. Add it to the state object as `finalDominantCount: number`, initialized to 0.
Update the computation that sets `finalDominantDimension` to also set `finalDominantCount` at the same time.

Change 3: Track whether the final result was a tie.
Add a boolean state variable `finalResultIsTied: boolean`, initialized to false.
When computing the final result, set `finalResultIsTied` to true if two or more dimensions share the maximum count (before the tiebreaker resolves it). Expose this in the returned state object.

Change 4: Expose finalDominantCount and finalResultIsTied in the hook's return value.
These must be accessible from App.tsx.

--- FILE: src/App.tsx ---

Change 5: Pass finalDominantCount and finalResultIsTied to ResultScreen.
Locate the ResultScreen render call. Add two new props: `dominantCount={gameState.finalDominantCount}` and `isTied={gameState.finalResultIsTied}`.

--- FILE: src/components/ResultScreen.tsx ---

Change 6: Accept the two new props.
Add `dominantCount: number` and `isTied: boolean` to the ResultScreenProps interface.

Change 7: If isTied is true, show a subtitle line below the result header name.
In the Section 0 identity header block (currently shows the player's name and a subtitle "A familiar way you tend to respond when things are still unfolding"), add a conditional element below the subtitle:
  If isTied is true, show: "Your pattern was closely divided between two tendencies."
  Style it at 0.95rem, color var(--color-text-light), fontStyle italic, marginTop 0.5rem.
  If isTied is false, render nothing.

Change 8: Modulate slider values based on dominantCount.
The current sliders use static preset values from content.ts (e.g., Dimension A slider 1 = value 22, Dimension B slider 1 = value 80). These are the same for every player in that dimension regardless of how strongly they scored.
Apply a strength modifier when rendering each slider dot's left position:

  Define a helper function inside ResultScreen called getModulatedSliderValue that takes (baseValue: number, count: number): number:
  - If count >= 10: return baseValue unchanged (strong dominance — preserve the full lean)
  - If count >= 7: move the value 20% toward 50 (moderate dominance)
    Formula: baseValue + (50 - baseValue) * 0.20
  - If count >= 5 (minimum possible dominance out of 15): move 35% toward 50
    Formula: baseValue + (50 - baseValue) * 0.35
  - Round the result to one decimal place.
  - Clamp the result between 2 and 98 (safety bound for the slider dot CSS positioning).

  Use getModulatedSliderValue(slider.value, dominantCount) in place of the raw slider.value when setting the slider dot's left CSS position. The base value in content.ts must NOT be mutated — only the rendered position changes.

WHAT NOT TO CHANGE
- Do not modify question content, reflection trigger content, or result copy.
- Do not change any CSS.
- Do not change the progress bar or question navigation logic.
- Do not change ReflectionScreen, QuestionScreen, LoginScreen, or StageIntroScreen.
```

---

## BATCH 3 — Accessibility & UX Polish

```
You are implementing accessibility improvements and UX polish fixes to a React + TypeScript web app called "Predictable Destiny."

PROJECT OVERVIEW
A psychological minigame for live webinars. Players answer 15 questions across 3 stages. The app is Vite + React + TypeScript + vanilla CSS. Target audience: business owners and senior decision-makers aged 40–65, many of whom are non-native English speakers. This audience is the primary reason accessibility improvements matter — they read carefully, may use keyboard navigation, and need adequate visual contrast.

CODING RULES — FOLLOW STRICTLY
- TypeScript strict mode. No `any` type. No non-null assertion (`!`). No `as unknown as T` casts.
- Use double quotes for all strings.
- Use template literals or .join() instead of string concatenation with +.
- Write clear JSDoc comments on functions and interfaces.
- No placeholder comments — write complete code.
- Do not change any file not listed in the CHANGES section below.

FILES TO READ BEFORE STARTING
1. src/components/LoginScreen.tsx — the entry screen with the form
2. src/index.css — all global CSS, animations, variables
3. src/components/QuestionScreen.tsx — the main question/answer screen
4. src/components/ResultScreen.tsx — the final result screen

CHANGES TO MAKE

--- FILE: src/components/LoginScreen.tsx ---

Change 1: Add accessible labels to the name and email input fields.
Currently both inputs use placeholder text only. Placeholder text is not a label — it disappears on focus and is not reliably read by screen readers.
For each input, add a visually-hidden `<label>` element:
  - Create a CSS class `.sr-only` in the component using a style object (or note it needs to be added to index.css — see Change 4 below) that applies the standard screen-reader-only pattern: position absolute, width 1px, height 1px, padding 0, margin -1px, overflow hidden, clip rect(0,0,0,0), white-space nowrap, border 0.
  - Add `<label htmlFor="login-name" className="sr-only">Your name</label>` before the name input.
  - Add `id="login-name"` to the name input element.
  - Add `<label htmlFor="login-email" className="sr-only">Email address (optional)</label>` before the email input.
  - Add `id="login-email"` to the email input element.
  - Also add `aria-label` attributes directly on each input as a redundant fallback.

--- FILE: src/index.css ---

Change 2: Add the .sr-only utility class.
Add the standard visually-hidden pattern as a global class:
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

Change 3: Add :focus-visible styles to interactive elements.
Currently there are :hover styles for option cards and buttons but no :focus-visible styles — keyboard users have no visible focus indicator.
Add the following rules:
  .btn-primary:focus-visible {
    outline: 2px solid var(--color-gold-dark);
    outline-offset: 3px;
  }
  /* Option card buttons rendered inline in QuestionScreen use class .option-card-btn
     but they are actually inline-styled <button> elements. Target them with a 
     more general selector: */
  button:focus-visible {
    outline: 2px solid var(--color-gold-dark);
    outline-offset: 2px;
  }
  /* But exclude the back-navigation buttons from this ring since they have their own 
     visible icon. Use a class instead: */
  .back-btn:focus-visible {
    outline: 2px solid var(--color-gold-dark);
    outline-offset: 3px;
    border-radius: 6px;
  }
  NOTE: If you see that the option card buttons are plain <button> elements without a 
  class, the global `button:focus-visible` rule will catch them. Verify this works.

--- FILE: src/components/QuestionScreen.tsx ---

Change 4: Add className="back-btn" to the back navigation button.
Find the ChevronLeft back button and add `className="back-btn"` to it so the CSS focus rule above can target it specifically.

Change 5: Raise the stage counter secondary span opacity.
Current: the "/" and total count span has `opacity: 0.35` — this fails WCAG AA contrast at 4.5:1 for the target audience.
Change the opacity on the `/ {totalQuestions}` span from `0.35` to `0.55`.

Change 6: Set a minimum starting value for the progress bar.
Current: on Q1 the progress bar shows approximately 6.7% (1/15), which reads as "nearly empty."
Instead of using raw progressPercent from the hook, compute a display value in the component:
  const displayProgress = Math.max(progressPercent, 8);
Use `displayProgress` for the bar width instead of `progressPercent` directly.
This ensures the bar reads as "already started" on Q1 without affecting the underlying state.

--- FILE: src/components/ResultScreen.tsx ---

Change 7: Clamp slider dot left position between 2% and 98%.
Currently the slider dot is positioned with: `left: mounted ? \`${slider.value}%\` : "50%"`
A value of 0 places the dot half off the left edge of the track. A value of 100 clips the right edge.
Replace the raw slider value in the left expression with a clamped version:
  const clampedLeft = Math.min(98, Math.max(2, slider.value));
  left: mounted ? `${clampedLeft}%` : "50%"
NOTE: If Batch 2 has already been applied, the slider value passed here will be the modulated value, not the raw content.ts value. Clamp whichever value arrives — the clamping is a display guard, not a data transform.

WHAT NOT TO CHANGE
- Do not modify question content, reflection trigger content, or result copy.
- Do not change game state logic in useGameState.ts.
- Do not change App.tsx.
- Do not change ReflectionScreen, StageIntroScreen.
- Do not add or remove any screens or routes.
```

---

## BATCH 4 — Stage III Echo Moment

```
You are implementing a targeted enhancement to the most psychologically powerful moment in a React + TypeScript web app called "Predictable Destiny."

PROJECT OVERVIEW
A psychological minigame for live webinars. Players answer 15 questions across 3 stages. Stage III (Q11–Q15) is "The Mirror" — instead of asking what the player would do, it asks what they already know about themselves. The game also compares Stage III answers against the player's corresponding Stage I answers (same slot, 10 questions apart). When they match, the echo text reads "Still here." When they differ, it reads "Something has shifted." This moment is currently underplayed — small italic muted text that auto-advances in 850ms.

The core task of this batch: make the Stage III selection moment feel like a genuine pause rather than a brief label.

CODING RULES — FOLLOW STRICTLY
- TypeScript strict mode. No `any` type. No non-null assertion (`!`). No `as unknown as T` casts.
- Use double quotes for all strings.
- Use template literals or .join() instead of string concatenation with +.
- Write clear JSDoc comments on functions and interfaces.
- No placeholder comments — write complete code.
- Do not change any file not listed in the CHANGES section below.

FILES TO READ BEFORE STARTING
1. src/components/QuestionScreen.tsx — the full component, especially:
   - The handleSelect function (auto-advance delay logic)
   - The echoText useMemo (the "Still here." / "Something has shifted." logic)
   - The behavioral echo render block at the bottom
   - The option card render loop (the scale transform on isChosen)
2. src/index.css — the animation classes and keyframes available

CHANGES TO MAKE

--- FILE: src/components/QuestionScreen.tsx ---

Change 1: Extend the auto-advance delay for Stage III selections only.
Current: handleSelect uses a single 850ms delay for all stages.
Change: if the current question is in Stage III (questionIndex >= 10), use 1600ms. Otherwise keep 850ms.
  const advanceDelay = questionIndex >= 10 ? 1600 : 850;
  setTimeout(() => onAnswer(dim), advanceDelay);

Change 2: Add a second echo line for Stage III comparisons.
Currently echoText is a single string. For Stage III, extend the echo to include a second, supporting sentence.
Change the echoText logic to return either a string (for Stage I/II) or an object with { primary: string; secondary: string } for Stage III comparisons.
Define a new type at the top of the file:
  type EchoContent =
    | { type: "simple"; text: string }
    | { type: "comparison"; primary: string; secondary: string };

Update the echoText useMemo to return EchoContent:
  - Stage I & II: return { type: "simple", text: DIMENSION_ECHOES[selected] }
  - Stage III, match: return { type: "comparison", primary: "Still here.", secondary: "You chose the same pattern five questions ago." }
  - Stage III, shift: return { type: "comparison", primary: "Something has shifted.", secondary: "You answered differently this time." }
  - Stage III, no Stage I reference available: return { type: "simple", text: DIMENSION_ECHOES[selected] }

Rename the state variable from `echoText` to `echoContent` to match the new type.

Change 3: Update the echo render block to handle both echo content types.
Replace the current single-line echo render with a conditional block:
  - If echoContent.type === "simple": render exactly as before (single italic muted line).
  - If echoContent.type === "comparison": render a two-part block:
      - Primary line: 1.5rem, color var(--color-text) (not muted), font-weight 500, not italic, text-align center
      - Secondary line: 1.05rem, color var(--color-text-light), fontStyle italic, marginTop 0.6rem, text-align center
      - A thin gold horizontal rule that animates its width from 0 to 50px using a CSS animation
        (define a new keyframe in index.css called `expandLine` and apply it here)
      - The entire comparison block should use a larger paddingTop (2rem instead of 1.5rem) and paddingBottom (1rem)

Change 4: Remove the scale(1.02) transform from selected cards in Stage III.
Current: all selected option cards use `transform: isChosen ? "scale(1.02)" : "scale(1)"`.
Change: in Stage III (questionIndex >= 10), the selected card should NOT scale up. The state should feel like weight, not celebration.
  transform: isChosen ? (questionIndex >= 10 ? "scale(1)" : "scale(1.02)") : "scale(1)"
All other card styles (gold border, gold background, gold shadow) remain unchanged.

--- FILE: src/index.css ---

Change 5: Add the expandLine keyframe animation.
Add a new keyframe for the gold line that expands beneath the comparison echo:
  @keyframes expandLine {
    0%   { width: 0;    opacity: 0; }
    30%  { opacity: 1; }
    100% { width: 50px; opacity: 1; }
  }
Add a CSS class to use it:
  .echo-line-expand {
    height: 1px;
    background: var(--color-gold-dark);
    margin: 1.2rem auto 0;
    animation: expandLine 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s forwards;
    width: 0;
  }
Use className="echo-line-expand" on the gold rule element in the comparison echo block.

WHAT NOT TO CHANGE
- Do not change Stage I or Stage II selection behavior (850ms delay, scale transform, single echo line all stay as-is for those stages).
- Do not change question content, reflection triggers, result copy, or scoring logic.
- Do not change App.tsx, useGameState.ts, ResultScreen.tsx, LoginScreen.tsx, ReflectionScreen.tsx, or StageIntroScreen.tsx.
```

---

## BATCH 5 — Surprise Screen & Game Flow Changes

```
You are adding a new screen to the game flow and updating the closing section of the result screen in a React + TypeScript web app called "Predictable Destiny."

PROJECT OVERVIEW
A psychological minigame for live webinars. Players go through: Login → Q1–Q5 → Reflection 1 → Q6–Q10 → Reflection 2 → [Stage III Intro] → Q11–Q15 → Reflection 3 → Result.
This batch inserts a new "Surprise Screen" between Reflection 2 and the Stage III Intro. The screen auto-advances after 4 seconds with no player input — the only moment in the game where the player cannot tap past it. Its content confronts the player silently before Stage III begins.

CODING RULES — FOLLOW STRICTLY
- TypeScript strict mode. No `any` type. No non-null assertion (`!`). No `as unknown as T` casts.
- Use double quotes for all strings.
- Use template literals or .join() instead of string concatenation with +.
- Write JSDoc comments on all new functions, components, and interfaces.
- No placeholder comments — write complete code.
- Do not change any file not listed in the CHANGES section below.

FILES TO READ BEFORE STARTING
1. src/hooks/useGameState.ts — the full state machine. Pay attention to:
   - The GameStage type union
   - The proceedFromReflection function
   - The proceedFromStageIntro function
   - The goBack function
   - The returned state object shape
2. src/App.tsx — how each stage maps to a component render
3. src/components/StageIntroScreen.tsx — use this as a reference for the structure of a full-screen transition component
4. src/components/ResultScreen.tsx — specifically the closing section at the bottom (the "Sit with this." block and the CAE GOH watermark)
5. src/index.css — available CSS classes, especially .glass-container, .screen-enter, .screen-exit, .animate-fade-up, delay classes, and .animate-breathe

CHANGES TO MAKE

--- NEW FILE: src/components/SurpriseScreen.tsx ---

Create this component from scratch. Requirements:
- It is a full-screen glass container (use .glass-container and the screen-enter/screen-exit transition pattern, same as every other screen).
- It has NO back button. No header. No stage label. No progress bar. No manual continue button.
- It auto-advances: on mount, start a setTimeout of 4000ms that calls onProceed(). Clean up with clearTimeout on unmount.
- Content is vertically and horizontally centered in the available space.
- Two lines of text:
    Primary: "You've been making the same choice."
      Style: 1.8rem, fontWeight 400, color var(--color-text), textAlign center, lineHeight 1.5
      Animation: animate-fade-up delay-400
    Secondary: "Have you noticed?"
      Style: 1.3rem, fontStyle italic, color var(--color-text-light), textAlign center, marginTop 1.2rem
      Animation: animate-fade-up delay-800
- No other visual elements. The blankness around the text is intentional.
- Props interface: { onProceed: () => void; isTransitioning: boolean }
- Export named: SurpriseScreen

--- FILE: src/hooks/useGameState.ts ---

Change 1: Add "surprise" to the GameStage union type.
Locate the GameStage type definition. Add "surprise" as a valid value.

Change 2: Update proceedFromReflection to route to "surprise" when triggerBlock is 2.
Currently proceedFromReflection routes to "stageIntro" at some point (after Reflection 2). Change this so that when currentTriggerBlock === 2, the transition goes to "surprise" instead of "stageIntro".
The existing routing to "question" (after Reflection 1 and Reflection 3) must remain unchanged.

Change 3: Add a proceedFromSurprise handler.
Add a new function:
  /**
   * Called when the SurpriseScreen's auto-advance timer fires.
   * Transitions to the Stage III intro screen.
   */
  const proceedFromSurprise = (): void => {
    handleTransition("stageIntro");
  };
Where handleTransition is whatever the existing transition utility is in useGameState. Expose proceedFromSurprise in the returned state object.

Change 4: Update goBack to handle the "surprise" stage.
In the goBack function, add a case for when stage === "surprise". Going back from SurpriseScreen should return to the Reflection 2 screen: handleTransition("reflection") — and ensure currentTriggerBlock is set back to 2. Review the existing goBack logic to understand how it restores prior state and apply the same pattern.
NOTE: While the SurpriseScreen has no back button in its UI, the game state machine should still handle back navigation correctly in case goBack is ever called programmatically.

--- FILE: src/App.tsx ---

Change 5: Import SurpriseScreen.
Add the import at the top: import { SurpriseScreen } from "./components/SurpriseScreen";

Change 6: Add the SurpriseScreen render block.
In the main conditional render section, add:
  {gameState.stage === "surprise" && (
    <SurpriseScreen
      onProceed={gameState.proceedFromSurprise}
      isTransitioning={gameState.isTransitioning}
    />
  )}
Place it between the Reflection block and the StageIntro block.

--- FILE: src/components/ResultScreen.tsx ---

Change 7: Replace the "Sit with this." closing section with a breathing name element.
Find the closing section at the bottom of ResultScreen (currently contains "The speaker will return shortly." and "Sit with this.").
Replace it with:
  - The player's first name (extract with name.split(" ")[0] or use name if no spaces), displayed at 3.2rem, fontWeight 400, textAlign center, color var(--color-text), using className="animate-breathe" for the slow pulse
  - Below the name: "The speaker will return shortly." at 0.95rem, fontStyle italic, color var(--color-text-light), textAlign center, marginTop 1.5rem
  - Below that: "Sit with this." at 1rem, fontWeight 500, color var(--color-text), textAlign center, marginTop 0.4rem
  - The entire block should have paddingTop 2rem and a top border: "1px solid rgba(243,206,133,0.35)" (same as before)
  - Wrap the whole block in animate-fade-up delay-1200 (same as the section it replaces)
  - If name is an empty string, fall back to displaying nothing in place of the name (guard with: {name.trim() && <div>...</div>})

WHAT NOT TO CHANGE
- Do not change question content, reflection triggers, or result profile copy.
- Do not change QuestionScreen, LoginScreen, or ReflectionScreen.
- Do not change the scoring logic (computeDominantDimension).
- Do not change any CSS except what is needed to support the new SurpriseScreen (which should use only existing CSS classes from index.css — no new CSS needed).
```

---

## BATCH 6 — Result Page Personal Quote-Back

```
You are implementing a personal quote-back feature on the result screen of a React + TypeScript web app called "Predictable Destiny."

PROJECT OVERVIEW
A psychological minigame for live webinars. Players answer 15 questions. Q15 asks: "what question must you ask yourself right now?" — the player chooses one of 4 self-directed questions. The answer is stored in the answers array as a Dimension ('A'|'B'|'C'|'D'). The actual text of the chosen option lives in the questions data in src/data/content.ts.

The result page currently shows generic text that every player in a given dimension receives. This batch adds one piece of genuinely personal content: the player's own Q15 answer, quoted back to them verbatim in Section 03.

IMPORTANT: This batch shares files with Batch 5. READ the current versions of useGameState.ts and App.tsx after Batch 5 has been applied. Do not overwrite Batch 5's changes — integrate with them.

CODING RULES — FOLLOW STRICTLY
- TypeScript strict mode. No `any` type. No non-null assertion (`!`). No `as unknown as T` casts.
- Use double quotes for all strings.
- Use template literals or .join() instead of string concatenation with +.
- Write JSDoc comments on all new functions and interfaces.
- No placeholder comments — write complete code.
- Do not change any file not listed in the CHANGES section below.

FILES TO READ BEFORE STARTING
1. src/hooks/useGameState.ts — current state after Batch 5 has been applied. Note the returned state object and what it currently exposes.
2. src/App.tsx — current state after Batch 5 has been applied. Note the ResultScreen render call.
3. src/data/content.ts — specifically questions[14] (Q15, the last question). Read all 4 option texts. These are the texts that will be quoted back.
4. src/components/ResultScreen.tsx — current state after Batch 5 has been applied. Specifically Section 03 ("What this pattern may mean").

CHANGES TO MAKE

--- FILE: src/hooks/useGameState.ts ---

Change 1: Compute and expose the player's Q15 answer text.
Import questions from "../data/content" if not already imported (it may already be used in the file — check first).
After the final result is computed (where finalDominantDimension and finalDominantCount are set), also compute:
  /**
   * The verbatim text of the player's Q15 answer option, used for the
   * quote-back on the result screen. Empty string if Q15 was not answered.
   */
  const q15Option = answers[14] !== undefined
    ? (questions[14].options.find((opt) => opt.id === answers[14]) ?? null)
    : null;
  const q15AnswerText: string = q15Option !== null ? q15Option.text : "";
Store this as a state variable or compute it inline when needed. The simplest approach is to store it in a `useRef` or compute it as a derived value at the point of state finalization.
Add `q15AnswerText: string` to the returned state object. Initialize it as an empty string until Q15 is answered.

--- FILE: src/App.tsx ---

Change 2: Pass q15AnswerText to ResultScreen.
In the ResultScreen render block, add:
  q15AnswerText={gameState.q15AnswerText}

--- FILE: src/components/ResultScreen.tsx ---

Change 3: Add q15AnswerText to ResultScreenProps.
Add `q15AnswerText: string` to the ResultScreenProps interface.

Change 4: Insert the quote-back block in Section 03.
Section 03 currently has this structure:
  1. SectionDivider — "03 · WHAT THIS PATTERN MAY MEAN"
  2. Line 1 — calm observation (reflectionLines[0])
  3. Line 2 — the benefit (reflectionLines[1])
  4. Gold hidden-cost box — the tension (reflectionLines[2])

Insert a new block between Line 2 and the gold hidden-cost box. Only render it if q15AnswerText is a non-empty string.

The block structure:
  - Intro line: "When asked what question you most needed to ask yourself — you chose:"
    Style: 0.95rem, color var(--color-text-light), fontStyle italic, lineHeight 1.7, marginBottom 1rem, textAlign center
  - The quote text (q15AnswerText):
    Style: container with a 3px left border in var(--color-gold-dark), paddingLeft 1.2rem, marginBottom 2.5rem, marginTop 0
    Text itself: 1.1rem, color var(--color-text), fontWeight 500, lineHeight 1.65, fontStyle normal
    This left-border treatment distinguishes it visually as a direct quote, not description.

  Wrap the entire quote-back block in a conditional: {q15AnswerText.trim().length > 0 && ( ... )}
  Do not render any wrapper or empty div when q15AnswerText is empty.

SPACING NOTE: After inserting the quote-back block, the marginBottom on Line 2 (reflectionLines[1]) should be reduced from 3rem to 1.5rem so the sequence flows without excessive whitespace: observation → benefit → quote-back → hidden cost.

WHAT NOT TO CHANGE
- Do not change the SectionDivider component.
- Do not change Sections 01, 02, or 04 of the result screen.
- Do not change the slider rendering.
- Do not change the RevealWords component.
- Do not change question content, reflection triggers, or scoring logic.
- Do not change any CSS files.
- Do not change LoginScreen, QuestionScreen, ReflectionScreen, StageIntroScreen, or SurpriseScreen.
```

---

## Running Order Reference

| Batch | Safe to run with | Must run after |
|---|---|---|
| Batch 1 — Copy & Language | 2, 3, 4 | — |
| Batch 2 — Scoring & Sliders | 1, 3, 4 | — |
| Batch 3 — Accessibility & UX | 1, 2, 4 | — |
| Batch 4 — Stage III Echo | 1, 2, 3 | — |
| Batch 5 — Surprise Screen & Flow | — | 1, 2, 3, 4 complete |
| Batch 6 — Quote-Back | — | Batch 5 complete |
