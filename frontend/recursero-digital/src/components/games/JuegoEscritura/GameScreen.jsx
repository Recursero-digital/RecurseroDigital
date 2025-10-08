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
        <div className="game-content">
            <div className="game-header">
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
                        onClick={() => navigate('/alumno/juegos')}
                        title="Volver al dashboard"
                    >
                        🏠
                    </button>
                </div>
                
                <h1 className="game-title">🔤 Juego de Escritura 🔤</h1>
                <p className="game-instruction">Arrastra cada número a su palabra correspondiente</p>
            </div>

            <div className="game-status">
                <div className="status-item">
                    <span className="status-icon">🏆</span>
                    <span className="status-label">Nivel</span>
                    <span className="status-value">{level}</span>
                </div>
                <div className="status-item">
                    <span className="status-icon">📝</span>
                    <span className="status-label">Actividad</span>
                    <span className="status-value">{activity}/3</span>
                </div>
                <div className="status-item">
                    <span className="status-icon">⭐</span>
                    <span className="status-label">Puntos</span>
                    <span className="status-value">{points}</span>
                </div>
                <div className="status-item">
                    <span className="status-icon">🎯</span>
                    <span className="status-label">Intentos</span>
                    <span className="status-value">{attempts}</span>
                </div>
            </div>

            <div className="game-play-area">
                <div className="numbers-section">
                    <h3 className="numbers-title">Números Disponibles</h3>
                    <div className="numbers-container">
                        {numbers.map((number, index) => {
                            if (usedNumbers.has(number)) {
                                return null;
                            }
                            
                            return (
                                <div 
                                    key={`number-${index}`}
                                    className="number-box"
                                    draggable
                                    onDragStart={(e) => onDragStart(e, number)}
                                >
                                    {number}
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className="words-section">
                    <h3 className="words-title">Palabras a Completar</h3>
                    <div className="words-container">
                        {wordPairs.map((wordPair, index) => (
                            <div key={`word-${index}`} className="word-pair">
                                <div 
                                    className={`drop-zone ${dragAnswers[index] ? 'filled' : 'empty'}`}
                                    onDragOver={onDragOver}
                                    onDrop={(e) => onDrop(e, index)}
                                    onClick={() => dragAnswers[index] && onRemoveNumber(index)}
                                    title={dragAnswers[index] ? "Hacé clic para quitar" : "Arrastra un número aquí"}
                                >
                                    {dragAnswers[index] ? dragAnswers[index] : ''}
                                </div>
                                <div className="word-text">{wordPair.word}</div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="button-group">
                    <button 
                        onClick={onCheck} 
                        className="btn"
                        disabled={Object.keys(dragAnswers).length !== wordPairs.length}
                    >
                        Verificar Respuestas
                    </button>
                </div>

                {/* Pista Permanente */}
                <div className="permanent-hint">
                    <div className="permanent-hint-header">
                        <span className="hint-icon">💡</span>
                        <h4>Pista: Correspondencias</h4>
                    </div>
                    <div className="permanent-hint-content">
                        <p className="hint-text">Estos son los números y sus palabras correctas:</p>
                        <div className="hint-numbers">
                            {wordPairs.map((pair, index) => (
                                <React.Fragment key={index}>
                                    {index > 0 && <span className="hint-label">•</span>}
                                    <span className="hint-number">{pair.number}</span>
                                    <span className="hint-arrow">→</span>
                                    <span className="hint-word">{pair.word}</span>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameScreen;