import { useGameState } from "./hooks/useGameState";
import { LoginScreen }      from "./components/LoginScreen";
import { QuestionScreen }   from "./components/QuestionScreen";
import { ReflectionScreen } from "./components/ReflectionScreen";
import { StageIntroScreen } from "./components/StageIntroScreen";
import { ResultScreen }     from "./components/ResultScreen";
import { questions }        from "./data/content";

function App() {
  const gameState = useGameState();

  return (
    <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh", width: "100%" }}>
      {/* Ambient depth elements — two large blurred radial gradient orbs that
          float very slowly behind the glass container, giving the frosted-glass
          effect something visible to blur against. */}
      <div className="ambient-orb-1" />
      <div className="ambient-orb-2" />

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

        {/* ── Question (Q1–Q15) ── */}
        {gameState.stage === "question" && gameState.currentQuestion && (
          <QuestionScreen
            question={gameState.currentQuestion}
            questionIndex={gameState.questionIndex}
            totalQuestions={questions.length}
            progressPercent={gameState.progressPercent}
            onAnswer={gameState.answerQuestion}
            isTransitioning={gameState.isTransitioning}
            onBack={gameState.goBack}
            answers={gameState.answers}
          />
        )}

        {/* ── Reflection (after Q5, Q10, Q15) ── */}
        {gameState.stage === "reflection" && (
          <ReflectionScreen
            triggerBlock={gameState.currentTriggerBlock}
            dominantDimension={gameState.computeDominantDimension(
              gameState.questionIndex - 5,
              gameState.questionIndex
            )}
            onProceed={gameState.proceedFromReflection}
            isTransitioning={gameState.isTransitioning}
            onBack={gameState.goBack}
            name={gameState.user.name}
          />
        )}

        {/* ── Stage III intro (shown once, between Reflection 2 and Q11) ── */}
        {gameState.stage === "stageIntro" && (
          <StageIntroScreen
            onProceed={gameState.proceedFromStageIntro}
            isTransitioning={gameState.isTransitioning}
            onBack={gameState.goBack}
          />
        )}

        {/* ── Result ── */}
        {gameState.stage === "result" && (
          <ResultScreen
            name={gameState.user.name}
            finalDimension={gameState.finalDominantDimension}
            isTransitioning={gameState.isTransitioning}
            onBack={gameState.goBack}
          />
        )}

      </main>
    </div>
  );
}

export default App;
