export type Dimension = "A" | "B" | "C" | "D";

export interface BranchingSetup {
  /** 0-based index of the question whose answer determines which variant to show */
  branchesOn: number;
  /** One setup string per dimension — keyed by the previous answer's dimension */
  variants: Record<Dimension, string>;
}

export interface Option {
  id: Dimension;
  text: string;
}

export interface Question {
  id: number;
  setup: string | BranchingSetup;
  context: string;
  options: Option[];
  isReversal?: boolean;
  isCostQuestion?: boolean;
}

export interface ResultInterpretation {
  chip: string;
  secondaryChips: string[];
  sliders: Array<{
    label1: string;
    label2: string;
    title: string;
    value: number;
  }>;
  reflectionLines: [string, string, string];
  q1CostLine: string;
}

export const questions: Question[] = [
  {
    id: 1,
    setup: "A new direction opens in your market. The information is incomplete. Others are watching the same space.",
    context: "What do you do?",
    options: [
      { id: "A", text: "Move in now and adjust as I learn" },
      { id: "B", text: "Hold back until the picture is clearer" },
      { id: "C", text: "Run the numbers before I decide" },
      { id: "D", text: "Position myself without fully committing" }
    ]
  },
  {
    id: 2,
    setup: {
      branchesOn: 0,
      variants: {
        A: "You moved first. Things are in motion — but a key detail surfaces that changes the picture. Something you would have caught with more time.",
        B: "You held back. The space is clearer now, but two others have moved in. Your team is asking why you are still watching.",
        C: "You ran the numbers. The data looks promising but not conclusive. A faster competitor has already launched while you were analysing.",
        D: "You positioned yourself without committing. Both paths are still open, but your team is not sure which way you are heading."
      }
    },
    context: "What do you do now?",
    options: [
      { id: "A", text: "Push forward — we will fix it as we go" },
      { id: "B", text: "Pause and get clarity before the next move" },
      { id: "C", text: "Map out exactly what changed before deciding" },
      { id: "D", text: "Keep room to adjust — do not lock in yet" }
    ]
  },
  {
    id: 3,
    setup: {
      branchesOn: 1,
      variants: {
        A: "You pushed through again. A partner now needs your answer by end of day. You have about 70% of the information. This is your third fast call.",
        B: "You paused. The picture is sharper, but the deadline did not pause with you. A partner needs your answer by end of day. You have about 70%.",
        C: "You mapped it out. The analysis helped, but took time. A partner needs your answer by end of day. You have about 70%.",
        D: "You kept room to adjust. Flexible — but a partner now needs a firm answer by end of day. You have about 70%."
      }
    },
    context: "What do you do?",
    options: [
      { id: "A", text: "Decide now — 70% is enough" },
      { id: "B", text: "Push the deadline — a wrong call is worse than a late one" },
      { id: "C", text: "Use what I have to work out the outcomes first" },
      { id: "D", text: "Give a soft answer I can adjust later" }
    ]
  },
  {
    id: 4,
    setup: "Think of a real decision from the first three months of this year. Someone you know took the path you passed on — and it worked for them.",
    context: "Looking back, you:",
    options: [
      { id: "A", text: "Think I should have moved sooner" },
      { id: "B", text: "Still believe holding back was right at the time" },
      { id: "C", text: "Want to understand exactly why it worked for them" },
      { id: "D", text: "Think every business has its own timing" }
    ]
  },
  {
    id: 5,
    setup: {
      branchesOn: 3,
      variants: {
        A: "You wish you had moved sooner. Speed matters to you, even in hindsight. But every default has a price.",
        B: "You stand by the wait. Patience matters to you. But every default has a price.",
        C: "You want to understand the logic. Clarity matters more to you than speed. But every default has a price.",
        D: "You see your own timing as valid. Flexibility matters to you. But every default has a price."
      }
    },
    context: "In the first three months — what did your pattern cost you most?",
    isCostQuestion: true,
    options: [
      { id: "A", text: "Relationships — people around me struggle to keep up or stay aligned" },
      { id: "B", text: "Missed windows — some chances closed while I was still deciding" },
      { id: "C", text: "Direction — I stay busy but not always heading the right way" },
      { id: "D", text: "Energy — I keep running and it is starting to show" }
    ]
  },
  {
    id: 6,
    isReversal: true,
    setup: {
      branchesOn: 4,
      variants: {
        A: "You said your pattern costs you relationships. A trusted advisor is describing how you make decisions.",
        B: "You said your pattern costs you timing. A trusted advisor is describing how you make decisions.",
        C: "You said your pattern costs you direction. A trusted advisor is describing how you make decisions.",
        D: "You said your pattern costs you energy. A trusted advisor is describing how you make decisions."
      }
    },
    context: "Which would they least say about you?",
    options: [
      { id: "A", text: "You move fast and fix later" },
      { id: "B", text: "You wait until you are sure" },
      { id: "C", text: "You need the data before you act" },
      { id: "D", text: "You keep options open as long as possible" }
    ]
  },
  {
    id: 7,
    setup: "When a strategy is not working, your automatic response is usually to:",
    context: "",
    options: [
      { id: "A", text: "Try something different immediately" },
      { id: "B", text: "Step back and watch longer" },
      { id: "C", text: "Analyse what went wrong before changing anything" },
      { id: "D", text: "Pull back — keep room to shift" }
    ]
  },
  {
    id: 8,
    setup: {
      branchesOn: 6,
      variants: {
        A: "You default to action. Be honest about the first three months of this year.",
        B: "You default to watching. Be honest about the first three months of this year.",
        C: "You default to analysis. Be honest about the first three months of this year.",
        D: "You default to flexibility. Be honest about the first three months of this year."
      }
    },
    context: "The decisions that mattered most were probably made:",
    options: [
      { id: "A", text: "Quickly — trusting instinct over data" },
      { id: "B", text: "Slowly — waiting longer than I probably needed to" },
      { id: "C", text: "Carefully — running the analysis until it felt safe enough" },
      { id: "D", text: "Tentatively — committing just enough to stay flexible" }
    ]
  },
  {
    id: 9,
    isReversal: true,
    setup: {
      branchesOn: 7,
      variants: {
        A: "You move fast and trust instinct. Every decision habit has a cost.",
        B: "You move slowly and wait for signals. Every decision habit has a cost.",
        C: "You move carefully and trust analysis. Every decision habit has a cost.",
        D: "You move tentatively and stay flexible. Every decision habit has a cost."
      }
    },
    context: "Which cost do you notice least in yourself?",
    options: [
      { id: "A", text: "Moving fast, then fixing avoidable mistakes" },
      { id: "B", text: "Waiting until the best window quietly closes" },
      { id: "C", text: "Over-planning until good ideas never start" },
      { id: "D", text: "Keeping options open until nothing gets fully built" }
    ]
  },
  {
    id: 10,
    setup: {
      branchesOn: 8,
      variants: {
        A: "The cost you notice least — wasted motion — might be running right now.",
        B: "The cost you notice least — closed windows — might already be happening.",
        C: "The cost you notice least — unlaunched ideas — might be piling up.",
        D: "The cost you notice least — nothing fully built — might be the story of this year."
      }
    },
    context: "The months ahead will amplify your pattern. If one thing needs to change, what is it?",
    options: [
      { id: "A", text: "Am I moving fast because it is right — or because standing still feels uncomfortable?" },
      { id: "B", text: "Am I waiting for certainty — or just avoiding the risk of being wrong?" },
      { id: "C", text: "Am I planning carefully — or hiding behind the analysis?" },
      { id: "D", text: "Am I staying flexible — or afraid to fully commit?" }
    ]
  }
];

