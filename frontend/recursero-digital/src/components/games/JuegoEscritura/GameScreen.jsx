import React from 'react';

const GameScreen = ({ 
    level, 
    activity, 
    points,
    attempts,
    numbers,
    wordPairs,
    dragAnswers,
    usedNumbers,
    onDragStart,
    onDragOver,
    onDrop,
    onRemoveNumber,
    onCheck, 
    onClear 
}) => {
    return (
        <div className="chalkboard">
            <div className="game-hud">
                <div>Nivel: <span>{level}</span> | Actividad: <span>{activity}</span>/5</div>
                <div>Puntos: <span>{points}</span> | Intentos: <span>{attempts}</span></div>
            </div>
        
            <div className="paper-note" data-aos="zoom-in">
                <div className="activity-title">Números para Arrastrar</div>
                <div className="instruction-text">Arrastra cada número a su palabra correspondiente</div>
            </div>
            
            {/* Números para arrastrar */}
            <div className="numbers-container">
                {numbers.map((number, index) => {
                    // Solo mostrar números que no están siendo usados
                    if (usedNumbers.has(number)) {
                        return null;
                    }
                    
                    return (
                        <div 
                            key={`number-${index}`}
                            className={`number-box color-${index % 7}`}
                            draggable
                            onDragStart={(e) => onDragStart(e, number)}
                        >
                            {number}
                        </div>
                    );
                })}
            </div>
            
            {/* Palabras con campos de arrastre */}
            <div className="words-container">
                {wordPairs.map((wordPair, index) => (
                    <div key={`word-${index}`} className="word-pair">
                        <div 
                            className={`drop-zone ${dragAnswers[index] ? 'filled' : 'empty'}`}
                            onDragOver={onDragOver}
                            onDrop={(e) => onDrop(e, index)}
                            onClick={() => dragAnswers[index] && onRemoveNumber(index)}
                            title={dragAnswers[index] ? "Haz clic para remover" : "Arrastra un número aquí"}
                        >
                            {dragAnswers[index] ? dragAnswers[index] : ''}
                        </div>
                        <div className="word-text">{wordPair.word}</div>
                    </div>
                ))}
            </div>
            
            <div className="button-group">
                <button 
                    onClick={onCheck} 
                    className="btn btn-verify"
                    disabled={Object.keys(dragAnswers).length !== wordPairs.length}
                >
                    Enviar respuestas
                </button>
                <button 
                    onClick={onClear} 
                    className="btn btn-clear"
                    disabled={Object.keys(dragAnswers).length === 0}
                >
                    Limpiar
                </button>
            </div>
        </div>
    );
};

export default GameScreen;