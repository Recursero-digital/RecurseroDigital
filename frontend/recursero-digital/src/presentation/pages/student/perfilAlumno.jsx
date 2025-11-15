import React from "react";
import { useStudentProfile } from "../../hooks/useStudentProfile";
import "../../styles/pages/perfilAlumno.css";

/**
 * Componente de perfil del estudiante
 * 
 * TODO BACKEND: Una vez implementados los endpoints reales:
 * 1. Los datos vendrán automáticamente del backend vía useStudentProfile
 * 2. Verificar que la estructura de datos del backend coincida con la UI
 * 3. Ajustar manejo de estados de loading y error según necesidades
 */
export default function PerfilAlumno() {
  // TODO BACKEND: Este hook ya estará conectado al API real
  const { data: studentData, loading, error } = useStudentProfile();

  // TODO BACKEND: Personalizar mensajes según errores específicos del API
  if (loading) {
    return (
      <div className="perfil-container">
        <div className="perfil-header">
          <div className="loading-message">
            <h2> Cargando tu perfil...</h2>
            <p>Recopilando tus aventuras</p>
          </div>
        </div>
      </div>
    );
  }

  // TODO BACKEND: Personalizar manejo de errores según respuestas del API
  if (error) {
    return (
      <div className="perfil-container">
        <div className="perfil-header">
          <div className="error-message">
            <h2>😱 Oops! Algo salió mal</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Intentar nuevamente</button>
          </div>
        </div>
      </div>
    );
  }

  // TODO BACKEND: Verificar que studentData tenga la estructura esperada
  if (!studentData) {
    return (
      <div className="perfil-container">
        <div className="perfil-header">
          <div className="no-data-message">
            <h2>📊 No hay datos disponibles</h2>
            <p>No se pudieron cargar las estadísticas</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <div className="avatar-section">
          <div className="perfil-avatar emoji-avatar">
            🚀
          </div>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">¡Hola {studentData.name}!</h1>
          <p className="profile-title">🚀 Explorador de Matemáticas 🚀</p>
          <div className="achievements">
            <div className="achievement-item">
              🏆 <span>{studentData.totalScore}</span> puntos totales
            </div>
            <div className="achievement-item">
              ⭐{" "}
              <span>
                {studentData.stats.ordenamiento.stars +
                  studentData.stats.escritura.stars}
              </span>{" "}
              estrellas ganadas
            </div>
          </div>
        </div>
      </div>
      <div className="games-stats">
        <h2 className="stats-title">🎮 Mis Aventuras Matemáticas 🎮</h2>

      
        <div className="games-grid">
          <div className="card-game">
            <div className="game-icon">🔢</div>
            <h3 className="game-title">Ordenamiento de Números</h3>
            <div className="stars">
              {[...Array(3)].map((_, i) => (
                <span
                  key={i}
                  className={`star ${
                    i < studentData.stats.ordenamiento.stars ? "filled" : ""
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>
            <div className="game-stats">
              <div className="stat-row">
                <span className="stat-emoji">🎯</span>
                <span>
                  Mejor puntaje: {studentData.stats.ordenamiento.highScore}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-emoji">🎲</span>
                <span>
                  Partidas jugadas: {studentData.stats.ordenamiento.gamesPlayed}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-emoji">✨</span>
                <span>
                  Precisión: {studentData.stats.ordenamiento.accuracy}
                </span>
              </div>
            </div>
          </div>
          <div className="card-game">
            <div className="game-icon">✍️</div>
            <h3 className="game-title">Números en Palabras</h3>
            <div className="stars">
              {[...Array(3)].map((_, i) => (
                <span
                  key={i}
                  className={`star ${
                    i < studentData.stats.escritura.stars ? "filled" : ""
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>
            <div className="game-stats">
              <div className="stat-row">
                <span className="stat-emoji">🎯</span>
                <span>
                  Mejor puntaje: {studentData.stats.escritura.highScore}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-emoji">🎲</span>
                <span>
                  Partidas jugadas: {studentData.stats.escritura.gamesPlayed}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-emoji">✨</span>
                <span>Precisión: {studentData.stats.escritura.accuracy}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
