# Agent Implementation Prompts — Wow Factor V2

Seven self-contained prompts. Run Batch 1 first, then Batch 2. After Batch 2, run Batches 3, 4, 6, 7 in any order (or in parallel). Run Batch 5 last.

---

## BATCH 1 — Content Restructuring

```
You are restructuring the game content for a React + TypeScript web app called "Predictable Destiny."

PROJECT OVERVIEW
A psychological minigame for live webinars. Players answer questions across 3 stages. Their answers reveal one of 4 behavioural dimensions: A (Early Movement), B (Seeking Clarity), C (Calculated Risk), D (Preserving Options). After every stage, a personalized reflection screen fires. The final screen shows a result profile. The app is built with Vite + React + TypeScript + vanilla CSS. All game content lives in src/data/content.ts.

CORE DESIGN PRINCIPLES
- Mirror over Label: never tell the player who they ARE. Show their behaviour and let them recognise themselves.
- The game must NOT feel like a personality quiz. No MBTI-style categorisation.
- All copy at 8th-grade reading level. Short sentences. Zero corporate jargon.
- Target audience: business owners and senior decision-makers, aged 40–65, many non-native English speakers.

CODING RULES — FOLLOW STRICTLY
- TypeScript strict mode. No `any` type. No non-null assertion (`!`). No `as unknown as T` casts.
- Use double quotes for all strings.
- Use template literals or .join() instead of string concatenation with +.
- Write clear JSDoc comments on functions and interfaces.
- No placeholder comments — write complete code.
- Do not change any file not listed in the CHANGES section below.

FILES TO READ BEFORE STARTING
1. src/data/content.ts — read the entire file. Understand the questions array, dynamicTriggers, and resultInterpretations structures.
2. docs/copywriting-guide.md — the tone and copy principles.
3. docs/wow-factor-v2-plan.md — the full plan including question mapping.

WHAT YOU ARE DOING
The game currently has 15 questions. You are cutting it to 10 questions (3 per stage for Stages I and II, 4 for Stage III). You are also writing 3 new "reversal" questions — one per stage — where the player identifies which behaviour is LEAST like them instead of most like them.

QUESTION MAPPING — OLD TO NEW
Keep these 7 old questions (renumber their `id` fields sequentially 1–10):
- Old Q1 (id:1) → New Q1 (Stage I) — "Your company is starting a new project..."
- Old Q2 (id:2) → New Q2 (Stage I) — "A chance to work on something big..."
- Old Q6 (id:6) → New Q4 (Stage II) — "You watch someone else succeed..."
- Old Q7 (id:7) → New Q5 (Stage II) — "You remember a path you did not take..."
- Old Q11 (id:11) → New Q7 (Stage III) — "Whether you succeed or fail..."
- Old Q12 (id:12) → New Q8 (Stage III) — "Some habits keep repeating..."
- Old Q15 (id:15) → New Q10 (Stage III, final question) — "Getting to where you are today..."

Cut all other old questions (Q3, Q4, Q5, Q8, Q9, Q10, Q13, Q14).

Write 3 NEW reversal questions:
- New Q3 (Stage I, id:3): The last question of Stage I. Instead of "you usually:", frame it as "which of these reactions is most unlike you?" or "which would you almost never do?" Theme: facing an unclear opportunity. Must have 4 options mapping to A/B/C/D. The options describe the same 4 behaviours (act first / wait / calculate / preserve options) but the player picks the one that is LEAST like them.
- New Q6 (Stage II, id:6): The last question of Stage II. Reversal framing: "looking back at past decisions, which perspective would you almost never take?" 4 options A/B/C/D.
- New Q9 (Stage III, id:9): The second-to-last question of Stage III. Reversal framing: "which of these hidden costs do you notice LEAST in yourself?" or "which of these habits is least like yours?" 4 options A/B/C/D.

RULES FOR WRITING REVERSAL QUESTIONS
1. Same setup + context structure as all other questions.
2. The 4 options MUST map to A, B, C, D in the same order as every other question.
3. Option A = acting/moving first behaviour. Option B = waiting/watching behaviour. Option C = calculating/measuring behaviour. Option D = preserving options/flexibility behaviour.
4. The framing must make it clear the player is choosing what they would REJECT or find most unlike themselves. Use phrasing like "most unlike you" or "you would almost never."
5. 8th-grade reading level. Maximum 20 words per sentence in setup/context.
6. Do NOT label the behaviours. Describe them as actions.

CHANGES TO MAKE

--- FILE: src/data/content.ts ---

Change 1: Replace the entire questions array.
The new array has exactly 10 Question objects with ids 1–10, in the order specified above. Keep the 7 existing questions' setup/context/options text exactly as they are (just renumber the id). Write the 3 new reversal questions fresh.

Update the stage comments:
- Stage I (Q1–Q3): "The Unknown — how do you react to opportunities before you have full information?"
- Stage II (Q4–Q6): "The Aftermath — how do you reflect on past decisions and the chances you passed on?"
- Stage III (Q7–Q10): "The Mirror — direct confrontation with your own habitual patterns."

Change 2: Update dynamicTriggers.
Remove the `stage3` entry entirely — there is no Reflection 3 in the new flow.
Keep `stage1` and `stage2` exactly as they are. Their text does not reference question counts and remains valid.

Change 3: Verify resultInterpretations.
Read through all 4 dimension entries (A, B, C, D). Confirm that no text references "15 questions" or any specific question count. If any does, update it. If none do (which is expected), leave them unchanged.

WHAT NOT TO CHANGE
- Do not change the Dimension type, Option interface, or Question interface.
- Do not change resultInterpretations unless a question count reference is found.
- Do not change any component files, hooks, CSS, or anything outside content.ts.
- Do not change the dynamicTriggers.stage1 or stage2 text content — only remove stage3.
```

---

## BATCH 2 — State & Flow Restructuring

```
You are restructuring the game state machine and app flow for a React + TypeScript web app called "Predictable Destiny."

PROJECT OVERVIEW
A psychological minigame for live webinars. The game has been restructured from 15 questions to 10 questions (Batch 1 already completed). You are now updating the state machine and app routing to match the new 10-question flow.

NEW GAME FLOW (after Batch 1)
- Stage I: questions at indices 0, 1, 2 (Q1–Q3)
- After Q3 answer → Reflection 1 (triggerBlock 1)
- Stage II: questions at indices 3, 4, 5 (Q4–Q6)
- After Q6 answer → Reflection 2 (triggerBlock 2)
- After Reflection 2 → Surprise Screen → Stage III Intro
- Stage III: questions at indices 6, 7, 8, 9 (Q7–Q10)
- After Q10 answer → straight to Result (NO Reflection 3)

CODING RULES — FOLLOW STRICTLY
- TypeScript strict mode. No `any` type. No non-null assertion (`!`). No `as unknown as T` casts.
- Use double quotes for all strings.
- Use template literals or .join() instead of string concatenation with +.
- Write clear JSDoc comments on functions and interfaces.
- No placeholder comments — write complete code.
- Do not change any file not listed in the CHANGES section below.

FILES TO READ BEFORE STARTING
1. src/data/content.ts — the restructured content (10 questions, 2 trigger stages). Confirm it has exactly 10 questions.
2. src/hooks/useGameState.ts — the full state machine. Read every function.
3. src/App.tsx — how stages map to components.
4. docs/wow-factor-v2-plan.md — the full plan for reference.

CHANGES TO MAKE

--- FILE: src/hooks/useGameState.ts ---

Change 1: Update currentTriggerBlock.
Reflections now fire at questionIndex 3 and 6 (not 5, 10, 15).
Change the type from `0 | 1 | 2 | 3` to `0 | 1 | 2`.
Update the useMemo:
  if (questionIndex === 3)  return 1;
  if (questionIndex === 6)  return 2;
  return 0;

Change 2: Update answerQuestion.
The next question index triggers reflections at 3 and 6, and goes to result at 10.
  const nextIndex = questionIndex + 1;
  if (nextIndex === 3 || nextIndex === 6) {
    handleTransition("reflection", nextIndex);
  } else if (nextIndex === 10) {
    handleTransition("result", nextIndex);
  } else {
    handleTransition("question", nextIndex);
  }

Change 3: Update proceedFromReflection.
There is no Reflection 3 → result path anymore. Only two cases:
  - questionIndex === 6 → go to "surprise"
  - questionIndex === 3 → go to "question" (Q4, index 3)
Remove the questionIndex === 15 case entirely.

Change 4: Update the final result computation.
Change the guard from `answers.length < 15` to `answers.length < 10`.
Change the final computation from `computeDominantDimension(0, 15)` to `computeDominantDimension(0, 10)`.

Change 5: Update slider modulation thresholds.
The getModulatedSliderValue function (currently in ResultScreen.tsx but the thresholds are relevant here) uses thresholds designed for 15 questions. With 10 questions, update the thresholds:
  - count >= 7 (was >= 10): strong dominance, return base value unchanged
  - count >= 5 (was >= 7): moderate, pull 20% toward center
  - count >= 3 (was >= 5): weak, pull 35% toward center
NOTE: The function itself lives in ResultScreen.tsx, not here. But you need to update the finalDominantCount computation to reflect the new scale. The count values are correct as-is (they count how many of the 10 answers matched). No change needed to the count computation — just note the threshold change for Batch 5.

Change 6: Update q15AnswerText → q10AnswerText.
Rename the variable and update it to read answers[9] and questions[9] instead of answers[14] and questions[14].
Update the JSDoc comment to reference Q10 instead of Q15.
Expose as `q10AnswerText` in the return value.

Change 7: Add q1AnswerText and q7AnswerText.
Add two new computed values for the result page comparison:
  const q1AnswerText = useMemo((): string => {
    if (answers[0] === undefined) return "";
    const q1Option = questions[0].options.find(opt => opt.id === answers[0]);
    return q1Option ? q1Option.text : "";
  }, [answers]);

  const q7AnswerText = useMemo((): string => {
    if (answers[6] === undefined) return "";
    const q7Option = questions[6].options.find(opt => opt.id === answers[6]);
    return q7Option ? q7Option.text : "";
  }, [answers]);
Expose both in the return value.

Change 8: Update progressPercent.
It already uses `questions.length` dynamically, so it auto-adjusts. Verify this. No change needed if it uses `questions.length`.

Change 9: Update goBack.
Adjust the back navigation map:
  - question[0] → login
  - question[3] → reflection (came from Reflection 1)
  - question[6] → stageIntro (came from Stage III intro)
  - question[n] → question[n-1] + pop answer
  - reflection → question[n-1] + pop answer
  - surprise → reflection (triggerBlock 2)
  - stageIntro → surprise
  - result → previous stage (since there's no Reflection 3, back from result should go to question[9] + pop answer, restoring the last question)
Update the boundary checks: replace `questionIndex === 5` with `questionIndex === 3`, replace `questionIndex === 10` with `questionIndex === 6`.
For result: go back to question (index 9) and pop the last answer.

Change 10: Update currentQuestion guard.
Change `questionIndex < 15 ? questionIndex : 14` to `questionIndex < 10 ? questionIndex : 9`.

--- FILE: src/App.tsx ---

Change 11: Update the reflection screen computation.
The dominant dimension computation currently uses: computeDominantDimension(gameState.questionIndex - 5, gameState.questionIndex)
Change to: computeDominantDimension(gameState.questionIndex - 3, gameState.questionIndex)
(Each stage now has 3 questions, not 5.)

Change 12: Pass new props to ResultScreen.
Replace `q15AnswerText` with `q10AnswerText`. Add `q1AnswerText` and `q7AnswerText`:
  q10AnswerText={gameState.q10AnswerText}
  q1AnswerText={gameState.q1AnswerText}
  q7AnswerText={gameState.q7AnswerText}

Change 13: Add scroll-to-top on screen transitions.
Add a useEffect in App.tsx that scrolls to top whenever stage or questionIndex changes:
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [gameState.stage, gameState.questionIndex]);
Import useEffect from React at the top.

WHAT NOT TO CHANGE
- Do not change content.ts (already restructured in Batch 1).
- Do not change any component files other than App.tsx.
- Do not change index.css.
- Do not change the computeDominantDimension algorithm itself — only the arguments passed to it.
- Do not change the SurpriseScreen, StageIntroScreen, or LoginScreen renders in App.tsx (they don't need changes).
```

