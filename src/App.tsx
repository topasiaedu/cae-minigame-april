import { useEffect, useMemo } from "react";
import { useGameState } from "./hooks/useGameState";
import { LoginScreen }      from "./components/LoginScreen";
import { QuestionScreen }   from "./components/QuestionScreen";
import { ReflectionScreen } from "./components/ReflectionScreen";
import { StageIntroScreen } from "./components/StageIntroScreen";
import { ConfrontationScreen } from "./components/ConfrontationScreen";
import { ResultScreen }     from "./components/ResultScreen";
import { questions, Dimension, stageIBehaviorText, q4DescriptionText } from "./data/content";

function App() {
  const gameState = useGameState();

  /**
   * Scroll to top instantly on every screen transition.
   * Prevents mobile players from seeing partial content from the previous screen.
   */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [gameState.stage, gameState.questionIndex]);

  /**
   * Compute the current dominant behavioural dimension from answers collected
   * so far. Used to drive subliminal ambient orb adjustments. Returns null if
   * no answers have been submitted yet.
   */
  const currentDominant: Dimension | null =
    gameState.answers.length === 0
      ? null
      : gameState.computeDominantDimension(0, gameState.answers.length);

  /**
   * Subliminal orb adjustments based on the player's emerging behavioural pattern.
   * Changes are deliberately subtle — the player should feel the room is slightly
   * different without being able to name why.
   *
   * A (action): warmer, faster — the room feels energised
   * B (waiting): cooler, slower — the room feels still
   * C (calculating): sharper edges (less blur) — the room feels precise
   * D (preserving): orbs drift apart — the room feels spacious
   */
  const orbOverrides = useMemo(() => {
    if (currentDominant === null) {
      return { orb1: {} as React.CSSProperties, orb2: {} as React.CSSProperties };
    }

    switch (currentDominant) {
      case "A":
        return {
          orb1: { animationDuration: "18s", background: "radial-gradient(circle, rgba(255, 190, 100, 0.22) 0%, rgba(200, 150, 80, 0) 70%)" } as React.CSSProperties,
          orb2: { animationDuration: "22s", background: "radial-gradient(circle, rgba(245, 195, 110, 0.2) 0%, rgba(200, 150, 80, 0) 70%)" } as React.CSSProperties
        };
      case "B":
        return {
          orb1: { animationDuration: "35s", background: "radial-gradient(circle, rgba(220, 200, 160, 0.15) 0%, rgba(180, 160, 120, 0) 70%)" } as React.CSSProperties,
          orb2: { animationDuration: "40s", background: "radial-gradient(circle, rgba(210, 190, 150, 0.12) 0%, rgba(180, 160, 120, 0) 70%)" } as React.CSSProperties
        };
      case "C":
        return {
          orb1: { animationDuration: "25s", filter: "blur(25px)" } as React.CSSProperties,
          orb2: { animationDuration: "30s", filter: "blur(30px)" } as React.CSSProperties
        };
      case "D":
        return {
          orb1: { top: "-15%", left: "-15%", animationDuration: "28s" } as React.CSSProperties,
          orb2: { bottom: "-25%", right: "-25%", animationDuration: "33s" } as React.CSSProperties
        };
    }
  }, [currentDominant]);

  // Reflection-specific slice and counts are only meaningful during reflection stage.
  const reflectionSlice: Dimension[] =
    gameState.stage === "reflection"
      ? gameState.answers.slice(gameState.questionIndex - 3, gameState.questionIndex)
      : [];
  const reflectionDominant: Dimension =
    gameState.stage === "reflection"
      ? gameState.computeDominantDimension(gameState.questionIndex - 3, gameState.questionIndex)
      : "A";
  const reflectionDominantCount = reflectionSlice.filter(
    (answer) => answer === reflectionDominant
  ).length;

  return (
    <div style={{ position: "relative", overflowX: "hidden", minHeight: "100vh", width: "100%" }}>
      {/* Ambient depth elements — two large blurred radial gradient orbs that
          float very slowly behind the glass container, giving the frosted-glass
          effect something visible to blur against. Inline styles here override
          specific CSS class properties based on the player's emerging pattern. */}
      <div className="ambient-orb-1" style={orbOverrides.orb1} />
      <div className="ambient-orb-2" style={orbOverrides.orb2} />

      <main style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
      }}>

        {/* ── Login ── */}
        {gameState.stage === "login" && (
          <LoginScreen
            onLogin={gameState.handleLogin}
            isTransitioning={gameState.isTransitioning}
          />
        )}

        {/* ── Question (Q1–Q10) ── */}
        {gameState.stage === "question" && gameState.currentQuestion && (
          <QuestionScreen
            question={gameState.currentQuestion}
            resolvedSetup={gameState.currentResolvedSetup}
            questionIndex={gameState.questionIndex}
            totalQuestions={questions.length}
            progressPercent={gameState.progressPercent}
            onAnswer={gameState.answerQuestion}
            isTransitioning={gameState.isTransitioning}
            onBack={gameState.goBack}
            answers={gameState.answers}
          />
        )}

        {/* ── Reflection (after Q3 and Q6) ── */}
        {gameState.stage === "reflection" && (
          <ReflectionScreen
            triggerBlock={gameState.currentTriggerBlock}
            dominantDimension={reflectionDominant}
            dominantCount={reflectionDominantCount}
            onProceed={gameState.proceedFromReflection}
            isTransitioning={gameState.isTransitioning}
            onBack={gameState.goBack}
            name={gameState.user.name}
            stageAnswers={reflectionSlice}
            allAnswers={gameState.answers}
            stageIDominant={gameState.stageIDominant}
            playerCostText={gameState.playerCostText}
          />
        )}

        {/* ── Stage intro (Stage I or II) ── */}
        {gameState.stage === "stageIntro" && (
          <StageIntroScreen
            stageNumber={gameState.stageIntroNumber}
            onProceed={gameState.proceedFromStageIntro}
            isTransitioning={gameState.isTransitioning}
            onBack={gameState.goBack}
          />
        )}

        {/* ── Confrontation (replaces surprise + breathe + stage III intro) ── */}
        {gameState.stage === "confrontation" && (
          <ConfrontationScreen
            onProceed={gameState.proceedFromConfrontation}
            isTransitioning={gameState.isTransitioning}
            onBack={gameState.goBack}
            stageIDominant={gameState.stageIDominant}
            hasContradiction={gameState.hasContradiction}
            stageIBehaviorText={stageIBehaviorText[gameState.stageIDominant]}
            q4DescriptionText={gameState.answers[3] !== undefined ? q4DescriptionText[gameState.answers[3]] : ""}
            playerCostText={gameState.playerCostText}
          />
        )}

        {/* ── Result ── */}
        {gameState.stage === "result" && (
          <ResultScreen
            name={gameState.user.name}
            finalDimension={gameState.finalDominantDimension}
            isTied={gameState.finalResultIsTied}
            tiedDimensions={gameState.tiedDimensions}
            answerCounts={gameState.answerCounts}
            q10AnswerText={gameState.q10AnswerText}
            q1AnswerText={gameState.q1AnswerText}
            isTransitioning={gameState.isTransitioning}
            onBack={gameState.goBack}
            playerCostText={gameState.playerCostText}
          />
        )}

      </main>

    </div>
  );
}

export default App;
