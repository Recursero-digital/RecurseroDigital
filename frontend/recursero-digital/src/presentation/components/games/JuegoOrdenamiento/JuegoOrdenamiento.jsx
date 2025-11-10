import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import "./JuegoOrdenamiento.css";
import StartScreen from './StartScreen';
import LevelSelectScreen from './LevelSelectScreen';
import GameScreen from './GameScreen';
import CongratsModal from './CongratsModal';
import FeedbackModal from './FeedbackModal';
import { useUserProgress } from '../../../hooks/useUserProgress';
import useGameScoring from '../../../hooks/useGameScoring';
import { 
  getNumbersForActivity,
  checkOrder, 
  generateHint, 
  levelRanges, 
  totalActivities, 
  getNumbersCount 
} from './utils';

const JuegoOrdenamiento = () => {
  const navigate = useNavigate();
  const { unlockLevel } = useUserProgress();
  const { 
    points, 
    attempts, 
    incrementAttempts, 
    resetScoring, 
    completeActivity,
    startActivityTimer
  } = useGameScoring();

  const [gameState, setGameState] = useState('start');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentActivity, setCurrentActivity] = useState(0);
  const [numbers, setNumbers] = useState([]);
  const [sortedNumbers, setSortedNumbers] = useState([]);
  const [targetNumbers, setTargetNumbers] = useState([]);
  const [levelResults, setLevelResults] = useState([]);
  
  const [showGameComplete, setShowGameComplete] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [showPermanentHint, setShowPermanentHint] = useState(false);


  const handleBackToGames = useCallback(() => {
    navigate('/alumno/juegos', { replace: true });
  }, [navigate]);

  const handleBackToLevels = useCallback(() => setGameState('level-select'), []);
  
  const handleBackToStart = useCallback(() => {
    resetGame();
    setGameState('start');
  }, []);

  const resetGame = useCallback(() => {
    setCurrentLevel(0);
    setCurrentActivity(0);
    resetScoring();
    setNumbers([]);
    setSortedNumbers([]);
    setShowGameComplete(false);
    setShowLevelUp(false);
    setShowFeedback(false);
    setFeedbackSuccess(false);
    setTargetNumbers([]);
    setLevelResults([]);
    setShowPermanentHint(false);
  }, [resetScoring]);

  const setupLevel = useCallback((level) => {
    const numbersData = getNumbersForActivity(level + 1, currentActivity);
    setNumbers(numbersData.shuffled);
    setSortedNumbers(numbersData.original);
  }, [currentActivity]);

  const handleStartGame = useCallback((level) => {
    setCurrentLevel(level - 1);
    setCurrentActivity(0);
    resetScoring();
    setLevelResults([]);
    setShowPermanentHint(false);
    setGameState('game');
  }, [resetScoring]);

  const handleActivityComplete = useCallback(() => {
    const activityScore = completeActivity(currentLevel, 'ordenamiento', currentActivity, currentLevel);
    const newActivity = currentActivity + 1;
    
    const result = {
      activity: currentActivity + 1,
      score: activityScore,
      attempts: attempts,
      level: currentLevel + 1
    };
    
    setLevelResults(prev => [...prev, result]);
    setTargetNumbers([]);
    setFeedbackSuccess(true);
    setShowFeedback(true);
  }, [currentLevel, currentActivity, completeActivity, attempts]);

  const handleFailedAttempt = useCallback(() => {
    incrementAttempts();
    setFeedbackSuccess(false);
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      setTargetNumbers([]); 
    }, 2500);
  }, [incrementAttempts]);

  const handleContinueAfterSuccess = useCallback(() => {
    setShowFeedback(false);
    if (currentActivity + 1 < totalActivities) {
      setCurrentActivity(currentActivity + 1);
      setupLevel(currentLevel); 
      setTargetNumbers([]);
      setShowPermanentHint(true);
      startActivityTimer();
    } else {  
      unlockLevel('ordenamiento', currentLevel + 2);
      
      if (currentLevel === 0) {
        setCurrentLevel(1);
        setCurrentActivity(0);
        setLevelResults([]);
        setShowPermanentHint(false);
        setTimeout(() => setupLevel(1), 100);
      } else if (currentLevel === 2) {
        setShowGameComplete(true);
      } else {
        setShowLevelUp(true);
      }
    }
  }, [currentActivity, currentLevel, setupLevel, unlockLevel]);

  const handleDrop = useCallback((draggedNumber) => {
    const newTargetNumbers = [...targetNumbers, draggedNumber];
    setTargetNumbers(newTargetNumbers);

    const numbersCount = getNumbersCount(); // Always returns 6
    if (newTargetNumbers.length === numbersCount) {
      if (checkOrder(newTargetNumbers, sortedNumbers)) {
        handleActivityComplete();
      } else {
        handleFailedAttempt();
      }
    }
  }, [targetNumbers, sortedNumbers, handleActivityComplete, handleFailedAttempt]);

  const handleRemove = useCallback((numberToRemove) => {
    setTargetNumbers(prev => prev.filter(num => num !== numberToRemove));
  }, []);

  const handleNextLevel = useCallback(() => {
    setShowLevelUp(false);
    if (currentLevel >= levelRanges.length - 1) {
      setShowGameComplete(true);
    } else {
      setCurrentLevel(prev => prev + 1);
      setCurrentActivity(0);
      setLevelResults([]);
      setShowPermanentHint(false);
      setTimeout(() => setupLevel(currentLevel + 1), 100);
    }
  }, [currentLevel, setupLevel]);

  const getHint = useCallback(() => {
    return generateHint(numbers);
  }, [numbers]);

  useEffect(() => {
    if (gameState === 'game') {
      setupLevel(currentLevel);
      setTargetNumbers([]);
      setShowPermanentHint(true);
      startActivityTimer();
    }
  }, [gameState, currentLevel, setupLevel, startActivityTimer]);

  return (
    <div className="game-container">
      {gameState === 'start' && (
        <StartScreen 
          onStart={() => setGameState('level-select')} 
          onBackToGames={handleBackToGames} 
        />
      )}
      
      {gameState === 'level-select' && (
        <LevelSelectScreen 
          onSelectLevel={handleStartGame} 
          onBackToGames={handleBackToGames} 
        />
      )}
      
      {gameState === 'game' && !showGameComplete && (
        <GameScreen
          currentLevel={currentLevel}
          currentActivity={currentActivity}
          totalActivities={totalActivities}
          attempts={attempts}
          points={points}
          numbers={numbers}
          sortedNumbers={sortedNumbers}
          targetNumbers={targetNumbers}
          numbersCount={getNumbersCount()}
          onDrop={handleDrop}
          onRemove={handleRemove}
          onBackToLevels={handleBackToLevels}
          onBackToGames={handleBackToGames}
          generateHint={getHint}
          showPermanentHint={showPermanentHint}
          levelRanges={levelRanges}
        />
      )}

      {gameState === 'game' && showGameComplete && (
        <div className="juego-ordenamiento-content">
          <header className="game-header">
            <div className="header-controls">
              <div className="buttons-group">
                <button 
                  className="btn-back-to-levels"
                  onClick={handleBackToLevels}
                  title="Volver a niveles"
                >
                  ← Niveles
                </button>
                <button 
                  className="btn-back-to-dashboard"
                  onClick={handleBackToGames}
                  title="Volver a juegos"
                >
                  ← Juegos
                </button>
              </div>
              
              <div className="game-status">
                <div className="status-item">
                  <div className="status-icon">📊</div>
                  <div className="status-label">Nivel</div>
                  <div className="status-value">3</div>
                </div>
                <div className="status-item">
                  <div className="status-icon">⭐</div>
                  <div className="status-label">Puntuación</div>
                  <div className="status-value">{points}</div>
                </div>
              </div>
            </div>
            <h1 className="game-title">� Ordenamiento Numérico</h1>
          </header>

          <div className="progress-container">
            <div 
              className="progress-bar"
              data-progress="100"
              style={{'--progress-width': '100%'}}
            />
          </div>

          <div className="game-complete">
            <h2 className="complete-title">🎉 ¡Felicitaciones!</h2>
            <p className="complete-message">¡Has completado todos los niveles del juego de ordenamiento!</p>
            <p className="final-score">Puntuación final: {points}</p>
            <div className="complete-buttons">
              <button className="restart-button" onClick={handleBackToLevels}>
                📊 Ver Niveles
              </button>
              <button className="restart-button" onClick={handleBackToStart}>
                🔄 Jugar de nuevo
              </button>
            </div>
          </div>
        </div>
      )}

      {showLevelUp && !showGameComplete && (
        <CongratsModal
          level={currentLevel + 1}
          results={levelResults}
          totalScore={points}
          onNextLevel={handleNextLevel}
          onBackToLevels={handleBackToLevels}
        />
      )}

      {showFeedback && (
        <FeedbackModal
          isSuccess={feedbackSuccess}
          onContinue={feedbackSuccess ? handleContinueAfterSuccess : () => setShowFeedback(false)}
          onRetry={() => {
            setShowFeedback(false);
            setTargetNumbers([]);
          }}
        />
      )}
    </div>
  );
};

export default JuegoOrdenamiento;