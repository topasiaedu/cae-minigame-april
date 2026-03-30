import { useCallback, useMemo, useState } from "react";
import { Dimension, questions, resolveSetup } from "../data/content";

const NON_SCORED_INDICES: ReadonlySet<number> = new Set([4, 5, 8]);

export type GameStage = "login" | "stageIntro" | "question" | "reflection" | "confrontation" | "result";

export interface UserState {
  name: string;
  email: string;
}

type StageIntroNumber = 1 | 2;

const EMPTY_COUNTS: Record<Dimension, number> = { A: 0, B: 0, C: 0, D: 0 };

export function useGameState() {
  const [stage, setStage] = useState<GameStage>("login");
  const [stageIntroNumber, setStageIntroNumber] = useState<StageIntroNumber>(1);
  const [user, setUser] = useState<UserState>({ name: "", email: "" });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Dimension[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentTriggerBlock = useMemo<0 | 1 | 2>(() => {
    if (questionIndex === 3) return 1;
    if (questionIndex === 6) return 2;
    return 0;
  }, [questionIndex]);

  const getScoredCounts = useCallback((startIndex: number, endIndex: number): Record<Dimension, number> => {
    const counts: Record<Dimension, number> = { ...EMPTY_COUNTS };
    const subset = answers.slice(startIndex, endIndex);
    subset.forEach((answer, localIndex) => {
      const globalIndex = startIndex + localIndex;
      if (!NON_SCORED_INDICES.has(globalIndex)) {
        counts[answer] += 1;
      }
    });
    return counts;
  }, [answers]);

  const computeDominantDimension = useCallback((startIndex: number, endIndex: number): Dimension => {
    const counts = getScoredCounts(startIndex, endIndex);
    const maxCount = Math.max(counts.A, counts.B, counts.C, counts.D);
    const tied = (Object.keys(counts) as Dimension[]).filter((dimension) => counts[dimension] === maxCount);
    if (tied.length === 1) {
      return tied[0];
    }

    const subset = answers.slice(startIndex, endIndex);
    let bestDimension: Dimension = tied[0];
    let bestStreak = -1;
    let bestLastSeen = -1;

    tied.forEach((dimension) => {
      const lastSeen = subset.lastIndexOf(dimension);
      let streak = 0;
      if (lastSeen >= 0) {
        streak = 1;
        for (let index = lastSeen - 1; index >= 0; index -= 1) {
          if (subset[index] === dimension) {
            streak += 1;
          } else {
            break;
          }
        }
      }

      if (streak > bestStreak || (streak === bestStreak && lastSeen > bestLastSeen)) {
        bestDimension = dimension;
        bestStreak = streak;
        bestLastSeen = lastSeen;
      }
    });

    return bestDimension;
  }, [answers, getScoredCounts]);

  const answerCounts = useMemo<Record<Dimension, number>>(() => getScoredCounts(0, answers.length), [answers.length, getScoredCounts]);

  const { finalDominantDimension, finalDominantCount, finalResultIsTied, tiedDimensions } = useMemo(() => {
    const maxCount = Math.max(answerCounts.A, answerCounts.B, answerCounts.C, answerCounts.D);
    const tied = (Object.keys(answerCounts) as Dimension[]).filter((dimension) => answerCounts[dimension] === maxCount && maxCount > 0);
    return {
      finalDominantDimension: computeDominantDimension(0, answers.length > 0 ? answers.length : 1),
      finalDominantCount: maxCount,
      finalResultIsTied: tied.length > 1,
      tiedDimensions: tied
    };
  }, [answerCounts, answers.length, computeDominantDimension]);

  const q10AnswerText = useMemo((): string => {
    const answer = answers[9];
    if (answer === undefined) return "";
    const option = questions[9].options.find((item) => item.id === answer);
    return option === undefined ? "" : option.text;
  }, [answers]);

  const q1AnswerText = useMemo((): string => {
    const answer = answers[0];
    if (answer === undefined) return "";
    const option = questions[0].options.find((item) => item.id === answer);
    return option === undefined ? "" : option.text;
  }, [answers]);

  const q8AnswerText = useMemo((): string => {
    const answer = answers[7];
    if (answer === undefined) return "";
    const option = questions[7].options.find((item) => item.id === answer);
    return option === undefined ? "" : option.text;
  }, [answers]);

  const progressPercent = useMemo((): number => Math.min(100, Math.round((questionIndex / questions.length) * 100)), [questionIndex]);

  const playerCostText = useMemo((): string => {
    const answer = answers[4];
    if (answer === undefined) return "";
    const option = questions[4].options.find((item) => item.id === answer);
    return option === undefined ? "" : option.text;
  }, [answers]);

  const stageIDominant = useMemo((): Dimension => {
    if (answers.length < 3) return "A";
    return computeDominantDimension(0, 3);
  }, [answers, computeDominantDimension]);

  const hasContradiction = useMemo((): boolean => {
    const q4Answer = answers[3];
    if (q4Answer === undefined) return false;
    return stageIDominant !== q4Answer;
  }, [stageIDominant, answers]);

  const currentResolvedSetup = useMemo((): string => {
    const question = questions[Math.min(questionIndex, questions.length - 1)];
    return resolveSetup(question, answers);
  }, [questionIndex, answers]);

  const handleTransition = (nextStage?: GameStage, nextQuestionIndex?: number, nextIntroNumber?: StageIntroNumber): void => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (nextStage !== undefined) setStage(nextStage);
      if (nextQuestionIndex !== undefined) setQuestionIndex(nextQuestionIndex);
      if (nextIntroNumber !== undefined) setStageIntroNumber(nextIntroNumber);
      setIsTransitioning(false);
    }, 600);
  };

  const handleLogin = (name: string, email: string): void => {
    setUser({ name, email });
    handleTransition("stageIntro", 0, 1);
  };

  const answerQuestion = (dimension: Dimension): void => {
    setAnswers((previous) => [...previous, dimension]);
    const nextIndex = questionIndex + 1;
    if (nextIndex === 3 || nextIndex === 6) {
      handleTransition("reflection", nextIndex);
      return;
    }
    if (nextIndex === 10) {
      handleTransition("result", nextIndex);
      return;
    }
    handleTransition("question", nextIndex);
  };

  const proceedFromReflection = (): void => {
    if (questionIndex === 6) {
      handleTransition("confrontation", 6);
      return;
    }
    handleTransition("stageIntro", 3, 2);
  };

  const proceedFromStageIntro = (): void => {
    if (stageIntroNumber === 1) {
      handleTransition("question", 0);
      return;
    }
    handleTransition("question", 3);
  };

  const proceedFromConfrontation = (): void => {
    handleTransition("question", 6);
  };

  const goBack = (): void => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      if (stage === "stageIntro") {
        if (stageIntroNumber === 1) {
          setStage("login");
        } else {
          setStage("reflection");
          setQuestionIndex(3);
        }
      } else if (stage === "question") {
        if (questionIndex === 0) {
          setStage("stageIntro");
          setStageIntroNumber(1);
        } else if (questionIndex === 3) {
          setStage("stageIntro");
          setStageIntroNumber(2);
        } else if (questionIndex === 6) {
          setStage("confrontation");
        } else {
          setAnswers((previous) => previous.slice(0, -1));
          setQuestionIndex((previous) => previous - 1);
        }
      } else if (stage === "reflection") {
        setAnswers((previous) => previous.slice(0, -1));
        setQuestionIndex((previous) => previous - 1);
        setStage("question");
      } else if (stage === "confrontation") {
        setStage("reflection");
        setQuestionIndex(6);
      } else if (stage === "result") {
        setAnswers((previous) => previous.slice(0, -1));
        setQuestionIndex(9);
        setStage("question");
      }
      setIsTransitioning(false);
    }, 600);
  };

  return {
    stage,
    stageIntroNumber,
    user,
    questionIndex,
    answers,
    currentQuestion: questions[Math.min(questionIndex, questions.length - 1)],
    currentTriggerBlock,
    computeDominantDimension,
    finalDominantDimension,
    finalDominantCount,
    finalResultIsTied,
    tiedDimensions,
    answerCounts,
    q10AnswerText,
    q1AnswerText,
    q8AnswerText,
    progressPercent,
    isTransitioning,
    playerCostText,
    stageIDominant,
    hasContradiction,
    currentResolvedSetup,
    handleLogin,
    answerQuestion,
    proceedFromReflection,
    proceedFromConfrontation,
    proceedFromStageIntro,
    goBack
  };
}
