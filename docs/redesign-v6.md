# Redesign v6 — Connected Stories & Confrontation

**Date:** 30 March 2026
**Context:** Webinar mini-game for Malaysian/Singaporean business owners, played live on 1 April.
**Positioning:** Zi Wei Dou Shu as a strategic decision-making tool. The speaker (Cae Goh) closes after the game.

---

## 1. Mission (unchanged)

**What the game must achieve:**
Create urgency to stop guessing. The player should leave feeling: *"I have been making decisions with the same unconscious habit — and the months ahead will amplify that unless I do something about it."*

**What the speaker needs:**
An audience that has just seen their own pattern, felt the cost, and is sitting with one unresolved question. The speaker closes the loop with Zi Wei Dou Shu as the framework that explains WHY the pattern exists and HOW to work with it.

**What the game must NOT do:**
Fully resolve the player's question. The game is the diagnosis. The reading is the treatment. Every insight the game gives away is one less reason to book a reading. The game should make the pattern undeniable, but should NOT explain why it exists or how to fix it — that is the speaker's job.

**Three emotional stages:**
1. **Recognition** — "I keep choosing the same way."
2. **Cost** — "That pattern had consequences — and I just named them myself."
3. **Urgency** — "The months ahead start now. This pattern is still running."

---

## 2. What v5 Got Right (keep all of this)

| Element | Why it stays |
|---------|-------------|
| 3-stage structure | Escalation from hypothetical → retrospective → confessional is proven |
| 10 questions (8 scored, 2 reversals) | Enough data for credible pattern, under 8 minutes |
| Stage I and II intros | Boss explicitly wanted parity across stages |
| 2 reflection screens | Where the game becomes a mirror |
| Confrontation screen | The shift into Stage III needs a felt moment |
| 4 dimensions (A/B/C/D) | Simple enough to explain, rich enough for a portrait |
| Shuffled option order | Prevents gaming the system |
| Stage III echo comparison | "Still here." / "Something has shifted." — genuine surprise |
| 3-phase result | Name/evidence → cost → takeaway/urgency |
| Chips + sliders + distribution bar | Cae explicitly requested these |
| Answer distribution bar | Only genuinely personal data in the result |
| Back navigation | Business owners will want to reconsider |
| Gold gradient design system | Right register for this audience |
| Word-by-word reveal on hidden cost | Forces slow reading at the key moment |
| Result curtain animation | Theatrical transition to revelation |

---

## 3. What v5 Got Wrong (insights from boss playtest + audit)

### 3A. The game feels like a personality quiz, not a confrontation

Every question has the same 4-option structure mapping to "move fast / wait / analyze / keep options." After 2-3 questions, the player recognises the template and starts pattern-matching instead of reflecting. The game TELLS the player their pattern rather than making them FEEL it.

**Fix:** Questions within each stage form a connected story where consequences build. The player watches their pattern create outcomes across a multi-part scenario. The pattern reveals itself through the story, not through a label.

### 3B. The reflection screens are passive

The player reads text, waits, and taps Continue. There is no active engagement.

**Fix:** Reflection 2 surfaces contradictions between Stage I behavior and Stage II retrospection. The Confrontation screen quotes the player's own answers back at them, including the cost they named themselves.

### 3C. "Q1" is ambiguous

The game has 10 questions labeled "01 / 10" through "10 / 10." The copy uses "Q1" to mean "first quarter (January-March)." A player could read "Think of your Q1" as "think of Question 1." For a Malaysian/Singaporean audience where English is a working language, this creates real confusion.

**Fix:** Replace all instances of "Q1" with "the first three months" or "the first three months of this year." Replace "Q2" with "the months ahead" or "April onwards."

### 3D. Questions feel repetitive

Q1 and Q2 are both "uncertain situation → how do you respond?" with the same four behavioral options. Q4 and Q5 are both "looking back at Q1." The boss noticed.