---

## BATCH 3 — QuestionScreen Changes

```
You are implementing visual and interaction changes to the QuestionScreen of a React + TypeScript web app called "Predictable Destiny."

PROJECT OVERVIEW
A psychological minigame for live webinars. The game has been restructured from 15 to 10 questions across 3 stages:
- Stage I (indices 0–2): "The Unknown" — how you react to unclear opportunities
- Stage II (indices 3–5): "The Aftermath" — how you reflect on past decisions
- Stage III (indices 6–9): "The Mirror" — direct self-confrontation
Q10 (index 9) is the final and most important question: "what question must you ask yourself right now?" Its answer gets quoted back on the result page. It must look and feel different from every other question.

TARGET AUDIENCE: Business owners aged 40–65, many non-native English speakers, playing on phones during a live webinar.

CODING RULES — FOLLOW STRICTLY
- TypeScript strict mode. No `any` type. No non-null assertion (`!`). No `as unknown as T` casts.
- Use double quotes for all strings.
- Use template literals or .join() instead of string concatenation with +.
- Write clear JSDoc comments on functions and interfaces.
- No placeholder comments — write complete code.
- Do not change any file not listed in the CHANGES section below.

FILES TO READ BEFORE STARTING
1. src/components/QuestionScreen.tsx — read the entire file. Key areas:
   - The stage computation and STAGE_OVERLAYS
   - The handleSelect function (advance delay logic)
   - The echoContent useMemo (Stage III echo comparisons)
   - The option card render loop
   - The progress bar
2. src/index.css — existing animation classes and keyframes.

CHANGES TO MAKE

--- FILE: src/components/QuestionScreen.tsx ---

Change 1: Update stage boundaries.
Current: const stage = questionIndex < 5 ? 1 : questionIndex < 10 ? 2 : 3;
New:     const stage = questionIndex < 3 ? 1 : questionIndex < 6 ? 2 : 3;

Change 2: Update Stage III advance delay boundary.
Current: const advanceDelay = questionIndex >= 10 ? 1600 : 850;
New:     const advanceDelay = questionIndex >= 6 ? 1600 : 850;

Change 3: Update Stage III selected card scale boundary.
Current: transform: isChosen ? (questionIndex >= 10 ? "scale(1)" : "scale(1.02)") : "scale(1)"
New:     transform: isChosen ? (questionIndex >= 6 ? "scale(1)" : "scale(1.02)") : "scale(1)"

Change 4: Update Stage III progress bar boundary.
Current: questionIndex >= 10 for the .stage3-progress-bar class and conditional inline gradient.
New:     questionIndex >= 6.

Change 5: Update the Q11 entry overlay boundary.
Current: questionIndex === 10 triggers the heavier containerBackground.
New:     questionIndex === 6 (Q7 is the first Stage III question now).

Change 6: Update echo comparison logic.
Current: const isStageThree = questionIndex >= 10; with stageOneIndex = questionIndex - 10;
New: Echo comparisons only happen for indices 6, 7, 8 (Q7–Q9). Index 9 (Q10) has no echo — it is the special final question.
  const isEchoComparison = questionIndex >= 6 && questionIndex <= 8;
  if (isEchoComparison) {
    const stageOneIndex = questionIndex - 6;
    const stageOneAnswer = answers[stageOneIndex];
    // ... existing comparison logic
  }
For Q10 (index 9): return the simple echo { type: "simple", text: DIMENSION_ECHOES[selected] } — same as Stage I/II.

Change 7: Remove entry animation for Stage III questions.
Currently: const transClass = isTransitioning ? "screen-exit" : "screen-enter";
For Stage III (questionIndex >= 6): skip the screen-enter class. The container should appear instantly with no animation.
  const transClass = isTransitioning
    ? "screen-exit"
    : (questionIndex >= 6 ? "" : "screen-enter");
Without screen-enter, the glass-container renders at its default state (opacity 1, no transform, no blur). This is intentional — the sudden absence of ceremony signals weight.

Change 8: Update stage fade delay boundaries.
Current: const questionFadeDelay = stage === 3 ? "delay-400" : "delay-200";
         const optionFadeDelay = stage === 3 ? "delay-800" : "delay-400";
These can stay as-is since they already check `stage === 3`. Verify they work correctly with the new stage computation.

Change 9: Make Q10 (index 9) visually distinct.
This is the most important visual change. When questionIndex === 9:

a) The option grid changes from 2 columns to 1 column:
   gridTemplateColumns: questionIndex === 9 ? "1fr" : "1fr 1fr"

b) Each option card fades in individually with staggered delays instead of sharing a single fade-up wrapper. Remove the shared animate-fade-up wrapper for Q10. Instead, each option button gets its own animation:
   className: questionIndex === 9 ? "animate-fade-up" : undefined
   style: questionIndex === 9 ? { ...existingStyles, animationDelay: `${0.6 + idx * 0.8}s`, opacity: 0 } : existingStyles
   (idx is the shuffled position index — 0, 1, 2, 3)
   This means: first option appears at 0.6s, second at 1.4s, third at 2.2s, fourth at 3.0s.

c) The question text is larger:
   fontSize: questionIndex === 9 ? "1.6rem" : "1.35rem"

d) The option cards have no position number badge for Q10:
   Only render the numbered span badge when questionIndex !== 9. For Q10, the badge is hidden — the question feels more like a contemplation than a selection.

e) The min-height on option cards is removed for Q10 (let them size naturally in single column):
   minHeight: questionIndex === 9 ? "auto" : "120px"

f) No echo text for Q10 — already handled in Change 6.

Change 10: Raise stage label opacity.
Current: opacity: 0.45
New:     opacity: 0.6

--- FILE: src/index.css ---

No CSS changes needed. All visual changes are handled through inline styles and existing classes.

WHAT NOT TO CHANGE
- Do not change the question text rendering (setup/context content comes from data).
- Do not change scoring logic, shuffle logic, or the answers prop.
- Do not change the back button behaviour.
- Do not change the echo text content (the "Still here." / "Something has shifted." strings).
- Do not change App.tsx, useGameState.ts, or any other component.
```

---

## BATCH 4 — ReflectionScreen Changes

```
You are implementing a targeted change to the Reflection Screen of a React + TypeScript web app called "Predictable Destiny."

PROJECT OVERVIEW
A psychological minigame for live webinars. After every stage of questions, a reflection screen fires showing personalized text based on the player's dominant behavioural dimension. The game has been restructured to have 2 reflections (after Stage I and Stage II). The Reflection Screen currently shows text and a continue button that appears almost immediately — within about 1 second of the text.

The problem: players tap through the reflection without reading. The button appears too quickly. The reflection text is the most psychologically important content in the game between stages, and it is being skipped.

TARGET AUDIENCE: Business owners aged 40–65 on their phones. They need clear, visible UI elements. No hidden gestures.

CODING RULES — FOLLOW STRICTLY
- TypeScript strict mode. No `any` type. No non-null assertion (`!`). No `as unknown as T` casts.
- Use double quotes for all strings.
- Use template literals or .join() instead of string concatenation with +.
- Write clear JSDoc comments on functions and interfaces.
- No placeholder comments — write complete code.
- Do not change any file not listed in the CHANGES section below.

FILES TO READ BEFORE STARTING
1. src/components/ReflectionScreen.tsx — read the entire file.
2. src/index.css — confirm animation classes exist.

CHANGES TO MAKE

--- FILE: src/components/ReflectionScreen.tsx ---

Change 1: Add a delayed continue button.
Currently the CTA button wrapper uses className="animate-fade-up delay-800", which means it appears 0.8s + 0.8s animation = ~1.6s after mount. This is too fast.

Add a state variable to control button visibility:
  const [showButton, setShowButton] = useState(false);

Add a useEffect that shows the button after 5 seconds:
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => setShowButton(true), 5000);
      return () => clearTimeout(timer);
    }
    setShowButton(false);
    return undefined;
  }, [isTransitioning, triggerBlock]);

Import useState and useEffect from React (useState may already be imported — check first, useEffect may not be).

Update the button wrapper: instead of always rendering the button, conditionally render it based on showButton:
  {showButton && (
    <div
      className="animate-fade-up"
      style={{
        marginTop: "auto",
        paddingTop: "3rem",
        width: "100%",
        maxWidth: "360px",
        paddingBottom: "2rem"
      }}
    >
      <button className="btn-primary" onClick={onProceed}>
        {ctaText}
      </button>
    </div>
  )}

Remove the delay-800 class from this wrapper — the 5-second delay replaces it. The animate-fade-up class still triggers a smooth fade-in when the element mounts.

Change 2: Verify the component handles only triggerBlock 1 and 2.
The current code has an if/else-if/else chain for triggerBlock 1, 2, and 3. Since Reflection 3 no longer exists in the game flow, the else branch (triggerBlock 3) will never execute. You can leave it in place as a safety fallback or remove it. If removing, update the else branch to default to triggerBlock 2 content as a fallback.

WHAT NOT TO CHANGE
- Do not change the character-by-character reveal on Reflection 2.
- Do not change the Reflection 3 heavier entry styling (even if Reflection 3 is no longer used, the styling is harmless).
- Do not change the reflection text content.
- Do not change the roman-watermark element.
- Do not change any other component, App.tsx, useGameState.ts, or index.css.
```

---

## BATCH 5 — Result Page Overhaul

```
You are completely overhauling the result screen of a React + TypeScript web app called "Predictable Destiny."

PROJECT OVERVIEW
A psychological minigame for live webinars. Players answer 10 questions across 3 stages. The result screen currently shows everything in a single long scroll: identity header, dimension name, Q10 quote-back, chips, sliders, reflection lines, bigger picture quote, and closing text.

THE PROBLEM
The current result page delivers 9 content blocks at once. The player skims past the emotional payload to see "what they got." The chips, sliders, and dimension name make it feel like a personality test output. The game's goal is MIRROR, not LABEL. The result should feel like a quiet conversation, not a quiz result.

THE SOLUTION
Transform the result page into a 4-phase staged reveal. Each phase shows focused content and a visible "Continue" button (matching the pattern the player learned from reflection screens). The analytical content (chips, sliders) moves behind an optional expandable. The dimension name is NOT shown prominently — the mirror sentence leads instead.

TARGET AUDIENCE: Business owners aged 40–65 on their phones. Every interaction must be self-evident. Visible buttons, no hidden gestures.

CODING RULES — FOLLOW STRICTLY
- TypeScript strict mode. No `any` type. No non-null assertion (`!`). No `as unknown as T` casts.
- Use double quotes for all strings.
- Use template literals or .join() instead of string concatenation with +.
- Write clear JSDoc comments on functions and interfaces.
- No placeholder comments — write complete code.
- Do not change any file not listed in the CHANGES section below.

FILES TO READ BEFORE STARTING
1. src/components/ResultScreen.tsx — read the entire file carefully. Understand every section.
2. src/data/content.ts — the resultInterpretations structure (chips, sliders, reflectionLines).
3. src/hooks/useGameState.ts — understand what props are passed (especially q10AnswerText, q1AnswerText, q7AnswerText, dominantCount, isTied).
4. src/App.tsx — how ResultScreen is rendered and what props it receives.
5. src/index.css — available animation classes.

CHANGES TO MAKE

--- FILE: src/components/ResultScreen.tsx ---

Change 1: Update the ResultScreenProps interface.
Replace q15AnswerText with q10AnswerText. Add q1AnswerText and q7AnswerText:
  interface ResultScreenProps {
    name: string;
    finalDimension: Dimension;
    dominantCount: number;
    isTied: boolean;
    q10AnswerText: string;
    q1AnswerText: string;
    q7AnswerText: string;
    isTransitioning: boolean;
    onBack: () => void;
  }

Change 2: Add phase state management.
  const [phase, setPhase] = useState(1);
  const [showContinue, setShowContinue] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

Add a useEffect that shows the continue button 3 seconds after each phase loads:
  useEffect(() => {
    if (phase < 4 && !isTransitioning) {
      setShowContinue(false);
      const timer = setTimeout(() => setShowContinue(true), 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [phase, isTransitioning]);

Add handlers:
  /** Advance to the next result phase */
  const advancePhase = (): void => {
    setPhase(prev => Math.min(prev + 1, 4));
  };

  /** Go back one phase, or exit result if on phase 1 */
  const handleBack = (): void => {
    if (phase > 1) {
      setPhase(prev => prev - 1);
    } else {
      onBack();
    }
  };

Change 3: Update the slider modulation thresholds.
The getModulatedSliderValue function needs updated thresholds for 10 questions:
  if (count >= 7) {
    modulated = baseValue;  // strong dominance (70%+)
  } else if (count >= 5) {
    modulated = baseValue + (50 - baseValue) * 0.20;  // moderate (50%+)
  } else if (count >= 3) {
    modulated = baseValue + (50 - baseValue) * 0.35;  // weak (30%+)
  }

Change 4: Restructure the JSX into 4 phases.
Replace the entire content of the returned JSX (inside the glass-container) with phase-based rendering. Keep the result-curtain div at the top (it only shows on initial mount).

The overall structure:

  <div className={`glass-container ${transClass}`} style={{ paddingBottom: "4rem" }}>
    <div className="result-curtain" />

    {/* Back button — always visible */}
    <div className="animate-fade-up" style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
      <button onClick={handleBack} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.5rem", marginLeft: "-0.5rem" }} aria-label="Go back">
        <ChevronLeft size={24} color="var(--color-text)" />
      </button>
    </div>

    {/* === PHASE 1: Name === */}
    {phase === 1 && ( ... )}

    {/* === PHASE 2: Mirror + Comparison + Quote-back === */}
    {phase === 2 && ( ... )}

    {/* === PHASE 3: Hidden Cost === */}
    {phase === 3 && ( ... )}

    {/* === PHASE 4: Bigger Picture + Closing === */}
    {phase === 4 && ( ... )}
  </div>

PHASE 1 — Player's name, alone.
  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
    <h1 className="animate-fade-up delay-200" style={{ fontSize: "3.2rem", fontWeight: 400, marginBottom: "1rem" }}>
      {name || "Friend"}
    </h1>
    <p className="animate-fade-up delay-400" style={{ fontSize: "1.1rem", color: "var(--color-text-light)", lineHeight: 1.6 }}>
      A familiar way you tend to respond<br />when things are still unfolding
    </p>
    {isTied && (
      <p className="animate-fade-up delay-600" style={{ fontSize: "0.95rem", color: "var(--color-text-light)", fontStyle: "italic", marginTop: "0.5rem" }}>
        Your pattern was closely divided between two tendencies.
      </p>
    )}
    {/* Continue button */}
    {showContinue && (
      <div className="animate-fade-up" style={{ marginTop: "auto", paddingTop: "3rem", width: "100%", maxWidth: "360px" }}>
        <button className="btn-primary" onClick={advancePhase}>Continue</button>
      </div>
    )}
  </div>

PHASE 2 — Mirror sentence + Q1 vs Q7 comparison + Q10 quote-back.
  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
    {/* Mirror sentence — the first reflectionLine, NOT the dimension name */}
    <p className="animate-fade-up delay-200" style={{ fontSize: "1.35rem", lineHeight: 1.8, color: "var(--color-text)", textAlign: "center", marginBottom: "3rem" }}>
      {resultData.reflectionLines[0]}
    </p>

    {/* Q1 vs Q7 comparison — the player's own words as a mirror */}
    {q1AnswerText.trim().length > 0 && q7AnswerText.trim().length > 0 && (
      <div className="animate-fade-up delay-400" style={{ marginBottom: "3rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--color-text-light)", fontStyle: "italic", marginBottom: "0.5rem" }}>
            At the start, you said:
          </p>
          <div style={{ borderLeft: "3px solid var(--color-gold-mid)", paddingLeft: "1.2rem" }}>
            <p style={{ fontSize: "1.05rem", color: "var(--color-text)", fontWeight: 500, lineHeight: 1.65, margin: 0 }}>
              {q1AnswerText}
            </p>
          </div>
        </div>
        <div>
          <p style={{ fontSize: "0.9rem", color: "var(--color-text-light)", fontStyle: "italic", marginBottom: "0.5rem" }}>
            Just now, you said:
          </p>
          <div style={{ borderLeft: "3px solid var(--color-gold-dark)", paddingLeft: "1.2rem" }}>
            <p style={{ fontSize: "1.05rem", color: "var(--color-text)", fontWeight: 500, lineHeight: 1.65, margin: 0 }}>
              {q7AnswerText}
            </p>
          </div>
        </div>
      </div>
    )}

    {/* Q10 quote-back — the question they chose for themselves */}
    {q10AnswerText.trim().length > 0 && (
      <div className="animate-fade-up delay-600" style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-light)", fontStyle: "italic", lineHeight: 1.7, marginBottom: "1rem", textAlign: "center" }}>
          When asked what question you most needed to ask yourself — you chose:
        </p>
        <div style={{ borderLeft: "3px solid var(--color-gold-dark)", paddingLeft: "1.2rem" }}>
          <p style={{ fontSize: "1.1rem", color: "var(--color-text)", fontWeight: 500, lineHeight: 1.65, fontStyle: "normal", margin: 0 }}>
            {q10AnswerText}
          </p>
        </div>
      </div>
    )}

    {showContinue && (
      <div className="animate-fade-up" style={{ marginTop: "auto", paddingTop: "2rem", width: "100%", maxWidth: "360px", margin: "0 auto" }}>
        <button className="btn-primary" onClick={advancePhase}>Continue</button>
      </div>
    )}
  </div>

PHASE 3 — Benefit + Hidden Cost.
  <div style={{ flex: 1, display: "flex", flexDirection: "column", textAlign: "center" }}>
    {/* Benefit line */}
    <p className="animate-fade-up delay-200" style={{ fontSize: "1.15rem", lineHeight: 1.8, color: "var(--color-text-light)", marginBottom: "3rem" }}>
      {resultData.reflectionLines[1]}
    </p>

    {/* Hidden cost box */}
    <div className="animate-fade-up delay-400" style={{
      padding: "1.8rem 1.5rem",
      background: "linear-gradient(135deg, rgba(251,229,184,0.25), rgba(243,206,133,0.1))",
      borderRadius: "16px",
      border: "1px solid rgba(243,206,133,0.3)",
      marginBottom: "2rem"
    }}>
      <p style={{ fontSize: "1.25rem", lineHeight: 1.8, color: "var(--color-text)", fontStyle: "italic", margin: 0 }}>
        {resultData.reflectionLines[2]}
      </p>
    </div>

    {showContinue && (
      <div className="animate-fade-up" style={{ marginTop: "auto", paddingTop: "2rem", width: "100%", maxWidth: "360px", margin: "0 auto" }}>
        <button className="btn-primary" onClick={advancePhase}>Continue</button>
      </div>
    )}
  </div>

PHASE 4 — Bigger Picture + Closing.
This is the final phase. No continue button. Keep the RevealWords component for the punchline.
  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
    {/* Quiet opener */}
    <p className="animate-fade-up delay-200" style={{ fontSize: "1.25rem", lineHeight: 1.9, marginBottom: "2rem", color: "var(--color-text-light)", fontStyle: "italic", textAlign: "center" }}>
      "What determines your path is rarely a single, brilliant choice."
    </p>

    {/* Punchline — word-by-word reveal */}
    <p className="animate-fade-up delay-400" style={{ fontSize: "1.35rem", lineHeight: 1.9, color: "var(--color-text)", fontWeight: 500, textAlign: "center", marginBottom: "3rem" }}>
      <RevealWords
        text="It is the quiet, automatic habit you fall back on every time you simply don't know what to do."
        startDelay={0.8}
      />
    </p>

    {/* Closing question — replaces "Sit with this." */}
    <div className="animate-fade-up delay-800" style={{ textAlign: "center", marginBottom: "4rem" }}>
      <p style={{ fontSize: "1.6rem", fontWeight: 500, color: "var(--color-text)", lineHeight: 1.6 }}>
        What has it cost you?
      </p>
      {name.trim() && (
        <div className="animate-breathe-delayed" style={{ fontSize: "2.4rem", fontWeight: 400, color: "var(--color-text)", marginTop: "2rem" }}>
          {name.trim().split(" ")[0]}
        </div>
      )}
      <p style={{ fontSize: "0.95rem", color: "var(--color-text-light)", fontStyle: "italic", marginTop: "1.5rem" }}>
        The speaker will return shortly.
      </p>
    </div>

    {/* See more detail — expandable */}
    <div style={{ borderTop: "1px solid rgba(243,206,133,0.35)", paddingTop: "2rem" }}>
      <button
        onClick={() => setShowDetail(prev => !prev)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-main)",
          fontSize: "0.95rem",
          color: "var(--color-text-light)",
          textAlign: "center",
          width: "100%",
          padding: "0.5rem",
          opacity: 0.7
        }}
      >
        {showDetail ? "Hide detail" : "See your detailed pattern"}
      </button>

      {showDetail && (
        <div className="animate-fade-up" style={{ marginTop: "2rem" }}>
          {/* Chips grid */}
          <div style={{ marginBottom: "3rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
              {[resultData.chip, ...resultData.secondaryChips].map((chip, idx) => (
                <div key={idx} style={{
                  padding: "0.8rem 1rem",
                  background: "linear-gradient(135deg, var(--color-gold-light), var(--color-gold-mid))",
                  borderRadius: "14px",
                  fontWeight: idx === 0 ? 600 : 500,
                  fontSize: "1rem",
                  textAlign: "center",
                  color: "var(--color-text)",
                  boxShadow: "0 4px 12px rgba(220, 180, 110, 0.2)"
                }}>
                  {chip}
                </div>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            {resultData.sliders.map((slider, idx) => (
              <div key={idx}>
                <div style={{ fontSize: "0.85rem", letterSpacing: "1.5px", color: "var(--color-text-light)", textTransform: "uppercase", marginBottom: "1rem", textAlign: "center" }}>
                  {slider.title}
                </div>
                <div style={{ position: "relative", paddingBottom: "1.5rem" }}>
                  <div style={{ width: "100%", height: "2px", background: "rgba(0,0,0,0.08)", borderRadius: "1px", position: "relative" }}>
                    <div style={{ position: "absolute", left: "50%", top: "-4px", width: "1px", height: "10px", background: "rgba(0,0,0,0.15)", transform: "translateX(-50%)" }} />
                    <div style={{
                      position: "absolute", width: "20px", height: "20px",
                      background: "#fff", border: "2.5px solid var(--color-gold-dark)", borderRadius: "50%",
                      top: "-9px",
                      left: `${getModulatedSliderValue(slider.value, dominantCount)}%`,
                      transform: "translateX(-50%)",
                      transition: `left 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${0.3 + idx * 0.2}s`,
                      boxShadow: "0 2px 10px rgba(200, 150, 80, 0.35)", zIndex: 2
                    }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.8rem" }}>
                    <span style={{ fontSize: "0.95rem", color: "var(--color-text)", fontWeight: 500 }}>{slider.label1}</span>
                    <span style={{ fontSize: "0.95rem", color: "var(--color-text)", fontWeight: 500 }}>{slider.label2}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* CAE GOH watermark */}
    <div style={{ textAlign: "center", marginTop: "3rem", opacity: 0.3, fontSize: "0.85rem", letterSpacing: "4px" }}>
      CAE GOH
    </div>
  </div>

Change 5: Keep the SectionDivider and RevealWords components.
SectionDivider is no longer used in the main flow (sections are replaced by phases) but you can keep it in the file for the expandable detail section if desired, or remove it. RevealWords IS used in Phase 4 — keep it.

Change 6: Remove the mounted state for slider animation.
The sliders are now inside the expandable detail section. When the player taps "See your detailed pattern", the sliders should animate from centre to their value. Use the showDetail state as the trigger instead of mounted:
  Replace all references to `mounted` with `showDetail` for slider left positioning.
  Remove the old mounted useEffect if it's no longer needed.

WHAT NOT TO CHANGE
- Do not change the result-curtain div (keep the theatrical entry).
- Do not change the getModulatedSliderValue logic (except the thresholds in Change 3).
- Do not change App.tsx, useGameState.ts, or any other component.
- Do not add any content that labels or categorises the player (no dimension names prominently displayed).
```

