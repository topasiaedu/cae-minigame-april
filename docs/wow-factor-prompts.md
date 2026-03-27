# Agent Implementation Prompts — Wow-Factor Enhancements

Five self-contained prompts. Run Batch W1 first. Then run W2, W3, W4, W5 in any order (or in parallel sessions) after W1 completes.

---

## BATCH W1 — CSS Foundation + Background Image

```
You are implementing CSS foundation changes and fixing the background image path for a React + TypeScript web app called "Predictable Destiny."

PROJECT OVERVIEW
A psychological minigame for live webinars. Players answer 15 questions across 3 stages. Their answers reveal one of 4 behavioural dimensions. The app is built with Vite + React + TypeScript + vanilla CSS. All styling lives in src/index.css. Static assets served at root URL must live in the public/ folder.

CODING RULES — FOLLOW STRICTLY
- TypeScript strict mode. No `any` type. No non-null assertion (`!`). No `as unknown as T` casts.
- Use double quotes for all strings.
- Use template literals or .join() instead of string concatenation with +.
- Write clear JSDoc comments on functions and interfaces.
- No placeholder comments — write complete code.
- Do not change any file not listed in the CHANGES section below.

FILES TO READ BEFORE STARTING
1. src/index.css — read the entire file so you understand the existing design tokens, keyframes, and class structure before adding anything.

BACKGROUND IMAGE FIX
The file `background.jpeg` exists at the project root (same level as `src/`, `public/`, `package.json`).
The CSS at line 54 references `background-image: url('/background.jpeg')`.
In a Vite project, files served at `/` must live in the `public/` directory.
ACTION: Copy `background.jpeg` from the project root into `public/background.jpeg`.
Do NOT modify the CSS — the path `/background.jpeg` is already correct once the file is in `public/`.

CHANGES TO MAKE

--- FILE: src/index.css ---

Change 1: Fix the @keyframes breathe animation.
The current keyframe starts at opacity 0.3, which creates a visible opacity dip when the animation runs on an element whose parent is still fading in via animate-fade-up.
Replace the existing @keyframes breathe block with this version:

  @keyframes breathe {
    0%   { opacity: 1;   transform: scale(1);    }
    50%  { opacity: 1;   transform: scale(1.06); }
    100% { opacity: 0.55; transform: scale(1);   }
  }

This makes the breathe start at full opacity (matching the end state of a fade-up), pulse gently up in scale, then settle to 0.55 — a subtle presence rather than a dramatic throb.
Keep the .animate-breathe class unchanged (animation: breathe 3.5s ease-in-out infinite).

Change 2: Add .animate-breathe-delayed class.
Immediately after the .animate-breathe class, add:

  /**
   * Delayed breathe variant for elements whose parent fades in over ~2s.
   * The 2.2s delay ensures the breathe cycle starts only after the
   * parent animate-fade-up delay-1200 has fully resolved.
   */
  .animate-breathe-delayed {
    animation: breathe 3.5s ease-in-out 2.2s infinite;
  }

Change 3: Raise .roman-watermark opacity.
Find the .roman-watermark rule. Change opacity from 0.02 to 0.04.
This makes the watermark subtly perceptible at the edges of vision without competing with the copy.

Change 4: Add SurpriseScreen progress line animation.
After the existing .animate-breathe / .animate-breathe-delayed classes, add:

  /* ─── Surprise Screen Progress Line ─────────────────────────────────────── */

  /**
   * 4-second linear fill that spans the full width of the screen.
   * Duration matches the SurpriseScreen auto-advance timer exactly.
   * The line signals to the player that waiting is intentional, not a bug.
   */
  @keyframes surpriseProgress {
    0%   { width: 0%; }
    100% { width: 100%; }
  }

  .surprise-progress {
    position: absolute;
    bottom: 2.5rem;
    left: 0;
    height: 1px;
    width: 0%;
    background: var(--color-gold-dark);
    opacity: 0.45;
    animation: surpriseProgress 4s linear forwards;
    pointer-events: none;
  }

Change 5: Add result page curtain animation.
Add after the surprise-progress block:

  /* ─── Result Page Entry Curtain ──────────────────────────────────────────── */

  /**
   * A semi-dark overlay rendered on the result page that fades from visible
   * to invisible over 1.8s. Creates a "theatre lights dropping" effect that
   * gives the result reveal a moment of weight before the content appears.
   * pointer-events: none throughout — it never blocks interaction.
   */
  @keyframes curtainFade {
    0%   { opacity: 1; }
    22%  { opacity: 1; }
    100% { opacity: 0; }
  }

  .result-curtain {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(30, 20, 10, 0.62);
    z-index: 50;
    pointer-events: none;
    animation: curtainFade 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

Change 6: Add Stage III progress bar class.
Add after the result-curtain block:

  /* ─── Stage III Progress Bar ─────────────────────────────────────────────── */

  /**
   * Overrides the gold gradient on the progress bar for Stage III questions.
   * Amber/copper tones signal a heavier register without alarming the player.
   */
  .stage3-progress-bar {
    background: linear-gradient(90deg, rgba(200, 110, 40, 0.85), rgba(160, 70, 20, 1)) !important;
  }

Change 7: Add character-reveal animation for Reflection 2 header.
Add after the stage3-progress-bar block:

  /* ─── Character-by-Character Reveal ─────────────────────────────────────── */

  /**
   * Used on Reflection 2's header "A silent repetition."
   * Each character span is given an increasing animation-delay inline.
   * The result: the phrase assembles itself character by character,
   * creating a felt sense that the pattern is being named slowly.
   */
  @keyframes charReveal {
    0%   { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0);   }
  }

  .char-reveal-container {
    display: inline;
  }

  .char-span {
    display: inline-block;
    opacity: 0;
    animation: charReveal 0.35s ease forwards;
  }

  /* Preserve space characters in the reveal */
  .char-span-space {
    display: inline-block;
    width: 0.28em;
  }

WHAT NOT TO CHANGE
- Do not change any component .tsx files.
- Do not change any other CSS rules beyond what is listed above.
- Do not change the color tokens, font imports, or :root variables.
- Do not change transition/animation classes not listed above.
```

