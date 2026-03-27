export type Dimension = "A" | "B" | "C" | "D";

export interface Option {
  id: Dimension;
  text: string;
}

export interface Question {
  id: number;
  setup: string;
  context: string;
  options: Option[];
  /** When true, this question asks the player to pick the option LEAST like them.
   * Reversal answers are excluded from dominant dimension scoring. */
  isReversal?: boolean;
}

export interface Trigger {
  stage: number;
  condition: Dimension;
  text: string;
}

export const questions: Question[] = [
  // ─── Stage I (Q1–Q3): The Unknown ────────────────────────────────────────
  // Theme: How do you react to opportunities before you have full information?
  {
    id: 1,
    setup: "Your company is starting a new project, but the goal isn't clear yet.",
    context: "Joining early gets you noticed, but you might take the blame if it fails. You usually:",
    options: [
      { id: "A", text: "Join first and figure it out later" },
      { id: "B", text: "Watch for a while before deciding" },
      { id: "C", text: "Check the risks to see if it's worth it" },
      { id: "D", text: "Wait until there's a safe backup plan" }
    ]
  },
  {
    id: 2,
    setup: "A chance to work on something big suddenly appears, but many details are missing.",
    context: "If you don't decide now, someone else will take it. But the risks are real. You usually:",
    options: [
      { id: "A", text: "Grab it first, just to secure the spot" },
      { id: "B", text: "Wait a bit longer until things are clearer" },
      { id: "C", text: "Calculate the effort and payoff first" },
      { id: "D", text: "Keep my distance to avoid being trapped" }
    ]
  },
  {
    // Reversal question: player picks the reaction most unlike them
    id: 3,
    isReversal: true,
    setup: "An opportunity appears. The details are unclear. You have to decide now.",
    context: "Which of these reactions would you almost never have?",
    options: [
      { id: "A", text: "Jump straight in before thinking it through" },
      { id: "B", text: "Hold back and wait for more information" },
      { id: "C", text: "Run the numbers before making any move" },
      { id: "D", text: "Avoid committing until a safer option appears" }
    ]
  },

  // ─── Stage II (Q4–Q6): The Aftermath ─────────────────────────────────────
  // Theme: How do you reflect on past decisions and the chances you passed on?
  {
    id: 4,
    setup: "You watch someone else succeed with a chance you decided to pass on.",
    context: "Looking back, you:",
    options: [
      { id: "A", text: "Think I should have just tried earlier" },
      { id: "B", text: "Think my choice to wait was still the smart move" },
      { id: "C", text: "Want to figure out exactly why they succeeded" },
      { id: "D", text: "Think everyone has their own pace — I wasn't wrong" }
    ]
  },
  {
    id: 5,
    setup: "You remember a path you did not take.",
    context: "Someone else took it. It worked out for them. When you replay that moment, you:",
    options: [
      { id: "A", text: "Wish I had just started without overthinking it" },
      { id: "B", text: "Think waiting was still the right call at the time" },
      { id: "C", text: "Want to understand exactly why it worked for them" },
      { id: "D", text: "Think every path has its season — that one wasn't mine" }
    ]
  },
  {
    // Reversal question: player picks the perspective they would almost never take
    id: 6,
    isReversal: true,
    setup: "Looking back at past decisions you've made,",
    context: "which of these perspectives would you almost never take?",
    options: [
      { id: "A", text: "I should have acted sooner — waiting cost me" },
      { id: "B", text: "I was right to pause — rushing would have made it worse" },
      { id: "C", text: "I needed more data before I could have known" },
      { id: "D", text: "Keeping my options open was the wisest thing I did" }
    ]
  },

  // ─── Stage III (Q7–Q10): The Mirror ──────────────────────────────────────
  // Theme: Direct confrontation with your own habitual patterns.
  {
    id: 7,
    setup: "Whether you succeed or fail,",
    context: "often doesn't depend on your initial idea. It depends on your hidden habits when things get hard. What most often stops you?",
    options: [
      { id: "A", text: "Rushing in, only to realize later I didn't think it through" },
      { id: "B", text: "Waiting to feel totally sure, causing me to start too late" },
      { id: "C", text: "Calculating the value so much that I lose my speed" },
      { id: "D", text: "Refusing to close other doors, so I never fully commit" }
    ]
  },
  {
    id: 8,
    setup: "Some habits keep repeating",
    context: "not because they are smart, but because they feel safe. If you had to be honest, what makes you feel safe?",
    options: [
      { id: "A", text: "Simply moving — doing something feels better than nothing" },
      { id: "B", text: "Waiting — at least I won't make an early mistake" },
      { id: "C", text: "Thinking — planning it out means I won't waste resources" },
      { id: "D", text: "Staying free — having room to escape feels best" }
    ]
  },
  {
    // Reversal question: player picks the hidden cost least like them
    id: 9,
    isReversal: true,
    setup: "Every habit has a hidden price.",
    context: "Which of these costs do you notice least in yourself?",
    options: [
      { id: "A", text: "Moving fast and spending energy fixing things later" },
      { id: "B", text: "Waiting too long until the best moment quietly passes" },
      { id: "C", text: "Over-planning until great ideas never get started" },
      { id: "D", text: "Keeping options open until nothing is ever truly built" }
    ]
  },
  {
    id: 10,
    setup: "Getting to where you are today,",
    context: "the biggest factor wasn't one brilliant choice. It was the quiet habit that softly pushed you closer to some things — and further from others. What question must you ask yourself right now?",
    options: [
      { id: "A", text: "Do I move too fast, leaving mistakes I have to clean up later?" },
      { id: "B", text: "Do I wait too long for proof, missing the doors I should have walked through?" },
      { id: "C", text: "Do I focus too heavily on the math, letting passion die while I plan?" },
      { id: "D", text: "Do I protect my freedom so much that I never truly commit to my life?" }
    ]
  }
];

// ─── Dynamic Reflection Triggers ─────────────────────────────────────────────
// 8 unique texts (2 stages × 4 dimensions). Each is written in second-person
// mirror style: name the pattern → describe it over time → end with a question.

export const dynamicTriggers: Record<string, Record<Dimension, string>> = {
  stage1: {
    A: "Some people naturally move rapidly down a path so they don't miss out. Over time, does this early-action habit quietly repeat in other big choices?",
    B: "Some people naturally wait for things to clear up before taking a step. Over time, does this deeply rooted hesitation softly echo in other big choices?",
    C: "Some people naturally need to map out every risk before they begin. Over time, does this need for control repeatedly surface when faced with the unknown?",
    D: "Some people naturally prefer to keep their escape doors open. Over time, does this quiet resistance to hard commitments dictate more of life than realized?"
  },
  stage2: {
    A: "Moving quickly feels like taking charge. Over time, this constant motion simply becomes what you do. Does responding fast actually serve you, or has it just become your automatic rhythm?",
    B: "Waiting for the dust to settle feels like the smart move. Over time, that pause quietly becomes your default gear. Are you holding back to see clearly, or has waiting simply become your habit?",
    C: "Running the numbers first feels like the safest route. Over time, the need to measure everything slows your pace. Are you calculating the odds to win, or just to avoid making a mistake?",
    D: "Leaving an open door feels like protecting your freedom. Over time, avoiding commitment becomes its own kind of cage. Are you keeping your options open to stay flexible, or simply to avoid being tied down?"
  }
};

// ─── Result Interpretations ───────────────────────────────────────────────────
// Each dimension maps to: primary chip, secondary chips, 5 sliders, 3 reflection lines.
// Slider value: 50 = centre (balanced). < 50 = leans LEFT label. > 50 = leans RIGHT label.

