# Calculated Risk Phase 3 - Exact Design Mapping

## Scope
- Profile: `Calculated Risk` only.
- Copy: unchanged.
- Goal: make long text easier to read and close better in webinar context.

## Fixed Design Tokens (use exactly)
- `sentence-chip`: `font-size 0.95rem`, `line-height 1.82`, `padding 0.45rem 0.6rem`, `border-radius 10px`
- `lead sentence`: `font-weight 600`, `color #2c251d`
- `key phrase`: `font-weight 600`, `color #7d1f0f`
- `section quote`: `font-size 1.15rem`, `font-weight 600`, bronze gradient
- `section gap`: `1.5rem`
- `sentence chip gap`: `0.55rem`

## Conversion Order (must remain)
1. `01 Your Decision Portrait` (credibility)
2. `02 The Path You Chose` (self-recognition)
3. `03 What You Actually Missed` (stakes)
4. `04 Final Thoughts` (solution bridge)

---

## Sentence-Level Mapping

### 02 The Path You Chose
| Sentence / phrase | Exact design treatment | Why |
|---|---|---|
| `"Map every risk before committing."` | Quote style, bronze gradient, single line if possible | Identity anchor; this is the self-label |
| `You like to think things through and analyze every detail before taking action.` | One `sentence-chip`, lead style (`font-weight 600`) | Validation before challenge increases receptivity |
| `While this is a good habit, it can often lead to missed opportunities.` | One `sentence-chip`; phrase `missed opportunities` in `key phrase` style | Fast pivot to cost; needs instant scanability |

### 03 What You Actually Missed
| Sentence / phrase | Exact design treatment | Why |
|---|---|---|
| `"You're careful, but you're also missing out."` | Section warning title, strongest visual weight in page | Emotional peak; marks consequence section |
| `Your habit of overthinking can keep you from making decisions.` | `sentence-chip`; highlight `overthinking`, `making decisions` | Names root mechanism clearly |
| `You might spend hours calculating... until the chance passes.` | `sentence-chip`; highlight `hours`, `chance passes` | Encodes time loss + opportunity loss |
| `For example, you may have hesitated... someone else succeed...` | `sentence-chip`; highlight `hesitated`, `someone else succeed` | Adds social proof pain |
| `Think about how many partnerships you've let slip away...` | `sentence-chip`; highlight `partnerships`, `slip away`, `taking action` | Expands pain beyond one event |
| `You might find yourself stuck in a cycle of what ifs...` | `sentence-chip`; highlight `stuck`, `cycle of what ifs` | Reflects internal loop audience already feels |
| `Every decade brings new opportunities... others are moving ahead.` | `sentence-chip`; highlight `Every decade`, `others are moving ahead` | Adds long-horizon urgency |
| `Imagine the regret... if you had just acted.` | `sentence-chip` with slightly heavier border; highlight `regret`, `just acted` | End of consequence arc; should linger |

### 04 Final Thoughts
| Sentence / phrase | Exact design treatment | Why |
|---|---|---|
| `What if you had a clear playbook for 2026?` | Standalone line, gradient heading style (same family as warning but calmer hue) | Switches from pain to possibility |
| `By understanding your wealth path... make informed decisions...` | 1-2 `sentence-chip` blocks; highlight `wealth path`, `career trajectory`, `relationship dynamics`, `informed decisions` | Gives mechanism and specificity (credibility) |
| `The Design Your Destiny Program equips you...` | Dedicated `offer-chip` variant: same chip base + subtle gold border; highlight `Design Your Destiny Program`, `bold steps forward`, `successful outcomes` | Closing CTA bridge; must read as actionable offer, not generic paragraph |

---

## Word-Level Emphasis Map (Calculated Risk)

### Pain words (terracotta emphasis)
- `missed opportunities`
- `overthinking`
- `chance passes`
- `hesitated`
- `slip away`
- `stuck`
- `what ifs`
- `regret`

### Action words (deep gold emphasis)
- `taking action`
- `just acted`
- `bold steps forward`
- `make informed decisions`

### Offer words (brand gold emphasis)
- `clear playbook for 2026`
- `Design Your Destiny Program`
- `successful outcomes`

## Strict Usage Rules
- Max **2 emphasized phrases per sentence-chip**.
- Never emphasize entire sentences.
- Keep copy text unchanged; only wrap spans.
- If a sentence is under 70 characters, do **not** split further.

## Why this closes better in webinar
- Reader sees pain in small, digestible units instead of one heavy wall.
- Key pain terms are impossible to miss while scrolling.
- Final section visibly changes tone from diagnosis -> direction -> offer.
- The product line gets dedicated visual weight at the exact moment the audience is ready for solution framing.