---

## BATCH W2 — QuestionScreen Visual Overhaul

```
You are implementing visual and interaction enhancements to the question screen of a React + TypeScript web app called "Predictable Destiny."

PROJECT OVERVIEW
A psychological minigame for live webinars. Players answer 15 questions across 3 stages:
- Stage I (Q1–Q5): "The Unknown" — future-oriented scenarios
- Stage II (Q6–Q10): "The Aftermath" — retrospective reflection
- Stage III (Q11–Q15): "The Mirror" — direct self-confrontation

Stage III is the psychologically heaviest stage. After each Stage III answer, an echo appears comparing the current selection to the player's corresponding Stage I answer. Currently, both "Still here." and "Something has shifted." render a gold expanding line beneath them. This batch removes that line from "Something has shifted." — the absence becomes meaningful. It also adds visual weight to Stage III via the progress bar and the Q11 entry.

CODING RULES — FOLLOW STRICTLY
- TypeScript strict mode. No `any` type. No non-null assertion (`!`). No `as unknown as T` casts.
- Use double quotes for all strings.
- Use template literals or .join() instead of string concatenation with +.
- Write clear JSDoc comments on functions and interfaces.
- No placeholder comments — write complete code.
- Do not change any file not listed in the CHANGES section below.

FILES TO READ BEFORE STARTING
1. src/components/QuestionScreen.tsx — read the entire file. Key sections:
   - The EchoContent type definition and echoContent useMemo
   - The comparison echo render block at the bottom (the `echoContent.type === "comparison"` branch)
   - The progress bar inline div
   - The STAGE_OVERLAYS constant
   - The handleSelect function and stage variable
2. src/index.css — confirm that .stage3-progress-bar and .echo-line-expand classes exist (added in Batch W1). Do not modify this file.

CHANGES TO MAKE

--- FILE: src/components/QuestionScreen.tsx ---

Change 1: Echo asymmetry — gold line only for "Still here."
In the comparison echo render block (the `echoContent.type === "comparison"` branch), find the line:
  <div className="echo-line-expand" />
This renders the expanding gold line for ALL Stage III comparisons. It should only render when the player chose the SAME pattern as Stage I.

Update the render so the gold line is conditional:
  {echoContent.primary === "Still here." && <div className="echo-line-expand" />}

When the answer is different ("Something has shifted."), the gold line is absent. The player who has seen "Still here." gold lines in earlier Stage III questions will notice its absence — that contrast is intentional.
Do not change the primary text, secondary text, or any other styling in this block.

Change 2: Stage III progress bar color.
The progress bar inner fill div is currently inline-styled with:
  background: "linear-gradient(90deg, var(--color-gold-light), var(--color-gold-dark))"

For Stage III questions (questionIndex >= 10), add the className "stage3-progress-bar" to this div to apply the amber/copper gradient defined in index.css (from Batch W1).
For Stage I and Stage II questions, do not apply the class — keep the existing gold inline style.

The resulting style attribute and className should be:
  style={{
    height: "100%",
    width: `${Math.max(progressPercent, 8)}%`,
    ...(questionIndex < 10 && {
      background: "linear-gradient(90deg, var(--color-gold-light), var(--color-gold-dark))"
    }),
    transition: "width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)"
  }}
  className={questionIndex >= 10 ? "stage3-progress-bar" : undefined}

Change 3: Q11 entry — slightly heavier background tint.
The STAGE_OVERLAYS constant defines per-stage background tints. For Q11 specifically (the very first Stage III question, questionIndex === 10), the entry should feel noticeably heavier than Q12–Q15 — it is the first moment in the new stage.

Below the STAGE_OVERLAYS constant, add a computed value for the glass-container background:

  /**
   * Q11 (questionIndex 10) gets an extra layer of darkness on entry.
   * This is purely cosmetic — it signals the stage shift at the exact
   * moment the player crosses into Stage III for the first time.
   */
  const containerBackground =
    questionIndex === 10
      ? "rgba(100, 50, 20, 0.18)"
      : STAGE_OVERLAYS[stage];

Use containerBackground instead of STAGE_OVERLAYS[stage] in the glass-container's style prop:
  <div
    className={`glass-container ${transClass}`}
    style={{ background: containerBackground }}
  >

WHAT NOT TO CHANGE
- Do not change the question text rendering.
- Do not change option card rendering, shuffle logic, or scoring.
- Do not change the handleSelect function beyond what is listed.
- Do not change the stage label, back button, or question counter.
- Do not change the echo text content (the primary/secondary strings themselves).
- Do not modify index.css.
```

