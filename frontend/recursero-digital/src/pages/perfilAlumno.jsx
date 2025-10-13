import React, { useMemo, useState, useEffect } from "react";
import "./../styles/perfilAlumno.css";

export default function PerfilAlumno() {
  // Lista de avatares disponibles
  const avatarOptions = [
    { id: 1, emoji: "🚀", name: "Explorador Espacial", color: "#7c3aed" },
    { id: 2, emoji: "🦖", name: "Dino Matemático", color: "#10b981" },
    { id: 3, emoji: "🧙‍♂️", name: "Mago de Números", color: "#f59e0b" },
    { id: 4, emoji: "🦸‍♀️", name: "Súper Estudiante", color: "#ef4444" }
  ];

  // Estado para el avatar seleccionado
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    const saved = localStorage.getItem("selectedAvatar");
    return saved ? JSON.parse(saved) : avatarOptions[0];
  });

  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  // Guardar avatar seleccionado en localStorage
  useEffect(() => {
    localStorage.setItem("selectedAvatar", JSON.stringify(selectedAvatar));
  }, [selectedAvatar]);

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setShowAvatarSelector(false);
  };

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
        stars: 3,
      },
      escritura: {
        highScore: 9800,
        gamesPlayed: 35,
        accuracy: "88%",
        stars: 3,
      },
    },
  };

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <div className="avatar-section">
          <div className="avatar-frame" onClick={() => setShowAvatarSelector(true)}>
            <div 
              className="perfil-avatar emoji-avatar" 
              style={{ backgroundColor: selectedAvatar.color }}
            >
              {selectedAvatar.emoji}
            </div>
            <div className="avatar-change-hint">✨ </div>
          </div>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">🌟 ¡Hola {studentData.name}! 🌟</h1>
          <p className="profile-title">🚀 Explorador Galáctico de Matemáticas 🚀</p>
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

      {/* Selector de Avatares */}
      {showAvatarSelector && (
        <div className="avatar-selector-overlay" onClick={() => setShowAvatarSelector(false)}>
          <div className="avatar-selector-modal" onClick={(e) => e.stopPropagation()}>
            <h3>🎨 ¡Elige tu Avatar! 🎨</h3>
            <div className="avatar-options">
              {avatarOptions.map((avatar) => (
                <div 
                  key={avatar.id}
                  className={`avatar-option ${selectedAvatar.id === avatar.id ? 'selected' : ''}`}
                  onClick={() => handleAvatarSelect(avatar)}
                  style={{ backgroundColor: avatar.color }}
                >
                  <div className="avatar-emoji">{avatar.emoji}</div>
                  <span className="avatar-name">{avatar.name}</span>
                </div>
              ))}
            </div>
            <button 
              className="close-selector-btn" 
              onClick={() => setShowAvatarSelector(false)}
            >
              ✨ Listo ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