---

## BATCH 6 — Ambient Orbs

```
You are implementing subtle ambient orb responsiveness in a React + TypeScript web app called "Predictable Destiny."

PROJECT OVERVIEW
A psychological minigame for live webinars. Two large blurred radial gradient orbs float behind the glass container, giving the frosted-glass effect something to blur against. Currently they are purely decorative — identical for every player. This change makes them subtly respond to the player's behavioural pattern as it emerges during gameplay.

The player will NOT consciously notice the change. This is subliminal atmospheric mirroring — the room feels slightly different for different players without anyone being told why.

CODING RULES — FOLLOW STRICTLY
- TypeScript strict mode. No `any` type. No non-null assertion (`!`). No `as unknown as T` casts.
- Use double quotes for all strings.
- Use template literals or .join() instead of string concatenation with +.
- Write clear JSDoc comments on functions and interfaces.
- No placeholder comments — write complete code.
- Do not change any file not listed in the CHANGES section below.

FILES TO READ BEFORE STARTING
1. src/App.tsx — read the entire file. Note the ambient-orb-1 and ambient-orb-2 divs and how gameState is used.
2. src/hooks/useGameState.ts — understand the computeDominantDimension function and the answers array.
3. src/index.css — read the .ambient-orb-1 and .ambient-orb-2 classes and the @keyframes floatOrb.

CHANGES TO MAKE

--- FILE: src/App.tsx ---

Change 1: Compute the current dominant dimension from answers so far.
Add a useMemo that computes the current dominant dimension whenever answers change. Only compute if at least 1 answer exists:

  import { useMemo } from "react";  // add to existing import

  const currentDominant: Dimension | null = useMemo(() => {
    if (gameState.answers.length === 0) return null;
    return gameState.computeDominantDimension(0, gameState.answers.length);
  }, [gameState.answers]);

Import the Dimension type from "../data/content" if not already imported.

Change 2: Define orb style overrides based on dominant dimension.
Create a useMemo that returns inline style overrides for each orb:

  /**
   * Subliminal orb adjustments based on the player's emerging pattern.
   * Changes are deliberately subtle — the player should feel the room
   * is different without being able to name why.
   *
   * A (action): warmer, faster — the room feels energised
   * B (waiting): cooler, slower — the room feels still
   * C (calculating): sharper edges (less blur) — the room feels precise
   * D (preserving): orbs drift apart — the room feels spacious
   */
  const orbOverrides = useMemo(() => {
    if (currentDominant === null) {
      return { orb1: {} as React.CSSProperties, orb2: {} as React.CSSProperties };
    }

    switch (currentDominant) {
      case "A":
        return {
          orb1: { animationDuration: "18s", background: "radial-gradient(circle, rgba(255, 190, 100, 0.22) 0%, rgba(200, 150, 80, 0) 70%)" } as React.CSSProperties,
          orb2: { animationDuration: "22s", background: "radial-gradient(circle, rgba(245, 195, 110, 0.2) 0%, rgba(200, 150, 80, 0) 70%)" } as React.CSSProperties
        };
      case "B":
        return {
          orb1: { animationDuration: "35s", background: "radial-gradient(circle, rgba(220, 200, 160, 0.15) 0%, rgba(180, 160, 120, 0) 70%)" } as React.CSSProperties,
          orb2: { animationDuration: "40s", background: "radial-gradient(circle, rgba(210, 190, 150, 0.12) 0%, rgba(180, 160, 120, 0) 70%)" } as React.CSSProperties
        };
      case "C":
        return {
          orb1: { animationDuration: "25s", filter: "blur(25px)" } as React.CSSProperties,
          orb2: { animationDuration: "30s", filter: "blur(30px)" } as React.CSSProperties
        };
      case "D":
        return {
          orb1: { top: "-15%", left: "-15%", animationDuration: "28s" } as React.CSSProperties,
          orb2: { bottom: "-25%", right: "-25%", animationDuration: "33s" } as React.CSSProperties
        };
    }
  }, [currentDominant]);

Change 3: Apply the overrides to the orb divs.
Replace the plain divs:
  <div className="ambient-orb-1" />
  <div className="ambient-orb-2" />
With:
  <div className="ambient-orb-1" style={orbOverrides.orb1} />
  <div className="ambient-orb-2" style={orbOverrides.orb2} />

Note: inline styles override the CSS class properties. The CSS class still provides the base positioning, sizing, and animation. The inline styles only override the specific properties listed above. The transition between different dominant dimensions will happen abruptly (no CSS transition on these properties), but since the changes are subtle and the orbs are blurred, this is acceptable. If the dominant dimension changes between answers, the orb adjustment happens instantly.

WHAT NOT TO CHANGE
- Do not change the CSS classes .ambient-orb-1 or .ambient-orb-2 in index.css.
- Do not change the @keyframes floatOrb animation.
- Do not change any component files.
- Do not change useGameState.ts or content.ts.
- Do not add any visible UI indicator of the orb changes — the entire point is that the player does not notice.
```

