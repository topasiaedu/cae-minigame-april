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
  /**
   * Short pattern label. Used in the distribution bar (Phase 3) and the
   * "YOUR PATTERN" pill in Phase 1.
   */
  chip: string;

  /**
   * Two recognition/strength lines.
   * [0] = recognition sentence shown in Phase 1
   * [1] = strength sentence shown in Phase 2 (paragraph 1)
   *
   * The third shadow line that previously existed here has been moved into
   * pathWalked[2] where it is expanded into a full paragraph.
   */
  reflectionLines: [string, string];

  /**
   * Personalised callback question shown in Phase 2, tied to the player's
   * Q1 answer (their first three months decision context).
   */
  q1CostLine: string;

  /**
   * Three paragraphs for Section 1 "The Path You Walked" in Phase 3.
   * Uses {Q1}, {Q8}, {COST}, {COUNT} as interpolation tokens:
   *   {Q1}    = player's Q1 answer text
   *   {Q8}    = player's Q8 answer text
   *   {COST}  = player's Q5 answer text (what the pattern cost them)
   *   {COUNT} = number of scored questions where they chose this dimension
   */
  pathWalked: [string, string, string];

  /**
   * Three paragraphs for Section 2 "The Pattern You Rarely Used" in Phase 3.
   * Shown when THIS dimension is the player's weakest (lowest answerCount).
   * Uses {Q9}, {COUNT} as interpolation tokens:
   *   {Q9}    = player's Q9 answer text (cost they notice least)
   *   {COUNT} = number of times they chose this dimension (may be 0)
   */
  weaknessNarrative: [string, string, string];
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
    reflectionLines: [
      "You start before everything is clear.",
      "This keeps you in motion when others are still hesitating."
    ],
    q1CostLine: "In the first three months — was some of that motion actually just noise?",
    pathWalked: [
      "Not because the picture was clear. Because waiting felt like falling behind.",
      "{COUNT} out of 7 choices went the same way — moving before the fog lifted. You are the person who builds while others are still in the meeting.",
      "But the pattern carries a quiet cost. Work-life balance does not collapse — it slips. A dinner half-attended. A conversation you were too far ahead to be present for. The drive that builds things is the same drive that makes the present invisible."
    ],
    weaknessNarrative: [
      "Early Movement showed up just {COUNT} out of 7 times. The impulse to move before everything was clear was the one you resisted most.",
      "That resistance has protected you. But the cost of not starting is invisible — no trace, no record. Just a slightly smaller version of what could have existed.",
      "Is there something you have been waiting to start that is already overdue?"
    ]
  },
  B: {
    chip: "Seeking Clarity",
    reflectionLines: [
      "You prefer to wait until the picture is clearer.",
      "This protects you from early, costly mistakes."
    ],
    q1CostLine: "In the first three months — did some of that caution actually cost you a window?",
    pathWalked: [
      "You needed the picture clearer before you moved. That is not hesitation — that is your standard.",
      "{COUNT} out of 7 choices went the same way — holding back, waiting, protecting your position. You are the person who asks the question everyone else skipped.",
      "But the goal has always been clear to you. The gap is the starting. Some windows close while you are still gathering certainty — and you know, if you are honest, which ones those were."
    ],
    weaknessNarrative: [
      "Seeking Clarity showed up just {COUNT} out of 7 times. You rarely paused to gather more before acting.",
      "Speed builds things. But it also creates cleanup. Some decisions made quickly may still be showing up in the results.",
      "Is there a pattern from the first three months where going fast cost you something that only became visible later?"
    ]
  },
  C: {
    chip: "Calculated Risk",
    reflectionLines: [
      "You measure before you move.",
      "This keeps you from wasting energy on things that do not add up."
    ],
    q1CostLine: "In the first three months — did some of that planning actually stop something from starting?",
    pathWalked: [
      "Precision before movement. Logic before commitment. That was your first answer, and it echoed.",
      "{COUNT} out of 7 choices went the same way — mapping the risk first, protecting the downside. You do not waste resources on things that do not add up.",
      "But the pattern has a blind spot that always looks like thoroughness. Opportunities were not lost to bad luck — they were reviewed to death. Perfectionism does not feel like fear. It feels like standards."
    ],
    weaknessNarrative: [
      "Calculated Risk showed up just {COUNT} out of 7 times. The analytical, detail-first mode was the one you used least.",
      "You tend to trust feel over formula. In the right moments, that is an asset. But some decisions may have been made without a full accounting of what they would actually cost.",
      "What is one decision from the first three months where the numbers mattered more than you gave them credit for?"
    ]
  },
  D: {
    chip: "Preserving Options",
    reflectionLines: [
      "You protect your freedom to change direction.",
      "This keeps you from being trapped by choices that no longer fit."
    ],
    q1CostLine: "In the first three months — did some of that flexibility actually prevent you from building?",
    pathWalked: [
      "Keep the exits open. Stay in the room without fully belonging to it. That was your first instinct, and it stayed.",
      "{COUNT} out of 7 choices went the same way — staying flexible, keeping room to shift. You read the room faster than most.",
      "But the pattern is easily pulled. The next opportunity catches your eye before the current one is finished. Nothing gets fully built when everything stays tentative. The freedom you protect may already be costing you the depth you want."
    ],
    weaknessNarrative: [
      "Preserving Options showed up just {COUNT} out of 7 times. Flexibility — keeping exits open, avoiding lock-in — was the pattern you used least.",
      "You tend to commit fully. That builds depth. But full commitment also means carrying things longer than you should — out of identity rather than wisdom.",
      "Is there something you are still holding that you should have put down by now?"
    ]
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
