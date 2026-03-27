# Wow-Factor Enhancement Plan — Predictable Destiny

## What We're Doing

The game's psychological architecture is sound and its content is strong. The improvement-plan.md batches (W1–W6 of the original series) addressed correctness and integrity. This plan closes the gap between the game's *intent* and its *felt delivery*.

The current gap in one sentence: the content earns genuine psychological depth, but the moment-to-moment experience is too quiet to carry the weight of what it is trying to do. Without a background image, sound, and a few targeted theatrical moments, the game reads as a well-crafted quiz rather than a memorable event.

These changes do not alter game logic, scoring, question content, or the psychological arc. They improve the *delivery* of moments that already exist.

---

## Why These Changes Matter

| Gap | Current State | After These Changes |
|---|---|---|
| Background image missing | Flat beige — glassmorphism blurs nothing | Atmospheric depth on every screen |
| SurpriseScreen looks like a loading state | Blank text for 4 seconds, no motion | Progress line + breathing text signal intentionality |
| Result page has no reveal moment | Page fades in like any other screen | Brief dark curtain, then staged reveal |
| Dimension name buried in chip grid | Listed as the first chip among five | Given its own moment before the chips |
| Q15 quote-back is buried below sliders | Section 03, after 5 sliders | First personal moment after identity header |
| "Still here." and "Something has shifted." look identical | Both show the gold expanding line | Only "Still here." shows the line — absence becomes signal |
| animate-breathe causes opacity dip | Breathe cycle starts at opacity 0.3, visible through parent's fade-in | Breathe delayed until after fade-in completes |
| Roman numeral watermarks near-invisible | opacity 0.02 — purely a CSS artefact | opacity 0.04 — subtly perceptible |
| Stage III entry looks like Stage I | Same gold progress bar, same card styling | Amber-toned progress bar, slightly heavier Q11 entry |
| Reflection 2 header is static | "A silent repetition." appears all at once | Characters appear one by one, 40ms apart |

---

## Implementation Batches

All batches are self-contained. Batch W1 must run before W2–W5. W2–W5 may run in any order after W1.

---

### Batch W1 — CSS Foundation + Background Image

**Files:** `src/index.css` (edits), `background.jpeg` → `public/background.jpeg` (file copy)

This batch does two things: fixes the background image path and adds all CSS declarations needed by the later batches, so W2–W5 never need to touch index.css.

| Change | Detail |
|---|---|
| Copy `background.jpeg` to `public/` | Project root `background.jpeg` must be in `public/background.jpeg` for Vite to serve it at `/background.jpeg` |
| Fix `@keyframes breathe` | Change starting keyframe from `opacity: 0.3` to `opacity: 1`, so the breathe animation doesn't create an immediate dip after the parent fade-in |
| Add `.animate-breathe-delayed` class | Same as `animate-breathe` but with `animation-delay: 2.2s`, for use on the result page's closing name where the parent section takes ~2s to fade in |
| Roman numeral opacity | `.roman-watermark` opacity `0.02` → `0.04` |
| Add `@keyframes surpriseProgress` + `.surprise-progress` | 4s linear horizontal fill, gold, 1px high — for the SurpriseScreen bottom indicator |
| Add `@keyframes curtainFade` + `.result-curtain` | Full-screen dark overlay (rgba 0,0,0,0.55) that holds for 0.4s then fades to 0 over 1.4s, pointer-events none — for Result page theatrical entry |
| Add `.stage3-progress` CSS class | Gradient class using amber/copper tones (rgba 180,90,30 → rgba 160,70,20) for Stage III progress bar |
| Add `@keyframes charReveal` + `.char-reveal-container` + `.char-span` | Character-by-character stagger: each `.char-span` uses `animation: charReveal 0.4s ease forwards`, stagger applied inline via `animationDelay` — for Reflection 2 header |

---

### Batch W2 — QuestionScreen Visual Overhaul

**Files:** `src/components/QuestionScreen.tsx`
**Depends on:** W1 (reads updated index.css for `.stage3-progress` class)

| Change | Detail |
|---|---|
| Echo asymmetry | In the comparison echo render block, only render `<div className="echo-line-expand" />` when `echoContent.primary === "Still here."`. The gold line does not appear for "Something has shifted." — its absence becomes the signal. |
| Stage III progress bar color | In the progress bar inner `<div>`, when `questionIndex >= 10`, use `className="stage3-progress"` (overriding the inline gradient style) to apply the amber/copper tones from W1 |
| Stage III Q11 heavier entry | When `questionIndex === 10` (the very first Stage III question), apply an additional overlay tint of `rgba(120, 60, 20, 0.08)` on top of the existing `STAGE_OVERLAYS[3]` value — done by computing the effective background value conditionally |

