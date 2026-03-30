# Full Audit & Redesign Proposal — v5

**Date:** 27 March 2026
**Context:** Webinar mini-game for business owners/decision-makers, played live on 1 April.

---

## 1. The Mission

**Webinar positioning:**
> Q1 is done. April changes pace. If something has been slightly off since CNY — April will magnify it. This session is a fast reset before Q2 accelerates whatever direction you're currently in. Not formal. Interactive. Strategic. Includes live decision games.

**What the game must achieve:**
Create urgency to stop guessing. The player should leave the game feeling: *"I may have been making Q1 decisions with the same unconscious habit — and Q2 will amplify that unless I do something about it."*

**What the speaker needs from the game:**
An audience that has just seen their own pattern, felt the cost, and is sitting with one unresolved question. The speaker closes the loop.

**What "success" looks like:**
The player, in 7-8 minutes, goes through three emotional stages:
1. **Recognition** — "I keep choosing the same way."
2. **Cost** — "That pattern had consequences in Q1."
3. **Urgency** — "Q2 starts now. This pattern is still running."

Every screen in the game exists to serve one of these three jobs, or it gets cut.

---

## 2. Full Audit — Current Design

### Screen-by-screen inventory (current: 22 screens)

| # | Screen | Time | Does it serve Recognition, Cost, or Urgency? | Verdict |
|---|--------|------|-----------------------------------------------|---------|
| 1 | Login | ~20s | None yet — it's entry | Keep, rewrite |
| 2 | Stage I Intro | ~8s | Neither — it's orientation copy | Keep, rewrite (boss feedback) |
| 3 | Q1 | ~10s | Recognition (data point 1) | Keep, rewrite scenario |
| 4 | Q2 | ~10s | Recognition (data point 2) | Keep, rewrite scenario |
| 5 | Q3 | ~10s | Recognition (data point 3) | Keep, rewrite scenario |
| 6 | Reflection 1 | ~10s | Recognition (pattern named) | Keep, redesign |
| 7 | Stage II Intro | ~8s | Neither — it's orientation copy | Keep, rewrite (boss feedback) |
| 8 | Q4 | ~10s | Cost (data point 4) | Keep, rewrite scenario |
| 9 | Q5 | ~10s | Cost (data point 5) | Keep, rewrite scenario |
| 10 | Q6 | ~10s | Cost (data point 6, reversal) | Keep, rewrite scenario |
| 11 | Reflection 2 | ~10s | Cost (pattern cost surfaced) | Keep, redesign |
| 12 | Surprise | 4s | Recognition (confrontation) | **Merge** into Stage III intro |
| 13 | Breathe | ~4s | Neither — wellness app energy, wrong audience | **Cut** |
| 14 | Stage III Intro | ~8s | Urgency (signals escalation) | Keep, merge with Surprise, rewrite |
| 15 | Q7 | ~10s | Urgency (data point 7) | Keep, rewrite scenario |
| 16 | Q8 | ~10s | Urgency (data point 8) | Keep, rewrite scenario |
| 17 | Q9 | ~10s | Urgency (data point 9, reversal) | Keep, rewrite scenario |
| 18 | Q10 | ~10s | Urgency (data point 10) | Keep, rewrite scenario |
| 19 | Result Phase 1 | ~5s | Recognition (pattern named) | Keep, restructure |
| 20 | Result Phase 2 | ~10s | Recognition (quotes mirrored) | Merge with Phase 1 |
| 21 | Result Phase 3 | ~10s | Cost (benefit + hidden cost) | Keep, restructure |
| 22 | Result Phase 4 | ~10s | Urgency (open loop for speaker) | Keep, restructure |

**Current total: 22 screens.** Of which 10 are questions. That means 12 screens are non-question overhead. The player spends more time reading transition copy than making decisions. For a "fast, interactive, strategic" webinar, this is too slow.

### What gets cut and why

**Stage I Intro — Keep, rewrite.** Boss feedback explicitly asked why Stages I and II didn't have context briefs like Stage III. She IS the target audience. If she felt disoriented, other business owners will too. Keep the intro but make it short and Q1-specific. No watermark theatrics — just a sentence and a CTA.

**Stage II Intro — Keep, rewrite.** Same reasoning. The tonal shift into retrospection needs framing. But the copy must earn the screen — not generic orientation, but Q1-anchored context.

**Breathe Screen — Cut.** "Take a breath" is wellness language. This audience came for a strategy huddle. They don't want to breathe — they want to understand. The 2-second wait + Continue button adds nothing that the Stage III confrontation screen can't carry on its own.

**Surprise Screen — Merged into Stage III Intro.** "You've been making the same choice. Have you noticed?" is the strongest single line in the game. It should not be wasted on a 4-second auto-advance screen that most players will half-read. Move this line into the Stage III intro as the opening punch, then follow with the "this section is different" framing. One screen, double the impact.

