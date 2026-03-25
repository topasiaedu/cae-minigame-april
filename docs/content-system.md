# Content System

All game content lives in a single file: `src/data/content.ts`.

This is the **only file you need to edit** to change questions, reflection triggers, or result copy.

---

## The Four Dimensions

Every question has four answer options, each mapped to a behavioral dimension:

| Dimension | Pattern Name | Core Behavior |
|---|---|---|
| **A** | Early Movement | Starts before everything is clear. Acts first, adjusts later. |
| **B** | Seeking Clarity | Waits until the picture is clearer. Avoids early mistakes. |
| **C** | Calculated Risk | Measures before moving. Needs proof before committing. |
| **D** | Preserving Options | Keeps exits open. Avoids full commitment. Values flexibility. |

The dominant dimension across all 15 answers determines the final result.

---

## The 15 Questions

Questions are split into 3 stages of 5:

| Stage | Questions | Theme |
|---|---|---|
| Stage I | Q1–Q5 | The Unknown — how do you react to opportunities without full information? |
| Stage II | Q6–Q10 | The Aftermath — how do you reflect on past decisions and missed chances? |
| Stage III | Q11–Q15 | The Mirror — direct confrontation with your own habitual patterns. |

### Question Structure

```ts
{
  id: 1,
  setup: "Your company is starting a new project, but the goal isn't clear yet.",
  context: "Joining early gets you noticed, but you might take the blame if it fails. You usually:",
  options: [
    { id: 'A', text: "Join first and figure it out later" },
    { id: 'B', text: "Watch for a while before deciding" },
    { id: 'C', text: "Check the risks to see if it's worth it" },
    { id: 'D', text: "Wait until there's a safe backup plan" }
  ]
}
```

- `setup` — The bold sentence. Sets the scene. Never changes the dim.
- `context` — Frames the stakes and conflict. Leads into the 4 answers.
- Options are always in **A, B, C, D order** — the order must stay consistent.

---

## Dynamic Reflection Triggers

After every 5 questions, a reflection screen fires. The text shown is selected based on the **dominant dimension from the last 5 answers**.

```ts
export const dynamicTriggers = {
  stage1: { A: "...", B: "...", C: "...", D: "..." },  // fires after Q5
  stage2: { A: "...", B: "...", C: "...", D: "..." },  // fires after Q10
  stage3: { A: "...", B: "...", C: "...", D: "..." },  // fires after Q15 → then result
}
```

Each trigger is a single paragraph written in **second person, mirror style** — it describes a pattern, then asks a question. It does not give an answer.

---

## Result Interpretations

```ts
export const resultInterpretations = {
  A: {
    chip: "Early movement",                   // Primary identity chip
    secondaryChips: [...],                    // 4 secondary descriptor tags
    sliders: [                                // 5 behavioral spectrum sliders
      {
        label1: "Move first",                 // Left pole (behavior description)
        label2: "Think first",               // Right pole (opposite behavior)
        title: "When a chance appears",       // The context label above the slider
        value: 22                             // 0–100. 50 = balanced center. <50 = leans left.
      },
      ...
    ],
    reflectionLines: [                        // 3-sentence reflection, shown separately
      "You start before everything is clear.",           // Sentence 1: the observation
      "This keeps you in motion when others hesitate.",  // Sentence 2: the benefit
      "But over time, it becomes hard to tell..."        // Sentence 3: the hidden cost (shown in gold box)
    ]
  }
}
```

### Slider Value Guide

The slider value determines where the dot sits on a center-origin scale:

| Value | Meaning |
|---|---|
| `0–20` | Strongly leans LEFT (label1 behavior) |
| `21–40` | Moderately leans left |
| `50` | Perfectly balanced (center dot) |
| `60–79` | Moderately leans right |
| `80–100` | Strongly leans RIGHT (label2 behavior) |

Think of it like MBTI's I–E scale. The dot starts at center (50%) and animates to the actual value when the result page mounts.

---

## Scoring Algorithm

```ts
// From useGameState.ts
const computeDominantDimension = (startIndex: number, endIndex: number): Dimension => {
  const subset = answers.slice(startIndex, endIndex);
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  subset.forEach(ans => { counts[ans]++; });
  // Returns whichever dimension has the highest count
  // Tie-breaking: first encountered dimension with max count wins (default A)
};
```

- **Reflection trigger**: called with `(questionIndex - 5, questionIndex)` — only the last 5 answers
- **Final result**: called with `(0, 15)` — all 15 answers

---

## How to Edit Content

### Changing a question
Edit the corresponding object in the `questions` array. Keep all 4 options and the same `id` values.

### Changing a reflection trigger
Edit the string inside `dynamicTriggers.stage1[dimension]` etc.

### Changing result copy
Edit the relevant object inside `resultInterpretations[dimension]`. If you change `sliders`, keep all 5 items. If you change `reflectionLines`, keep exactly 3 strings.

### Adding more dimensions
Currently only supports A/B/C/D. Expanding would require changes to the `Dimension` type, `computeDominantDimension`, `dynamicTriggers`, and `resultInterpretations`.
