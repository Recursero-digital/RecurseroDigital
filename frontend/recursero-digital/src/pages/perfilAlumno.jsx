import React from "react";
import "./../styles/perfilAlumno.css";
import avatar from "./../assets/logo.png"; // Asegúrate de tener un avatar en esta ruta

export default function PerfilAlumno() {
  // Datos de ejemplo
  const studentData = {
    name: "Malena Barán",
    stats: {
      ordenamiento: {
        highScore: 12500,
        gamesPlayed: 42,
        accuracy: "92%",
      },
      escritura: {
        highScore: 9800,
        gamesPlayed: 35,
        accuracy: "88%",
      },
    },
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <div className="perfil-header">
          <img src={avatar} alt="Avatar" className="perfil-avatar" />
          <h1 className="perfil-name">{studentData.name}</h1>
          <p className="perfil-email">{studentData.email}</p>
        </div>
        <div className="perfil-stats">
          <h2 className="stats-title">Estadísticas de Juegos</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-card-title">Juego de Ordenamiento</h3>
              <p className="stat-item">
                Puntaje Más Alto:{" "}
                <span>{studentData.stats.ordenamiento.highScore}</span>
              </p>
              <p className="stat-item">
                Partidas Jugadas:{" "}
                <span>{studentData.stats.ordenamiento.gamesPlayed}</span>
              </p>
              <p className="stat-item">
                Precisión:{" "}
                <span>{studentData.stats.ordenamiento.accuracy}</span>
              </p>
            </div>
            <div className="stat-card">
              <h3 className="stat-card-title">Juego de Escritura</h3>
              <p className="stat-item">
                Puntaje Más Alto:{" "}
                <span>{studentData.stats.escritura.highScore}</span>
              </p>
              <p className="stat-item">
                Partidas Jugadas:{" "}
                <span>{studentData.stats.escritura.gamesPlayed}</span>
              </p>
              <p className="stat-item">
                Precisión: <span>{studentData.stats.escritura.accuracy}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
