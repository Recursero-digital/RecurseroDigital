import React, { useState } from 'react';
import DashboardStats from '../../components/teacher/DashboardStats';
import '../../styles/pages/teacherGames.css';

const TeacherGames = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentView, setCurrentView] = useState('overview');
  // const [selectedCourse] = useState('1');

  const games = [
    {
      id: 'ordenamiento',
      name: 'Ordenamiento de Números',
      description: 'Los estudiantes aprenden a ordenar números de menor a mayor',
      icon: '🔢',
      totalPlays: 150,
      averageScore: 84,
      averageTime: '2m 30s',
      difficulty: 'Medio',
      status: 'active'
    },
    {
      id: 'escritura',
      name: 'Escritura de Números',
      description: 'Convertir números a palabras y viceversa',
      icon: '✍️',
      totalPlays: 120,
      averageScore: 78,
      averageTime: '3m 15s',
      difficulty: 'Medio',
      status: 'active'
    },
    {
      id: 'descomposicion',
      name: 'Descomposición y Composición',
      description: 'Descomponer números en unidades, decenas y centenas',
      icon: '🧮',
      totalPlays: 100,
      averageScore: 88,
      averageTime: '2m 45s',
      difficulty: 'Fácil',
      status: 'active'
    },
    {
      id: 'escala',
      name: 'Escala Numérica',
      description: 'Encontrar números anteriores y posteriores',
      icon: '📏',
      totalPlays: 80,
      averageScore: 76,
      averageTime: '2m 10s',
      difficulty: 'Fácil',
      status: 'active'
    }
  ];

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    setCurrentView('game-detail');
  };

  const handleBackToOverview = () => {
    setSelectedGame(null);
    setCurrentView('overview');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'fácil': return 'easy';
      case 'medio': return 'medium';
      case 'difícil': return 'hard';
      default: return 'medium';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 65) return 'average';
    return 'needs-improvement';
  };

  return (
    <div className="teacher-games">
      <div className="games-header">
        <h1>🎮 Gestión de Juegos</h1>
        <p>Supervisa el progreso y configura las actividades de aprendizaje</p>
        
        <div className="view-controls">
          <button 
            className={`view-btn ${currentView === 'overview' ? 'active' : ''}`}
            onClick={() => setCurrentView('overview')}
          >
            🎯 Vista General
          </button>
          <button 
            className={`view-btn ${currentView === 'config' ? 'active' : ''}`}
            onClick={() => setCurrentView('config')}
          >
            ⚙️ Configuración
          </button>
        </div>
      </div>

      <div className="games-content">
        {currentView === 'overview' && (
          <div className="games-overview">
            {/* Estadísticas generales */}
            <div className="overview-stats">
              <div className="stat-card total-games">
                <div className="stat-icon">🎮</div>
                <div className="stat-content">
                  <h3>{games.reduce((acc, game) => acc + game.totalPlays, 0)}</h3>
                  <p>Juegos Totales Jugados</p>
                </div>
              </div>
              <div className="stat-card avg-score">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <h3>{Math.round(games.reduce((acc, game) => acc + game.averageScore, 0) / games.length)}%</h3>
                  <p>Promedio General</p>
                </div>
              </div>
              <div className="stat-card active-games">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>{games.filter(game => game.status === 'active').length}</h3>
                  <p>Juegos Activos</p>
                </div>
              </div>
            </div>

            {/* Lista de juegos */}
            <div className="games-grid">
              {games.map((game) => (
                <div 
                  key={game.id} 
                  className="game-card"
                  onClick={() => handleSelectGame(game)}
                >
                  <div className="game-header">
                    <div className="game-icon">{game.icon}</div>
                    <div className="game-info">
                      <h3>{game.name}</h3>
                      <p>{game.description}</p>
                    </div>
                    <div className={`game-status ${game.status}`}>
                      {game.status === 'active' ? 'Activo' : 'Inactivo'}
                    </div>
                  </div>

                  <div className="game-stats">
                    <div className="stat-row">
                      <div className="stat">
                        <span className="stat-label">Jugadas</span>
                        <span className="stat-value">{game.totalPlays}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Promedio</span>
                        <span className={`stat-value score-${getScoreColor(game.averageScore)}`}>
                          {game.averageScore}%
                        </span>
                      </div>
                    </div>
                    <div className="stat-row">
                      <div className="stat">
                        <span className="stat-label">Tiempo Promedio</span>
                        <span className="stat-value">{game.averageTime}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Dificultad</span>
                        <span className={`stat-value difficulty-${getDifficultyColor(game.difficulty)}`}>
                          {game.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="game-actions">
                    <button className="action-btn view-details">
                      📊 Ver Detalles
                    </button>
                    <button className="action-btn configure">
                      ⚙️ Configurar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'game-detail' && selectedGame && (
          <div className="game-detail">
            <div className="detail-header">
              <button className="back-btn" onClick={handleBackToOverview}>
                ← Volver a Juegos
              </button>
              <div className="game-title">
                <span className="game-icon-large">{selectedGame.icon}</span>
                <div>
                  <h2>{selectedGame.name}</h2>
                  <p>{selectedGame.description}</p>
                </div>
              </div>
            </div>
            <div className="game-reports-placeholder">
              <div className="report-section">
                <h3>📈 Estadísticas Detalladas</h3>
                <div className="detailed-stats">
                  <div className="detail-card">
                    <h4>Rendimiento General</h4>
                    <div className="metrics">
                      <div className="metric">
                        <span>Total de Jugadas:</span>
                        <span>{selectedGame.totalPlays}</span>
                      </div>
                      <div className="metric">
                        <span>Promedio de Puntuación:</span>
                        <span>{selectedGame.averageScore}%</span>
                      </div>
                      <div className="metric">
                        <span>Tiempo Promedio:</span>
                        <span>{selectedGame.averageTime}</span>
                      </div>
                      <div className="metric">
                        <span>Nivel de Dificultad:</span>
                        <span>{selectedGame.difficulty}</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-card">
                    <h4>Tendencias</h4>
                    <div className="trend-info">
                      <p>📈 Mejora promedio: +5% en las últimas 2 semanas</p>
                      <p>⏱️ Tiempo de resolución: -15% más rápido</p>
                      <p>🎯 Tasa de completación: 92%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="report-section">
                <h3>👥 Rendimiento por Estudiante</h3>
                <div className="student-performance">
                  <p>Esta sección mostrará el rendimiento individual de cada estudiante en este juego específico.</p>
                  <button className="btn-placeholder">Ver Reporte Completo →</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'config' && (
          <div className="games-config">
            <h3>⚙️ Configuración de Actividades</h3>
            <div className="config-placeholder">
              <div className="config-section">
                <h4>🎯 Configuración General</h4>
                <div className="config-options">
                  <div className="config-item">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Permitir reintentos ilimitados
                    </label>
                  </div>
                  <div className="config-item">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Mostrar pistas automáticas
                    </label>
                  </div>
                  <div className="config-item">
                    <label>
                      <input type="checkbox" />
                      Modo de práctica sin puntuación
                    </label>
                  </div>
                </div>
              </div>

              <div className="config-section">
                <h4>⏱️ Configuración de Tiempo</h4>
                <div className="config-options">
                  <div className="config-item">
                    <label>
                      Tiempo límite por juego:
                      <select>
                        <option>Sin límite</option>
                        <option>2 minutos</option>
                        <option>5 minutos</option>
                        <option>10 minutos</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>

              <div className="config-section">
                <h4>🎮 Juegos Habilitados</h4>
                <div className="games-toggle">
                  {games.map((game) => (
                    <div key={game.id} className="game-toggle">
                      <label>
                        <input 
                          type="checkbox" 
                          defaultChecked={game.status === 'active'}
                        />
                        <span className="game-icon">{game.icon}</span>
                        {game.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="config-actions">
                <button className="btn-save">💾 Guardar Configuración</button>
                <button className="btn-reset">🔄 Restaurar Predeterminados</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherGames;