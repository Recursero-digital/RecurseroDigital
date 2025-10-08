import React, { useMemo } from "react";
import "./../styles/perfilAlumno.css";
import avatar from "./../assets/logo1.png";

export default function PerfilAlumno() {
  const userNameOrEmail = useMemo(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedName = localStorage.getItem("userName");
    if (storedName) return storedName.toUpperCase();
    if (storedEmail) {
      const nameFromEmail = storedEmail.split("@")[0];
      return nameFromEmail.toUpperCase();
    }
    return "ALUMNO";
  }, []);

  const studentData = {
    name: userNameOrEmail,
    level: 15,
    totalScore: 22300,
    stats: {
      ordenamiento: {
        highScore: 12500,
        gamesPlayed: 42,
        accuracy: "92%",
        stars: 3
      },
      escritura: {
        highScore: 9800,
        gamesPlayed: 35,
        accuracy: "88%",
        stars: 3
      },
    },
  };

  return (
    <div className="perfil-container">
      {/* Header del perfil con avatar y info básica */}
      <div className="perfil-header">
        <div className="avatar-section">
          <div className="avatar-frame">
            <img src={avatar} alt="Avatar" className="perfil-avatar" />
            <div className="level-badge">Nivel {studentData.level}</div>
          </div>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">¡Hola {studentData.name}! 👋</h1>
          <p className="profile-title">🧮 Matemático Explorador 🧮</p>
          <div className="achievements">
            <div className="achievement-item">
              🏆 <span>{studentData.totalScore}</span> puntos totales
            </div>
            <div className="achievement-item">
              ⭐ <span>{studentData.stats.ordenamiento.stars + studentData.stats.escritura.stars}</span> estrellas ganadas
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas de juegos */}
      <div className="games-stats">
        <h2 className="stats-title">🎮 Mis Aventuras Matemáticas 🎮</h2>
        
        <div className="games-grid">
          {/* Juego de Ordenamiento */}
          <div className="game-card ordenamiento">
            <div className="game-icon">🔢</div>
            <h3 className="game-title">Ordenamiento de Números</h3>
            <div className="stars">
              {[...Array(3)].map((_, i) => (
                <span key={i} className={`star ${i < studentData.stats.ordenamiento.stars ? 'filled' : ''}`}>⭐</span>
              ))}
            </div>
            <div className="game-stats">
              <div className="stat-row">
                <span className="stat-emoji">🎯</span>
                <span>Mejor puntaje: {studentData.stats.ordenamiento.highScore}</span>
              </div>
              <div className="stat-row">
                <span className="stat-emoji">🎲</span>
                <span>Partidas jugadas: {studentData.stats.ordenamiento.gamesPlayed}</span>
              </div>
              <div className="stat-row">
                <span className="stat-emoji">✨</span>
                <span>Precisión: {studentData.stats.ordenamiento.accuracy}</span>
              </div>
            </div>
          </div>

          {/* Juego de Escritura */}
          <div className="game-card escritura">
            <div className="game-icon">✍️</div>
            <h3 className="game-title">Números en Palabras</h3>
            <div className="stars">
              {[...Array(3)].map((_, i) => (
                <span key={i} className={`star ${i < studentData.stats.escritura.stars ? 'filled' : ''}`}>⭐</span>
              ))}
            </div>
            <div className="game-stats">
              <div className="stat-row">
                <span className="stat-emoji">🎯</span>
                <span>Mejor puntaje: {studentData.stats.escritura.highScore}</span>
              </div>
              <div className="stat-row">
                <span className="stat-emoji">🎲</span>
                <span>Partidas jugadas: {studentData.stats.escritura.gamesPlayed}</span>
              </div>
              <div className="stat-row">
                <span className="stat-emoji">✨</span>
                <span>Precisión: {studentData.stats.escritura.accuracy}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de motivación */}
 
      </div>
    </div>
  );
}
