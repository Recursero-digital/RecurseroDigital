import React from 'react';
import { useNavigate } from 'react-router-dom';
import { generateHintExample } from './utils';

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
    
    // Generar ejemplo para la pista que NO esté en el ejercicio actual
    const allUsedNumbers = [...numbers]; // Todos los números del ejercicio actual
    const hintExample = generateHintExample(level - 1, allUsedNumbers);
    
    return (
        <div className="game-content">
            <div className="game-header">
                <div className="header-controls">
                    <div className="buttons-group">
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
                            ← Juegos
                        </button>
                    </div>
                    
                    <div className="game-status">
                        <div className="status-item">
                            <div className="status-icon">🏆</div>
                            <div className="status-label">Nivel</div>
                            <div className="status-value">{level}</div>
                        </div>
                        <div className="status-item">
                            <div className="status-icon">📝</div>
                            <div className="status-label">Actividad</div>
                            <div className="status-value">{activity}/5</div>
                        </div>
                        <div className="status-item">
                            <div className="status-icon">⭐</div>
                            <div className="status-label">Puntos</div>
                            <div className="status-value">{points}</div>
                        </div>
                        <div className="status-item">
                            <div className="status-icon">🎯</div>
                            <div className="status-label">Intentos</div>
                            <div className="status-value">{attempts}</div>
                        </div>
                    </div>
                </div>
                
                <h1 className="game-title">🔤 Juego de Escritura 🔤</h1>
                <p className="game-instruction">Arrastra cada número a su palabra correspondiente</p>
            </div>

            <div className="game-play-area">
                <div className="numbers-section">
                    <h3 className="numbers-title">Números Disponibles</h3>
                    <div className="escritura-numbers-container">
                        {numbers.map((number, index) => {
                            if (usedNumbers.has(number)) {
                                return null;
                            }
                            
                            return (
                                <div 
                                    key={`number-${index}`}
                                    className="escritura-number-box"
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
                        <h4>Ejemplo</h4>
                    </div>
                    <div className="permanent-hint-content">
                        <div className="hint-example">
                            <span className="hint-number">{hintExample.number}</span>
                            <span className="hint-arrow">→</span>
                            <span className="hint-word">{hintExample.word}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameScreen;