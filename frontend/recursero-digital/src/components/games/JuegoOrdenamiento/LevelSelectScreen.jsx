import React from 'react';

const LevelSelectScreen = ({ onSelectLevel }) => {
    const levels = [
        { number: 1, range: "10 - 250", difficulty: "Fácil", color: "level-1" },
        { number: 2, range: "251 - 500", difficulty: "Intermedio", color: "level-2" },
        { number: 3, range: "501 - 750", difficulty: "Avanzado", color: "level-3" },
        { number: 4, range: "751 - 1000", difficulty: "Experto", color: "level-4" },
        { number: 5, range: "1001 - 1500", difficulty: "Maestro", color: "level-5" }
    ];

    return (
        <div className="level-select-screen">
            <h1>Selecciona un Nivel</h1>
            <p>Elige el rango de números que quieres ordenar</p>
            <div className="level-grid">
                {levels.map(level => (
                    <button
                        key={level.number}
                        className={`level-btn ${level.color}`}
                        onClick={() => onSelectLevel(level.number)}
                    >
                        <div className="level-number">Nivel {level.number}</div>
                        <div className="level-range">{level.range}</div>
                        <div className="level-difficulty">{level.difficulty}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LevelSelectScreen;
