import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourseStatistics } from '../../../infrastructure/adapters/api/teacherApi';
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
        setError(null);
        console.log('Fetching statistics for courseId:', courseId);
        const data = await getCourseStatistics(courseId);
        console.log('Statistics data received:', data);
        setStats({
          courseStats: {
            totalStudents: data.totalStudents || 0,
            progressByGame: data.progressByGame || []
          }
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading stats:', error);
        console.error('Error details:', {
          message: error?.message,
          error: error?.error,
          response: error?.response
        });
        const errorMessage = error?.message || error?.error || 'Error al cargar las estadísticas';
        setError(errorMessage);
        setLoading(false);
      }
    };

    if (courseId) {
      fetchStats();
    } else {
      setError('No se ha seleccionado un curso');
      setLoading(false);
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
      </div>

      <div className="games-distribution">
        <h3>🎮 Progreso del Curso por Juego</h3>
        <div className="games-chart">
          {courseStats.progressByGame && courseStats.progressByGame.length > 0 ? (
            courseStats.progressByGame.map((gameProgress) => {
              const gameNames = {
                ordenamiento: 'Ordenamiento',
                escritura: 'Escritura',
                descomposicion: 'Descomposición',
                escala: 'Escala Numérica'
              };

              const gameName = gameNames[gameProgress.gameId] || gameProgress.gameId;
              const percentage = gameProgress.averageProgress || 0;

              return (
                <div key={gameProgress.gameId} className="game-bar">
                  <div className="game-info">
                    <span className="game-name">{gameName}</span>
                    <span className="game-count">
                      {gameProgress.studentsWithProgress || 0}/{gameProgress.totalStudents || 0} estudiantes
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${gameProgress.gameId}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="percentage">{percentage}%</span>
                </div>
              );
            })
          ) : (
            <div className="no-data">
              <p>No hay datos de progreso disponibles para este curso</p>
            </div>
          )}
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