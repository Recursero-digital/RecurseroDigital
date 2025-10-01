import React from 'react';
import { useNavigate } from 'react-router-dom';
import { levelRanges } from './utils';
import { useUserProgress } from '../../../hooks/useUserProgress';

const LevelSelectScreen = ({ onSelectLevel }) => {
    const navigate = useNavigate();
    const { isLevelUnlocked } = useUserProgress();
    
    const levels = [
        { difficulty: "Fácil", color: "level-1" },
        { difficulty: "Intermedio", color: "level-2" },
        { difficulty: "Avanzado", color: "level-3" },
        { difficulty: "Experto", color: "level-4" },
        { difficulty: "Maestro", color: "level-5" }
    ];

    return (
        <div className="chalkboard">
            <div className="header-controls">
                <button 
                    className="btn-back-to-levels"
                    onClick={() => navigate('/alumno')}
                    title="Volver a juegos"
                >
                    ← Juegos
                </button>
            </div>
            <h2>Elige un nivel</h2>
            <div className="level-grid">
                {levelRanges.map((range, index) => {
                    const levelNumber = index + 1;
                    const isUnlocked = isLevelUnlocked('escritura', levelNumber);
                    const isLocked = !isUnlocked;
                    
                    return (
                        <button 
                            key={index} 
                            onClick={() => isUnlocked && onSelectLevel(levelNumber)} 
                            className={`btn level-btn level-${levelNumber} ${isLocked ? 'locked' : ''}`}
                            disabled={isLocked}
                        >
                            <div className="level-number">
                                {isLocked ? '🔒' : ''} Nivel {levelNumber}
                            </div>
                            <div className="level-range">({range.min} - {range.max})</div>
                            <div className="level-difficulty">{levels[index].difficulty}</div>
                            {isLocked && (
                                <div className="locked-message">
                                    Completa el nivel {levelNumber - 1} para desbloquear
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