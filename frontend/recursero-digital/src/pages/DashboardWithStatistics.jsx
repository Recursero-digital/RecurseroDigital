import React, { useState } from 'react';
import StudentProgressDashboard from '../components/StudentProgressDashboard';
import useStudentId from '../hooks/useStudentId';
import GameWithStatistics from '../components/games/GameWithStatistics';

/**
 * Dashboard actualizado que incluye el sistema de estadísticas
 * Este es un ejemplo de cómo integrar las estadísticas en el dashboard existente
 */
function DashboardWithStatistics() {
  const { studentId, isLoading: studentIdLoading } = useStudentId();
  const [activeTab, setActiveTab] = useState('progress'); // 'progress' o 'games'

  if (studentIdLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-with-statistics">
      <header className="dashboard-header">
        <h1 className="dashboard-title">
          🎓 Mi Panel de Estudiante
        </h1>
        <div className="student-info">
          <span className="student-id">ID: {studentId}</span>
        </div>
      </header>

      <nav className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          📊 Mi Progreso
        </button>
        <button 
          className={`tab ${activeTab === 'games' ? 'active' : ''}`}
          onClick={() => setActiveTab('games')}
        >
          🎮 Jugar
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'progress' && (
          <div className="progress-section">
            <StudentProgressDashboard studentId={studentId} />
          </div>
        )}

        {activeTab === 'games' && (
          <div className="games-section">
            <div className="games-grid">
              <div className="game-card">
                <h3>Juego de Escritura</h3>
                <p>Practica escribiendo números correctamente</p>
                <GameWithStatistics 
                  gameType="game-escritura" 
                  gameName="Juego de Escritura" 
                />
              </div>

              <div className="game-card">
                <h3>Juego de Ordenamiento</h3>
                <p>Ordena números de menor a mayor</p>
                <GameWithStatistics 
                  gameType="game-ordenamiento" 
                  gameName="Juego de Ordenamiento" 
                />
              </div>

              <div className="game-card">
                <h3>Juego de Descomposición</h3>
                <p>Descompone números en unidades, decenas y centenas</p>
                <GameWithStatistics 
                  gameType="game-descomposicion" 
                  gameName="Juego de Descomposición" 
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .dashboard-with-statistics {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .dashboard-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          color: white;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .dashboard-title {
          color: white;
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 10px 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .student-info {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
        }

        .student-id {
          background: rgba(255, 255, 255, 0.2);
          padding: 5px 15px;
          border-radius: 20px;
          font-weight: 600;
        }

        .dashboard-tabs {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 30px;
        }

        .tab {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .tab:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .tab.active {
          background: white;
          color: #667eea;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .progress-section {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
        }

        .games-section {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
        }

        .games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .game-card {
          background: white;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          transition: transform 0.2s ease;
        }

        .game-card:hover {
          transform: translateY(-5px);
        }

        .game-card h3 {
          color: #1f2937;
          font-size: 1.3rem;
          margin: 0 0 10px 0;
        }

        .game-card p {
          color: #6b7280;
          margin: 0 0 15px 0;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .dashboard-with-statistics {
            padding: 15px;
          }

          .dashboard-title {
            font-size: 2rem;
          }

          .dashboard-tabs {
            flex-direction: column;
            align-items: center;
          }

          .tab {
            width: 100%;
            max-width: 300px;
          }

          .games-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default DashboardWithStatistics;
