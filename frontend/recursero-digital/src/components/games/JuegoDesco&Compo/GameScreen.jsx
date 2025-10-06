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
    onShowHint,
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
                <div>Nivel: <span>{level}</span> | Pregunta: <span>{activity}</span>/{totalActivities}</div>
                <div>Puntos: <span>{points}</span> | Intentos: <span>{attempts}</span></div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div className="progress-indicator">
                    Pregunta {activity} de {totalActivities}
                </div>
            </div>

            <div className="paper-note slide-in" style={{ position: 'relative' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)',
                    margin: '-2rem -2rem 2rem -2rem',
                    padding: '1.5rem 2rem',
                    borderRadius: '1rem 1rem 0 0',
                    borderBottom: '2px solid #81d4fa'
                }}>
                    <h3 className="question-title" style={{
                        margin: 0,
                        color: '#0277bd',
                        fontSize: '1.5rem',
                        fontWeight: '600'
                    }}>
                        {question.type === 'decomposition' 
                            ? '¿Qué número se forma?' 
                            : '¿Qué número se forma?'
                        }
                    </h3>
                </div>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '2rem',
                    alignItems: 'center',
                    minHeight: '200px'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                        padding: '2rem',
                        borderRadius: '1rem',
                        border: '2px solid #ce93d8',
                        textAlign: 'center'
                    }}>
                        <p style={{
                            fontSize: '0.9rem',
                            color: '#4a148c',
                            marginBottom: '1rem',
                            fontStyle: 'italic'
                        }}>
                            {question.type === 'decomposition' 
                                ? 'Escribe el número que se forma:'
                                : 'Escribe el número que se forma:'
                            }
                        </p>

                        {question.type === 'decomposition' ? (
                            <div className="question-number">
                                {formatNumber(question.number)}
                            </div>
                        ) : (
                            <div className="question-decomposition">
                                {question.decomposition.join(' + ')}
                            </div>
                        )}
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                        padding: '2rem',
                        borderRadius: '1rem',
                        border: '2px solid #ffcc02',
                        textAlign: 'center'
                    }}>
                        <p style={{
                            fontSize: '0.9rem',
                            color: '#e65100',
                            marginBottom: '1rem',
                            fontStyle: 'italic'
                        }}>
                            {question.type === 'decomposition' 
                                ? 'Escribe la descomposición:'
                                : 'Escribe el número:'
                            }
                        </p>

                        <form onSubmit={handleSubmit}>
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
                                    borderRadius: '0.5rem'
                                }}
                            />
                        </form>

                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            justifyContent: 'center',
                            marginTop: '1rem'
                        }}>
                            <button
                                onClick={onCheckAnswer}
                                disabled={!userAnswer.trim()}
                                style={{
                                    background: userAnswer.trim() ? '#4caf50' : '#e0e0e0',
                                    color: userAnswer.trim() ? 'white' : '#9e9e9e',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    cursor: userAnswer.trim() ? 'pointer' : 'not-allowed',
                                    fontSize: '1.2rem',
                                    transition: 'all 0.3s ease'
                                }}
                                title="Verificar respuesta"
                            >
                                ✓
                            </button>
                            
                            <button
                                onClick={onShowHint}
                                style={{
                                    background: '#ff9800',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    transition: 'all 0.3s ease'
                                }}
                                title="Ver pista"
                            >
                                ?
                            </button> // Boton para consulta --Ver
                            
                            <button
                                onClick={() => onAnswerChange('')}
                                style={{
                                    background: '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    transition: 'all 0.3s ease'
                                }}
                                title="Limpiar respuesta"
                            >
                                ↺
                            </button> // Botón para reiniciar la respuesta--Ver
                        </div>
                    </div>
                </div>

                <div style={{
                    marginTop: '2rem',
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
    );
};

export default GameScreen;