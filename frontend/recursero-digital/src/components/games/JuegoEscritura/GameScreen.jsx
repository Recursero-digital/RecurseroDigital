import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    onBackToLevels
}) => {
    const navigate = useNavigate();
    return (
        <div className="chalkboard">
            <div className="header-controls">
                <button 
                    className="btn-back-to-levels"
                    onClick={onBackToLevels}
                    title="Volver a niveles"
                >
                    ← Niveles
                </button>
                <button 
                    className="btn-back-to-dashboard"
                    onClick={() => navigate('/alumno')}
                    title="Volver al dashboard"
                >
                    🏠
                </button>
            </div>
            <div className="game-hud">
                <div>Nivel: <span>{level}</span> | Actividad: <span>{activity}</span>/3</div>
                <div>Puntos: <span>{points}</span> | Intentos: <span>{attempts}</span></div>
            </div>
        
            <div className="paper-note" data-aos="zoom-in">
                <div className="activity-title">Números para Arrastrar</div>
                <div className="instruction-text">Arrastra cada número a su palabra que corresponde</div>
            </div>
            

            <div className="numbers-container">
                {numbers.map((number, index) => {
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
            
            <div className="words-container">
                {wordPairs.map((wordPair, index) => (
                    <div key={`word-${index}`} className="word-pair">
                        <div 
                            className={`drop-zone ${dragAnswers[index] ? 'filled' : 'empty'}`}
                            onDragOver={onDragOver}
                            onDrop={(e) => onDrop(e, index)}
                            onClick={() => dragAnswers[index] && onRemoveNumber(index)}
                            title={dragAnswers[index] ? "Hacé clic para sacar " : "Arrastra un número aquí"}
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
            </div>

            {/* Sección de pista permanente */}
            <div className="hint-section">
                <div className="hint-header">
                    <span className="hint-icon">💡</span>
                    <span className="hint-title">Pista de números y palabras</span>
                </div>
                <div className="hint-content">
                    <div className="hint-pairs-list">
                        {wordPairs.map((pair, index) => (
                            <div key={index} className="hint-pair-item">
                                <span className="hint-number">{pair.number}</span>
                                <span className="hint-arrow">→</span>
                                <span className="hint-word">{pair.word}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameScreen;