import { useState, useMemo } from "react";
import { Dimension, questions } from "../data/content";

/** Indices of reversal questions excluded from dominant-dimension scoring.
 * These prompts ask "least like you", so treating selections as positive
 * matches would invert the signal. */
const REVERSAL_INDICES: ReadonlySet<number> = new Set([2, 5, 8]);

/**
 * The complete set of navigable screens in the app.
 * - login:       Entry screen (name + optional email)
 * - question:    The 10 behavioural questions
 * - reflection:  Interstitial pause screen after Q3 and Q6
 * - stageIntro:  Brief "entering Stage III" screen shown once, before Q7
 * - surprise:    Psychological mirror moment between Reflection 2 and Stage III Intro
 * - result:      Personalised result page
 */
export type GameStage = "login" | "question" | "reflection" | "surprise" | "breathe" | "stageIntro" | "result";

export interface UserState {
  name: string;
  email: string;
}

export function useGameState() {
  const [stage, setStage]                 = useState<GameStage>("login");
  const [user, setUser]                   = useState<UserState>({ name: "", email: "" });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers]             = useState<Dimension[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Which of the two reflection blocks is currently active (0 = none)
  const currentTriggerBlock = useMemo<0 | 1 | 2>(() => {
    if (questionIndex === 3)  return 1;
    if (questionIndex === 6)  return 2;
    return 0;
  }, [questionIndex]);

  /**
   * Compute the dominant behavioural dimension across a slice of answers.
   *
   * Tie-breaking strategy: if two or more dimensions share the highest count,
   * the most-recent answers within the slice are used as a tiebreaker via
   * longest trailing streak and recency. This gives Stage III answers more
   * weight than Stage I, which is intentional — the later mirror questions
   * are more self-aware and should carry more signal.
   * If still tied after that secondary pass, the first tied dimension wins.
   */
  const computeDominantDimension = (startIndex: number, endIndex: number): Dimension => {
    const subset = answers.slice(startIndex, endIndex);
    const counts: Record<Dimension, number> = { A: 0, B: 0, C: 0, D: 0 };
    subset.forEach((ans, localIdx) => {
      const globalIdx = startIndex + localIdx;
      if (!REVERSAL_INDICES.has(globalIdx)) {
        counts[ans]++;
      }
    });

    const max = Math.max(counts.A, counts.B, counts.C, counts.D);
    const tied = (Object.keys(counts) as Dimension[]).filter(k => counts[k] === max);

    // No tie — return the clear winner
    if (tied.length === 1) return tied[0];

    // Tiebreaker: longest consecutive streak at the end of the subset
    let bestTiedDim: Dimension = tied[0];
    let longestStreak = -1;
    let mostRecentAppearance = -1;

    tied.forEach(dim => {
      const lastIndex = subset.lastIndexOf(dim);
      let streak = 0;

      if (lastIndex !== -1) {
        streak = 1;
        for (let i = lastIndex - 1; i >= 0; i--) {
          if (subset[i] === dim) streak++;
          else break;
        }
      }

      if (streak > longestStreak) {
        longestStreak = streak;
        mostRecentAppearance = lastIndex;
        bestTiedDim = dim;
      } else if (streak === longestStreak) {
        if (lastIndex > mostRecentAppearance) {
          mostRecentAppearance = lastIndex;
          bestTiedDim = dim;
        }
      }
    });

    return bestTiedDim;
  };

  // Final dominant dimension across all 10 answers (shown on result page)
  const { finalDominantDimension, finalDominantCount, finalResultIsTied } = useMemo(() => {
    if (answers.length < 10) {
      return { finalDominantDimension: "A" as Dimension, finalDominantCount: 0, finalResultIsTied: false };
    }
    const counts: Record<Dimension, number> = { A: 0, B: 0, C: 0, D: 0 };
    answers.forEach((ans, idx) => {
      if (!REVERSAL_INDICES.has(idx)) {
        counts[ans]++;
      }
    });
    const max = Math.max(counts.A, counts.B, counts.C, counts.D);
    const tied = (Object.keys(counts) as Dimension[]).filter(k => counts[k] === max);

    return {
      finalDominantDimension: computeDominantDimension(0, 10),
      finalDominantCount: max,
      finalResultIsTied: tied.length > 1
    };
  }, [answers]);

  /**
   * The verbatim text of the player's Q10 answer option, used for the
   * quote-back on the result screen. Empty string if Q10 was not answered.
   */
  const q10AnswerText = useMemo((): string => {
    if (answers[9] === undefined) return "";
    const q10Option = questions[9].options.find(opt => opt.id === answers[9]);
    return q10Option ? q10Option.text : "";
  }, [answers]);

  /**
   * The verbatim text of the player's Q1 answer option, shown on the result
   * page as the "At the start, you said:" comparison anchor.
   * Empty string if Q1 was not answered.
   */
  const q1AnswerText = useMemo((): string => {
    if (answers[0] === undefined) return "";
    const q1Option = questions[0].options.find(opt => opt.id === answers[0]);
    return q1Option ? q1Option.text : "";
  }, [answers]);

  /**
   * The verbatim text of the player's Q7 answer option (first Stage III question),
   * shown on the result page as the "Just now, you said:" comparison mirror.
   * Empty string if Q7 was not answered.
   */
  const q7AnswerText = useMemo((): string => {
    if (answers[6] === undefined) return "";
    const q7Option = questions[6].options.find(opt => opt.id === answers[6]);
    return q7Option ? q7Option.text : "";
  }, [answers]);

  // Progress 0–100 for the thin gold bar on QuestionScreen
  const progressPercent = useMemo((): number => {
    return Math.min(100, Math.round((questionIndex / questions.length) * 100));
  }, [questionIndex]);

  // ─── Core Transition Helper ───────────────────────────────────────────────
  // Fires a 600ms fade-out, then swaps stage + questionIndex, then fade-in.
  const handleTransition = (newStage?: GameStage, newIndex?: number): void => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (newStage !== undefined)  setStage(newStage);
      if (newIndex  !== undefined) setQuestionIndex(newIndex);
      setIsTransitioning(false);
    }, 600);
  };

  // ─── Actions ─────────────────────────────────────────────────────────────

  const handleLogin = (name: string, email: string): void => {
    setUser({ name, email });
    handleTransition("question", 0);
  };

  const answerQuestion = (dimension: Dimension): void => {
    setAnswers(prev => [...prev, dimension]);
    const nextIndex = questionIndex + 1;

    if (nextIndex === 3 || nextIndex === 6) {
      handleTransition("reflection", nextIndex);
    } else if (nextIndex === 10) {
      handleTransition("result", nextIndex);
    } else {
      handleTransition("question", nextIndex);
    }
  };

  /**
   * Proceed from a Reflection screen.
   * - After Q6 (Reflection 2, questionIndex 6) → go to Surprise Screen
   * - After Q3 (Reflection 1, questionIndex 3) → go to Q4 (question at index 3)
   */
  const proceedFromReflection = (): void => {
    if (questionIndex === 6) {
      handleTransition("surprise", 6);
    } else {
      // questionIndex === 3 → go to Q4 (index 3)
      handleTransition("question", questionIndex);
    }
  };

  /** Proceed from the Surprise screen → show Stage III intro */
  const proceedFromSurprise = (): void => {
    handleTransition("breathe");
  };

  /** Proceed from the Breathe screen → show Stage III intro */
  const proceedFromBreathe = (): void => {
    handleTransition("stageIntro");
  };

  /** Proceed from the Stage III intro screen → show Q7 (index 6) */
  const proceedFromStageIntro = (): void => {
    handleTransition("question", questionIndex);
  };

  /**
   * Back navigation — complete map:
   *
   * result       → question[9] + pop answer (no Reflection 3 exists)
   * stageIntro   → surprise
   * surprise     → reflection (triggerBlock 2)
   * question[0]  → login
   * question[3]  → reflection (came from Reflection 1)
   * question[6]  → stageIntro (came from Stage III intro)
   * question[n]  → question[n-1] + pop answer
   * reflection   → question[n-1] + pop answer
   */
  const goBack = (): void => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      if (stage === "question") {
        if (questionIndex === 0) {
          setStage("login");
        } else if (questionIndex === 3) {
          // Back from Q4 → Reflection 1
          setStage("reflection");
        } else if (questionIndex === 6) {
          // Back from Q7 → Stage Intro (not reflection directly)
          setStage("stageIntro");
        } else {
          setAnswers(prev => prev.slice(0, -1));
          setQuestionIndex(questionIndex - 1);
        }
      } else if (stage === "reflection") {
        // Undo the last answered question that triggered this reflection
        setAnswers(prev => prev.slice(0, -1));
        setQuestionIndex(questionIndex - 1);
        setStage("question");
      } else if (stage === "stageIntro") {
        // Back from Stage III intro → Breathe
        setStage("breathe");
      } else if (stage === "breathe") {
        // Back from Breathe → Surprise
        setStage("surprise");
      } else if (stage === "surprise") {
        // Back from Surprise → Reflection 2
        setStage("reflection");
      } else if (stage === "result") {
        // No Reflection 3 — go back to Q10 and pop its answer
        setAnswers(prev => prev.slice(0, -1));
        setQuestionIndex(9);
        setStage("question");
      }
      setIsTransitioning(false);
    }, 600);
  };

  return {
    stage,
    user,
    questionIndex,
    answers,
    currentQuestion: questions[questionIndex < 10 ? questionIndex : 9],
    currentTriggerBlock,
    computeDominantDimension,
    finalDominantDimension,
    finalDominantCount,
    finalResultIsTied,
    q10AnswerText,
    q1AnswerText,
    q7AnswerText,
    progressPercent,
    isTransitioning,
    handleLogin,
    answerQuestion,
    proceedFromReflection,
    proceedFromSurprise,
    proceedFromBreathe,
    proceedFromStageIntro,
    goBack
  };
}