---

## BATCH W3 — SurpriseScreen Enhancement

```
You are implementing visual enhancements to the SurpriseScreen component of a React + TypeScript web app called "Predictable Destiny."

PROJECT OVERVIEW
A psychological minigame for live webinars. The SurpriseScreen is shown once, between Reflection 2 and the Stage III intro. It auto-advances after 4000ms. The player cannot skip it — it is the only screen in the game they cannot control. Its content confronts them silently:
  Primary:   "You've been making the same choice."  (1.8rem, centered)
  Secondary: "Have you noticed?"                    (1.3rem, italic, muted)

The problem: on a light background, these two lines of text sitting still for 4 seconds look like a loading state. Players aged 40–65 in a live webinar context will assume the app has frozen. This batch adds two changes that signal the wait is deliberate: a slow breathing pulse on the primary text, and a thin gold progress line that crawls across the bottom of the screen over exactly 4 seconds.

CODING RULES — FOLLOW STRICTLY
- TypeScript strict mode. No `any` type. No non-null assertion (`!`). No `as unknown as T` casts.
- Use double quotes for all strings.
- Use template literals or .join() instead of string concatenation with +.
- Write clear JSDoc comments on functions and interfaces.
- No placeholder comments — write complete code.
- Do not change any file not listed in the CHANGES section below.

FILES TO READ BEFORE STARTING
1. src/components/SurpriseScreen.tsx — read the entire file.
2. src/index.css — confirm that .surprise-progress and .animate-breathe classes exist (added in Batch W1). Do not modify this file.

CHANGES TO MAKE

--- FILE: src/components/SurpriseScreen.tsx ---

Change 1: Breathe animation on primary text.
The primary text <p> element currently has className="animate-fade-up delay-400" and no breathe animation.
Add className="animate-fade-up delay-400 animate-breathe" to this element.

The animate-breathe class runs on a 3.5s cycle, and the element will be fading in via animate-fade-up for the first 0.4s + 0.8s (delay + duration). The breathe cycle will be partway through its first loop when the text becomes visible — this is acceptable and looks intentional. The revised breathe keyframe (starting at opacity 1, from Batch W1) ensures no dip occurs.

Change 2: Add the progress line element.
The SurpriseScreen glass-container div currently has style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}.

Add position: "relative" to this container's style so the absolute-positioned progress line can anchor to it.

Inside the glass-container, after the existing content div, add:
  {/**
   * A thin gold line that crawls left-to-right across the bottom of the
   * screen over exactly 4 seconds — matching the auto-advance timer.
   * This communicates "something is happening" without labelling it a loader.
   */}
  <div className="surprise-progress" />

The .surprise-progress CSS class (defined in Batch W1 index.css) handles all positioning and animation. Do not add inline styles to this element.

WHAT NOT TO CHANGE
- Do not change the auto-advance timer duration (4000ms).
- Do not change the secondary text ("Have you noticed?").
- Do not change the onProceed or isTransitioning logic.
- Do not modify index.css.
```