---

## BATCH 7 — Sound Research & Implementation

```
You are adding a single ambient sound effect to a React + TypeScript web app called "Predictable Destiny."

PROJECT OVERVIEW
A psychological minigame for live webinars. The entire game is silent. The Surprise Screen is the most psychologically loaded moment — it appears between Stage II and Stage III, auto-advances after 4 seconds, and shows: "You've been making the same choice. Have you noticed?"

You are adding ONE sound — a low, soft ambient tone — that plays ONLY on the Surprise Screen. No other sounds anywhere in the game. The silence throughout the game makes this single moment of sound physically significant.

TARGET AUDIENCE: Business owners aged 40–65 on their phones during a live webinar. The sound must not be jarring, loud, or startling. It must feel like the room itself is humming, not like an alert.

CODING RULES — FOLLOW STRICTLY
- TypeScript strict mode. No `any` type. No non-null assertion (`!`). No `as unknown as T` casts.
- Use double quotes for all strings.
- Use template literals or .join() instead of string concatenation with +.
- Write clear JSDoc comments on functions and interfaces.
- No placeholder comments — write complete code.
- Do not change any file not listed in the CHANGES section below.

STEP 1: FIND A SUITABLE SOUND
Search online for a royalty-free ambient tone with these characteristics:
- Low frequency, around 60–100Hz (a deep hum, like a resonant C2 or D2 note)
- Duration: 3–5 seconds
- Smooth, sustained tone — no sharp attack, no percussion, no melody
- Think: the sound of a large empty room, or a distant bell's resonance, or a Tibetan singing bowl's low hum fading
- Must be royalty-free / CC0 / free for commercial use
- Preferred sources: freesound.org, pixabay.com/sound-effects, mixkit.co, or similar
- File format: MP3 preferred (smaller file size), OGG acceptable as fallback
- File size: under 100KB if possible (it's a short, simple tone)

If you cannot find an exact match, the closest approximation is acceptable. The key requirement is: low, soft, not startling, not musical.

Download the file and save it to: public/sounds/ambient-tone.mp3
(Create the public/sounds/ directory if it does not exist.)

STEP 2: IMPLEMENT IN SURPRISESCREEN
--- FILE: src/components/SurpriseScreen.tsx ---

Change 1: Add audio playback on mount.
When the Surprise Screen mounts (and is not transitioning), create an Audio element, set its volume to 0 (for fade-in), and play it. Fade the volume from 0 to 0.3 over 2 seconds using a setInterval (incrementing volume by ~0.015 every 100ms). When the component unmounts or begins transitioning out, fade volume from current level to 0 over 1 second, then pause and clean up.

Implementation approach:
  useEffect(() => {
    if (isTransitioning) return;

    const audio = new Audio("/sounds/ambient-tone.mp3");
    audio.volume = 0;
    audio.loop = true;

    /** Attempt to play — browsers may block autoplay without prior user interaction.
     *  Since the player has been tapping buttons throughout the game, autoplay
     *  should be allowed. If it fails, silently ignore — the game works without sound. */
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked — silent fallback. The game works without sound.
      });
    }

    // Fade in: 0 → 0.3 over 2 seconds
    let currentVolume = 0;
    const fadeIn = setInterval(() => {
      currentVolume = Math.min(currentVolume + 0.015, 0.3);
      audio.volume = currentVolume;
      if (currentVolume >= 0.3) clearInterval(fadeIn);
    }, 100);

    // Cleanup: fade out and stop
    return () => {
      clearInterval(fadeIn);
      let fadeOutVolume = audio.volume;
      const fadeOut = setInterval(() => {
        fadeOutVolume = Math.max(fadeOutVolume - 0.03, 0);
        audio.volume = fadeOutVolume;
        if (fadeOutVolume <= 0) {
          clearInterval(fadeOut);
          audio.pause();
          audio.src = "";
        }
      }, 100);
    };
  }, [isTransitioning]);

Change 2: No UI change.
Do not add any volume controls, mute buttons, or audio indicators. The sound simply exists in the room. The player cannot control it. It lasts 4 seconds (the duration of the Surprise Screen) and then the screen advances and the sound fades out.

WHAT NOT TO CHANGE
- Do not change the auto-advance timer (4000ms).
- Do not change the text content.
- Do not change the surprise-progress element.
- Do not change the animate-breathe class.
- Do not add sound to any other screen or component.
- Do not change App.tsx, useGameState.ts, index.css, or any other component.
```

---

## Running Order Reference

| Batch | Description | Files Changed | Run After | Can Parallel With |
|-------|-------------|---------------|-----------|-------------------|
| 1 | Content restructuring | `content.ts` | — (first) | — |
| 2 | State & flow | `useGameState.ts`, `App.tsx` | Batch 1 | — |
| 3 | QuestionScreen | `QuestionScreen.tsx` | Batch 2 | 4, 6, 7 |
| 4 | ReflectionScreen | `ReflectionScreen.tsx` | Batch 2 | 3, 6, 7 |
| 5 | Result page | `ResultScreen.tsx` | All others (run last) | — |
| 6 | Ambient orbs | `App.tsx`, `index.css` | Batch 2 | 3, 4, 7 |
| 7 | Sound | `SurpriseScreen.tsx`, audio file | Batch 2 | 3, 4, 6 |
