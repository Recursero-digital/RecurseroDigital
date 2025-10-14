import React, { useState, useEffect } from 'react';
import useGameStatistics from '../hooks/useGameStatistics';
import './StudentProgressDashboard.css';

const StudentProgressDashboard = ({ studentId }) => {
  const [progress, setProgress] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const { getStudentProgress, isLoading, error } = useGameStatistics();

  useEffect(() => {
    if (studentId) {
      loadProgress();
    }
  }, [studentId]);

  const loadProgress = async () => {
    try {
      const data = await getStudentProgress(studentId);
      setProgress(data);
    } catch (err) {
      console.error('Error loading progress:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGameName = (gameId) => {
    const gameNames = {
      'game-escritura': 'Juego de Escritura',
      'game-ordenamiento': 'Juego de Ordenamiento',
      'game-descomposicion': 'Juego de Descomposición'
    };
    return gameNames[gameId] || gameId;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return '#22c55e'; // Verde
    if (percentage >= 60) return '#f59e0b'; // Amarillo
    if (percentage >= 40) return '#f97316'; // Naranja
    return '#ef4444'; // Rojo
  };

  if (isLoading) {
    return (
      <div className="progress-dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando progreso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="progress-dashboard">
        <div className="error">
          <p>Error al cargar el progreso: {error}</p>
          <button onClick={loadProgress} className="retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="progress-dashboard">
        <div className="no-data">
          <p>No se encontró información de progreso</p>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-dashboard">
      <div className="dashboard-header">
        <h2>📊 Mi Progreso</h2>
        <div className="total-stats">
          <div className="stat-card">
            <span className="stat-label">Total de Puntos</span>
            <span className="stat-value">{progress.totalPoints}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Juegos Jugados</span>
            <span className="stat-value">{progress.totalGamesPlayed}</span>
          </div>
        </div>
      </div>

      <div className="games-grid">
        {progress.gameProgress.map((gameProgress) => (
          <div key={gameProgress.gameId} className="game-card">
            <div className="game-header">
              <h3>{getGameName(gameProgress.gameId)}</h3>
              <div className="game-level">
                Nivel {gameProgress.maxUnlockedLevel}
              </div>
            </div>

            <div className="game-stats">
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${Math.min(gameProgress.completionRate, 100)}%`,
                      backgroundColor: getProgressColor(gameProgress.completionRate)
                    }}
                  ></div>
                </div>
                <span className="progress-text">
                  {Math.round(gameProgress.completionRate)}% completado
                </span>
              </div>

              <div className="stats-row">
                <div className="stat">
                  <span className="stat-label">Puntos</span>
                  <span className="stat-value">{gameProgress.totalPoints}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Precisión</span>
                  <span className="stat-value">{Math.round(gameProgress.averageAccuracy)}%</span>
                </div>
              </div>

              {gameProgress.lastActivity && (
                <div className="last-activity">
                  <span className="activity-label">Última actividad:</span>
                  <span className="activity-date">
                    {formatDate(gameProgress.lastActivity)}
                  </span>
                </div>
              )}

              <button 
                className="details-btn"
                onClick={() => setSelectedGame(
                  selectedGame === gameProgress.gameId ? null : gameProgress.gameId
                )}
              >
                {selectedGame === gameProgress.gameId ? 'Ocultar' : 'Ver'} Detalles
              </button>
            </div>

            {selectedGame === gameProgress.gameId && (
              <div className="game-details">
                <h4>Historial de Actividades</h4>
                <div className="activities-list">
                  {gameProgress.statistics.slice(0, 5).map((stat, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-info">
                        <span className="activity-level">
                          Nivel {stat.level} - Actividad {stat.activity}
                        </span>
                        <span className="activity-date">
                          {formatDate(stat.createdAt)}
                        </span>
                      </div>
                      <div className="activity-stats">
                        <span className="activity-points">{stat.points} pts</span>
                        <span className="activity-attempts">{stat.attempts} intentos</span>
                        {stat.isCompleted && <span className="completed-badge">✓</span>}
                      </div>
                    </div>
                  ))}
                  {gameProgress.statistics.length > 5 && (
                    <div className="more-activities">
                      +{gameProgress.statistics.length - 5} actividades más
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {progress.gameProgress.length === 0 && (
        <div className="no-games">
          <p>🎮 ¡Comienza a jugar para ver tu progreso aquí!</p>
        </div>
      )}
    </div>
  );
};

export default StudentProgressDashboard;