**Result Phase 2 — Merged with Phase 1.** Currently Phase 1 is just the name + chip, and Phase 2 is the mirror quotes. That's two Continue-button taps to see what is really one unit of content: "here's your pattern, here's the evidence." Combine them.

**PatternViz diamond — Cut entirely.** An abstract SVG polygon means nothing to someone who doesn't understand the model. It creates cognitive work at a moment that should be emotional. The player's own quoted answers are a far better mirror than a geometric shape.

**Ambient sound — Cut.** In a webinar with 50+ people on different devices and browsers, audio autoplay is unreliable. The game must work fully silent. Designing around sound that may not play is a liability, not a feature.

### Redesigned screen count: 22 → 19

| # | Screen | Job |
|---|--------|-----|
| 1 | Login | Entry + Q1 priming |
| 2 | Stage I Intro | Orientation — "Think of Q1" |
| 3 | Q1 | Recognition |
| 4 | Q2 | Recognition |
| 5 | Q3 | Recognition |
| 6 | Reflection 1 | Recognition (mirror) |
| 7 | Stage II Intro | Orientation — "Now we look back at Q1" |
| 8 | Q4 | Cost |
| 9 | Q5 | Cost |
| 10 | Q6 (reversal) | Cost |
| 11 | Reflection 2 | Cost (mirror) |
| 12 | Confrontation (replaces Surprise + Breathe + Stage III Intro) | Urgency (escalation) |
| 13 | Q7 | Urgency |
| 14 | Q8 | Urgency |
| 15 | Q9 (reversal) | Urgency |
| 16 | Q10 | Urgency |
| 17 | Result Phase 1 — Pattern + Mirror | Recognition (complete) |
| 18 | Result Phase 2 — Cost | Cost (complete) |
| 19 | Result Phase 3 — Portrait + Q2 Open Loop | Urgency (complete) |

10 questions + 9 non-question screens. Down from 22 (cut 3: Surprise, Breathe, Result Phase 2 merged). Every non-question screen has exactly one job. Total estimated time: 7-8 minutes.

---

## 3. The Redesigned Flow — Every Screen

### Screen 1: Login

**Purpose:** Entry, name capture, emotional priming.

**Title:** `"Predictable Destiny"`

**Copy:**
> Q1 is done.
> Before Q2 begins — this will show you how you've been deciding.
>
> It takes about 8 minutes.
> There are no right answers.
> *As you answer, let your Q1 decisions come to mind.*

**Fields:** Name (required), Email (optional — "So Cae can follow up after the session.")

**CTA:** `"Begin"`

**Why this works:** The player is primed before they answer a single question. "Let your Q1 decisions come to mind" is the equivalent of the life-domain selection from the previous game — except here, the domain is shared by everyone in the room (Q1), which means when the speaker later references it, every player has the same anchor.

**What was cut:** "Every path is shaped by moments..." — beautiful but generic. "The mirror will only reflect what is already there" — sounds deep but means nothing to a business owner who just joined a strategy huddle. "Over the next few minutes, we will revisit these choices" — passive, vague.

---

### Screen 2: Stage I Intro

**Purpose:** Brief orientation before Stage I questions. Q1-anchored.

**Structure:**
- Stage label: `STAGE I · THE UNKNOWN`
- Watermark: `I`
- Copy line 1: `"These situations involve uncertainty."`
- Copy line 2 (italic): `"Think of your Q1 as you answer."`
- CTA: `"Begin"`

No headline, no body paragraph — just two lines and a button. Fast in, fast out.

---

### Screens 3–5: Stage I — "How You Decide Under Uncertainty"

**Theme:** The player encounters three business scenarios involving incomplete information and time pressure. Each tests the same four dimensions in clearly different contexts.

#### Q1 — Market opportunity

**Setup:** `"A new direction opens up in your market. The data isn't complete yet, but waiting means someone else moves first."`

**Context:** `"You usually:"`

| Dim | Option |
|-----|--------|
| A | "Move into it now and adjust as I learn" |
| B | "Hold until the landscape settles" |
| C | "Run the numbers first — only move when the math works" |
| D | "Position myself without locking in — keep options open" |

**Why it's here:** Classic uncertainty-under-competition scenario. Every business owner recognises this from Q1. Tests all four dimensions cleanly.

#### Q2 — Internal proposal

**Setup:** `"A key person on your team proposes a major change. Their logic is sound, but the timing feels uncertain."`

**Context:** `"You usually:"`

| Dim | Option |
|-----|--------|
| A | "Back it — momentum matters more than perfect timing" |
| B | "Slow it down — let's wait until we're sure" |
| C | "Stress-test it — what exactly are we risking?" |
| D | "Explore it without committing — don't close other doors yet" |