---

### Batch W3 — SurpriseScreen Enhancement

**Files:** `src/components/SurpriseScreen.tsx`
**Depends on:** W1 (uses `.surprise-progress` CSS class)

| Change | Detail |
|---|---|
| Progress line indicator | Add a `<div className="surprise-progress" />` element inside the glass-container, positioned absolute at the bottom with `left: 0`, `width: 0`, using the CSS animation from W1. The 4s animation duration matches the 4000ms auto-advance timer exactly. |
| Breathing primary text | Add `className="animate-breathe"` to the primary text `<p>` element ("You've been making the same choice.") so it slowly pulses while the player waits, signalling intentionality. |

---

### Batch W4 — Result Page Theatrical Opening & Structural Overhaul

**Files:** `src/components/ResultScreen.tsx`
**Depends on:** W1 (uses `.result-curtain` and `.animate-breathe-delayed` CSS classes)

| Change | Detail |
|---|---|
| Dark curtain reveal | At the top of the returned JSX (inside `.glass-container`, before the back button), add `<div className="result-curtain" />`. This element renders once, animates from semi-dark to invisible over 1.8s, then is gone. The player's first perception is that the screen is "opening." |
| Standalone dimension name reveal | After the identity header and before Section 01 chips, insert a new block: the `resultData.chip` text (e.g. "Early Movement") displayed at `2rem`, centered, `fontWeight 400`, `color: var(--color-text)`, with a 32px gold underline that uses the `echo-line-expand` animation. Use `animate-fade-up delay-400`. This gives the dimension its own named moment before the interpretive sections begin. |
| Q15 quote-back relocated | Remove the quote-back block from inside Section 03. Re-insert it as a full standalone section after the dimension reveal and before Section 01. Style the intro line at `0.9rem` italic muted, and the quote itself in the same left-border treatment as before. Use `animate-fade-up delay-600`. Section 03 keeps only its 3 reflection lines. |
| Fix animate-breathe on closing name | Replace `className="animate-breathe"` on the closing name `<div>` with `className="animate-breathe-delayed"` (added in W1). This starts the breathe cycle only after the parent section has finished fading in, eliminating the visible opacity dip. |

---

### Batch W5 — Reflection Screen Enhancement

**Files:** `src/components/ReflectionScreen.tsx`
**Depends on:** W1 (uses `.char-span` pattern and `@keyframes charReveal` from W1)

| Change | Detail |
|---|---|
| Reflection 2 header character reveal | When `triggerBlock === 2`, instead of rendering `headerText` ("A silent repetition.") as a plain text node inside `<h2>`, split it into individual characters and wrap each in a `<span className="char-span">` with `style={{ animationDelay: \`${idx * 0.04}s\` }}`. The `char-span` class uses `@keyframes charReveal` from W1. Add a `className="char-reveal-container"` to the `<h2>` wrapper for this case. Other trigger blocks keep the existing plain text rendering. |
| Reflection 3 heavier entry | When `triggerBlock === 3`, apply an additional inline background overlay to the `.glass-container` div: `style={{ background: "rgba(120, 60, 20, 0.09)" }}` on top of the normal glass. Also apply a longer screen-enter duration by overriding: add `style={{ animationDuration: "1.1s" }}` to the glass-container when `triggerBlock === 3`. (The default `screen-enter` is 0.8s; 1.1s creates a felt sense of arrival.) |

---

## What Is Deliberately Not Included

| Item | Reason |
|---|---|
| Reduce from 15 to 10 questions | Author decision required — excluded by request |
| Audio / sound layer | Requires audio asset sourcing and hosting decision; out of scope for this round |
| Background image re-design | Asset decision — the existing `background.jpeg` (a soft cream/ivory floral texture) is used as-is |
| Haptic feedback | Platform and browser constraint; varies across devices |
| Paginated result sections | Large architecture change with uncertain payoff |

---

## Running Order

| Batch | Files Changed | Run After |
|---|---|---|
| W1 — CSS Foundation + Background | `src/index.css`, file copy | — (run first) |
| W2 — QuestionScreen | `src/components/QuestionScreen.tsx` | W1 |
| W3 — SurpriseScreen | `src/components/SurpriseScreen.tsx` | W1 |
| W4 — Result Page | `src/components/ResultScreen.tsx` | W1 |
| W5 — Reflection Screen | `src/components/ReflectionScreen.tsx` | W1 |

W2, W3, W4, W5 are fully independent of each other and can be run in parallel after W1.
