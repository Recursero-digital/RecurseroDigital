import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./JuegoOrdenamiento.css";

const JuegoOrdenamiento = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState({
    currentLevel: 1,
    attempts: 0,
    score: 0,
  });
  
  const [numbers, setNumbers] = useState([]);
  const [sortedNumbers, setSortedNumbers] = useState([]);
  const [showGameComplete, setShowGameComplete] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [targetNumbers, setTargetNumbers] = useState([]);

  const levelRanges = useMemo(() => [
    { min: 1, max: 100 },
    { min: 101, max: 500 },
    { min: 501, max: 1000 },
    { min: 1001, max: 2000 },
    { min: 2001, max: 4000 },
  ], []);

  const numbersCount = 6;
  const targetAreaRef = useRef(null);

  // Generar números únicos para el nivel actual
  const generateNumbers = useCallback((level) => {
    const { min, max } = levelRanges[level - 1];
    const generatedNumbers = new Set();

    while (generatedNumbers.size < numbersCount) {
      const newNum = Math.floor(Math.random() * (max - min + 1)) + min;
      generatedNumbers.add(newNum);
    }

    const numbersArray = Array.from(generatedNumbers);
    const shuffledNumbers = [...numbersArray].sort(() => Math.random() - 0.5);
    const sorted = [...numbersArray].sort((a, b) => b - a);

    setNumbers(shuffledNumbers);
    setSortedNumbers(sorted);
  }, [levelRanges]);

  // Obtener instrucción de ordenamiento para el nivel
  const getOrderInstruction = useCallback((level) => {
    return level % 2 === 0
      ? "Ordena los números de menor a mayor"
      : "Ordena los números de mayor a menor";
  }, []);

  // Verificar si el ordenamiento es correcto
  const checkOrder = useCallback((currentNumbers) => {
    const isEvenLevel = gameState.currentLevel % 2 === 0;
    const correctOrder = [...sortedNumbers].sort((a, b) =>
      isEvenLevel ? a - b : b - a
    );
    return JSON.stringify(currentNumbers) === JSON.stringify(correctOrder);
  }, [gameState.currentLevel, sortedNumbers]);

  // Manejar completar nivel
  const handleLevelComplete = useCallback(() => {
    const newScore = Math.max(0, 
      gameState.score + 100 * gameState.currentLevel - gameState.attempts * 5
    );

    setShowLevelUp(true);

    setTimeout(() => {
      if (gameState.currentLevel >= levelRanges.length) {
        setShowGameComplete(true);
      } else {
        setGameState(prev => ({
          ...prev,
          currentLevel: prev.currentLevel + 1,
          attempts: 0,
          score: newScore,
        }));
        generateNumbers(gameState.currentLevel + 1);
        setTargetNumbers([]);
        setShowLevelUp(false);
      }
    }, 2000);
  }, [gameState, levelRanges.length, generateNumbers]);

  // Manejar intento fallido
  const handleFailedAttempt = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      attempts: prev.attempts + 1,
    }));
    
    setTimeout(() => {
      setTargetNumbers([]);
      generateNumbers(gameState.currentLevel);
    }, 500);
  }, [gameState.currentLevel, generateNumbers]);

  // Manejar drop de número
  const handleDrop = useCallback((draggedNumber) => {
    const newTargetNumbers = [...targetNumbers, draggedNumber];
    setTargetNumbers(newTargetNumbers);

    if (newTargetNumbers.length === numbersCount) {
      if (checkOrder(newTargetNumbers)) {
        handleLevelComplete();
      } else {
        handleFailedAttempt();
      }
    }
  }, [targetNumbers, numbersCount, checkOrder, handleLevelComplete, handleFailedAttempt]);

  // Manejar remoción de número
  const handleRemove = useCallback((numberToRemove) => {
    setTargetNumbers(prev => prev.filter(num => num !== numberToRemove));
  }, []);

  // Inicializar nivel
  useEffect(() => {
    generateNumbers(gameState.currentLevel);
    setTargetNumbers([]);
  }, [gameState.currentLevel, generateNumbers]);

  // Componente NumberBox con drag and drop nativo
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

  // Área de destino con drag and drop nativo
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
      // Solo cambiar si realmente salimos del contenedor
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
  const progressPercentage = (gameState.currentLevel / levelRanges.length) * 100;

  return (
    <div className="game-container">
      <div className="game-content">
        
        {/* Header */}
        <header className="game-header">
          <div className="header-top">
            <h1 className="game-title">
              🎯 Ordenamiento Numérico
            </h1>
            <button 
              className="btn-volver-dashboard"
              onClick={() => navigate('/alumno/juegos')}
              title="Volver al Dashboard"
            >
              🏠 Volver al Dashboard
            </button>
          </div>
          <p className="game-instruction">
            {getOrderInstruction(gameState.currentLevel)}
          </p>
        </header>

        {/* Status */}
        <div className="game-status">
          <div className="status-item">
            <div className="status-icon">📊</div>
            <div className="status-label">Nivel</div>
            <div className="status-value">{gameState.currentLevel}</div>
          </div>
          <div className="status-item">
            <div className="status-icon">🎯</div>
            <div className="status-label">Intentos</div>
            <div className="status-value">{gameState.attempts}</div>
          </div>
          <div className="status-item">
            <div className="status-icon">⭐</div>
            <div className="status-label">Puntuación</div>
            <div className="status-value">{gameState.score}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div 
            className="progress-bar"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {!showGameComplete ? (
          <div className="game-play-area">
            {/* Drop Target */}
            <DropTarget />
            
            {/* Available Numbers */}
            <div className="numbers-section">
              <h3 className="numbers-title">Números disponibles:</h3>
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
              Puntuación final: {gameState.score}
            </p>
            <button 
              className="restart-button"
              onClick={() => window.location.reload()}
            >
              🔄 Jugar de nuevo
            </button>
          </div>
        )}

        {showLevelUp && !showGameComplete && (
          <div className="level-up-overlay">
            <div className="level-up-modal">
              <h2 className="level-up-title">
                🎉 ¡Felicitaciones!
              </h2>
              <p className="level-up-message">
                Has completado el nivel {gameState.currentLevel}
              </p>
              <p className="level-up-message">
                ¡Prepárate para el nivel {gameState.currentLevel + 1}!
              </p>
              <p className="level-up-instruction">
                {getOrderInstruction(gameState.currentLevel + 1)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JuegoOrdenamiento;