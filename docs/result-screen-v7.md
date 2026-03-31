# Result Screen v7 — Narrative Sections (CAE Feedback)

**Date:** 31 March 2026
**Context:** Post-playtest feedback from CAE. The end screen (Phase 3 of `ResultScreen.tsx`) currently shows chips/pills and static sliders that feel impersonal and quiz-like. CAE wants to replace them with two narrative sections that speak directly to the player's pattern and blind spot.

---

## 1. What We Are Changing and Why

### Remove from Phase 3
- **Primary chips** (e.g. "Early Movement") — the label is not the insight
- **Secondary chips** (e.g. "Adjust as you go") — adds no emotional value
- **5 sliders** — static preset values that have no relationship to the player's actual answers; feel like a generic personality test output

### Keep in Phase 3
- **Distribution bars** (A/B/C/D with answer counts) — the only genuinely personalised data visual; keeps the "portrait" feel

### Add to Phase 3
Two new narrative sections that replace the chips and sliders:

1. **"The Path You Walked"** — Describes the pattern the player actually chose, referencing their real answers. Driven by the dominant dimension.
2. **"The Pattern You Rarely Used"** — Describes the dimension the player scored lowest on, and what that absence costs them. Styled with a distinct warning visual to signal a blind spot.

### Change in Phase 2
The existing gold box that contains `reflectionLines[2]` (the shadow sentence) is **removed**. Its role moves into the "The Path You Walked" section in Phase 3, where it is expanded into a full paragraph. This prevents repetition.

---

## 2. Dimension Mapping (Internal Reference Only — Do Not Expose to Player)

The 4 game dimensions loosely parallel DISC archetypes. This is for CAE's internal framing only. The player must never see the letters D/I/S/C or any DISC terminology.

| Game Dimension | Pattern Name | CAE Shadow Notes |
|---|---|---|
| **A** | Early Movement | Burnout, internal misalignment, loses work-life balance, sacrifices family/present moments, always future-focused, never present |
| **B** | Seeking Clarity | Wants the end goal without putting in effort, traditional, conservative, afraid of change, core value is stability/security, hard to adapt, asks 10 people for advice but never acts |
| **C** | Calculated Risk | Over-planner, perfectionist, misses opportunities, over-calculates risk and effort, no big picture view, short-sighted, detail-obsessed |
| **D** | Preserving Options | Easily distracted, easily influenced, wants to do everything, wants to show best self to others, lacks depth and detail |

---

## 3. Content Architecture Changes

### `ResultInterpretation` Interface (updated)

```typescript
export interface ResultInterpretation {
  /** Short pattern label used in distribution bar and Phase 1 chip */
  chip: string;
  /**
   * Two lines used in Phase 1 and Phase 2.
   * [0] = recognition sentence (Phase 1)
   * [1] = strength sentence (Phase 2, paragraph 1)
   * NOTE: The third shadow line is removed — it now lives in pathWalked[2].
   */
  reflectionLines: [string, string];
  /** Personalised callback question shown in Phase 2 */
  q1CostLine: string;
  /**
   * Three paragraphs for Section 1 "The Path You Walked" in Phase 3.
   * Use {Q1}, {Q8}, {COST}, {COUNT} as interpolation tokens.
   * {Q1}    = player's Q1 answer text (their first market move)
   * {Q8}    = player's Q8 answer text (self-description of how they decided)
   * {COST}  = player's Q5 answer text (what their pattern cost them)
   * {COUNT} = number of times they chose this dimension (out of 7 scored questions)
   */
  pathWalked: [string, string, string];
  /**
   * Three paragraphs for Section 2 "The Pattern You Rarely Used" in Phase 3.
   * Shown when THIS dimension is the player's weakest (lowest answerCount).
   * Use {Q9}, {COUNT} as interpolation tokens.
   * {Q9}    = player's Q9 answer text (cost they notice least in themselves)
   * {COUNT} = number of times they chose this dimension (may be 0)
   */
  weaknessNarrative: [string, string, string];
}
```

**Removed fields:** `sliders`, `secondaryChips`

---

## 4. Full Copy — Section 1: "The Path You Walked"

Personalisation tokens: `{Q1}`, `{Q8}`, `{COST}`, `{COUNT}`

### Dimension A — Early Movement

```
[0] When the first question opened, you chose to "{Q1}." Not because the picture was clear. Because waiting felt like falling behind.

[1] You told us how you made decisions in the first three months: "{Q8}." That is consistent. Across {COUNT} out of 7 choices, you led with momentum. The instinct to move before full clarity is not something you were taught — it is how you are wired. You are the person who builds while others are still in the meeting.

[2] But this pattern carries a specific cost that rarely announces itself. You are always in the next chapter — the next deal, the next move, the next version of what you are building. And somewhere behind you, the present keeps passing. Work-life balance does not collapse at once. It goes quietly: a dinner half-attended, a conversation you were not fully in, a person who learned not to wait for you to arrive. You named it yourself — "{COST}." The drive that builds things is the same drive that makes people feel invisible to you. You are always in the future. The question is what you are leaving in the present.
```