**Why it's different from Q1:** Q1 is external (market). Q2 is internal (team). Different relationship dynamics. Different stakes. A player who "moves first" on market opportunities might "slow down" on team proposals. That tension is valuable data.

#### Q3 — Forced decision under time pressure

**Setup:** `"You need to make a strategic call by end of day. You have about 70% of the information you'd want."`

**Context:** `"You:"`

| Dim | Option |
|-----|--------|
| A | "Decide now — 70% is enough, speed matters" |
| B | "Push the deadline — a wrong call is worse than a late one" |
| C | "Use what I have to model the outcomes first" |
| D | "Make a soft commitment I can reverse if needed" |

**Why it's different from Q1 and Q2:** Q1 = opportunity, Q2 = people, Q3 = clock. Three different triggers for the same four responses. If the player picks the same dimension all three times, the pattern is undeniable — and they'll feel it when Reflection 1 shows them.

**What was cut:** Old Q3 was a reversal ("which reaction would you almost never have?"). Reversal here was wasting a Stage I scoring slot. With Q3 now scored normally, Stage I produces 3 clean data points instead of 2.

---

### Screen 7: Stage II Intro

**Purpose:** Brief orientation before Stage II questions. Signals the shift into retrospection.

**Structure:**
- Stage label: `STAGE II · THE AFTERMATH`
- Watermark: `II`
- Copy line 1: `"Now we look back."`
- Copy line 2 (italic): `"Not to judge your Q1 — to see it clearly."`
- CTA: `"Continue"`

Same lightweight format as Stage I intro. Two lines, one button.

---

### Screen 6: Reflection 1

**Purpose:** First mirror moment. Show the player their own three answers. Name the pattern (or acknowledge the lack of one). Ask a Q1-specific cost question that sits unanswered.

**Structure:**

1. **Three answers, bare** — no labels, no "You just answered:", no PatternViz. Just three lines of the player's own text, stacked vertically with gold left-borders, staggered fade-in:
   > *"Move into it now and adjust as I learn"*
   > *"Back it — momentum matters more than perfect timing"*
   > *"Decide now — 70% is enough, speed matters"*

2. **Pattern observation** — varies based on `dominantCount` (how many of 3 answers matched the dominant dimension):

   **3 out of 3 (strong pattern):**
   | Dim | Text |
   |-----|------|
   | A | `"Three situations. Each time — you moved first."` |
   | B | `"Three situations. Each time — you waited."` |
   | C | `"Three situations. Each time — you calculated."` |
   | D | `"Three situations. Each time — you kept a way out."` |

   **2 out of 3 (moderate pattern):**
   > `"Two out of three — the same instinct."`

   **All different (no clear pattern):**
   > `"Three situations. Three different responses."`

3. **Q1 friction question** — appears after a 2s delay, NOT answered, just sits there. Also varies by dominantCount:

   **Clear pattern (2/3 or 3/3):**
   > `"How many times did this show up in your Q1?"`

   **All different (1/3):**
   > `"In Q1 — was it this mixed, or did one instinct take over?"`

4. **CTA** — appears after 4s total: `"Continue"`

**Why the balanced variant matters:** If someone picks A, C, B across three questions, showing them "Three situations. Each time — you moved first." is factually wrong. The game would lose credibility. Honest observation for balanced profiles ("Three different responses") is more psychologically interesting than a forced dominant — it tells the player "you don't have ONE default, you have several," which is still a mirror. The friction question still points at Q1 regardless.

**What was cut:**
- "Have you noticed, [Name]?" header — too leading. Let the evidence speak.
- PatternViz diamond — abstract noise. The three answers ARE the visualization.
- "You just answered:" label — unnecessary narration. The player knows what they just did.
- "Some people naturally move rapidly down a path..." trigger paragraph — third-person, generic, academic. Replaced by direct second-person observation.
- "Two of your last three answers leaned the same way" — stat-reporting that breaks the emotional moment.

---

### Screens 8–10: Stage II — "What It Cost"

**Theme:** Retrospective — looking back at decisions already made. The scenarios ground cost and consequence, not just reflection. Each tests the same four dimensions through different emotional angles.

#### Q4 — Missed opportunity

**Setup:** `"Someone in your circle moved on something you held back on in Q1. They got traction."`

**Context:** `"Looking back, you:"`

| Dim | Option |
|-----|--------|
| A | "Think I should have moved faster — I overthought it" |
| B | "Still believe waiting was the right call at the time" |
| C | "Want to understand exactly why it worked for them" |
| D | "Think every business has its own timing — I wasn't wrong to hold" |

**Why it's here:** Most business owners in the room can name a specific Q1 moment where this happened. The scenario is a trigger for a real memory.

#### Q5 — Failed bet

**Setup:** `"You backed a direction in Q1. It didn't deliver what you expected."`

**Context:** `"Looking back, you:"`