export const reflectionObservations = {
  stage1: {
    A: "Three decisions in one story. Each time — you moved first.",
    B: "Three decisions in one story. Each time — you held back.",
    C: "Three decisions in one story. Each time — you ran the numbers.",
    D: "Three decisions in one story. Each time — you kept a way out."
  },
  stage2: {
    A: "Even in hindsight — you would still move first.",
    B: "Even in hindsight — you would still wait.",
    C: "Even in hindsight — you would still want the numbers.",
    D: "Even in hindsight — you would still keep an exit open."
  }
} as const;

export const reflectionBalancedLines = {
  stage1: "Three situations. Three different responses.",
  stage1Moderate: "Two out of three — the same instinct.",
  stage2: "Looking back — no single pattern. But something drove each choice.",
  stage2Moderate: "Even looking back — the same instinct shows up."
} as const;

export const reflectionFriction = {
  stage1Clear: "How many times did this happen in the first three months?",
  stage1Balanced: "In the first three months — was it this mixed, or did one instinct take over?",
  stage2Clear: "Is this the price you want to keep paying?",
  stage2Balanced: "Even without a clear pattern — is the cost adding up?"
} as const;

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

export const resultInterpretations: Record<Dimension, ResultInterpretation> = {
  A: {
    chip: "Early Movement",
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
    ],
    q1CostLine: "In the first three months — was some of that motion actually just noise?"
  },
  B: {
    chip: "Seeking Clarity",
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
    ],
    q1CostLine: "In the first three months — did some of that caution actually cost you a window?"
  },
  C: {
    chip: "Calculated Risk",
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
    ],
    q1CostLine: "In the first three months — did some of that planning actually stop something from starting?"
  },
  D: {
    chip: "Preserving Options",
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
    ],
    q1CostLine: "In the first three months — did some of that flexibility actually prevent you from building?"
  }
};

/**
 * Resolves the setup text for a question. If the setup is a plain string, returns it directly.
 * If it is a BranchingSetup, looks up the previous answer and returns the matching variant.
 */
export function resolveSetup(question: Question, answers: Dimension[]): string {
  if (typeof question.setup === "string") {
    return question.setup;
  }
  const previousAnswer = answers[question.setup.branchesOn];
  if (previousAnswer === undefined) {
    return question.setup.variants.A;
  }
  return question.setup.variants[previousAnswer];
}
