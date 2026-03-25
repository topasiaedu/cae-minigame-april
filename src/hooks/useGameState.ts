import { useState, useMemo } from 'react';
import { Dimension, questions } from '../data/content';

export type GameStage = 'login' | 'question' | 'reflection' | 'result';

export interface UserState {
  name: string;
  email: string;
}

export function useGameState() {
  const [stage, setStage] = useState<GameStage>('login');
  const [user, setUser] = useState<UserState>({ name: '', email: '' });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Dimension[]>([]);
  
  // Is transitioning state handles the 600ms micro-delays between screens
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Trigger state (1, 2, or 3) based on where we are
  const currentTriggerBlock = useMemo(() => {
    if (questionIndex === 5) return 1;
    if (questionIndex === 10) return 2;
    if (questionIndex === 15) return 3;
    return 0;
  }, [questionIndex]);

  // Compute the current dominant dimension to feed into dynamic reflection triggers
  const computeDominantDimension = (startIndex: number, endIndex: number): Dimension => {
    const subset = answers.slice(startIndex, endIndex);
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    subset.forEach(ans => { counts[ans]++; });
    
    let dominant: Dimension = 'A';
    let max = 0;
    (Object.keys(counts) as Dimension[]).forEach(key => {
      if (counts[key] > max) {
        max = counts[key];
        dominant = key;
      }
    });
    return dominant;
  };

  // Full Result Dominant Dimension
  const finalDominantDimension = useMemo(() => {
    if (answers.length < 15) return 'A';
    return computeDominantDimension(0, 15);
  }, [answers]);

  // Progress Percentage (For questioning phase)
  const progressPercent = useMemo(() => {
    return Math.min(100, Math.round((questionIndex / questions.length) * 100));
  }, [questionIndex]);

  // Actions
  const handleTransition = (newStage?: GameStage, newIndex?: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (newStage) setStage(newStage);
      if (newIndex !== undefined) setQuestionIndex(newIndex);
      setIsTransitioning(false);
    }, 600);
  };

  const handleLogin = (name: string, email: string) => {
    setUser({ name, email });
    handleTransition('question', 0);
  };

  const answerQuestion = (dimension: Dimension) => {
    setAnswers(prev => [...prev, dimension]);
    const nextIndex = questionIndex + 1;
    
    if (nextIndex === 5 || nextIndex === 10 || nextIndex === 15) {
      handleTransition('reflection', nextIndex);
    } else {
      handleTransition('question', nextIndex);
    }
  };

  const proceedFromReflection = () => {
    if (questionIndex === 15) {
      handleTransition('result', 15);
    } else {
      handleTransition('question', questionIndex);
    }
  };

  const goBack = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      if (stage === 'question') {
        if (questionIndex === 0) {
          setStage('login');
        } else if (questionIndex === 5 || questionIndex === 10) {
          setStage('reflection');
        } else {
          setAnswers(prev => prev.slice(0, -1));
          setQuestionIndex(questionIndex - 1);
        }
      } else if (stage === 'reflection') {
         setAnswers(prev => prev.slice(0, -1));
         setQuestionIndex(questionIndex - 1);
         setStage('question');
      } else if (stage === 'result') {
         setStage('reflection');
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
    goBack
  };
}