| Dim | Option |
|-----|--------|
| A | "Would rather swing and miss than stand still — the lesson was worth it" |
| B | "Think I should have waited for better signals before committing" |
| C | "Want to know exactly where the strategy broke down" |
| D | "Committed too hard, too fast — should have kept room to pivot" |

**Why it's different from Q4:** Q4 = someone else succeeded where you didn't act (regret of inaction). Q5 = you acted and it failed (regret of action). These hit opposite emotional registers. Together they show the pattern operates in both directions.

#### Q6 — Reversal: external mirror

**Setup:** `"A trusted advisor is describing how you make decisions."`

**Context:** `"Which of these would they least say about you?"`

| Dim | Option |
|-----|--------|
| A | "You move fast and fix later" |
| B | "You wait until you're sure" |
| C | "You need the data before you act" |
| D | "You keep your options open as long as possible" |

**Why it's here:** The single Stage II reversal, but framed as third-person observation rather than self-report. "How would someone else describe you" forces a perspective shift. This is the only reversal that feels genuinely different from a normal question because it asks the player to see themselves from outside.

**Why only this reversal and Q9:** The old design had 3 reversals (Q3, Q6, Q9), leaving only 7 scored answers out of 10. Now with 2 reversals, 8 answers are scored — stronger statistical signal.

---

### Screen 11: Reflection 2

**Purpose:** Second mirror moment. Show Stage II answers. Name the cost. Ask what it cost them this quarter.

**Structure:**

1. **Three Stage II answers, bare** — same format as Reflection 1. Note: Q6 is a reversal, so the third quoted answer is "what they'd LEAST say about you" — still worth showing because it reveals what the player is NOT.

2. **Cost observation** — varies by dominantCount, same logic as Reflection 1:

   **3 out of 3 (strong pattern):**
   | Dim | Text |
   |-----|------|
   | A | `"Even in hindsight — you'd still move first."` |
   | B | `"Even in hindsight — you'd still wait."` |
   | C | `"Even in hindsight — you'd still want the numbers."` |
   | D | `"Even in hindsight — you'd still keep an exit open."` |

   **2 out of 3 (moderate):**
   > `"Even looking back — the same instinct shows up."`

   **All different (balanced):**
   > `"Looking back — no single pattern. But something drove each choice."`

3. **Cost friction question** — appears after 2s delay:

   **Clear pattern (2/3 or 3/3):**
   > `"What did this pattern cost you in Q1?"`

   **Balanced (1/3):**
   > `"Even without a clear pattern — did any of these cost you something in Q1?"`

4. **CTA** — appears after 4s: `"Keep going"`

**Why this works:** After Q4 (missed opportunity) and Q5 (failed bet), the player's own Q1 memories are already surface-level. The friction question doesn't need to manufacture relevance — it just points at what's already in the room. The balanced variant stays honest while still creating the Q1 bridge.

---

### Screen 12: Confrontation

**Purpose:** Replaces Surprise Screen + Breathe Screen + Stage III Intro. One screen. Three jobs: confront the pattern, signal escalation, set up Stage III.

**Structure:**

Roman numeral watermark: `III`

