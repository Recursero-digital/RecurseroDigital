import React from 'react';
import { useUserProgress } from '../../../hooks/useUserProgress';
import { getLevelConfig } from './utils';

const LevelSelectScreen = ({ onSelectLevel, onBackToGames }) => {
    const { isLevelUnlocked } = useUserProgress();
    
    const levels = [
        { 
          number: 1, 
          ...getLevelConfig(1),
          difficulty: "Fácil", 
          color: "level-1" 
        },
        { 
          number: 2, 
          ...getLevelConfig(2),
          difficulty: "Intermedio", 
          color: "level-2" 
        },
        { 
          number: 3, 
          ...getLevelConfig(3),
          difficulty: "Avanzado", 
          color: "level-3" 
        }
    ];

    return (
        <div className="level-select-screen">
                <div className="header-controls">
                    <div className="buttons-group">
                        <button 
                            className="btn-back-to-levels"
                            onClick={onBackToGames}
                            title="Volver a juegos"
                        >
                            ← Juegos
                        </button>
                    </div>
                </div>
                <div className="level-select-content">
                    <h1 className="level-select-title">Selecciona un Nivel</h1>
                    <p className="level-select-subtitle">Ordená los números de menor a mayor en cada actividad</p>
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
                                {isLocked ? '🔒' : ''} {level.name}
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
        </div>
    );
};export default LevelSelectScreen;
