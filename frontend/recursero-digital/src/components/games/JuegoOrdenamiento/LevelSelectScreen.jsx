import React from 'react';
import { useUserProgress } from '../../../hooks/useUserProgress';

const LevelSelectScreen = ({ onSelectLevel, onBackToGames }) => {
    const { isLevelUnlocked, getMaxUnlockedLevel } = useUserProgress();
    
    const levels = [
        { number: 1, range: "25 - 250", difficulty: "Fácil", color: "level-1" },
        { number: 2, range: "251 - 500", difficulty: "Intermedio", color: "level-2" },
        { number: 3, range: "501 - 750", difficulty: "Avanzado", color: "level-3" },
        { number: 4, range: "751 - 1000", difficulty: "Experto", color: "level-4" },
        { number: 5, range: "1001 - 1500", difficulty: "Maestro", color: "level-5" }
    ];

    const maxUnlocked = getMaxUnlockedLevel('ordenamiento');

    return (
        <div className="level-select-screen">
            <div className="header-controls">
                <button 
                    className="btn-back-to-levels"
                    onClick={onBackToGames}
                    title="Volver a juegos"
                >
                    ← Juegos
                </button>
            </div>
            <h1>Selecciona un Nivel</h1>
            <p>Elige el rango de números que quieres ordenar</p>
            <div className="level-grid">
                {levels.map(level => {
                    const isUnlocked = isLevelUnlocked('ordenamiento', level.number);
                    const isLocked = !isUnlocked;
                    
                    return (
                        <button
                            key={level.number}
                            className={`level-btn ${level.color} ${isLocked ? 'locked' : ''}`}
                            onClick={() => isUnlocked && onSelectLevel(level.number)}
                            disabled={isLocked}
                        >
                            <div className="level-number">
                                {isLocked ? '🔒' : ''} Nivel {level.number}
                            </div>
                            <div className="level-range">{level.range}</div>
                            <div className="level-difficulty">{level.difficulty}</div>
                            {isLocked && (
                                <div className="locked-message">
                                    Completa el nivel {level.number - 1} para desbloquear
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default LevelSelectScreen;
