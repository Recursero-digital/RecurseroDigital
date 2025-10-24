import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';

const GameScreen = ({ 
  currentLevel, 
  currentActivity, 
  totalActivities,
  attempts,
  points,
  numbers,
  sortedNumbers,
  targetNumbers,
  numbersCount,
  onDrop,
  onRemove,
  onBackToLevels,
  onBackToGames,
  generateHint,
  showPermanentHint,
  levelRanges
}) => {

  const [shouldAnimateHint, setShouldAnimateHint] = useState(false);
  const previousShowHint = useRef(showPermanentHint);

  // Detectar cuando la pista aparece por primera vez
  useEffect(() => {
    if (showPermanentHint && !previousShowHint.current) {
      setShouldAnimateHint(true);
      // Remover la clase después de la animación
      const timer = setTimeout(() => {
        setShouldAnimateHint(false);
      }, 500);
      return () => clearTimeout(timer);
    }
    previousShowHint.current = showPermanentHint;
  }, [showPermanentHint]);

  const getOrderInstruction = useCallback((level) => {
    return level % 2 === 0 ? "📈 ORDENA DE MENOR A MAYOR 📈": "📉 ORDENA DE MAYOR A MENOR 📉";
  }, []);

  // Components
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

  const DropTarget = React.memo(() => {
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
        onDrop(draggedNumber);
      }
    };

    return (
      <div
        className={`drop-target ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDropEvent}
      >
        {targetNumbers.length === 0 ? (
          <p className="drop-hint">Arrastra los números aquí o haz clic en ellos</p>
        ) : (
          targetNumbers.map((number, index) => (
            <NumberBox 
              key={`${number}-${index}`} 
              number={number} 
              isInTarget 
              onRemove={onRemove}
            />
          ))
        )}
      </div>
    );
  });

  const PermanentHint = React.memo(() => (
    <div className={`permanent-hint ${shouldAnimateHint ? 'hint-animate' : ''}`}>
      <div className="permanent-hint-header">
        <span className="hint-icon">💡</span>
        <h4>¡Pista especial!</h4>
      </div>
      <div className="permanent-hint-content">
        <p className="hint-text">{generateHint()}</p>
        <div className="hint-numbers">
          <span className="hint-label">Números:</span>
          {numbers.map(num => (
            <span key={num} className="hint-number">{num}</span>
          ))}
        </div>
      </div>
    </div>
  ));

  // Computed values
  const availableNumbers = numbers.filter(num => !targetNumbers.includes(num));
  // La barra de progreso: 0% nivel 1, 33% nivel 2, 66% nivel 3
  const progressPercentage = currentLevel === 0 ? 0 : currentLevel === 1 ? 33 : 66;

  return (
    <div className="juego-ordenamiento-content">
      <header className="game-header">
        <div className="header-controls">
          <div className="buttons-group">
            <button 
              className="btn-back-to-levels"
              onClick={onBackToLevels}
              title="Volver a niveles"
            >
              ← Niveles
            </button>
            <button 
              className="btn-back-to-dashboard"
              onClick={onBackToGames}
              title="Volver a juegos"
            >
              ← Juegos
            </button>
          </div>
          
          <div className="game-status">
            <div className="status-item">
              <div className="status-icon">📊</div>
              <div className="status-label">Nivel</div>
              <div className="status-value">{currentLevel + 1}</div>
            </div>
            <div className="status-item">
              <div className="status-icon">🎯</div>
              <div className="status-label">Actividad</div>
              <div className="status-value">{currentActivity + 1}/{totalActivities}</div>
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
        </div>
        <h1 className="game-title">🎯 Ordenamiento Numérico</h1>
        <p className="game-instruction">
          {getOrderInstruction(currentLevel + 1)}
        </p>
      </header>

      <div className="progress-container">
        <div 
          className="progress-bar"
          data-progress={progressPercentage}
          style={{'--progress-width': `${progressPercentage}%`}}
        />
      </div>

      <div className="game-play-area">
        <DropTarget />
        
        <div className="numbers-section">
          <h3 className="numbers-title">Números a ordenar:</h3>
          <div className="numbers-container">
            {availableNumbers.map(number => (
              <NumberBox 
                key={number} 
                number={number} 
                onDrop={onDrop}
              />
            ))}
          </div>
        </div>
      </div>

      {showPermanentHint && <PermanentHint />}
    </div>
  );
};

export default GameScreen;