import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import "./JuegoCalculos.css";
import StartScreen from './StartScreen';
import LevelSelectScreen from './LevelSelectScreen';
import GameScreen from './GameScreen';
import CongratsModal from './CongratsModal';
import { useUserProgress } from '../../../hooks/useUserProgress';
import useGameScoring from '../../../hooks/useGameScoring';

const JuegoCalculos = () => {
  const navigate = useNavigate();
  const { unlockLevel } = useUserProgress();
  const { 
    points, 
    attempts, 
    incrementAttempts, 
    resetScoring, 
    completeActivity,
    addPoints,
    startActivityTimer
  } = useGameScoring();

  // Game state management
  const [gameState, setGameState] = useState('start'); // 'start', 'levelSelect', 'playing', 'gameComplete'
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [gameResults, setGameResults] = useState({
    isWin: false,
    finalScore: 0,
    lives: 0,
    correctAnswers: 0,
    totalQuestions: 0
  });

  // Navigation handlers
  const handleBackToGames = useCallback(() => {
    navigate('/alumno/juegos', { replace: true });
  }, [navigate]);

  const handleStartGame = useCallback((operation) => {
    setSelectedOperation(operation);
    setGameState('levelSelect');
  }, []);

  const handleSelectLevel = useCallback((level) => {
    setSelectedLevel(level);
    setGameState('playing');
    resetScoring();
    startActivityTimer();
  }, [resetScoring, startActivityTimer]);

  const handleBackToStart = useCallback(() => {
    setSelectedOperation(null);
    setSelectedLevel(null);
    setGameState('start');
  }, []);

  const handleBackToLevelSelect = useCallback(() => {
    setSelectedLevel(null);
    setGameState('levelSelect');
  }, []);

  const handleGameComplete = useCallback((isWin, finalScore, correctAnswers, totalQuestions, totalAttempts) => {
    setGameResults({
      isWin,
      finalScore,
      lives: 0, // No lives system
      correctAnswers,
      totalQuestions,
      totalAttempts
    });

    // Complete activity for scoring system and unlock next level if won
    if (isWin) {
      const levelNumber = parseInt(selectedLevel.replace('nivel', ''));
      
      completeActivity(
        levelNumber - 1,           
        'calculos',                
        0,                         
        levelNumber                
      );
      
      // Unlock next level if available - usando gameId específico por operación
      if (levelNumber < 3) {
        // Crear gameId específico para cada operación: 'calculos-suma', 'calculos-resta', 'calculos-multiplicacion'
        const gameId = `calculos-${selectedOperation}`;
        unlockLevel(gameId, levelNumber + 1);
      }
    }

    setGameState('gameComplete');
  }, [selectedLevel, selectedOperation, completeActivity, unlockLevel]);

  const handlePlayAgain = useCallback(() => {
    setGameState('playing');
    resetScoring();
    startActivityTimer(); 
  }, [resetScoring, startActivityTimer]);

  const handlePlayNextLevel = useCallback((nextLevel) => {
    setSelectedLevel(nextLevel);
    setGameState('playing');
    resetScoring();
    startActivityTimer();
  }, [resetScoring, startActivityTimer]);

  const handleUpdateScore = useCallback((points) => {
    addPoints(points);
  }, [addPoints]);

  const handleUpdateAttempts = useCallback(() => {
    incrementAttempts();
  }, [incrementAttempts]);

  // Render current screen based on game state
  const renderCurrentScreen = () => {
    switch(gameState) {
      case 'start':
        return (
          <StartScreen 
            onStartGame={handleStartGame}
            onBackToGames={handleBackToGames}
          />
        );

      case 'levelSelect':
        return (
          <LevelSelectScreen 
            operation={selectedOperation}
            onSelectLevel={handleSelectLevel}
            onBackToStart={handleBackToStart}
          />
        );

      case 'playing':
        return (
          <GameScreen 
            operation={selectedOperation}
            level={selectedLevel}
            onGameComplete={handleGameComplete}
            onBackToLevelSelect={handleBackToLevelSelect}
            onUpdateScore={handleUpdateScore}
            onUpdateAttempts={handleUpdateAttempts}
          />
        );

      case 'gameComplete':
        return (
          <>
            {/* Keep the previous screen visible behind the modal */}
            <GameScreen 
              operation={selectedOperation}
              level={selectedLevel}
              onGameComplete={handleGameComplete}
              onBackToLevelSelect={handleBackToLevelSelect}
              onUpdateScore={handleUpdateScore}
              onUpdateAttempts={handleUpdateAttempts}
            />
            <CongratsModal 
              isVisible={true}
              isWin={gameResults.isWin}
              operation={selectedOperation}
              level={selectedLevel}
              finalScore={gameResults.finalScore}
              totalQuestions={gameResults.totalQuestions}
              correctAnswers={gameResults.correctAnswers}
              totalAttempts={gameResults.totalAttempts}
              onPlayAgain={handlePlayAgain}
              onNextLevel={handlePlayNextLevel}
              onBackToLevelSelect={handleBackToLevelSelect}
              onBackToStart={handleBackToStart}
            />
          </>
        );

      default:
        return (
          <StartScreen 
            onStartGame={handleStartGame}
            onBackToGames={handleBackToGames}
          />
        );
    }
  };

  return (
    <div className="game-container">
      {renderCurrentScreen()}
    </div>
  );
};

export default JuegoCalculos;