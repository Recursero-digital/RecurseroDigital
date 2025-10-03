import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import "./JuegoOrdenamiento.css";
import StartScreen from './StartScreen';
import LevelSelectScreen from './LevelSelectScreen';
import LevelResultsModal from './LevelResultsModal';
import ActivityFeedbackModal from './ActivityFeedbackModal';
import { useUserProgress } from '../../../hooks/useUserProgress';
import useGameScoring from '../../../hooks/useGameScoring';

const JuegoOrdenamiento = () => {
  const navigate = useNavigate();
  const { unlockLevel } = useUserProgress();
  const { 
    points, 
    attempts, 
    incrementAttempts, 
    resetAttempts, 
    resetScoring, 
    completeActivity 
  } = useGameScoring();

  const [gameState, setGameState] = useState('start');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentActivity, setCurrentActivity] = useState(0);
  const [numbers, setNumbers] = useState([]);
  const [sortedNumbers, setSortedNumbers] = useState([]);
  const [showGameComplete, setShowGameComplete] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [targetNumbers, setTargetNumbers] = useState([]);
  const [levelResults, setLevelResults] = useState([]);
  const [showHintModal, setShowHintModal] = useState(false);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);

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
    setShowHintModal(false);
    setConsecutiveFailures(0);
  }, [resetScoring]);

  const handleBackToGames = useCallback(() => {
    navigate('/alumno/juegos', { replace: true });
  }, [navigate]);

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
    return level % 2 === 0 ? "📈 ORDENA DE MENOR A MAYOR 📈": "📉 ORDENA DE MAYOR A MENOR 📉";
 }, []);

  const generateHint = useCallback(() => {
    const isEvenLevel = (currentLevel + 1) % 2 === 0;
    const sortedArray = [...sortedNumbers].sort((a, b) => isEvenLevel ? a - b : b - a);
    
    const hints = [];
    
    if (isEvenLevel) {
      hints.push(`💡 Recuerda: Debes ordenar de MENOR a MAYOR`);
      hints.push(`🔢 El número más pequeño es: ${Math.min(...sortedNumbers)}`);
      hints.push(`🔢 El número más grande es: ${Math.max(...sortedNumbers)}`);
      hints.push(`➡️ Comienza colocando el número ${sortedArray[0]} primero`);
      hints.push(`🎯 El orden correcto empieza: ${sortedArray[0]}, ${sortedArray[1]}, ${sortedArray[2]}...`);
    } else {
      hints.push(`💡 Recuerda: Debes ordenar de MAYOR a MENOR`);
      hints.push(`🔢 El número más grande es: ${Math.max(...sortedNumbers)}`);
      hints.push(`🔢 El número más pequeño es: ${Math.min(...sortedNumbers)}`);
      hints.push(`➡️ Comienza colocando el número ${sortedArray[0]} primero`);
      hints.push(`🎯 El orden correcto empieza: ${sortedArray[0]}, ${sortedArray[1]}, ${sortedArray[2]}...`);
    }
    
    return hints[Math.floor(Math.random() * hints.length)];
  }, [currentLevel, sortedNumbers]);

  
  const checkOrder = useCallback((currentNumbers) => {
    const isEvenLevel = (currentLevel + 1) % 2 === 0;
    const correctOrder = [...sortedNumbers].sort((a, b) =>
      isEvenLevel ? a - b : b - a
    );
    return JSON.stringify(currentNumbers) === JSON.stringify(correctOrder);
  }, [currentLevel, sortedNumbers]);

 
  const handleStartGame = useCallback((level) => {
    setCurrentLevel(level - 1);
    setCurrentActivity(0);
    resetScoring();
    setLevelResults([]);
    setConsecutiveFailures(0); 
    setGameState('game');
  }, [resetScoring]);


 
  const handleActivityComplete = useCallback(() => {
    const activityScore = completeActivity(currentLevel);
    const newActivity = currentActivity + 1;
    
    setConsecutiveFailures(0);
    
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
    
    setTimeout(() => {
      setShowFeedback(false);
      if (newActivity < 3) {
        setCurrentActivity(newActivity);
        generateNumbers(currentLevel); 
        setTargetNumbers([]);
        setConsecutiveFailures(0); 
      } else {  
        unlockLevel('ordenamiento', currentLevel + 2);
        setShowLevelUp(true);
      }
    }, 1500);
  }, [currentLevel, currentActivity, completeActivity, generateNumbers, unlockLevel]);

  
  const handleFailedAttempt = useCallback(() => {
    const newConsecutiveFailures = consecutiveFailures + 1;
    setConsecutiveFailures(newConsecutiveFailures);
    incrementAttempts();
    
    if (newConsecutiveFailures >= 3) {
      setShowHintModal(true);
      setConsecutiveFailures(0); 
    } else {
      
      setFeedbackSuccess(false);
      setShowFeedback(true);
      
      setTimeout(() => {
        setShowFeedback(false);
        setTargetNumbers([]); 
      }, 1500);
    }
  }, [consecutiveFailures]);

 
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
      setConsecutiveFailures(0);
      setTimeout(() => {
        generateNumbers(currentLevel + 1);
      }, 100);
    }
  };

     
  const handleBackToLevels = useCallback(() => {
    setGameState('level-select');
  }, []);

     
  const handleBackToStart = useCallback(() => {
    resetGame();
    setGameState('start');
  }, [resetGame]);

  const handleCloseHint = useCallback(() => {
    setShowHintModal(false);
    setTargetNumbers([]);
  }, []);

     
  const handleContinueFeedback = () => {
    setShowFeedback(false);
  };

   
  const handleRetryFeedback = () => {
    setShowFeedback(false);
    setTargetNumbers([]);
  };

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
      
      {gameState === 'game' && (
        <div className="game-content">
          <header className="game-header">
            <div className="header-controls">
              <button 
                className="btn-back-to-levels"
                onClick={() => setGameState('level-select')}
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
            <h1 className="game-title">
              🎯 Ordenamiento Numérico
            </h1>
            <p className="game-instruction">
              {getOrderInstruction(currentLevel + 1)}
            </p>
          </header>
          <div className="game-status">
            <div className="status-item">
              <div className="status-icon">📊</div>
              <div className="status-label">Nivel</div>
              <div className="status-value">{currentLevel + 1}</div>
            </div>
            <div className="status-item">
              <div className="status-icon">🎯</div>
              <div className="status-label">Actividad</div>
              <div className="status-value">{currentActivity + 1}/3</div>
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
                onClick={handleBackToStart}
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

      {showHintModal && (
        <div className="hint-modal-overlay">
          <div className="hint-modal">
            <div className="hint-header">
              <h2>💡 ¡Pista Especial!</h2>
              <p>Lo intentaste 3 veces seguidas. ¡Te ayudamos un poco!</p>
            </div>
            
            <div className="hint-content">
              <div className="hint-message">
                {generateHint()}
              </div>
              
              <div className="hint-visual">
                <p><strong>Números actuales:</strong></p>
                <div className="numbers-preview">
                  {numbers.map(num => (
                    <span key={num} className="number-preview">{num}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="hint-actions">
              <button 
                className="hint-btn hint-btn-continue"
                onClick={handleCloseHint}
              >
                💪Intentar de nuevo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JuegoOrdenamiento;