export const resultInterpretations: Record<Dimension, {
  chip: string;
  secondaryChips: string[];
  sliders: Array<{
    label1: string;
    label2: string;
    title: string;
    value: number;
  }>;
  reflectionLines: [string, string, string];
}> = {
  A: {
    chip: "Early movement",
    secondaryChips: ["Adjust as you go", "Stay in motion", "Before full clarity", "Short cycles"],
    sliders: [
      { label1: "Move first",        label2: "Think first",      title: "When a chance appears",           value: 22 },
      { label1: "Trust the feeling", label2: "Wait for proof",   title: "When information is incomplete",  value: 25 },
      { label1: "Go all in",         label2: "Keep a way out",   title: "When commitment is required",     value: 40 },
      { label1: "Act now",           label2: "Slow down",        title: "When time pressure hits",         value: 18 },
      { label1: "Keep moving",       label2: "Stop and rethink", title: "When something goes wrong",       value: 20 }
    ],
    reflectionLines: [
      "You start before everything is clear.",
      "This keeps you in motion when others are still hesitating.",
      "But over time, it becomes hard to tell the difference between moving with purpose — and simply staying busy."
    ]
  },
  B: {
    chip: "Seeking clarity",
    secondaryChips: ["Wait and see", "Gathering data", "Holds for more signal", "Steady pace"],
    sliders: [
      { label1: "Move first",        label2: "Think first",      title: "When a chance appears",           value: 80 },
      { label1: "Trust the feeling", label2: "Wait for proof",   title: "When information is incomplete",  value: 85 },
      { label1: "Go all in",         label2: "Keep a way out",   title: "When commitment is required",     value: 75 },
      { label1: "Act now",           label2: "Slow down",        title: "When time pressure hits",         value: 82 },
      { label1: "Keep moving",       label2: "Stop and rethink", title: "When something goes wrong",       value: 78 }
    ],
    reflectionLines: [
      "You prefer to wait until the picture is clearer.",
      "This protects you from early, costly mistakes.",
      "But over time, the window for some decisions quietly closes while you are still watching."
    ]
  },
  C: {
    chip: "Calculated risk",
    secondaryChips: ["Numbers first", "Maps the risk first", "Minimizing waste", "Firm logic"],
    sliders: [
      { label1: "Move first",        label2: "Think first",      title: "When a chance appears",           value: 72 },
      { label1: "Trust the feeling", label2: "Wait for proof",   title: "When information is incomplete",  value: 88 },
      { label1: "Go all in",         label2: "Keep a way out",   title: "When commitment is required",     value: 60 },
      { label1: "Act now",           label2: "Slow down",        title: "When time pressure hits",         value: 70 },
      { label1: "Keep moving",       label2: "Stop and rethink", title: "When something goes wrong",       value: 80 }
    ],
    reflectionLines: [
      "You measure before you move.",
      "This keeps you from wasting energy on things that don't add up.",
      "But over time, the habit of calculating can quietly kill things before they even have a chance to begin."
    ]
  },
  D: {
    chip: "Preserving options",
    secondaryChips: ["Flexibility", "Avoiding lock-in", "Always pivoting", "Keeping exits open"],
    sliders: [
      { label1: "Move first",        label2: "Think first",      title: "When a chance appears",           value: 45 },
      { label1: "Trust the feeling", label2: "Wait for proof",   title: "When information is incomplete",  value: 42 },
      { label1: "Go all in",         label2: "Keep a way out",   title: "When commitment is required",     value: 85 },
      { label1: "Act now",           label2: "Slow down",        title: "When time pressure hits",         value: 50 },
      { label1: "Keep moving",       label2: "Stop and rethink", title: "When something goes wrong",       value: 55 }
    ],
    reflectionLines: [
      "You protect your freedom to change direction.",
      "This keeps you from being trapped by choices that no longer fit.",
      "But over time, keeping an exit nearby can quietly prevent you from building anything that truly lasts."
    ]
  }
};
