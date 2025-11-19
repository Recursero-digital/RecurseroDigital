import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { /* getCourseStatistics, */ MOCK_DATA } from '../../../infrastructure/adapters/api/teacherApi';
import '../../styles/components/DashboardStats.css';

const DashboardStats = ({ courseId }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setStats({
            courseStats: {
              totalStudents: 25,
              activeStudents: 22,
              averageCourseScore: 84,
              totalGamesPlayed: 450,
              gamesDistribution: {
                ordenamiento: 150,
                escritura: 120,
                descomposicion: 100,
                escala: 80
              },
              averageTimePerGame: 180,
              difficultyAnalysis: {
                ordenamiento: { easy: 80, medium: 60, hard: 40 },
                escritura: { easy: 85, medium: 70, hard: 45 },
                descomposicion: { easy: 90, medium: 75, hard: 50 },
                escala: { easy: 75, medium: 55, hard: 35 }
              }
            }
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading stats:', error);
        setError('Error al cargar las estadísticas');
        setLoading(false);
      }
    };

    if (courseId) {
      fetchStats();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="dashboard-stats loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-stats error">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div className="dashboard-stats">No hay datos disponibles</div>;
  }

  const { courseStats } = stats;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 80) return '#10b981'; 
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="dashboard-stats">
      <div className="stats-header">
        <h2>📊 Estadísticas del Curso</h2>
        <p>Resumen general del desempeño de tus estudiantes</p>
      </div>

      <div className="main-metrics">
        <div className="metric-card students">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>{courseStats.totalStudents}</h3>
            <p>Estudiantes totales</p>
          </div>
        </div>

        <div className="metric-card average-score">
          <div className="metric-icon">⭐</div>
          <div className="metric-content">
            <h3>{courseStats.averageCourseScore}%</h3>
            <p>Promedio del curso</p>
            <span className="metric-detail">
              {courseStats.totalGamesPlayed} juegos completados
            </span>
          </div>
        </div>

        <div className="metric-card time">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <h3>{formatTime(courseStats.averageTimePerGame)}</h3>
            <p>Tiempo promedio por juego</p>
            <span className="metric-detail">
              Basado en {courseStats.totalGamesPlayed} sesiones
            </span>
          </div>
        </div>
      </div>

      <div className="games-distribution">
        <h3>🎮 Distribución de Juegos Jugados</h3>
        <div className="games-chart">
          {Object.entries(courseStats.gamesDistribution).map(([game, count]) => {
            const percentage = (count / courseStats.totalGamesPlayed) * 100;
            const gameNames = {
              ordenamiento: 'Ordenamiento',
              escritura: 'Escritura',
              descomposicion: 'Descomposición',
              escala: 'Escala Numérica'
            };

            return (
              <div key={game} className="game-bar">
                <div className="game-info">
                  <span className="game-name">{gameNames[game]}</span>
                  <span className="game-count">{count} juegos</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${game}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="percentage">{percentage.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="difficulty-analysis">
        <h3>📈 Análisis de Dificultad por Juego</h3>
        <div className="difficulty-grid">
          {Object.entries(courseStats.difficultyAnalysis).map(([game, levels]) => {
            const gameNames = {
              ordenamiento: 'Ordenamiento',
              escritura: 'Escritura', 
              descomposicion: 'Descomposición',
              escala: 'Escala Numérica'
            };

            return (
              <div key={game} className="difficulty-card">
                <h4>{gameNames[game]}</h4>
                <div className="difficulty-levels">
                  <div className="level easy">
                    <span>Fácil</span>
                    <div className="level-bar">
                      <div 
                        className="level-fill" 
                        style={{ 
                          width: `${levels.easy}%`,
                          backgroundColor: getPercentageColor(levels.easy)
                        }}
                      ></div>
                    </div>
                    <span>{levels.easy}%</span>
                  </div>
                  <div className="level medium">
                    <span>Medio</span>
                    <div className="level-bar">
                      <div 
                        className="level-fill" 
                        style={{ 
                          width: `${levels.medium}%`,
                          backgroundColor: getPercentageColor(levels.medium)
                        }}
                      ></div>
                    </div>
                    <span>{levels.medium}%</span>
                  </div>
                  <div className="level hard">
                    <span>Difícil</span>
                    <div className="level-bar">
                      <div 
                        className="level-fill" 
                        style={{ 
                          width: `${levels.hard}%`,
                          backgroundColor: getPercentageColor(levels.hard)
                        }}
                      ></div>
                    </div>
                    <span>{levels.hard}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>


      <div className="quick-actions">
        
        
          <button className="action-btn export">
            📥 Exportar Datos
          </button>
          <button className="action-btn report" onClick={() => navigate('/docente/reportes')}>
            📋 Generar Reporte
          </button>
     
      </div>
    </div>
  );
};

export default DashboardStats;