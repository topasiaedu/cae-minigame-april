export type Dimension = "A" | "B" | "C" | "D";

export interface BranchingSetup {
  /** 0-based index of the question whose answer determines which variant to show */
  branchesOn: number;
  /** One setup string per dimension, keyed by the previous answer's dimension */
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
   */
  reflectionLines: [string, string];

  /**
   * Personalised callback question shown in Phase 2, tied to the player's
   * Q1 answer (their first three months decision context).
   */
  q1CostLine: string;

  /** Full decision profile shown in Phase 3 after distribution bars. */
  decisionProfile: {
    pathYouChose: {
      quote: string;
      body: string;
    };
    whatYouActuallyMissed: {
      quote: string;
      paragraphs: string[];
    };
    finalThoughts: string;
  };
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
        A: "You moved first. Things are in motion, but a key detail surfaces that changes the picture. Something you would have caught with more time.",
        B: "You held back. The space is clearer now, but two others have moved in. Your team is asking why you are still watching.",
        C: "You ran the numbers. The data looks promising but not conclusive. A faster competitor has already launched while you were analysing.",
        D: "You positioned yourself without committing. Both paths are still open, but your team is not sure which way you are heading."
      }
    },
    context: "What do you do now?",
    options: [
      { id: "A", text: "Push forward. We will fix it as we go" },
      { id: "B", text: "Pause and get clarity before the next move" },
      { id: "C", text: "Map out exactly what changed before deciding" },
      { id: "D", text: "Keep room to adjust. Do not lock in yet" }
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
        D: "You kept room to adjust. Flexible, but a partner now needs a firm answer by end of day. You have about 70%."
      }
    },
    context: "What do you do?",
    options: [
      { id: "A", text: "Decide now. 70% is enough" },
      { id: "B", text: "Push the deadline. A wrong call is worse than a late one" },
      { id: "C", text: "Use what I have to work out the outcomes first" },
      { id: "D", text: "Give a soft answer I can adjust later" }
    ]
  },
  {
    id: 4,
    setup: "Think of a real decision from the first three months of this year. Someone you know took the path you passed on, and it worked for them.",
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
    context: "In the first three months, what did your pattern cost you most?",
    isCostQuestion: true,
    options: [
      { id: "A", text: "Relationships. People around me struggle to keep up or stay aligned" },
      { id: "B", text: "Missed windows. Some chances closed while I was still deciding" },
      { id: "C", text: "Direction. I stay busy but not always heading the right way" },
      { id: "D", text: "Energy. I keep running and it is starting to show" }
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
      { id: "D", text: "Pull back and keep room to shift" }
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
      { id: "A", text: "Quickly, trusting instinct over data" },
      { id: "B", text: "Slowly, waiting longer than I probably needed to" },
      { id: "C", text: "Carefully, running the analysis until it felt safe enough" },
      { id: "D", text: "Tentatively, committing just enough to stay flexible" }
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
        A: "The cost you notice least, wasted motion, might be running right now.",
        B: "The cost you notice least, closed windows, might already be happening.",
        C: "The cost you notice least, unlaunched ideas, might be piling up.",
        D: "The cost you notice least, nothing fully built, might be the story of this year."
      }
    },
    context: "The months ahead will amplify your pattern. If one thing needs to change, what is it?",
    options: [
      { id: "A", text: "Am I moving fast because it is right, or because standing still feels uncomfortable?" },
      { id: "B", text: "Am I waiting for certainty, or just avoiding the risk of being wrong?" },
      { id: "C", text: "Am I planning carefully, or hiding behind the analysis?" },
      { id: "D", text: "Am I staying flexible, or afraid to fully commit?" }
    ]
  }
];

export const reflectionObservations = {
  stage1: {
    A: "Three decisions in one story. Each time, you moved first.",
    B: "Three decisions in one story. Each time, you held back.",
    C: "Three decisions in one story. Each time, you ran the numbers.",
    D: "Three decisions in one story. Each time, you kept a way out."
  },
  stage2: {
    A: "Even in hindsight, you would still move first.",
    B: "Even in hindsight, you would still wait.",
    C: "Even in hindsight, you would still want the numbers.",
    D: "Even in hindsight, you would still keep an exit open."
  }
} as const;

export const reflectionBalancedLines = {
  stage1: "Three situations. Three different responses.",
  stage1Moderate: "Two out of three, the same instinct.",
  stage2: "Looking back, no single pattern. But something drove each choice.",
  stage2Moderate: "Even looking back, the same instinct shows up."
} as const;

export const reflectionFriction = {
  stage1Clear: "How many times did this happen in the first three months?",
  stage1Balanced: "In the first three months, was it this mixed, or did one instinct take over?",
  stage2Clear: "Is this the price you want to keep paying?",
  stage2Balanced: "Even without a clear pattern, is the cost adding up?"
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
    q1CostLine: "In the first three months, was some of that motion actually just noise?",
    decisionProfile: {
      pathYouChose: {
        quote: "Act quickly or risk falling behind.",
        body: "You dive into projects without waiting. While your eagerness to act seems like a strength, it can lead to rushed decisions and missed opportunities."
      },
      whatYouActuallyMissed: {
        quote: "You're always moving forward, but what about today?",
        paragraphs: [
          "You feel the pressure of FOMO (Fear of Missing Out) and constantly chase the next big thing. Think about the times you've jumped into a new project without a clear plan, only to realize later that you were too busy to notice your relationships fading. You might have missed out on family gatherings because you were glued to your work, believing that your hard work would pay off.",
          "You push yourself to achieve more but end up feeling exhausted and alone. Your drive can lead to burnout, where you wake up one day realizing that you've sacrificed precious time with loved ones and important moments in life. Imagine the regret of looking back and realizing you missed unforgettable experiences because you were always focused on the next task."
        ]
      },
      finalThoughts: "Imagine having insights from your Zi Wei chart to identify your risky zones. Understanding where to focus your energy in 2026 can help you hustle smartly, avoiding costly mistakes while allowing you to build a fulfilling life. With the Design Your Destiny Program, you'll learn to recognize the right moments to act, ensuring you achieve your goals without sacrificing your relationships or well-being."
    }
  },
  B: {
    chip: "Seeking Clarity",
    reflectionLines: [
      "You prefer to wait until the picture is clearer.",
      "This protects you from early, costly mistakes."
    ],
    q1CostLine: "In the first three months, did some of that caution actually cost you a window?",
    decisionProfile: {
      pathYouChose: {
        quote: "Wait until the picture is clearer.",
        body: "You want to gather all the information before making a move. While this seems smart, it often leads to missed chances."
      },
      whatYouActuallyMissed: {
        quote: "You're careful, but you're also stuck.",
        paragraphs: [
          "You might ask a dozen friends for advice on a decision you already know you need to make, but you keep waiting for the perfect moment. You've probably read countless self-help books or attended workshops but still find yourself procrastinating.",
          "You might have watched others take risks and succeed while you stayed on the sidelines, wondering why you're not living your best life. That feeling of being left behind can sting, and you may find yourself questioning why others seem to have it all figured out while you feel stuck.",
          "Imagine the opportunities you could have seized if you had acted sooner. Reflect on how much further along you could be if you hadn't waited for clarity that never came."
        ]
      },
      finalThoughts: "What if you had the tools to make decisions without second-guessing yourself? With insights from your Zi Wei chart, you can lock down the most efficient path forward, eliminating the need for endless research and validation. The Design Your Destiny Program will give you the clarity to act decisively, turning your goals into reality and helping you live the life you've always wanted."
    }
  },
  C: {
    chip: "Calculated Risk",
    reflectionLines: [
      "You measure before you move.",
      "This keeps you from wasting energy on things that do not add up."
    ],
    q1CostLine: "In the first three months, did some of that planning actually stop something from starting?",
    decisionProfile: {
      pathYouChose: {
        quote: "Map every risk before committing.",
        body: "You like to think things through and analyze every detail before taking action. While this is a good habit, it can often lead to missed opportunities."
      },
      whatYouActuallyMissed: {
        quote: "You're careful, but you're also missing out.",
        paragraphs: [
          "Your habit of overthinking can keep you from making decisions. You might spend hours calculating the risks and rewards of every opportunity, debating with yourself until the chance passes. For example, you may have hesitated to invest in a promising project because you wanted to make sure everything was perfect, only to see someone else succeed with that very idea.",
          "Think about how many partnerships you've let slip away because you were too busy analyzing every detail instead of taking action. You might find yourself stuck in a cycle of what ifs, wondering how your life could look different if you had just taken that leap.",
          "Every decade brings new opportunities, and while you're busy weighing the pros and cons, others are moving ahead. Imagine the regret of looking back and realizing you could have been part of something amazing if you had just acted."
        ]
      },
      finalThoughts: "What if you had a clear playbook for 2026? By understanding your wealth path, career trajectory, and relationship dynamics through your Zi Wei chart, you can make informed decisions more effectively. The Design Your Destiny Program equips you with the knowledge to take bold steps forward, turning potential regrets into successful outcomes."
    }
  },
  D: {
    chip: "Preserving Options",
    reflectionLines: [
      "You protect your freedom to change direction.",
      "This keeps you from being trapped by choices that no longer fit."
    ],
    q1CostLine: "In the first three months, did some of that flexibility actually prevent you from building?",
    decisionProfile: {
      pathYouChose: {
        quote: "Keep my options open as long as possible.",
        body: "You like to stay flexible and avoid making decisions. This might feel safe, but it often keeps you from moving forward."
      },
      whatYouActuallyMissed: {
        quote: "You're adaptable, but you're also missing out.",
        paragraphs: [
          "While you think keeping your options open is smart, it often leads to unfinished projects and lost opportunities. You might recall times when you hesitated to commit to a job, thinking something better would come along, only to watch someone else take that role and thrive.",
          "Maybe you started several hobbies but never stuck with any, leaving you feeling scattered and unfulfilled. When friends share their successes, you might feel a pang of jealousy, realizing you're still waiting for the right time to start something meaningful. The fear of making the wrong choice can hold you back, leaving you feeling frustrated and stuck in a cycle of indecision."
        ]
      },
      finalThoughts: "What if you could pinpoint the sectors of your life that are primed for growth right now? By tapping into your Zi Wei chart, you can discover your main reward areas and act on them quickly. The Design Your Destiny Program will empower you to make confident decisions, helping you capitalize on opportunities and break free from indecision, allowing you to create the life you truly desire."
    }
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
