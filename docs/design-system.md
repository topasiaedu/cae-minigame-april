# Design System

## Design Philosophy

The visual language is built around **serene luxury** — the feeling of looking into a still, deep pool of water in a quiet room. Every design decision prioritises:

- **Negative space** over decoration
- **Motion as meaning** — animations signal reflection time, not entertainment
- **Gold as the sole accent** — warmth, wisdom, intentionality

The aesthetic deliberately avoids: bright colors, emoji, drop shadows that look "shiny," cluttered layouts, and anything that evokes a mobile game or corporate survey.

---

## Color Palette

All colors are defined as CSS variables in `src/index.css`:

```css
:root {
  --color-bg-start: #f8f4ee;   /* Warm cream white — page background top */
  --color-bg-end:   #efe8da;   /* Slightly deeper cream — page background bottom */

  --color-text:       #2c2416; /* Near-black warm brown — primary text */
  --color-text-light: #6b5a3e; /* Medium warm brown — secondary/muted text */

  --color-gold-light: #fbe5b8; /* Soft gold — chip fills, card accents */
  --color-gold-mid:   #f3ce85; /* Medium gold — borders, divider lines */
  --color-gold-dark:  #c8963c; /* Deep gold — selected states, CTAs, progress bar */
}
```

### Usage Rules

| Token | Used For |
|---|---|
| `--color-text` | H1, H2, bold paragraph text, selected option text |
| `--color-text-light` | Context text, muted labels, unselected option text |
| `--color-gold-dark` | Primary button fill, selected badge, progress bar, section dividers |
| `--color-gold-mid` | Borders, divider lines, gold card glows |
| `--color-gold-light` | Chip fills, selected card background gradients |

---

## Typography

```css
--font-main: 'Cormorant Garamond', 'Georgia', serif;
```

**Cormorant Garamond** is a high-end editorial serif used by luxury fashion publications. It communicates depth and intentionality. Loaded via Google Fonts.

| Usage | Size | Weight |
|---|---|---|
| Display headers (result name) | 2.8rem | 400 |
| Question setup | 1.35rem | 500 |
| Body text | 1rem–1.15rem | 400 |
| Labels / stage text | 0.72–0.85rem | 600 + letter-spacing |
| Base font size | 17px | — |

---

## Glassmorphism

The main container (`.glass-container`) uses:

```css
.glass-container {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 28px;
}
```

This creates the frosted-glass card that all screens sit inside. The ambient orbs behind it (`.ambient-orb-1`, `.ambient-orb-2`) provide the colored light source that the blur diffuses.

Option cards use the same pattern at a lighter opacity (`rgba(255,255,255,0.55)`), with the selected state flipping to a gold gradient.

---

## Ambient Orbs

Two fixed, blurred radial gradient divs float in the background:

```css
.ambient-orb-1 {
  /* Top-left, soft gold, 50vw diameter */
  animation: floatOrb 25s infinite alternate ease-in-out;
}
.ambient-orb-2 {
  /* Bottom-right, deeper amber, 60vw diameter */
  animation: floatOrb 30s infinite alternate-reverse ease-in-out;
}
```

They animate very slowly (25–30 second cycles) so the background feels alive without being distracting. `pointer-events: none` ensures they never interfere with clicks.

---

## Stage Background Overlays

The `QuestionScreen` applies a subtle inline style tint that changes per stage:

| Stage | Color | Feeling |
|---|---|---|
| Stage I (Q1–Q5) | `rgba(243, 206, 133, 0.06)` | Soft, exploratory |
| Stage II (Q6–Q10) | `rgba(210, 160, 80, 0.09)` | Warmer, more intense |
| Stage III (Q11–Q15) | `rgba(160, 90, 50, 0.08)` | Terracotta, reckoning |

---

## Animation Classes

All defined in `src/index.css`:

| Class | Effect | Duration |
|---|---|---|
| `.animate-fade-up` | Fade in + translate up 20px | 0.8s |
| `.delay-200` through `.delay-1200` | Staggered animation delays | — |
| `.screen-enter` | Page fade-in on mount | 0.5s |
| `.screen-exit` | Page fade-out on unmount | 0.5s |
| `.animate-breathe` | Subtle scale pulse (result page idle) | 3.5s loop |

### Stagger Pattern

Content on every screen uses progressive delays to create a **cinematic reveal**:

```
Header    → delay-200
Content   → delay-400
Options   → delay-400 or delay-600
Button    → delay-800
```

This forces a reading pace and prevents users from rushing to the options before reading the question.

---

## Progress Bar

The progress bar is a thin `3px` horizontal rule at the top of `QuestionScreen`. It grows smoothly using:

```css
transition: width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
background: linear-gradient(90deg, var(--color-gold-light), var(--color-gold-dark));
```

---

## Editorial Section Dividers (Result Page)

Section headers on the result page use a centered rule-line pattern instead of heading text:

```
─────────── 01  A CLOSER LOOK ───────────
```

Each side is a `flex: 1` div with a gold `linear-gradient` fading to transparent. This creates the sense of an editorial magazine layout rather than a structured form.

---

## Responsive Design

The `.glass-container` is constrained to a max-width of `430px` (standard mobile viewport). On desktop, it centers with generous padding. All font sizes use `rem` units relative to the `17px` base, making the entire layout scale proportionally.
