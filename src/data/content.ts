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
}

export interface Trigger {
  stage: number;
  condition: Dimension;
  text: string;
}

export const questions: Question[] = [
  // ─── Stage I (Q1–Q5): The Unknown ────────────────────────────────────────
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
    id: 3,
    setup: "An exciting idea appears, but it feels very unproven.",
    context: "It could be huge, but maybe not. Without acting now, there won't be a second chance. You decide to:",
    options: [
      { id: "A", text: "Jump in early to get a head start" },
      { id: "B", text: "Wait and see if it turns into something real" },
      { id: "C", text: "Look at the data to make sure it's smart" },
      { id: "D", text: "Keep my options open and don't commit yet" }
    ]
  },
  {
    id: 4,
    setup: "You see a new path for growth, but you don't know what the short-term results will be.",
    context: "It takes a lot of time with no obvious reward. How do you make the call?",
    options: [
      { id: "A", text: "Just start trying and see what happens" },
      { id: "B", text: "Watch quietly to gather more facts" },
      { id: "C", text: "Study the risk and reward before moving" },
      { id: "D", text: "Stay back and wait for obvious answers" }
    ]
  },
  {
    id: 5,
    setup: "A rare opportunity demands a fast choice.",
    context: "If you hesitate, the value drops or someone else takes it. Under time pressure, you:",
    options: [
      { id: "A", text: "Act fast to make sure I don't lose it" },
      { id: "B", text: "Try to buy more time to make a safe choice" },
      { id: "C", text: "Quickly scan the numbers to make sure it's safe" },
      { id: "D", text: "Step away. I don't like being rushed" }
    ]
  },

  // ─── Stage II (Q6–Q10): The Aftermath ────────────────────────────────────
  // Theme: How do you reflect on past decisions and the chances you passed on?
  // These are deliberately retrospective — the player looks backward, not forward.
  {
    id: 6,
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
    id: 7,
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
    id: 8,
    setup: "You stayed with a decision longer than you should have.",
    context: "If you are honest about why you didn't leave sooner, it was because:",
    options: [
      { id: "A", text: "I was too committed to stop — leaving felt like wasting what I'd already done" },
      { id: "B", text: "I needed more time to be completely sure it was the wrong move" },
      { id: "C", text: "I kept recalculating whether the cost of leaving was actually worth it" },
      { id: "D", text: "I wasn't ready to close that door — it might still have had value" }
    ]
  },
  {
    id: 9,
    setup: "A major choice you made did not go the way you expected.",
    context: "Looking back at it now, your most honest thought is:",
    options: [
      { id: "A", text: "I moved too fast and missed things I should have caught first" },
      { id: "B", text: "I waited too long for certainty that was never coming" },
      { id: "C", text: "I spent so long assessing that I ran out of time to act" },
      { id: "D", text: "I kept too many exits open and never fully trusted the direction" }
    ]
  },
  {
    id: 10,
    setup: "When you look back at chances you didn't take,",
    context: "the most honest reason you passed on them was usually:",
    options: [
      { id: "A", text: "I assumed another chance would come — and moved on too quickly" },
      { id: "B", text: "I wasn't certain enough yet. The window closed while I was waiting." },
      { id: "C", text: "I was still weighing the risk and reward when the moment passed" },
      { id: "D", text: "Some part of me didn't want to fully commit, even when the chance was real" }
    ]
  },

  // ─── Stage III (Q11–Q15): The Mirror ─────────────────────────────────────
  // Theme: Direct confrontation with your own habitual patterns.
  // These questions don't ask what you would do — they ask what you already know.
  {
    id: 11,
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
    id: 12,
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
    id: 13,
    setup: "The problem is,",
    context: "a comfortable habit often carries an invisible price. Looking deeply at your past, what price do you usually pay?",
    options: [
      { id: "A", text: "I start fast, but spend massive energy fixing things later" },
      { id: "B", text: "I can do the work, but my 'wait a bit longer' misses the perfect window" },
      { id: "C", text: "Great ideas die at the starting line because I spent too much time assessing them" },
      { id: "D", text: "I hold onto many options, but struggle to build anything truly deep" }
    ]
  },
  {
    id: 14,
    setup: "When you use the same habit for years,",
    context: "others move far ahead while you stay locked in your familiar rhythm. What do you most need to remind yourself of today?",
    options: [
      { id: "A", text: "Don't always rush in, so you can stop patching holes later" },
      { id: "B", text: "Don't always wait, because great chances shrink while you sit still" },
      { id: "C", text: "Don't always calculate, because you kill things before they even start" },
      { id: "D", text: "Don't always leave an exit, because you never fully trust the path you are on" }
    ]
  },
  {
    id: 15,
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
// 12 unique texts (3 stages × 4 dimensions). Each is written in second-person
// mirror style: name the pattern → describe it over time → end with a question.

export const dynamicTriggers: Record<string, Record<Dimension, string>> = {
  stage1: {
    A: "Some people naturally move rapidly down a path so they don't miss out. Over time, does this early-action habit quietly repeat in other big choices?",
    B: "Some people naturally wait for things to clear up before taking a step. Over time, does this deeply rooted hesitation softly echo in other big choices?",
    C: "Some people naturally need to map out every risk before they begin. Over time, does this need for control repeatedly surface when faced with the unknown?",
    D: "Some people naturally prefer to keep their escape doors open. Over time, does this quiet resistance to hard commitments dictate more of life than realized?"
  },
  stage2: {
    A: "Many realize later that their familiar way of deciding — like leaping before looking — wasn't just a style. It was a hidden habit.",
    B: "Many realize later that their familiar way of deciding — like constantly waiting for a better view — wasn't just cautious. It was a hidden habit.",
    C: "Many realize later that their familiar way of deciding — like endlessly trusting the math — wasn't just rational. It was a hidden habit.",
    D: "Many realize later that their familiar way of deciding — like keeping an exit nearby at all times — wasn't just flexible. It was a hidden habit."
  },
  stage3: {
    A: "A pattern has quietly been drawing your map. Your speed has given you movement, but what has it kept you from building solidly?",
    B: "A pattern has quietly been drawing your map. Your patience has kept you safe, but what great beginnings has it delayed?",
    C: "A pattern has quietly been drawing your map. Your sharp thinking manages risk, but what beautiful things has it shut down fast?",
    D: "A pattern has quietly been drawing your map. Your freedom keeps you safe from being trapped, but what profound depth has it kept away?"
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
    secondaryChips: ["Wait and see", "Gathering data", "Risk averse", "Steady pace"],
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
    secondaryChips: ["Numbers first", "Analytical", "Minimizing waste", "Firm logic"],
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