### Dimension B — Seeking Clarity

```
[0] When the first question opened, you chose to "{Q1}." You needed the picture to be clearer before you moved. That is not hesitation — that is your standard.

[1] You described how you made the decisions that mattered most: "{Q8}." Across {COUNT} out of 7 choices, you held back, waited, or protected your position. You are the person who asks the question everyone else skipped. Who sees the gap others did not check. Who would rather be late and right than first and wrong.

[2] But this pattern has a shadow that feels like wisdom. The goal has always been clear to you. The gap is the starting. You ask one more person, wait for one more signal, check one more detail. Stability and security matter deeply to you — and that is not weakness. But the market does not pause for comfort. Some windows close while you are still gathering certainty. You named the cost yourself — "{COST}." The question is not whether caution is right. It is whether the next step is actually missing information — or whether you already know, and waiting feels safer than being wrong.
```

### Dimension C — Calculated Risk

```
[0] When the first question opened, you chose to "{Q1}." Precision before movement. Logic before commitment. That was your first answer, and it echoed through {COUNT} out of 7 choices.

[1] You told us your key decisions were made: "{Q8}." You are the analyst. The one who maps the risk before entering the room. Who knows the numbers before anyone else. Who does not waste resources on things that do not add up — and who protects others from doing so either.

[2] But this pattern has a blind spot that is invisible from the inside, because it always looks like thoroughness. You are so precise with the detail that the larger picture sometimes blurs. Opportunities you missed were not lost to bad luck — they were reviewed to death. Partnerships that could have changed everything received an analysis instead of a yes. Perfectionism does not feel like fear from the inside. It feels like standards. You named the cost yourself — "{COST}." The skill waiting to be built is not more analysis. It is knowing when to stop.
```

### Dimension D — Preserving Options

```
[0] When the first question opened, you chose to "{Q1}." Keep the exits open. Stay in the room without fully belonging to it. That was your first answer, and it appeared {COUNT} out of 7 times in your choices.

[1] You described your decisions as: "{Q8}." You are responsive. Alive to what is around you. You read the room faster than most, and you want to be in everything — and often you are. Others see your energy and want to follow it.

[2] But this pattern is easily pulled. The next opportunity catches your eye before the current one is finished. Someone else's success lands differently on you — what they are doing suddenly seems more interesting than what you are doing. You want to show your best to the world, always. And that wanting can quietly replace the slower work of building something that does not need an audience. You named the cost yourself — "{COST}." Nothing gets fully built when everything stays tentative. The freedom you are protecting may already be costing you the depth you actually want.
```

---

## 5. Full Copy — Section 2: "The Pattern You Rarely Used"

Personalisation tokens: `{Q9}`, `{COUNT}`

This section is driven by the **weakest dimension** — the one with the lowest score in `answerCounts`. If two or more dimensions tie for lowest, **show all tied weakness cards stacked**, each with its own copy.

The Q9 answer text (`q9AnswerText`) comes from Q9 (index 8): "Which cost do you notice least in yourself?" — the answer is the cost the player admitted they cannot see in themselves. It is the most powerful personalisation in this section.

### When A is weakest (player rarely chose Early Movement)

```
[0] Early Movement showed up the least in your choices — just {COUNT} out of 7. You rarely chose speed over certainty. The impulse to move before everything was clear was the one you resisted most.

[1] That resistance has protected you. It has probably saved you from decisions you would have regretted more than the ones you delayed. But the cost of not starting is invisible in a way the cost of moving is not. A bad decision leaves a mark. A decision never made leaves nothing — no trace, no record, just a slightly smaller version of what could have existed.

[2] You told us the cost you notice least in yourself: "{Q9}." Sit with that. There may be something you have been waiting to start that is already overdue — not because the conditions were not right, but because standing still has always felt safer than being wrong in motion.
```

### When B is weakest (player rarely chose Seeking Clarity)

```
[0] Seeking Clarity showed up the least in your choices — just {COUNT} out of 7. You rarely chose to wait, gather more, or hold back. The instinct to pause for a clearer signal was the one you used the least.

[1] That speed has built things. But speed without checkpoints also creates cleanup — decisions made quickly that required more correction than patience would have cost upfront. Not every move needs more data. But some do. And the ones that did may still be showing up in the results.

[2] You told us the cost you notice least in yourself: "{Q9}." The question worth sitting with: is there a pattern from the first three months where going fast cost you something that only became visible later — and is it still costing you now?
```

### When C is weakest (player rarely chose Calculated Risk)

