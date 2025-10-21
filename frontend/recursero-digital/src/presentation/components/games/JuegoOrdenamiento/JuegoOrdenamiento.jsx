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
  generateNumbers, 
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
    completeActivity 
  } = useGameScoring();

  // Game state
  const [gameState, setGameState] = useState('start');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentActivity, setCurrentActivity] = useState(0);
  const [numbers, setNumbers] = useState([]);
  const [sortedNumbers, setSortedNumbers] = useState([]);
  const [targetNumbers, setTargetNumbers] = useState([]);
  const [levelResults, setLevelResults] = useState([]);
  
  // UI state
  const [showGameComplete, setShowGameComplete] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [showPermanentHint, setShowPermanentHint] = useState(false);

  // Navigation handlers
  const handleBackToGames = useCallback(() => {
    navigate('/alumno/juegos', { replace: true });
  }, [navigate]);

  const handleBackToLevels = useCallback(() => setGameState('level-select'), []);
  
  const handleBackToStart = useCallback(() => {
    resetGame();
    setGameState('start');
  }, []);

  // Game logic
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
    const numbersData = generateNumbers(level, levelRanges, getNumbersCount);
    setNumbers(numbersData.shuffled);
    setSortedNumbers(numbersData.sorted);
  }, []);

  // Game flow handlers
  const handleStartGame = useCallback((level) => {
    setCurrentLevel(level - 1);
    setCurrentActivity(0);
    resetScoring();
    setLevelResults([]);
    setShowPermanentHint(false);
    setGameState('game');
  }, [resetScoring]);

  const handleActivityComplete = useCallback(() => {
    const activityScore = completeActivity(currentLevel);
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
    } else {  
      unlockLevel('ordenamiento', currentLevel + 2);
      setShowLevelUp(true);
    }
  }, [currentActivity, currentLevel, setupLevel, unlockLevel]);

  const handleDrop = useCallback((draggedNumber) => {
    const newTargetNumbers = [...targetNumbers, draggedNumber];
    setTargetNumbers(newTargetNumbers);

    const numbersCount = getNumbersCount(currentLevel);
    if (newTargetNumbers.length === numbersCount) {
      if (checkOrder(newTargetNumbers, currentLevel, sortedNumbers)) {
        handleActivityComplete();
      } else {
        handleFailedAttempt();
      }
    }
  }, [targetNumbers, currentLevel, sortedNumbers, handleActivityComplete, handleFailedAttempt]);

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
    return generateHint(currentLevel, sortedNumbers);
  }, [currentLevel, sortedNumbers]);

  // Effects
  useEffect(() => {
    if (gameState === 'game') {
      setupLevel(currentLevel);
      setTargetNumbers([]);
      setShowPermanentHint(true);
    }
  }, [gameState, currentLevel, setupLevel]);



  // Render
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
          numbersCount={getNumbersCount(currentLevel)}
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
        <div className="game-content">
          <div className="game-complete">
            <h2 className="complete-title">🎉 ¡Juego Completado!</h2>
            <p className="complete-message">Has completado todos los niveles</p>
            <p className="final-score">Puntuación final: {points}</p>
            <button className="restart-button" onClick={handleBackToStart}>
              🔄 Jugar de nuevo
            </button>
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