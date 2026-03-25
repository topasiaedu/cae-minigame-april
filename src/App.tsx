import React from 'react';
import { useGameState } from './hooks/useGameState';
import { LoginScreen } from './components/LoginScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { ReflectionScreen } from './components/ReflectionScreen';
import { ResultScreen } from './components/ResultScreen';
import { questions } from './data/content';

function App() {
  const gameState = useGameState();

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', width: '100%' }}>
      {/* Ambient Depth Elements */}
      <div className="ambient-orb-1"></div>
      <div className="ambient-orb-2"></div>
      <main style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {gameState.stage === 'login' && (
          <LoginScreen 
            onLogin={gameState.handleLogin} 
            isTransitioning={gameState.isTransitioning}
          />
        )}
        
        {gameState.stage === 'question' && gameState.currentQuestion && (
          <QuestionScreen 
            question={gameState.currentQuestion}
            questionIndex={gameState.questionIndex}
            totalQuestions={questions.length}
            progressPercent={gameState.progressPercent}
            onAnswer={gameState.answerQuestion}
            isTransitioning={gameState.isTransitioning}
            onBack={gameState.goBack}
          />
        )}
        
        {gameState.stage === 'reflection' && (
          <ReflectionScreen 
            triggerBlock={gameState.currentTriggerBlock}
            dominantDimension={gameState.computeDominantDimension(
              gameState.questionIndex - 5, 
              gameState.questionIndex
            )}
            onProceed={gameState.proceedFromReflection}
            isTransitioning={gameState.isTransitioning}
            onBack={gameState.goBack}
          />
        )}
        
        {gameState.stage === 'result' && (
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