---

## BATCH W4 — Result Page Theatrical Opening & Structural Overhaul

```
You are implementing a theatrical entry moment and structural content reordering on the result screen of a React + TypeScript web app called "Predictable Destiny."

PROJECT OVERVIEW
A psychological minigame for live webinars. Players answer 15 questions. The result screen reveals their dominant behavioural dimension — one of:
- A: "Early Movement"
- B: "Seeking Clarity"
- C: "Calculated Risk"
- D: "Preserving Options"

The result screen is the psychological payoff of the entire game. Currently, it loads like every other screen — a smooth fade-in — and immediately launches into an interpretation chip grid. The three changes in this batch:

1. A dark curtain briefly covers the screen on entry, then fades away — creating a "theatre lights dropping" opening.
2. The player's dimension name ("Early Movement", "Seeking Clarity", etc.) is given its own standalone moment immediately after the identity header — before the chip grid.
3. The player's Q15 quote-back (the question they chose for themselves at Q15) is moved from inside Section 03 to immediately after the dimension reveal — making it the first personal moment the player encounters.

This reorders the experience from:
  Name → [Section 01: chips] → [Section 02: sliders] → [Section 03: reflection + quote-back] → [Section 04]
To:
  Name → Dimension reveal → Your question (Q15 quote-back) → [Section 01: chips] → [Section 02: sliders] → [Section 03: reflection only] → [Section 04]

CODING RULES — FOLLOW STRICTLY
- TypeScript strict mode. No `any` type. No non-null assertion (`!`). No `as unknown as T` casts.
- Use double quotes for all strings.
- Use template literals or .join() instead of string concatenation with +.
- Write clear JSDoc comments on functions and interfaces.
- No placeholder comments — write complete code.
- Do not change any file not listed in the CHANGES section below.

FILES TO READ BEFORE STARTING
1. src/components/ResultScreen.tsx — read the entire file carefully. Understand:
   - The ResultScreenProps interface
   - The mounted state and how it controls slider animation
   - The SectionDivider component
   - The RevealWords component
   - Section 0 (identity header)
   - Section 01 (chip grid — the current first section after the header)
   - Section 03 (currently contains the q15AnswerText quote-back block)
   - The closing section (the breathing name block)
2. src/index.css — confirm that .result-curtain and .animate-breathe-delayed classes exist (added in Batch W1). Do not modify this file.
3. src/data/content.ts — confirm the structure of resultInterpretations so you understand what resultData.chip contains.

CHANGES TO MAKE

--- FILE: src/components/ResultScreen.tsx ---

Change 1: Add the dark entry curtain.
Inside the returned JSX, as the FIRST child of the .glass-container div (before the back button), add:

  {/**
   * Entry curtain — a semi-dark overlay that briefly covers the screen
   * before fading away over 1.8s. Gives the result reveal a theatrical
   * weight. pointer-events: none ensures it never blocks interaction.
   */}
  <div className="result-curtain" />

The .result-curtain class (from Batch W1 index.css) handles the animation entirely. No other changes needed for this element.

Change 2: Add the standalone dimension name reveal.
Currently, Section 0 (the identity header) is immediately followed by Section 01 (chip grid, className="animate-fade-up delay-400").

Between the closing </header> tag of Section 0 and the opening <section> of Section 01, insert a new block:

  {/**
   * Standalone dimension name reveal.
   * The primary chip name gets its own moment before the interpretive
   * sections begin — giving the player a beat to recognise themselves
   * in the label before being handed the full interpretation.
   */}
  <div
    className="animate-fade-up delay-400"
    style={{
      textAlign: "center",
      marginBottom: "3.5rem"
    }}
  >
    <div style={{
      fontSize: "2rem",
      fontWeight: 400,
      color: "var(--color-text)",
      letterSpacing: "0.5px",
      marginBottom: "1.2rem"
    }}>
      {resultData.chip}
    </div>
    <div className="echo-line-expand" style={{ margin: "0 auto" }} />
  </div>

Since this new block uses delay-400, update the existing Section 01 (chips) to use delay-600 instead of delay-400. Update Section 02 (sliders) from delay-600 to delay-800. Update Section 03 (reflection) from delay-800 to delay-1000. Update Section 04 (bigger picture) from delay-1000 to delay-1200. Update the closing section from delay-1200 to delay-1400 (add this delay class to index.css if it does not already exist — if delay-1400 is not in index.css, add it as `.delay-1400 { animation-delay: 1.4s; }`).

Change 3: Relocate the Q15 quote-back block.
Currently, the Q15 quote-back is rendered inside Section 03 ("What this pattern may mean"), between the second reflection line and the gold hidden-cost box. Remove it from there.

Reinsert the exact same quote-back block (the conditional that checks q15AnswerText.trim().length > 0) as a new standalone section between the dimension reveal block and Section 01:

  {q15AnswerText.trim().length > 0 && (
    <section
      className="animate-fade-up delay-600"
      style={{ marginBottom: "4rem" }}
    >
      {/**
       * The player's own Q15 answer — the question they chose for
       * themselves — quoted back before any interpretation begins.
       * This is the first personalised moment on the result page.
       */}
      <p style={{
        fontSize: "0.9rem",
        color: "var(--color-text-light)",
        fontStyle: "italic",
        lineHeight: 1.7,
        marginBottom: "1rem",
        textAlign: "center"
      }}>
        When asked what question you most needed to ask yourself — you chose:
      </p>
      <div style={{
        borderLeft: "3px solid var(--color-gold-dark)",
        paddingLeft: "1.2rem"
      }}>
        <p style={{
          fontSize: "1.1rem",
          color: "var(--color-text)",
          fontWeight: 500,
          lineHeight: 1.65,
          fontStyle: "normal",
          margin: 0
        }}>
          {q15AnswerText}
        </p>
      </div>
    </section>
  )}

After this, push all remaining sections' delay classes forward by 200ms (delay-600 → delay-800 for chips, etc.) if the quote-back section is rendered. Since conditional rendering affects layout but not timing (all delay classes run from mount), you do not need to dynamically compute delays — simply assign the static delays in the new order:

  New delay assignments (final order after all changes in this batch):
  - Dimension name reveal:     delay-400  (Change 2)
  - Q15 quote-back section:    delay-600  (Change 3, this block)
  - Section 01 chips:          delay-800
  - Section 02 sliders:        delay-1000
  - Section 03 reflection:     delay-1200  (add .delay-1200 to closing name too if needed, but see Change 4)
  - Section 04 bigger picture: delay-1400  (needs new delay class — see note below)
  - Closing section:           delay-1400  (same as Section 04 — closing fades in together)

  NOTE on delay-1400: If this class does not exist in index.css, add it inline to the element as:
    style={{ animationDelay: "1.4s" }}
  OR add it directly in index.css (acceptable in this batch as a single-line addition at the end of the stagger delay block). Do not restructure index.css beyond this one addition.

Change 4: Fix animate-breathe on the closing name element.
In the closing section, find the <div> element that has className="animate-breathe". Replace it with className="animate-breathe-delayed".

The .animate-breathe-delayed class (added to index.css in Batch W1) starts the breathe cycle after 2.2s, ensuring it does not begin until after the section's own fade-in has completed. This eliminates the visible opacity dip that occurs when a breathe-animated element's parent is still fading in.

Section 03 changes (after quote-back is removed):
The reflectionLines[1] paragraph currently has marginBottom: "1.5rem" (it was set to 1.5rem in Batch 6 of the original series after the quote-back was inserted between it and the hidden-cost box). Now that the quote-back is gone from this section, update reflectionLines[1]'s paragraph to use marginBottom: "3rem" to restore the correct spacing between the benefit line and the hidden-cost box.

WHAT NOT TO CHANGE
- Do not change the SectionDivider component.
- Do not change the RevealWords component.
- Do not change the slider rendering or getModulatedSliderValue function.
- Do not change the ResultScreenProps interface.
- Do not change the mounted state logic.
- Do not change question content, reflection triggers, or scoring.
- Do not change App.tsx, useGameState.ts, or any other component.
```