```
[0] Calculated Risk showed up the least in your choices — just {COUNT} out of 7. You rarely stopped to map the numbers, test the logic, or stress-test the plan before committing. That mode — precise, analytical, detail-first — was the one you used the least.

[1] You tend to trust feel over formula. In the right moments, that is an asset. But it may also mean some of your decisions were made without a full accounting of what they would actually cost — in time, in energy, in people.

[2] You told us the cost you notice least in yourself: "{Q9}." The structure you have been skipping may not be caution — it may be the thing that makes everything else sustainable. What is one decision from the first three months where the numbers mattered more than you gave them credit for?
```

### When D is weakest (player rarely chose Preserving Options)

```
[0] Preserving Options showed up the least in your choices — just {COUNT} out of 7. You rarely chose to keep an exit open or stay tentative. Flexibility — staying adaptive, avoiding lock-in — was the pattern you used the least.

[1] You tend to commit fully. That creates depth and loyalty, and it builds things that last. But full commitment also means you carry things longer than you should — out of principle, or loyalty, or because letting go feels like failure.

[2] You told us the cost you notice least in yourself: "{Q9}." There may be a commitment in your life right now — a direction, a relationship, a plan — that you are still holding out of identity rather than wisdom. The question is not whether you are loyal. It is whether what you are loyal to is still worth the weight.
```

---

## 6. Updated `reflectionLines` Content (2 lines per dimension)

The third line was the shadow sentence, now removed from here. Updated values:

| Dimension | [0] Recognition | [1] Strength |
|---|---|---|
| A | "You start before everything is clear." | "This keeps you in motion when others are still hesitating." |
| B | "You prefer to wait until the picture is clearer." | "This protects you from early, costly mistakes." |
| C | "You measure before you move." | "This keeps you from wasting energy on things that do not add up." |
| D | "You protect your freedom to change direction." | "This keeps you from being trapped by choices that no longer fit." |

---

## 7. Section 2 Visual Design — Warning Box

Section 2 ("The Pattern You Rarely Used") uses a distinct visual treatment to signal a blind spot or risk area. It should feel noticeably different from the gold/warm tone of Section 1 without being aggressive.

**Colour palette (terracotta/red-adjacent, muted):**
- Background: `rgba(180, 50, 30, 0.06)`
- Border: `1px solid rgba(180, 50, 30, 0.3)`
- Border radius: `16px`
- Warning label text colour: `rgba(180, 50, 30, 0.85)`

**Layout within the warning box:**
- Small all-caps label at the top: `⚠ BLIND SPOT` — terracotta colour
- Section heading: `"The Pattern You Rarely Used"` — normal text colour
- 3 narrative paragraphs
- If two dimensions tie for weakest, render two warning boxes stacked with a small gap

**CSS class to add to `src/index.css`:** `.warning-box`, `.warning-label`

---

## 8. Phase 3 Layout After Changes

```
[Distribution bars — A/B/C/D with counts — KEEP]

[Section divider]

[Section 1: "The Path You Walked"]
  heading: small caps label
  paragraphs: 3 paragraphs, pathWalked[0..2] with tokens interpolated

[Section divider]

[Section 2 warning box: "The Pattern You Rarely Used"]
  ⚠ BLIND SPOT label (terracotta)
  heading
  paragraphs: 3 paragraphs, weaknessNarrative[0..2] with tokens interpolated
  (if tied weakest: second warning box stacked below)

[Zone B: Closing copy — KEEP]
[Zone C: Sign-off — KEEP]
```

---

## 9. New Data Flow — `q9AnswerText`

Q9 (0-based index 8, `NON_SCORED`) options:
- A: `"Moving fast, then fixing avoidable mistakes"`
- B: `"Waiting until the best window quietly closes"`
- C: `"Over-planning until good ideas never start"`
- D: `"Keeping options open until nothing gets fully built"`

The player's Q9 answer text needs to be:
1. Computed in `useGameState.ts` (same pattern as existing `q9AnswerText` pattern for q1/q8/q10)
2. Returned from `useGameState`
3. Passed from `App.tsx` to `ResultScreen` as a new prop `q9AnswerText: string`
4. Used in `ResultScreen` to populate the `{Q9}` token in `weaknessNarrative`

---

## 10. Files Changed

| File | What changes |
|---|---|
| `src/data/content.ts` | `ResultInterpretation` interface update; all 4 `resultInterpretations` entries rewritten with new fields; `reflectionLines` reduced to 2 items; `sliders` and `secondaryChips` removed |
| `src/hooks/useGameState.ts` | Add `q9AnswerText` computation (answers[8]) and return it |
| `src/App.tsx` | Pass `q9AnswerText` prop to `ResultScreen` |
| `src/components/ResultScreen.tsx` | Add `q9AnswerText` to props; update Phase 2 (remove gold shadow box); overhaul Phase 3 (remove chips/sliders/slidersVisible, add Section 1 + Section 2 with warning box) |
| `src/index.css` | Remove `.slider-track` and slider fill styles; add `.warning-box` and `.warning-label` styles |
