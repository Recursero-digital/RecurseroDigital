import React from 'react';
import { levelConfig, operationConfig, getTotalActivities } from './utils';
import { useUserProgress } from '../../../hooks/useUserProgress';

const LevelSelectScreen = ({ operation, onSelectLevel, onBackToStart }) => {
  const operationInfo = operationConfig[operation];
  const { isLevelUnlocked } = useUserProgress();

  return (
    <div className="level-select-screen">
      {/* Header Controls */}
      <div className="header-controls">
        <button 
          onClick={onBackToStart}
          className="btn-back-to-levels"
          title="Volver a operaciones"
        >
          ← Operaciones
        </button>
      </div>
      
      {/* Title */}
      <h1 className="level-select-title">
        {operationInfo.icon} {operationInfo.name}
      </h1>
      <p className="level-select-subtitle">
        Cada nivel tiene 5 ejercicios para resolver.
      </p>

      {/* Level Cards */}
      <div className="level-grid">
        {levelConfig.map((level, index) => {
          const levelKey = `nivel${index + 1}`;
          const totalQuestions = getTotalActivities(operation, levelKey);
          // Usar gameId específico por operación: 'calculos-suma', 'calculos-resta', 'calculos-multiplicacion'
          const gameId = `calculos-${operation}`;
          const isUnlocked = isLevelUnlocked(gameId, index + 1);
          const isLocked = !isUnlocked;
          
          return (
            <button 
              key={levelKey}
              className={`level-btn level-${index + 1} ${isLocked ? 'locked' : ''}`}
              onClick={() => isUnlocked && onSelectLevel(levelKey)}
              disabled={isLocked}
            >
              <div className="level-number">
                {isLocked ? '🔒' : ''} Nivel {level.number}
              </div>
              <div className="level-range">
                {level.description}
              </div>
              <div className="level-difficulty">
                {totalQuestions} ejercicios
              </div>
              <div className="level-points">
                {50 * (index + 1)} puntos base
              </div>
              {isLocked && index > 0 && (
                <div className="locked-message">
                  Completa el nivel {index} para desbloquear
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Tips Section */}
      <div className="level-tips">
        <h3>💡 Consejos para {operationInfo.name}</h3>
        <div className="tips-grid">
          {operation === 'suma' && (
            <>
              <div className="tip-item">
                <div className="tip-icon">🎯</div>
                <div className="tip-title">Nivel 1</div>
                <div className="tip-text">Operaciones básicas con números pequeños</div>
              </div>
              <div className="tip-item">
                <div className="tip-icon">⚡</div>
                <div className="tip-title">Nivel 2</div>
                <div className="tip-text">Números más grandes. Usa estrategias de suma mental</div>
              </div>
              <div className="tip-item">
                <div className="tip-icon">🚀</div>
                <div className="tip-title">Nivel 3</div>
                <div className="tip-text">Números de miles. ¡El desafío máximo!</div>
              </div>
            </>
          )}
          
          {operation === 'resta' && (
            <>
              <div className="tip-item">
                <div className="tip-icon">🎯</div>
                <div className="tip-title">Nivel 1</div>
                <div className="tip-text">Visualiza los números y restalos!</div>
              </div>
              <div className="tip-item">
                <div className="tip-icon">⚡</div>
                <div className="tip-title">Nivel 2</div>
                <div className="tip-text">Centenas</div>
              </div>
              <div className="tip-item">
                <div className="tip-icon">🚀</div>
                <div className="tip-title">Nivel 3</div>
                <div className="tip-text">Miles</div>
              </div>
            </>
          )}
          
          {operation === 'multiplicacion' && (
            <>
              <div className="tip-item">
                <div className="tip-icon">🎯</div>
                <div className="tip-title">Nivel 1</div>
                <div className="tip-text">Tablas básicas. Recuerda las multiplicaciones fundamentales</div>
              </div>
              <div className="tip-item">
                <div className="tip-icon">⚡</div>
                <div className="tip-title">Nivel 2</div>
                <div className="tip-text">Encuentra el factor. Divide el resultado por el número conocido</div>
              </div>
              <div className="tip-item">
                <div className="tip-icon">🚀</div>
                <div className="tip-title">Nivel 3</div>
                <div className="tip-text">Por 10, 100, 1000. ¡Solo agrega ceros!</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LevelSelectScreen;