---

## BATCH W5 — Reflection Screen Enhancement

```
You are implementing targeted enhancements to the Reflection Screen of a React + TypeScript web app called "Predictable Destiny."

PROJECT OVERVIEW
A psychological minigame for live webinars. After every 5 questions, a reflection screen fires:
- Reflection 1 (after Q5): "Have you noticed, [Name]?" — first mirror moment
- Reflection 2 (after Q10): "A silent repetition." — the pattern is named as a habit
- Reflection 3 (after Q15): "You've been here before." — the most confrontational; the map is drawn

These interstitials are currently static — text appears all at once, the player reads, and continues. This batch adds two targeted changes:
1. Reflection 2's header "A silent repetition." assembles character by character, making the naming feel like a slow recognition rather than a headline.
2. Reflection 3's entry is heavier — a slightly darker background and a longer screen fade-in signal that something has concluded.

CODING RULES — FOLLOW STRICTLY
- TypeScript strict mode. No `any` type. No non-null assertion (`!`). No `as unknown as T` casts.
- Use double quotes for all strings.
- Use template literals or .join() instead of string concatenation with +.
- Write clear JSDoc comments on functions and interfaces.
- No placeholder comments — write complete code.
- Do not change any file not listed in the CHANGES section below.

FILES TO READ BEFORE STARTING
1. src/components/ReflectionScreen.tsx — read the entire file. Understand:
   - How headerText is assigned per triggerBlock (the if/else if/else chain)
   - The glass-container div and its transClass
   - The <h2> that renders headerText
2. src/index.css — confirm that @keyframes charReveal, .char-span, and .char-span-space CSS classes exist (added in Batch W1). Do not modify this file.

CHANGES TO MAKE

--- FILE: src/components/ReflectionScreen.tsx ---

Change 1: Character-by-character header reveal for Reflection 2.
Currently the <h2> renders headerText as a plain string:
  <h2 className="animate-fade-up delay-200" style={{ ... }}>
    {headerText}
  </h2>

For Reflection 2 (triggerBlock === 2), instead of rendering the plain headerText string, split it into individual characters and render each as a span with a staggered animation delay.

Add a helper function inside the component (before the return):

  /**
   * Renders a string as individual character spans, each animated in
   * with a staggered delay. Space characters use .char-span-space for
   * correct width without invisible animated elements.
   *
   * @param text - The string to render character by character.
   * @param baseDelay - The delay (in seconds) before the first character appears.
   * @returns An array of span elements.
   */
  const renderCharByChar = (text: string, baseDelay: number): React.ReactElement[] => {
    return text.split("").map((char, idx): React.ReactElement => {
      if (char === " ") {
        return <span key={idx} className="char-span-space" />;
      }
      return (
        <span
          key={idx}
          className="char-span"
          style={{ animationDelay: `${baseDelay + idx * 0.04}s` }}
        >
          {char}
        </span>
      );
    });
  };

Then update the <h2> to conditionally use this helper:

  <h2
    className={triggerBlock === 2 ? "char-reveal-container delay-200" : "animate-fade-up delay-200"}
    style={{ fontSize: "2rem", marginBottom: "2.5rem", fontWeight: 400 }}
  >
    {triggerBlock === 2
      ? renderCharByChar(headerText, 0.2)
      : headerText
    }
  </h2>

For triggerBlock 1 and 3, the <h2> renders exactly as before (plain text, animate-fade-up delay-200).
For triggerBlock 2, each character fades up individually starting at 0.2s, with 40ms between each character. "A silent repetition." is 21 characters including spaces, so the last character appears at approximately 0.2 + 20 * 0.04 = 1.0s — a natural reading pace.

Change 2: Reflection 3 heavier entry.
Currently the glass-container div is:
  <div
    className={`glass-container ${transClass}`}
    style={{ position: "relative", overflow: "hidden" }}
  >

For Reflection 3 (triggerBlock === 3), apply two visual differences:
a) A darker background overlay — add a warm-dark tint to the glass-container:
b) A longer screen-enter animation duration — 1.1s instead of the default 0.8s

Update the glass-container div as follows:

  <div
    className={`glass-container ${transClass}`}
    style={{
      position: "relative",
      overflow: "hidden",
      ...(triggerBlock === 3 && {
        background: "rgba(100, 50, 15, 0.1)",
        animationDuration: triggerBlock === 3 && !isTransitioning ? "1.1s" : undefined
      })
    }}
  >

NOTE: animationDuration is only meaningful when the screen is entering (screen-enter class). When exiting (screen-exit), the transition duration is controlled by screen-exit. Only override it when !isTransitioning (i.e., the screen-enter class is active).

WHAT NOT TO CHANGE
- Do not change Reflection 1 or Reflection 2 entry behavior (only Reflection 3 gets the heavier treatment).
- Do not change the reflection text content (dynamicTriggers values).
- Do not change the CTA button text, the gold divider, or the back button.
- Do not change the roman-watermark element.
- Do not change App.tsx, useGameState.ts, index.css, or any other component.
```

---

## Running Order Reference

| Batch | Files Changed | Safe to Run With | Must Run After |
|---|---|---|---|
| W1 — CSS Foundation + Background | `src/index.css`, `public/background.jpeg` | — | — (run first) |
| W2 — QuestionScreen | `src/components/QuestionScreen.tsx` | W3, W4, W5 | W1 |
| W3 — SurpriseScreen | `src/components/SurpriseScreen.tsx` | W2, W4, W5 | W1 |
| W4 — Result Page | `src/components/ResultScreen.tsx` | W2, W3, W5 | W1 |
| W5 — Reflection Screen | `src/components/ReflectionScreen.tsx` | W2, W3, W4 | W1 |
