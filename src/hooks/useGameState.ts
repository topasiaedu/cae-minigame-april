import { useState, useMemo } from "react";
import { Dimension, questions } from "../data/content";

/**
 * The complete set of navigable screens in the app.
 * - login:       Entry screen (name + optional email)
 * - question:    The 15 behavioural questions
 * - reflection:  Interstitial pause screen after Q5, Q10, Q15
 * - stageIntro:  Brief "entering Stage III" screen shown once, before Q11
 * - result:      Personalised result page
 */
export type GameStage = "login" | "question" | "reflection" | "stageIntro" | "result";

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

  // Which of the three reflection blocks is currently active (0 = none)
  const currentTriggerBlock = useMemo<0 | 1 | 2 | 3>(() => {
    if (questionIndex === 5)  return 1;
    if (questionIndex === 10) return 2;
    if (questionIndex === 15) return 3;
    return 0;
  }, [questionIndex]);

  /**
   * Compute the dominant behavioural dimension across a slice of answers.
   *
   * Tie-breaking strategy: if two or more dimensions share the highest count,
   * the most-recent 5 answers within the slice are used as a tiebreaker.
   * This gives Stage III answers more weight than Stage I, which is intentional —
   * the later mirror questions are more self-aware and should carry more signal.
   * If still tied after that secondary pass, the first tied dimension wins.
   */
  const computeDominantDimension = (startIndex: number, endIndex: number): Dimension => {
    const subset = answers.slice(startIndex, endIndex);
    const counts: Record<Dimension, number> = { A: 0, B: 0, C: 0, D: 0 };
    subset.forEach(ans => { counts[ans]++; });

    const max = Math.max(counts.A, counts.B, counts.C, counts.D);
    const tied = (Object.keys(counts) as Dimension[]).filter(k => counts[k] === max);

    // No tie — return the clear winner
    if (tied.length === 1) return tied[0];

    // Tiebreaker: scan the last 5 answers within this range
    const recentStart   = Math.max(startIndex, endIndex - 5);
    const recentSubset  = answers.slice(recentStart, endIndex);
    const recentCounts: Record<Dimension, number> = { A: 0, B: 0, C: 0, D: 0 };
    recentSubset.forEach(ans => { recentCounts[ans]++; });

    let topDim: Dimension = tied[0];
    let topCount = -1;
    tied.forEach(dim => {
      if (recentCounts[dim] > topCount) {
        topCount = recentCounts[dim];
        topDim   = dim;
      }
    });
    return topDim;
  };

  // Final dominant dimension across all 15 answers (shown on result page)
  const finalDominantDimension = useMemo((): Dimension => {
    if (answers.length < 15) return "A";
    return computeDominantDimension(0, 15);
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

    if (nextIndex === 5 || nextIndex === 10 || nextIndex === 15) {
      handleTransition("reflection", nextIndex);
    } else {
      handleTransition("question", nextIndex);
    }
  };

  /**
   * Proceed from a Reflection screen.
   * - After Q15 (Reflection 3) → go to Result
   * - After Q10 (Reflection 2) → go to StageIntro (the Stage III intro screen)
   * - After Q5  (Reflection 1) → go to Q6 (question at index 5)
   */
  const proceedFromReflection = (): void => {
    if (questionIndex === 15) {
      handleTransition("result", 15);
    } else if (questionIndex === 10) {
      handleTransition("stageIntro", 10);
    } else {
      handleTransition("question", questionIndex);
    }
  };

  /** Proceed from the Stage III intro screen → show Q11 (index 10) */
  const proceedFromStageIntro = (): void => {
    handleTransition("question", questionIndex);
  };

  /**
   * Back navigation — complete map:
   *
   * result      → reflection (most recent, block 3)
   * stageIntro  → reflection (block 2)
   * question[0] → login
   * question[5] → reflection (block 1)       ← came from Reflection 1 "Continue"
   * question[10]→ stageIntro                 ← came from StageIntro "I'm ready"
   * question[n] → question[n-1] + pop answer
   * reflection  → question[n-1] + pop answer ← undo last question that triggered it
   */
  const goBack = (): void => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      if (stage === "question") {
        if (questionIndex === 0) {
          setStage("login");
        } else if (questionIndex === 5) {
          // Back from Q6 → Reflection 1
          setStage("reflection");
        } else if (questionIndex === 10) {
          // Back from Q11 → Stage Intro (not reflection directly)
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
        // Back from Stage III intro → Reflection 2
        setStage("reflection");
      } else if (stage === "result") {
        setStage("reflection");
      }
      setIsTransitioning(false);
    }, 600);
  };

  return {
    stage,
    user,
    questionIndex,
    answers,
    currentQuestion: questions[questionIndex < 15 ? questionIndex : 14],
    currentTriggerBlock,
    computeDominantDimension,
    finalDominantDimension,
    progressPercent,
    isTransitioning,
    handleLogin,
    answerQuestion,
    proceedFromReflection,
    proceedFromStageIntro,
    goBack
  };
}
