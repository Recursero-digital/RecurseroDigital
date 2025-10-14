import React, { useState, useEffect } from 'react';
import useGameScoring from '../../hooks/useGameScoring';
import useStudentId from '../../hooks/useStudentId';

/**
 * Componente de ejemplo que muestra cómo integrar las estadísticas
 * en cualquier juego existente
 */
const GameWithStatistics = ({ gameType, gameName }) => {
  const { studentId } = useStudentId();
  const { 
    points, 
    attempts, 
    incrementAttempts, 
    resetAttempts, 
    resetScoring,
    completeActivity,
    startGameSession,
    endGameSession,
    sessionStartTime
  } = useGameScoring();

  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentActivity, setCurrentActivity] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameData, setGameData] = useState({
    correctAnswers: 0,
    totalQuestions: 0
  });

  // Iniciar sesión cuando el juego comience
  const startGame = () => {
    startGameSession();
    setIsGameActive(true);
    resetScoring();
    setGameData({ correctAnswers: 0, totalQuestions: 0 });
  };

  // Finalizar sesión cuando el juego termine
  const endGame = () => {
    endGameSession();
    setIsGameActive(false);
  };

  // Ejemplo de función para cuando el estudiante complete una actividad
  const handleActivityComplete = async (isCorrect, additionalData = {}) => {
    const newGameData = {
      ...gameData,
      correctAnswers: gameData.correctAnswers + (isCorrect ? 1 : 0),
      totalQuestions: gameData.totalQuestions + 1
    };
    setGameData(newGameData);

    try {
      // Completar actividad con estadísticas
      await completeActivity(
        currentLevel,           // Nivel (0-indexed)
        gameType,              // Tipo de juego
        currentActivity,       // Actividad
        currentLevel + 1,      // Nivel máximo desbloqueado
        {
          correctAnswers: newGameData.correctAnswers,
          totalQuestions: newGameData.totalQuestions,
          ...additionalData
        },
        studentId              // ID del estudiante para estadísticas
      );

      console.log('✅ Actividad completada y estadísticas guardadas');
      
      // Avanzar a la siguiente actividad o nivel
      setCurrentActivity(prev => prev + 1);
      
    } catch (error) {
      console.error('❌ Error al guardar estadísticas:', error);
    }
  };

  // Ejemplo de función para cuando el estudiante falle
  const handleAttempt = () => {
    incrementAttempts();
    console.log('Intento registrado');
  };

  // Ejemplo de función para completar un nivel
  const completeLevel = async () => {
    try {
      await completeActivity(
        currentLevel,
        gameType,
        currentActivity,
        currentLevel + 2, // Desbloquear siguiente nivel
        {
          correctAnswers: gameData.correctAnswers,
          totalQuestions: gameData.totalQuestions,
          levelCompleted: true
        },
        studentId
      );

      console.log('🎉 Nivel completado y estadísticas guardadas');
      setCurrentLevel(prev => prev + 1);
      setCurrentActivity(0);
      
    } catch (error) {
      console.error('❌ Error al completar nivel:', error);
    }
  };

  // Ejemplo de función para pausar el juego
  const pauseGame = () => {
    // Las estadísticas se guardan automáticamente cuando se completa una actividad
    console.log('Juego pausado');
  };

  return (
    <div className="game-with-statistics">
      <div className="game-header">
        <h2>{gameName}</h2>
        <div className="game-stats">
          <div className="stat">
            <span>Puntos: {points}</span>
          </div>
          <div className="stat">
            <span>Intentos: {attempts}</span>
          </div>
          <div className="stat">
            <span>Nivel: {currentLevel + 1}</span>
          </div>
          <div className="stat">
            <span>Actividad: {currentActivity + 1}</span>
          </div>
        </div>
      </div>

      <div className="game-content">
        {!isGameActive ? (
          <div className="start-screen">
            <button onClick={startGame} className="start-btn">
              Iniciar Juego
            </button>
          </div>
        ) : (
          <div className="game-active">
            <div className="session-info">
              {sessionStartTime && (
                <p>Sesión iniciada: {sessionStartTime.toLocaleTimeString()}</p>
              )}
            </div>

            <div className="game-progress">
              <div className="progress-stat">
                Correctas: {gameData.correctAnswers} / {gameData.totalQuestions}
              </div>
              <div className="progress-stat">
                Precisión: {gameData.totalQuestions > 0 
                  ? Math.round((gameData.correctAnswers / gameData.totalQuestions) * 100) 
                  : 0}%
              </div>
            </div>

            {/* Aquí iría el contenido específico del juego */}
            <div className="game-area">
              <p>Área del juego específico...</p>
              
              {/* Botones de ejemplo para demostrar la integración */}
              <div className="demo-buttons">
                <button 
                  onClick={() => handleActivityComplete(true, { questionType: 'multiple-choice' })}
                  className="demo-btn correct"
                >
                  Respuesta Correcta
                </button>
                
                <button 
                  onClick={() => handleActivityComplete(false, { questionType: 'drag-drop' })}
                  className="demo-btn incorrect"
                >
                  Respuesta Incorrecta
                </button>
                
                <button 
                  onClick={handleAttempt}
                  className="demo-btn attempt"
                >
                  Registrar Intento
                </button>
                
                <button 
                  onClick={completeLevel}
                  className="demo-btn level"
                >
                  Completar Nivel
                </button>
              </div>
            </div>

            <div className="game-controls">
              <button onClick={pauseGame} className="control-btn">
                Pausar
              </button>
              <button onClick={endGame} className="control-btn end">
                Terminar Juego
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .game-with-statistics {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Inter', sans-serif;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e5e7eb;
        }

        .game-header h2 {
          color: #1f2937;
          margin: 0;
        }

        .game-stats {
          display: flex;
          gap: 15px;
        }

        .stat {
          background: #f3f4f6;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #374151;
        }

        .start-screen {
          text-align: center;
          padding: 40px;
        }

        .start-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .start-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .game-active {
          background: #f9fafb;
          border-radius: 12px;
          padding: 20px;
        }

        .session-info {
          margin-bottom: 15px;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .game-progress {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          padding: 15px;
          background: white;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
        }

        .progress-stat {
          font-weight: 600;
          color: #1f2937;
        }

        .game-area {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          min-height: 200px;
        }

        .demo-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
        }

        .demo-btn {
          padding: 10px 15px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .demo-btn.correct {
          background: #d1fae5;
          color: #059669;
        }

        .demo-btn.incorrect {
          background: #fee2e2;
          color: #dc2626;
        }

        .demo-btn.attempt {
          background: #fef3c7;
          color: #d97706;
        }

        .demo-btn.level {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .demo-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .game-controls {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .control-btn {
          padding: 10px 20px;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .control-btn:hover {
          border-color: #d1d5db;
          background: #f9fafb;
        }

        .control-btn.end {
          border-color: #ef4444;
          color: #ef4444;
        }

        .control-btn.end:hover {
          background: #ef4444;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default GameWithStatistics;
