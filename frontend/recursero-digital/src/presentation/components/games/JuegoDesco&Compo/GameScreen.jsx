import React from 'react';
import { useNavigate } from 'react-router-dom';

const GameScreen = ({ 
    level, 
    activity, 
    totalActivities,
    points,
    attempts,
    question,
    userAnswer,
    onAnswerChange,
    onCheckAnswer,
    onBackToLevels,
    formatNumber
}) => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userAnswer.trim()) {
            onCheckAnswer();
        }
    };

    return (
        <div className="juego-descomposicion-content">
            <header className="game-header">
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
                            onClick={() => navigate('/alumno')}
                            title="Volver al dashboard"
                        >
                            🏠 Dashboard
                        </button>
                    </div>
                    
                    <div className="game-status">
                        <div className="status-item">
                            <div className="status-icon">📊</div>
                            <div className="status-label">Nivel</div>
                            <div className="status-value">{level}</div>
                        </div>
                        <div className="status-item">
                            <div className="status-icon">🎯</div>
                            <div className="status-label">Pregunta</div>
                            <div className="status-value">{activity}/{totalActivities}</div>
                        </div>
                        <div className="status-item">
                            <div className="status-icon">🎯</div>
                            <div className="status-label">Intentos</div>
                            <div className="status-value">{attempts}</div>
                        </div>
                        <div className="status-item">
                            <div className="status-icon">⭐</div>
                            <div className="status-label">Puntos</div>
                            <div className="status-value">{points}</div>
                        </div>
                    </div>
                </div>
                <h1 className="game-title">🧮 Descomposición Numérica</h1>
                <p className="game-instruction">
                    Descompón o forma números según el valor posicional
                </p>
            </header>

            <div className="progress-container">
                <div 
                    className="progress-bar"
                    data-progress={Math.round((activity / totalActivities) * 100)}
                    style={{'--progress-width': `${Math.round((activity / totalActivities) * 100)}%`}}
                />
            </div>

            <div className="game-play-area">
                <div className="paper-note slide-in" style={{ 
                    position: 'relative',
                    maxWidth: '700px',
                    margin: '0 auto'
                }}>
                <div style={{
                    background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)',
                    margin: '-1.5rem -1.5rem 1rem -1.5rem',
                    padding: '1rem 1.5rem',
                    borderRadius: '1rem',
                    textAlign: 'center'
                }}>
                    <h3 className="question-title" style={{
                        margin: 0,
                        color: '#0277bd',
                        fontSize: '1.5rem',
                        fontWeight: '600'
                    }}>
                        ¿Qué número se forma?
                    </h3>
                </div>

                {/* Contenido principal centralizado */}
                <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem',
                    padding: '0.5rem'
                }}>
                    {/* Pregunta principal */}
                    <div style={{
                        background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        border: '2px solid #ce93d8',
                        textAlign: 'center',
                        minWidth: '280px',
                        maxWidth: '450px'
                    }}>
                        {question.type === 'decomposition' ? (
                            <div className="question-number" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#4a148c' }}>
                                {formatNumber(question.number)}
                            </div>
                        ) : (
                            <div className="question-decomposition" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4a148c' }}>
                                {question.decomposition.join(' + ')}
                            </div>
                        )}
                    </div>

                    {/* Sección de respuesta */}
                    <div style={{
                        background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        border: '2px solid #ffcc02',
                        textAlign: 'center',
                        minWidth: '280px',
                        maxWidth: '450px'
                    }}>
                        <p style={{
                            fontSize: '1rem',
                            color: '#e65100',
                            marginBottom: '1rem',
                            fontWeight: '600'
                        }}>
                            {question.type === 'decomposition' 
                                ? 'Escribe la descomposición:'
                                : 'Escribe el número:'
                            }
                        </p>

                        <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
                            <input
                                type="text"
                                className="answer-input"
                                value={userAnswer}
                                onChange={(e) => onAnswerChange(e.target.value)}
                                placeholder={
                                    question.type === 'decomposition' 
                                        ? 'Ej: 2000 + 300 + 40 + 7'
                                        : 'Escribe el número completo'
                                }
                                style={{
                                    fontSize: '1.2rem',
                                    fontWeight: '600',
                                    textAlign: 'center',
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    border: '2px solid #ffb74d',
                                    borderRadius: '0.5rem',
                                    padding: '0.75rem',
                                    width: '100%',
                                    maxWidth: '350px'
                                }}
                            />
                        </form>

                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center'
                        }}>
                            <button
                                onClick={onCheckAnswer}
                                disabled={!userAnswer.trim()}
                                style={{
                                    background: userAnswer.trim() ? '#4caf50' : '#e0e0e0',
                                    color: userAnswer.trim() ? 'white' : '#9e9e9e',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    padding: '0.6rem 1.2rem',
                                    cursor: userAnswer.trim() ? 'pointer' : 'not-allowed',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease'
                                }}
                                title="Verificar respuesta"
                            >
                                ✓ Verificar
                            </button>
                            
                            <button
                                onClick={() => onAnswerChange('')}
                                style={{
                                    background: '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    padding: '0.6rem 1.2rem',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease'
                                }}
                                title="Limpiar respuesta"
                            >
                                ↺ Limpiar
                            </button>
                        </div>
                    </div>
                </div>

                    {/* Pista en la parte inferior */}
                    <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        background: 'rgba(33, 150, 243, 0.1)',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(33, 150, 243, 0.2)',
                        textAlign: 'center'
                    }}>
                        <p style={{
                            color: '#1976d2',
                            fontSize: '0.9rem',
                            margin: 0,
                            fontWeight: '500'
                        }}>
                            {question.type === 'decomposition' 
                                ? '💡 Separa cada cifra según su valor posicional (unidades, decenas, centenas, etc.)'
                                : '💡 Suma todos los números para obtener el resultado final'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameScreen;