import React from 'react';
import '../../styles/pages/adminStatistics.css';

export default function AdminStatistics() {
  return (
    <div className="admin-statistics">
      <div className="statistics-header">
        <h1>Estadísticas del Sistema</h1>
        <p>Análisis y reportes de actividad de TecnoMente</p>
      </div>

      <div className="stats-overview">
        <div className="stat-box">
          <h3>Usuarios Registrados</h3>
          <div className="stat-value">150</div>
          <div className="stat-trends positive">+12% este mes</div>
        </div>
        <div className="stat-box">
          <h3>Sesiones de Juego</h3>
          <div className="stat-value">2,340</div>
          <div className="stat-trends positive">+18% este mes</div>
        </div>
        <div className="stat-box">
          <h3>Tiempo Promedio</h3>
          <div className="stat-value">25 min</div>
          <div className="stat-trends neutral">Sin cambios</div>
        </div>
        <div className="stat-box">
          <h3>Puntuación Promedio</h3>
          <div className="stat-value">85%</div>
          <div className="stat-trends positive">+5% este mes</div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h3>Actividad Semanal</h3>
          <div className="chart-placeholder">
            <p>Gráfico de actividad semanal</p>
            <small>(Integración con librería de gráficos pendiente)</small>
          </div>
        </div>
        <div className="chart-container">
          <h3>Juegos Más Populares</h3>
          <div className="popular-games">
            <div className="game-stats">
              <span className="game-name">Ordenamiento</span>
              <span className="game-plays">1,200 partidas</span>
            </div>
            <div className="game-stats">
              <span className="game-name">Escritura</span>
              <span className="game-plays">980 partidas</span>
            </div>
            <div className="game-stats">
              <span className="game-name">Descomposición</span>
              <span className="game-plays">765 partidas</span>
            </div>
            <div className="game-stats ">
              <span className="game-name">Escala</span>
              <span className="game-plays">654 partidas</span>
            </div>
          </div>
        </div>
      </div>

      <div className="reports-section">
        <h3>Reportes Disponibles</h3>
        <div className="reports-grid">
          <div className="report-card">
            <h4>Reporte de Usuarios</h4>
            <p>Estadísticas detalladas de usuarios activos e inactivos</p>
            <button className="download-btn">Descargar PDF</button>
          </div>
          <div className="report-card">
            <h4>Reporte de Actividad</h4>
            <p>Análisis de sesiones de juego y tiempo de uso</p>
            <button className="download-btn">Descargar PDF</button>
          </div>
          <div className="report-card">
            <h4>Reporte de Progreso</h4>
            <p>Seguimiento del progreso académico de estudiantes</p>
            <button className="download-btn">Descargar PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}