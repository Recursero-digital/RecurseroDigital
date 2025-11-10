import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProgress } from '../../../hooks/useUserProgress';

const LevelSelectScreen = ({ levels, onSelectLevel }) => {
    const navigate = useNavigate();
    const { isLevelUnlocked } = useUserProgress();

    const levelIcons = ['🔍', '📈', '🎯'];
    const levelColors = ['blue', 'green', 'purple'];

    return (
        <div className="game-scene bg-space-ui">
            <div className="landscape"></div>
            <div className="lighthouse"></div>
            <div className="house"></div>
            
            <div className="header-controls header-controls-level-select">
                <button 
                    className="btn-back-to-levels"
                    onClick={() => navigate('/alumno')}
                    title="Volver a juegos"
                >
                    ← Juegos
                </button>
            </div>

            <div className="level-select-content">
                <h2 className="game-title">
                    ⚡ Elige tu Aventura ⚡
                </h2>
                
                <p className="level-select-subtitle">
                    Selecciona el nivel de dificultad
                </p>
            </div>

            <div className="level-grid">
                {levels.map((level, index) => {
                    const levelNumber = index + 1;
                    const isUnlocked = isLevelUnlocked('escala', levelNumber);
                    const isLocked = !isUnlocked;
                    const color = levelColors[index];
                    
                    return (
                        <div 
                            key={index}
                            className={`level-card ${color} ${isLocked ? 'locked' : ''} slide-in`}
                            onClick={() => isUnlocked && onSelectLevel(index)}
                            style={{ animationDelay: `${index * 0.2}s` }}
                        >
                            {isLocked && (
                                <div className="level-lock-indicator">
                                    🔒
                                </div>
                            )}
                            
                            <div className={`level-icon ${color} ${isLocked ? '' : 'float'}`}>
                                {levelIcons[index]}
                            </div>
                            
                            <h3 className="level-title">
                                Nivel {levelNumber}
                            </h3>
                            
                            <h4 className={`level-card-title ${color}`}>
                                {level.name}
                            </h4>
                            
                            <p className="level-description">
                                {level.description}
                            </p>
                            
                            <p className="level-range">
                                Números del {level.range}
                            </p>
                            
                            <div className={`difficulty-indicator ${color}`}>
                                <div className={`difficulty-operation ${color}`}>
                                    {level.operation > 1 ? `±${level.operation}` : '±1'}
                                </div>
                                <div className={`difficulty-description ${color}`}>
                                    Saltos de {level.operation}
                                </div>
                            </div>
                            
                            <button 
                                className={`btn-level-explore ${isLocked ? 'disabled' : 'enabled bg-space-gradient'}`}
                                disabled={isLocked}
                            >
                                {isLocked ? '🔒 Bloqueado' : '🚀 ¡Explorar!'}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="game-instructions-card">
                <h3 className="instructions-card-title">
                    💡 Instrucciones de Juego
                </h3>
                <div className="instructions-card-content">
                    <p>
                        🎯 <strong>Objetivo:</strong> Completa cada nivel con al menos 60% de aciertos para desbloquear el siguiente.
                    </p>
                    <p>
                        📝 <strong>Modalidades:</strong> Encontrar números anteriores/posteriores y completar secuencias numéricas.
                    </p>
                    <p>
                        ⭐ <strong>Puntuación:</strong> ¡Cada nivel tiene 5 actividades emocionantes!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LevelSelectScreen;