**Fix:** Questions within each stage form chapters of ONE story. Q2's scenario is a direct consequence of Q1's choice. Q3 escalates the same story to a deadline. Each question feels like a new chapter because it IS a new chapter — the player's previous choice shaped what happened next.

### 3E. The game resolves too much — competing with the product

The result screen gives a complete personality profile (pattern name, 5 sliders, 4 secondary chips, distribution bar, benefit, hidden cost). The player screenshots it and feels "done." The speaker has nothing to close on.

**Fix:** Add the player's self-named cost to the result (powerful because it is their own words). Add a bridge line that creates a gap only the speaker can fill: "This game shows you the pattern. It cannot show you why it runs." Keep the chips/sliders/distribution bar (Cae requested), but ensure the emotional climax is the unresolved question, not the data.

### 3F. The ending is unclear

The boss was not sure the game had ended.

**Fix:** Add a small, delayed text below the watermark: "The speaker will continue from here."

---

## 4. The New Question Design

### Core Mechanic: Branching Setups

Each question has **one set of options** (4 options mapping to A/B/C/D, same for every player) but **up to 4 setup variants** (the scenario text adapts based on the player's previous answer).

The player sees their choice shape the next situation. The options still test the same four behavioral dimensions — scoring is completely unchanged. But the EXPERIENCE feels like a story responding to their decisions.

**Data structure:**
- Questions where `setup` is a `string` → universal (same for every player)
- Questions where `setup` is a `BranchingSetup` → the game looks up the previous answer and selects the matching variant

### Special Question: Q5 — Player Names Their Cost

Q5 is not scored as a behavioral dimension. Its four options are **cost categories**, not behavioral responses. The player selects what their pattern has cost them. This answer is stored separately and appears in the Confrontation screen and the Result screen as the player's own words.

Q5 is excluded from dimension scoring (added to the non-scored indices alongside reversals Q6 and Q9).

### Scored vs Non-Scored

| Index | Question | Scored? | Notes |
|-------|----------|---------|-------|
| 0 | Q1 | Yes | |
| 1 | Q2 | Yes | |
| 2 | Q3 | Yes | |
| 3 | Q4 | Yes | |
| 4 | Q5 | **No** | Cost question — player names their own cost |
| 5 | Q6 | **No** | Reversal |
| 6 | Q7 | Yes | |
| 7 | Q8 | Yes | |
| 8 | Q9 | **No** | Reversal |
| 9 | Q10 | Yes | |

**7 scored answers.** Down from 8 (v5). Still sufficient for reliable pattern detection across 4 dimensions.

---

## 5. Full Question Content

### Stage I — "The Opportunity" (connected story)

#### Q1 — The Opening (universal)

**Setup:** "A new direction opens in your market. The information is incomplete. Others are watching the same space."

**Context:** "What do you do?"

| Dim | Option |
|-----|--------|
| A | "Move in now and adjust as I learn" |
| B | "Hold back until the picture is clearer" |
| C | "Run the numbers before I decide" |
| D | "Position myself without fully committing" |

---

#### Q2 — The Consequence (branches on Q1)

**Setup variants:**

| After | Setup |
|-------|-------|
| A | "You moved first. Things are in motion — but a key detail surfaces that changes the picture. Something you would have caught with more time." |
| B | "You held back. The space is clearer now, but two others have moved in. Your team is asking why you are still watching." |
| C | "You ran the numbers. The data looks promising but not conclusive. A faster competitor has already launched while you were analysing." |
| D | "You positioned yourself without committing. Both paths are still open, but your team is not sure which way you are heading." |

**Context:** "What do you do now?"

| Dim | Option |
|-----|--------|
| A | "Push forward — we will fix it as we go" |
| B | "Pause and get clarity before the next move" |
| C | "Map out exactly what changed before deciding" |
| D | "Keep room to adjust — do not lock in yet" |

---

#### Q3 — The Deadline (branches on Q2)

**Setup variants:**

| After | Setup |
|-------|-------|
| A | "You pushed through again. A partner now needs your answer by end of day. You have about 70% of the information. This is your third fast call." |
| B | "You paused. The picture is sharper, but the deadline did not pause with you. A partner needs your answer by end of day. You have about 70%." |
| C | "You mapped it out. The analysis helped, but took time. A partner needs your answer by end of day. You have about 70%." |
| D | "You kept room to adjust. Flexible — but a partner now needs a firm answer by end of day. You have about 70%." |

**Context:** "What do you do?"

| Dim | Option |
|-----|--------|
| A | "Decide now — 70% is enough" |
| B | "Push the deadline — a wrong call is worse than a late one" |
| C | "Use what I have to work out the outcomes first" |
| D | "Give a soft answer I can adjust later" |

---

### Stage II — "The Aftermath" (retrospective with cost naming)

#### Q4 — The Look Back (universal)

**Setup:** "Think of a real decision from the first three months of this year. Someone you know took the path you passed on — and it worked for them."

**Context:** "Looking back, you:"

| Dim | Option |
|-----|--------|
| A | "Think I should have moved sooner" |
| B | "Still believe holding back was right at the time" |
| C | "Want to understand exactly why it worked for them" |
| D | "Think every business has its own timing" |

---

#### Q5 — Name Your Cost (branches on Q4, NOT SCORED)

**Setup variants:**

| After | Setup |
|-------|-------|
| A | "You wish you had moved sooner. Speed matters to you, even in hindsight. But every default has a price." |
| B | "You stand by the wait. Patience matters to you. But every default has a price." |
| C | "You want to understand the logic. Clarity matters more to you than speed. But every default has a price." |
| D | "You see your own timing as valid. Flexibility matters to you. But every default has a price." |

**Context:** "In the first three months — what did your pattern cost you most?"

| ID | Option (cost category) |
|----|------------------------|
| A | "Relationships — people around me struggle to keep up or stay aligned" |
| B | "Missed windows — some chances closed while I was still deciding" |
| C | "Direction — I stay busy but not always heading the right way" |
| D | "Energy — I keep running and it is starting to show" |

**Note:** These options use dimension IDs (A/B/C/D) for storage but are NOT scored as behavioral dimensions. The selected text is stored separately as `playerCostText` and displayed in the Confrontation and Result screens.

---

#### Q6 — The Outside View (reversal, branches on Q5)

**Setup variants:**

| After | Setup |
|-------|-------|
| A (cost=Relationships) | "You said your pattern costs you relationships. A trusted advisor is describing how you make decisions." |
| B (cost=Missed windows) | "You said your pattern costs you timing. A trusted advisor is describing how you make decisions." |
| C (cost=Direction) | "You said your pattern costs you direction. A trusted advisor is describing how you make decisions." |
| D (cost=Energy) | "You said your pattern costs you energy. A trusted advisor is describing how you make decisions." |

**Context:** "Which would they least say about you?"

| Dim | Option (reversal) |
|-----|-------------------|
| A | "You move fast and fix later" |
| B | "You wait until you are sure" |
| C | "You need the data before you act" |
| D | "You keep options open as long as possible" |

---

### Stage III — "The Mirror" (direct confrontation)

#### Q7 — The Automatic (universal)

**Setup:** "When a strategy is not working, your automatic response is usually to:"

**Context:** "" *(setup IS the question)*

| Dim | Option |
|-----|--------|
| A | "Try something different immediately" |
| B | "Step back and watch longer" |
| C | "Analyse what went wrong before changing anything" |
| D | "Pull back — keep room to shift" |

---

#### Q8 — The Confession (branches on Q7)

**Setup variants:**

| After | Setup |
|-------|-------|
| A | "You default to action. Be honest about the first three months of this year." |
| B | "You default to watching. Be honest about the first three months of this year." |
| C | "You default to analysis. Be honest about the first three months of this year." |
| D | "You default to flexibility. Be honest about the first three months of this year." |

**Context:** "The decisions that mattered most were probably made:"

| Dim | Option |
|-----|--------|
| A | "Quickly — trusting instinct over data" |
| B | "Slowly — waiting longer than I probably needed to" |
| C | "Carefully — running the analysis until it felt safe enough" |
| D | "Tentatively — committing just enough to stay flexible" |

---

#### Q9 — The Blind Spot (reversal, branches on Q8)

**Setup variants:**

| After | Setup |
|-------|-------|
| A | "You move fast and trust instinct. Every decision habit has a cost." |
| B | "You move slowly and wait for signals. Every decision habit has a cost." |
| C | "You move carefully and trust analysis. Every decision habit has a cost." |
| D | "You move tentatively and stay flexible. Every decision habit has a cost." |

**Context:** "Which cost do you notice least in yourself?"

| Dim | Option (reversal) |
|-----|-------------------|
| A | "Moving fast, then fixing avoidable mistakes" |
| B | "Waiting until the best window quietly closes" |
| C | "Over-planning until good ideas never start" |
| D | "Keeping options open until nothing gets fully built" |

---

#### Q10 — The Climax (branches on Q9)

**Setup variants:**

| After | Setup |
|-------|-------|
| A (least noticed: speed) | "The cost you notice least — wasted motion — might be running right now." |
| B (least noticed: waiting) | "The cost you notice least — closed windows — might already be happening." |
| C (least noticed: planning) | "The cost you notice least — unlaunched ideas — might be piling up." |
| D (least noticed: options) | "The cost you notice least — nothing fully built — might be the story of this year." |

**Context:** "The months ahead will amplify your pattern. If one thing needs to change, what is it?"

| Dim | Option |
|-----|--------|
| A | "Am I moving fast because it is right — or because standing still feels uncomfortable?" |
| B | "Am I waiting for certainty — or just avoiding the risk of being wrong?" |
| C | "Am I planning carefully — or hiding behind the analysis?" |
| D | "Am I staying flexible — or afraid to fully commit?" |

---

## 6. Reflection Screen Changes

### Reflection 1 (after Q1–Q3)

**No contradiction surfacing.** All three answers are within one connected story — a contradiction within the same story would be confusing, not insightful.

**Quote-back:** Show the three verbatim answers with gold left-borders (same as v5).

**Pattern observation (varies by dominantCount from Q1–Q3):**

| Condition | Text |
|-----------|------|
| 3/3 same, dim A | "Three decisions in one story. Each time — you moved first." |
| 3/3 same, dim B | "Three decisions in one story. Each time — you held back." |
| 3/3 same, dim C | "Three decisions in one story. Each time — you ran the numbers." |
| 3/3 same, dim D | "Three decisions in one story. Each time — you kept a way out." |
| 2/3 same | "Two out of three — the same instinct." |
| All different | "Three decisions. Three different responses." |

**Friction question:**

| Condition | Text |
|-----------|------|
| Clear pattern (2/3 or 3/3) | "How many times did this happen in the first three months?" |
| Balanced (1/3) | "In the first three months — was it this mixed, or did one instinct take over?" |

---

### Reflection 2 (after Q4–Q6) — WITH contradiction surfacing

**Quote-back:** Show Q4–Q6 verbatim answers (same format as Reflection 1).

**Pattern observation WITH contradiction check:**

Compare Stage I dominant (from Q1–Q3 scored answers) with the Q4 answer.

| Condition | Text |
|-----------|------|
| Stage I dom = Q4 answer (consistent), dim A | "Even in hindsight — you would still move first." |
| Stage I dom = Q4 answer (consistent), dim B | "Even in hindsight — you would still wait." |
| Stage I dom = Q4 answer (consistent), dim C | "Even in hindsight — you would still want the numbers." |
| Stage I dom = Q4 answer (consistent), dim D | "Even in hindsight — you would still keep an exit open." |
| Stage I dom ≠ Q4 answer (contradiction) | Dynamic: "In the first story, you **[Stage I behavior]** every time. But looking back — you said **[Q4 description]**." |

**Stage I behavior descriptions (for contradiction text):**
- A: "moved first"
- B: "held back"
- C: "ran the numbers"
- D: "kept your options open"

**Q4 answer descriptions (for contradiction text):**
- A: "you should have moved sooner"
- B: "holding back was still right"
- C: "you wanted to understand the logic"
- D: "the timing was just different"

**Cost reference (after observation):**
> "You said this costs you: **[Q5 cost text]**"

**Friction question:**

| Condition | Text |
|-----------|------|
| Clear pattern | "Is this the price you want to keep paying?" |
| Balanced | "Even without a clear pattern — is the cost adding up?" |

---

## 7. Confrontation Screen Changes

The Confrontation screen now uses the player's own data. It receives:
- `stageIDominant: Dimension` — dominant from Q1–Q3
- `hasContradiction: boolean` — whether Stage I dominant differs from Q4 answer
- `stageIBehaviorText: string` — e.g. "moved first"
- `q4DescriptionText: string` — e.g. "you should have moved sooner"
- `playerCostText: string` — the Q5 answer text

**Copy structure (timed reveal):**

**Line 1** (immediate): "You have been making the same call."

**Line 2** (1s delay):
- If contradiction: "In the first story, you [stageIBehaviorText]. But looking back at a real moment — you said [q4DescriptionText]."
- If consistent: "In the first story and in hindsight — the same instinct."

**Line 3** (2s delay): "And you already named what it costs you."

**Line 4** (2.5s delay, italic): "The next questions are not about what might happen. They are about what is already running."

**CTA** (3.5s delay): "I'm ready"

---

## 8. Result Screen Changes

### Phase 1 — Pattern + Mirror (mostly unchanged)

Keep: player name, "YOUR PATTERN" label, primary chip(s), mirror sentence (reflectionLines[0]), Q1 vs Q8 comparison, Q10 quote-back.

**Add** after Q10 quote-back:
> "You said your pattern costs you:"
> **[Q5 cost text in a gold-bordered quote card]**

### Phase 2 — The Cost (mostly unchanged)

Keep: benefit line (reflectionLines[1]), hidden cost box (reflectionLines[2]), Q1 cost line.

No changes.

### Phase 3 — Portrait + Bridge to Speaker (additions)

Keep: distribution bar, primary chip(s), secondary chips, sliders, Q2 closing question, player name (breathing), "Now you have seen it.", CAE GOH watermark.

**Update** Q2 closing question text:
> "The months ahead will amplify whatever direction you are already in."
> "Is this the pattern you want running it?"

**Add** after CAE GOH watermark:
> "This game shows you the pattern. It cannot show you why it runs, or how the months ahead will change it."

**Add** ending signal (small, delayed, low opacity):
> "The speaker will continue from here."

---

## 9. Data Architecture

### TypeScript Types

```typescript
export interface BranchingSetup {
  /** 0-based index of the question whose answer determines which setup variant to show */
  branchesOn: number;
  /** One setup string per dimension — keyed by the PREVIOUS answer's dimension */
  variants: Record<Dimension, string>;
}

export interface Question {
  id: number;
  /** Universal setup (string) or branching setup (variants based on previous answer) */
  setup: string | BranchingSetup;
  context: string;
  options: Option[];
  isReversal?: boolean;
  /** If true, this question is not scored as a behavioral dimension. The answer text is stored separately. */
  isCostQuestion?: boolean;
}
```

### Non-Scored Indices

```typescript
const NON_SCORED_INDICES: ReadonlySet<number> = new Set([4, 5, 8]);
// Index 4 = Q5 (cost question)
// Index 5 = Q6 (reversal)
// Index 8 = Q9 (reversal)
```

### Setup Resolution

When the game encounters a question where `setup` is a `BranchingSetup`:
1. Look up `answers[setup.branchesOn]` to get the previous answer's dimension
2. Use `setup.variants[dimension]` as the setup text
3. If the previous answer does not exist (edge case), fall back to the `A` variant

### New Game State

- `playerCostText: string` — the verbatim text of the Q5 answer (memoised from `answers[4]`)
- `stageIDominant: Dimension` — dominant dimension from Q1–Q3 scored answers
- `hasContradiction: boolean` — `stageIDominant !== answers[3]` (Stage I dominant differs from Q4 answer)
- `currentResolvedSetup: string` — the resolved setup text for the current question (handles branching)

### Contradiction Detection

Stage I behavior descriptions and Q4 answer descriptions are stored as constants in `content.ts`:

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

---

## 10. Language Fixes — "Q1" / "Q2" Replacements

All game copy should use plain language. Replace throughout:

| Old | New |
|-----|-----|
| "Q1 is done." | "The first three months are done." |
| "Before Q2 begins" | "Before April begins" |
| "Think of your Q1 as you answer" | "Think of your first three months as you answer" |
| "Not to judge your Q1" | "Not to judge your first three months" |
| "in Q1" / "in your Q1" | "in the first three months" |
| "Q2 starts now" | "The months ahead start now" or "April starts now" |
| "Q2 will accelerate" | "The months ahead will amplify" |
| "Your Q1 Pattern" | "Your Pattern" |
| "In Q1 — was some of..." | "In the first three months — was some of..." |

These changes apply to:
- `LoginScreen.tsx` — intro copy
- `StageIntroScreen.tsx` — stage intro copy
- `ConfrontationScreen.tsx` — confrontation copy
- `ReflectionScreen.tsx` — friction question text
- `ResultScreen.tsx` — result phase copy
- `content.ts` — reflection observations, friction text, result interpretations, question setups

---

## 11. Game Flow (unchanged)

```
login
  → stageIntro (Stage I)
  → question[0] (Q1 — universal)
  → question[1] (Q2 — branches on Q1)
  → question[2] (Q3 — branches on Q2)
  → reflection (block 1)
  → stageIntro (Stage II)
  → question[3] (Q4 — universal)
  → question[4] (Q5 — branches on Q4, cost question)
  → question[5] (Q6 — reversal, branches on Q5)
  → reflection (block 2 — with contradiction surfacing)
  → confrontation (with player data)
  → question[6] (Q7 — universal)
  → question[7] (Q8 — branches on Q7)
  → question[8] (Q9 — reversal, branches on Q8)
  → question[9] (Q10 — branches on Q9)
  → result (phase 1)
  → result (phase 2)
  → result (phase 3)
```

The flow architecture is identical to v5. No stages added or removed. The only changes are content and data handling within existing screens.

---

## 12. Content Summary

| Item | Count |
|------|-------|
| Universal question setups | 3 (Q1, Q4, Q7) |
| Branching question setups | 28 (7 questions × 4 variants) |
| Option texts | 40 (10 questions × 4 options) |
| **Total content pieces** | **71** |

---

## 13. What This Achieves for the Speaker

1. **Player-named cost = the player built their own case.** "I said speed costs me direction" → they are primed to want help fixing it.

2. **Caught contradiction = unresolved tension.** "I keep doing something I know hurts me — why?" → ZWDS explains why (chart configuration).

3. **Consequences shown, not explained = curiosity gap.** "I see where this goes, but I cannot change the default on my own" → the reading provides the how.

4. **Bridge line creates explicit handoff.** "This game shows you the pattern. It cannot show you why it runs." → the speaker picks up from exactly this point.

The game ends with the player holding awareness + discomfort + an unresolved question. The speaker provides the framework (ZWDS) that resolves all three.