1. **Confrontation line** (the old Surprise copy, kept because it's the strongest line in the game):
   > `"You've been making the same call."`

2. **Time anchor** — appears with 1s delay:
   > `"In Q1. Before that. Probably longer than you'd like to admit."`

3. **Escalation signal** — appears with 2s delay, italic:
   > `"The next questions are not about what might happen. They're about what's already running."`

4. **CTA** — appears after 3.5s: `"I'm ready"`

**Why this works:** Three screens compressed into one. The "take a breath" dead time is gone. The auto-advance ambiguity is gone (the Surprise screen's 4s auto-advance confused people). The player has agency (they tap when ready). And the confrontation line + Q1 anchor + escalation signal create a 3-beat emotional arc in one screen instead of spreading it across three.

---

### Screens 13–16: Stage III — "This Is Still Running"

**Theme:** Direct self-confrontation. No more hypotheticals. The player is asked what they already know about themselves and where this pattern is going.

Stage label: `STAGE III · THE MIRROR`

#### Q7 — Automatic response

**Setup:** `"When a strategy isn't working, your automatic response is usually to:"`

**Context:** (none needed — setup IS the question)

| Dim | Option |
|-----|--------|
| A | "Try something different immediately — action creates clarity" |
| B | "Step back and watch — patience reveals the real problem" |
| C | "Analyze what went wrong before changing anything" |
| D | "Loosen the commitment — keep the door open to shift" |

#### Q8 — Q1 honest assessment

**Setup:** `"Be honest about Q1. The decisions that mattered most were probably made:"`

**Context:** (none needed)

| Dim | Option |
|-----|--------|
| A | "Quickly — trusting gut over waiting for more information" |
| B | "Slowly — waiting longer than I probably needed to" |
| C | "Carefully — running the analysis until I felt safe enough" |
| D | "Tentatively — committing just enough to stay flexible" |

**Why it's different from Q7:** Q7 is behavioral (what you DO when things break). Q8 is confessional (how you ACTUALLY decided in Q1). Q7 is about a pattern. Q8 is about a specific quarter. Together they show: the pattern didn't take a break in Q1.

#### Q9 — Reversal: blind spot

**Setup:** `"Every decision habit has a cost."`

**Context:** `"Which of these costs do you notice least in yourself?"`

| Dim | Option |
|-----|--------|
| A | "Moving fast and spending energy fixing mistakes that didn't need to happen" |
| B | "Waiting too long until the best window quietly closed" |
| C | "Over-planning until strong ideas never got off the ground" |
| D | "Keeping options open until nothing was ever fully built" |

**Why it's a reversal:** The cost they notice LEAST is the cost their dominant pattern actually imposes. This is the blindness the game is trying to surface. Placing it at Q9 — second-to-last — means it lands after all the self-confrontation of Q7 and Q8.

#### Q10 — The Q2 question

**Setup:** `"Q2 starts now. If one pattern in how you decide needs to change — what is it?"`

**Context:** (none needed)

| Dim | Option |
|-----|--------|
| A | "Am I moving fast because it's right — or because standing still feels unbearable?" |
| B | "Am I waiting for certainty — or just avoiding the risk of being wrong?" |
| C | "Am I planning carefully — or hiding behind the analysis?" |
| D | "Am I staying flexible — or just afraid to fully commit?" |

**Why it's here:** This is the game's climax. The player is asked to name their own issue, in their own voice, pointed at Q2. Whatever they choose becomes the quote that appears on their result screen. It's the answer they gave themselves. The speaker can reference this: "The question you chose for yourself at the end — that's where we start."

---

### Result: 3 Phases

#### Phase 1 — Pattern + Mirror

**Purpose:** Name the pattern. Show the evidence in the player's own words. Handle balanced profiles as a first-class experience.

**Content, in order:**

1. **Player name** — large, centered, quiet. `3.2rem`.

2. **Pattern label** — small, uppercase: `"YOUR Q1 PATTERN"` at `1rem`.

3. **Primary chip(s):**
   - **Clear dominant:** Single styled pill, e.g. `"Early Movement"`.
   - **Tied (2+ dimensions share the top count):** Two chips side by side, e.g. `"Early Movement"` and `"Seeking Clarity"`. Add a line below: `"Your decisions pulled in two directions."`

4. **Mirror sentence** — the first `reflectionLine` for the dominant dimension (tiebreaker winner if tied): e.g. `"You start before everything is clear."`

5. **Q1 vs Q8 quote comparison:**
   > **In the first question, you said:**
   > *"Move into it now and adjust as I learn"*
   >
   > **About your actual Q1, you said:**
   > *"Quickly — trusting instinct over waiting for more information"*

   Note: the comparison is now Q1 (hypothetical) vs Q8 (confessional about Q1), not Q1 vs Q7. This is more powerful because Q8 explicitly asks about Q1 decisions, so the comparison shows: "your instinct in a hypothetical scenario matches how you actually decided in Q1."

6. **Q10 quote-back:**
   > **The question you chose for yourself:**
   > *"Am I moving fast because it's right — or because standing still feels uncomfortable?"*

7. **CTA:** `"Continue"`

**Why one phase instead of two:** All of this is one unit of meaning: "here's your pattern + here's the proof." Splitting it across two Continue taps breaks the evidence chain. The player should see the pattern name and the evidence on the same screen, so the connection is immediate.

#### Phase 2 — The Cost

**Purpose:** What this pattern gives and what it quietly takes. The emotional peak.

**Content:**

1. **Benefit line** — `reflectionLines[1]`: e.g. `"This keeps you in motion when others are still hesitating."`

2. **Hidden cost box** — gold-bordered, pulsing: `reflectionLines[2]`: e.g. `"But over time, it becomes hard to tell the difference between moving with purpose — and simply staying busy."`

3. **Q1 cost line** — new, dimension-specific:
   | Dim | Text |
   |-----|------|
   | A | `"In Q1 — was some of that motion actually just noise?"` |
   | B | `"In Q1 — did some of that caution actually cost you a window?"` |
   | C | `"In Q1 — did some of that planning actually stop something from starting?"` |
   | D | `"In Q1 — did some of that flexibility actually prevent you from building?"` |

   **Tied variant:** Show the Q1 cost line for the tiebreaker winner only. The question is still pointed enough to land for either dimension.

4. **CTA:** `"Continue"`

**Why this phase exists separately:** The cost must land before the open loop. If you combine cost + urgency on one screen, neither gets room to breathe. The player needs to sit with "what did this cost me in Q1" for a few seconds before being asked about Q2.

#### Phase 3 — Portrait + Q2 Open Loop

**Purpose:** Give the player a concrete takeaway (chips + sliders) AND the unresolved Q2 question. Signal clearly that the game is over. This is the "screenshot and discuss" screen.

**Content:**

1. **Answer distribution bar** — shows the player's actual scored answer counts across all 8 scored questions. This is real data, not a template:
   ```
   Early Movement      ████████████  (4)
   Seeking Clarity     ████          (2)
   Calculated Risk     ████          (2)
   Preserving Options                (0)
   ```
   Each bar uses the dimension's display name (from `chip` field) as its label. Bar width proportional to count. Color: `var(--color-gold-mid)`. This works for every profile — clear dominant, tied, or fully balanced. The player sees their actual distribution and it's undeniable.

2. **Primary chip** — styled pill for the dominant dimension (tiebreaker winner if tied).
   - **Tied variant:** Two chips side by side.

3. **4 secondary chips** — small pills in a flex row (for the dominant dimension only).

4. **5 sliders** — animated fill bars for the dominant dimension. (These are hardcoded per dimension. On this takeaway screen, they serve as a visual portrait to screenshot and discuss. The personal data was the distribution bar above. The sliders add texture.)
   - **Tied variant:** Show sliders for the tiebreaker winner only. The distribution bar above already shows both dimensions honestly.

5. **Divider** — thin gold horizontal rule.

6. **Q2 closing question:**
   > `"Q2 will accelerate whatever direction you're already in."`
   > `"Is this the pattern you want running it?"`

7. **Player name** — breathing animation, large.

8. **Watermark** — `CAE GOH`

9. **Closing cue** — a thin gold divider line above the watermark. Optionally, a small text: `"Now you've seen it."` at `1rem`, `opacity: 0.5`. Nothing about the speaker. Nothing that promises what comes next. Just a quiet full stop.

**No Continue button.** The visual format (portrait card + watermark + divider) unmistakably says: this is the end. The format shift from flowing text (Phases 1-2) to structured card (Phase 3) tells the brain "this is a different kind of screen — a summary."

**Why the distribution bar is the strongest ending element:** It's the only piece of data in the entire result that is genuinely computed from the player's answers. Every other number (slider values) is a per-dimension template. The distribution bar is uniquely theirs. A player who went 5-2-1-0 sees it and thinks "I really did lean that hard." A balanced player who went 3-3-1-1 sees their split honestly reflected. Neither feels like the game is making things up.

**Why chips and sliders are here, not in Phase 1:** In Phase 1, the player needs to see their pattern + their own evidence. Adding sliders and distribution bars would clutter that moment and turn it into a data dashboard. Here in Phase 3, after the emotional work is done, the visual elements serve as a grounding artifact: "here's the shape of your tendency, screenshot this, discuss it with the person next to you."

---

## 4. Data Architecture Changes

### Questions: 10 total, 8 scored, 2 reversals

| Index | Question | Stage | Reversal? | Scored? |
|-------|----------|-------|-----------|---------|
| 0 | Q1 — Market opportunity | I | No | Yes |
| 1 | Q2 — Internal proposal | I | No | Yes |
| 2 | Q3 — Forced decision | I | No | Yes |
| 3 | Q4 — Missed opportunity | II | No | Yes |
| 4 | Q5 — Failed bet | II | No | Yes |
| 5 | Q6 — External mirror | II | Yes | No |
| 6 | Q7 — Automatic response | III | No | Yes |
| 7 | Q8 — Q1 honest assessment | III | No | Yes |
| 8 | Q9 — Blind spot cost | III | Yes | No |
| 9 | Q10 — Q2 question | III | No | Yes |

`REVERSAL_INDICES` changes from `Set([2, 5, 8])` to `Set([5, 8])`.

### Dynamic triggers: simplified

Replace the current `dynamicTriggers` object with two sets of simpler, sharper strings:

**Reflection 1 — pattern observation (4 strings, one per dimension):**
```
A: "Three situations. Each time — you moved first."
B: "Three situations. Each time — you waited."
C: "Three situations. Each time — you calculated."
D: "Three situations. Each time — you kept a way out."
```

**Reflection 2 — cost observation (4 strings, one per dimension):**
```
A: "Even in hindsight — you'd still move first."
B: "Even in hindsight — you'd still wait."
C: "Even in hindsight — you'd still want the numbers."
D: "Even in hindsight — you'd still keep an exit open."
```

**Reflection friction questions (fixed, not per-dimension):**
```
reflection1: "How many times did this show up in your Q1?"
reflection2: "What did this pattern cost you in Q1?"
```

### Result: new dimension-specific Q1 cost lines

Add to `resultInterpretations` for each dimension:

```
A: { q1CostLine: "In Q1 — was some of that motion actually just noise?" }
B: { q1CostLine: "In Q1 — did some of that caution actually cost you a window?" }
C: { q1CostLine: "In Q1 — did some of that planning actually stop something from starting?" }
D: { q1CostLine: "In Q1 — did some of that flexibility actually prevent you from building?" }
```

### Quote comparison: Q1 vs Q8 instead of Q1 vs Q7

Result Phase 1 shows the player's Q1 answer next to their Q8 answer. Q8 now explicitly asks about Q1 decisions, so the pairing creates a more powerful mirror: "your hypothetical instinct = how you actually decided this quarter."

In `useGameState`, change `q7AnswerText` to `q8AnswerText` (index 7 instead of 6).

---

## 5. Game Flow Architecture

### GameStage type (simplified)

```
"login" | "stageIntro" | "question" | "reflection" | "confrontation" | "result"
```

`"stageIntro"` is reused for both Stage I and II intros (differentiated by `questionIndex`). Removed: `"stageIntro3"`, `"surprise"`, `"breathe"`.

### Flow map

```
login
  → stageIntro (Stage I)
  → question[0] (Q1)
  → question[1] (Q2)
  → question[2] (Q3)
  → reflection (block 1)
  → stageIntro (Stage II)
  → question[3] (Q4)
  → question[4] (Q5)
  → question[5] (Q6)
  → reflection (block 2)
  → confrontation (replaces old stageIntro3 + surprise + breathe)
  → question[6] (Q7)
  → question[7] (Q8)
  → question[8] (Q9)
  → question[9] (Q10)
  → result (phase 1)
  → result (phase 2)
  → result (phase 3)
```

### Back navigation map

```
stageIntro(I) → login
question[0]   → stageIntro (Stage I)
question[3]   → stageIntro (Stage II)
question[6]   → confrontation
question[n]   → question[n-1] + pop answer
reflection    → question[n-1] + pop answer
stageIntro(II)→ reflection (block 1)
confrontation → reflection (block 2)
result        → question[9] + pop answer
```

---

## 6. Components — What Changes

| Component | Action |
|-----------|--------|
| `LoginScreen.tsx` | Rewrite copy only |
| `StageIntroScreen.tsx` | Split into two components: keep `StageIntroScreen.tsx` (reused for Stage I and II, with `stageNumber: 1 \| 2` prop, lightweight format), and create new `ConfrontationScreen.tsx` (single-purpose, replaces Surprise + Breathe + old Stage III intro) |
| `QuestionScreen.tsx` | Keep structure. Fix text readability (all labels ≥ 1rem, non-italic, `--color-text`) |
| `ReflectionScreen.tsx` | Major redesign: strip PatternViz, strip "You just answered:" label, strip trigger paragraphs, add bare answer display + pattern observation (with balanced variant) + friction question |
| `SurpriseScreen.tsx` | **Delete** — functionality merged into ConfrontationScreen |
| `BreatheScreen.tsx` | **Delete** |
| `PatternViz.tsx` | **Delete** |
| `ResultScreen.tsx` | Restructure to 3 phases, add Q1 cost lines, add answer distribution bar, move chips/sliders to Phase 3, change Q7 quote to Q8 quote, handle tied profiles as first-class experience |
| `useGameState.ts` | Update `GameStage`, remove surprise/breathe handlers, add confrontation handler, change `REVERSAL_INDICES` to `Set([5, 8])`, change `q7AnswerText` to `q8AnswerText`, expose `answerCounts` for distribution bar |
| `App.tsx` | Remove surprise/breathe render blocks, update stageIntro to use `stageNumber`, add confrontation render block |
| `content.ts` | Rewrite all 10 questions, simplify `dynamicTriggers` to short observations + balanced variants, add `q1CostLine` to `resultInterpretations` |
| `index.css` | Remove surprise/breathe CSS, fix readability rule (min 1rem, labels non-italic), add distribution bar styles, keep all animation classes |

---

## 7. Readability Rules (Global)

These apply to every screen:

1. **Minimum font size for any visible text: `1rem`.** Cormorant Garamond renders optically small. Nothing below 1rem.
2. **Labels and instructions use `var(--color-text)`, not `var(--color-text-light)`.** Labels orient the reader — they are functional text, not decoration.
3. **Italic is ONLY for the player's own quoted words.** Labels, instructions, and game copy are never italic. This creates a clear visual language: italic = your words; upright = the game's words.
4. **`var(--color-text-light)` is ONLY for genuinely secondary content** — things the player can skip without losing meaning (e.g. "So Cae can follow up after the session", the email field note).
5. **Darken `--color-text-light` from `#5f5548` to `#4a3f34`.** Even for secondary content, the current value is too light on the glass background.

---

## 8. Language — Malaysian/Singaporean Audience

This audience is primarily Malaysian and Singaporean business owners. English is a working language but not necessarily a first language. Copy must be direct and avoid idioms, jargon, or vocabulary that requires native-level fluency.

### Words and phrases to simplify across all copy

| Current | Problem | Replacement |
|---------|---------|-------------|
| "got traction" | Startup/VC jargon | "it's working for them" |
| "stress-test it" | Technical jargon | "check the risks first" |
| "room to pivot" | Startup jargon | "room to change direction" |
| "model the outcomes" | Too abstract | "work out the possible results first" |
| "tentatively" | Uncommon word for non-native speakers | "carefully — just enough to stay flexible" |
| "trusting gut" | Understood but vague | "trusting instinct over data" |
| "lock in" | Ambiguous (can mean different things in MY/SG) | "commit fully" |
| "loosen the commitment" | Wordy/formal | "pull back — keep room to change" |
| "unbearable" | Overly dramatic for business context | "uncomfortable" |
| "swing and miss" | American baseball idiom | "try and fail" |

### Language rules for all game copy

1. **Maximum sentence length: ~15 words.** MY/SG English favors directness. Long nested clauses cause re-reading.
2. **No American idioms.** "Swing and miss," "hit the ground running," "move the needle" — these don't land consistently.
3. **Option text on question cards should be ≤ 12 words.** These are buttons on a phone screen. Long options cause scrolling and decision fatigue.
4. **Avoid double negatives and inverted constructions.** "Which of these would they LEAST say about you" is already at the limit. Don't push further.
5. **Use concrete verbs over abstract nouns.** "Move first" > "Early movement." "Wait until sure" > "Seeking clarity." In option text, verb-first phrasing is easier to parse quickly.

### Final review

The copy in this document uses placeholder English that should be reviewed by someone who speaks to this audience daily. Flag anything that feels "textbook" or "too American" and replace with phrasing that sounds like how Malaysian/Singaporean business owners actually talk to each other.

---

## 9. What Was Intentionally Kept

| Element | Why it stays |
|---------|-------------|
| **3-stage structure** | The escalation from hypothetical → retrospective → confessional is a proven psychological arc. Each stage serves a distinct emotional job (recognition, cost, urgency). |
| **10 questions** | 8 scored answers across 3 stages gives enough data for a credible pattern while keeping the game under 8 minutes. Fewer questions = thinner data. More = fatigue. |
| **Stage I and II intros** | Boss playtest explicitly flagged the lack of parity with Stage III. She IS the target audience. Lightened to 2 lines + CTA (not full theatrical screens). |
| **2 reflections** | Without breaks between stages, 10 questions becomes a form. The reflections are where the game becomes a mirror. They are the product. |
| **Confrontation screen** | The shift into Stage III needs a felt moment. One screen does this better than three (Surprise + Breathe + StageIntro). |
| **4 dimensions (A/B/C/D)** | Four behavioral patterns, each neutral, each with a benefit and a cost. The model is simple enough to explain in one chip label but rich enough that the sliders create a meaningful portrait. |
| **Shuffled option order** | Prevents the player from gaming the system by decoding that "A is always the first option." |
| **Stage III echo comparison** | "Still here." / "Something has shifted." — comparing Stage III answers against Stage I answers creates genuine surprise. |
| **3-phase result** | Each phase has one job: name/evidence, cost, takeaway/urgency. Fewer phases would overload a single screen. More would slow the ending. |
| **Balanced-profile handling** | Reflection observations and result chips adapt based on whether the player has a clear dominant or a balanced spread. No false claims. |
| **Answer distribution bar** | The only genuinely personal data in the result. Computed from actual answers, not a hardcoded template. Handles all profiles honestly. |
| **Chips + sliders on final phase** | They serve as a completion signal, a shareable artifact, and a grounding moment after the emotional phases. |
| **Word-by-word reveal** | On the Phase 2 hidden cost line, this forces the player to read slowly at the most important moment. |
| **Result curtain animation** | The theatrical "lights drop" on result entry creates a felt moment of transition from questions to revelation. |
| **Back navigation** | Business owners will want to reconsider answers. Removing back nav would feel controlling. |
| **Gold gradient design system** | Warm, editorial, premium. Right register for this audience. |

---

## 10. Implementation Approach

This is a copywriting + architecture change, not a UI overhaul. The visual design system, animation classes, glassmorphic styling, and component structure all stay. What changes:

1. **Content rewrite** — `content.ts`: all 10 questions, triggers, result interpretations
2. **Flow simplification** — `useGameState.ts`: fewer stages, simpler navigation
3. **Component cleanup** — delete 3 files, rename 1, redesign 2
4. **Result restructure** — `ResultScreen.tsx`: 3 phases instead of 4, new content placement
5. **Readability pass** — `index.css` + inline styles across all components

The app shell (`App.tsx`), the transition system, the scoring logic, the animation CSS, and the design tokens all stay.
