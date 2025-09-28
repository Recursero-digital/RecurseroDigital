import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "./JuegoOrdenamiento.css";
import StartScreen from './StartScreen';
import LevelSelectScreen from './LevelSelectScreen';
import LevelResultsModal from './LevelResultsModal';
import ActivityFeedbackModal from './ActivityFeedbackModal';
import { useUserProgress } from '../../../hooks/useUserProgress';

const JuegoOrdenamiento = () => {
  const { unlockLevel } = useUserProgress();
  const [gameState, setGameState] = useState('start');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentActivity, setCurrentActivity] = useState(0);
  const [points, setPoints] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [numbers, setNumbers] = useState([]);
  const [sortedNumbers, setSortedNumbers] = useState([]);
  const [showGameComplete, setShowGameComplete] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [targetNumbers, setTargetNumbers] = useState([]);
  const [levelResults, setLevelResults] = useState([]);

  const levelRanges = useMemo(() => [
    { min: 25, max: 250 },
    { min: 251, max: 500 },
    { min: 501, max: 750 },
    { min: 751, max: 1000 },
    { min: 1001, max: 1500 },
  ], []);

 
  const getNumbersCount = useCallback((level) => {
    return 6 + (level * 2);
  }, []);

  const numbersCount = getNumbersCount(currentLevel);
  const targetAreaRef = useRef(null);


  const generateNumbers = useCallback((level) => {
    const { min, max } = levelRanges[level];
    const currentNumbersCount = getNumbersCount(level);
    const generatedNumbers = new Set();

    while (generatedNumbers.size < currentNumbersCount) {
      const newNum = Math.floor(Math.random() * (max - min + 1)) + min;
      generatedNumbers.add(newNum);
    }

    const numbersArray = Array.from(generatedNumbers);
    const shuffledNumbers = [...numbersArray].sort(() => Math.random() - 0.5);
    const sorted = [...numbersArray].sort((a, b) => b - a);

    setNumbers(shuffledNumbers);
    setSortedNumbers(sorted);
  }, [levelRanges, getNumbersCount]);

  
  const getOrderInstruction = useCallback((level) => {
    return level % 2 === 0
      ? "📈 ORDENA DE MENOR A MAYOR 📈"
      : "📉 ORDENA DE MAYOR A MENOR 📉";
  }, []);

  
  const checkOrder = useCallback((currentNumbers) => {
    const isEvenLevel = (currentLevel + 1) % 2 === 0;
    const correctOrder = [...sortedNumbers].sort((a, b) =>
      isEvenLevel ? a - b : b - a
    );
    return JSON.stringify(currentNumbers) === JSON.stringify(correctOrder);
  }, [currentLevel, sortedNumbers]);

 
  const handleStartGame = (level) => {
    setCurrentLevel(level - 1);
    setCurrentActivity(0);
    setPoints(0);
    setAttempts(0);
    setLevelResults([]);
    setGameState('game');
  };

 
  const handleActivityComplete = useCallback(() => {
    const baseScore = 50 * (currentLevel + 1);
    const penaltyForAttempts = attempts * 5;
    const activityScore = Math.max(0, baseScore - penaltyForAttempts);
    
    const newPoints = points + activityScore;
    const newActivity = currentActivity + 1;
    
   
    const result = {
      activity: currentActivity + 1,
      score: activityScore,
      attempts: attempts,
      level: currentLevel + 1
    };
    
    setLevelResults(prev => [...prev, result]);
    setPoints(newPoints);
    setAttempts(0);
    setTargetNumbers([]);
    
       
    setFeedbackSuccess(true);
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      if (newActivity < 5) {
        setCurrentActivity(newActivity);
        generateNumbers(currentLevel);
      } else {  
        unlockLevel('ordenamiento', currentLevel + 2);
        setShowLevelUp(true);
      }
    }, 1500);
  }, [currentLevel, currentActivity, points, attempts, levelRanges.length, generateNumbers, unlockLevel, getNumbersCount]);

  
  const handleFailedAttempt = useCallback(() => {
    setAttempts(prev => prev + 1);
    
   
    setFeedbackSuccess(false);
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      setTargetNumbers([]);
      generateNumbers(currentLevel);
    }, 1500);
  }, [currentLevel, generateNumbers]);

 
  const handleDrop = useCallback((draggedNumber) => {
    const newTargetNumbers = [...targetNumbers, draggedNumber];
    setTargetNumbers(newTargetNumbers);

    if (newTargetNumbers.length === numbersCount) {
      if (checkOrder(newTargetNumbers)) {
        handleActivityComplete();
      } else {
        handleFailedAttempt();
      }
    }
  }, [targetNumbers, numbersCount, checkOrder, handleActivityComplete, handleFailedAttempt]);

 
  const handleRemove = useCallback((numberToRemove) => {
    setTargetNumbers(prev => prev.filter(num => num !== numberToRemove));
  }, []);

 
  useEffect(() => {
    if (gameState === 'game') {
      generateNumbers(currentLevel);
      setTargetNumbers([]);
    }
  }, [gameState, currentLevel, generateNumbers]);

 
  const NumberBox = React.memo(({ number, isInTarget = false, onDrop, onRemove }) => {
    const handleDragStart = (e) => {
      e.dataTransfer.setData('text/plain', number.toString());
      e.dataTransfer.effectAllowed = 'move';
    };

    const handleClick = () => {
      if (isInTarget) {
        onRemove(number);
      } else if (targetNumbers.length < numbersCount) {
        onDrop(number);
      }
    };

    return (
      <div
        className={`number-box ${isInTarget ? 'in-target' : ''}`}
        draggable={!isInTarget}
        onDragStart={handleDragStart}
        onClick={handleClick}
        data-value={number}
      >
        {number}
      </div>
    );
  });

 
  const DropTarget = () => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    };

    const handleDragEnter = (e) => {
      e.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
     
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setIsDragOver(false);
      }
    };

    const handleDropEvent = (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const draggedNumber = parseInt(e.dataTransfer.getData('text/plain'));
      if (!targetNumbers.includes(draggedNumber) && targetNumbers.length < numbersCount) {
        handleDrop(draggedNumber);
      }
    };

    return (
      <div
        className={`drop-target ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDropEvent}
        ref={targetAreaRef}
      >
        {targetNumbers.length === 0 ? (
          <p className="drop-hint">
            Arrastra los números aquí o haz clic en ellos
          </p>
        ) : (
          targetNumbers.map((number, index) => (
            <NumberBox 
              key={`${number}-${index}`} 
              number={number} 
              isInTarget 
              onRemove={handleRemove}
            />
          ))
        )}
      </div>
    );
  };

  const availableNumbers = numbers.filter(num => !targetNumbers.includes(num));
  const progressPercentage = ((currentLevel + 1) / levelRanges.length) * 100;

     
  const handleNextLevel = () => {
    setShowLevelUp(false);
    if (currentLevel >= levelRanges.length - 1) {
      setShowGameComplete(true);
    } else {
      setCurrentLevel(prev => prev + 1);
      setCurrentActivity(0);
      setLevelResults([]);
      generateNumbers(currentLevel + 1);
    }
  };

     
  const handleBackToLevels = () => {
    setGameState('level-select');
    setShowLevelUp(false);
  };

     
  const handleContinueFeedback = () => {
    setShowFeedback(false);
  };

   
  const handleRetryFeedback = () => {
    setShowFeedback(false);
    setTargetNumbers([]);
    generateNumbers(currentLevel);
  };

  return (
    <div className="game-container">
      {gameState === 'start' && <StartScreen onStart={() => setGameState('level-select')} />}
      
      {gameState === 'level-select' && <LevelSelectScreen onSelectLevel={handleStartGame} />}
      
      {gameState === 'game' && (
        <div className="game-content">
          {/* Header */}
          <header className="game-header">
            <h1 className="game-title">
              🎯 Ordenamiento Numérico
            </h1>
            <p className="game-instruction">
              {getOrderInstruction(currentLevel + 1)}
            </p>
          </header>

          {/* Status */}
          <div className="game-status">
            <div className="status-item">
              <div className="status-icon">📊</div>
              <div className="status-label">Nivel</div>
              <div className="status-value">{currentLevel + 1}</div>
            </div>
            <div className="status-item">
              <div className="status-icon">🎯</div>
              <div className="status-label">Actividad</div>
              <div className="status-value">{currentActivity + 1}/5</div>
            </div>
            <div className="status-item">
              <div className="status-icon">🎯</div>
              <div className="status-label">Intentos</div>
              <div className="status-value">{attempts}</div>
            </div>
            <div className="status-item">
              <div className="status-icon">⭐</div>
              <div className="status-label">Puntuación</div>
              <div className="status-value">{points}</div>
            </div>
          </div>

          <div className="progress-container">
            <div 
              className="progress-bar"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {!showGameComplete ? (
            <div className="game-play-area">
              <DropTarget />
              
              <div className="numbers-section">
                <h3 className="numbers-title">Números a ordenar:</h3>
                <div className="numbers-container">
                  {availableNumbers.map(number => (
                    <NumberBox 
                      key={number} 
                      number={number} 
                      onDrop={handleDrop}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="game-complete">
              <h2 className="complete-title">
                🎉 ¡Juego Completado!
              </h2>
              <p className="complete-message">
                Has completado todos los niveles
              </p>
              <p className="final-score">
                Puntuación final: {points}
              </p>
              <button 
                className="restart-button"
                onClick={() => window.location.reload()}
              >
                🔄 Jugar de nuevo
              </button>
            </div>
          )}
        </div>
      )}

      {showLevelUp && !showGameComplete && (
        <LevelResultsModal
          level={currentLevel + 1}
          results={levelResults}
          totalScore={points}
          onNextLevel={handleNextLevel}
          onBackToLevels={handleBackToLevels}
        />
      )}

      {showFeedback && (
        <ActivityFeedbackModal
          isSuccess={feedbackSuccess}
          onContinue={handleContinueFeedback}
          onRetry={handleRetryFeedback}
        />
      )}
    </div>
  );
};

export default JuegoOrdenamiento;