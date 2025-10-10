import React from 'react';

const GameScreen = ({ 
    activity,
    totalActivities,
    points,
    question,
    userAnswers,
    onAnswersChange,
    onCheckAnswer,
    onBackToLevels,
    levelConfig
}) => {

    const handleInputChange = (field, value) => {
        onAnswersChange(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="ocean-scene">
            <div className="landscape"></div>
            <div className="lighthouse"></div>
            <div className="house"></div>

            <div className="game-header">
                <div className="header-info">
                    <h2 className="level-title" style={{
                        fontSize: '2rem',
                        color: '#1e40af',
                        fontFamily: 'Fredoka, sans-serif',
                        fontWeight: '900',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                        🌊 {levelConfig.name} 🌊
                    </h2>
                    
                    <div className="question-counter" style={{
                        fontSize: '1.2rem',
                        color: '#0c4a6e',
                        fontWeight: '700',
                        background: 'rgba(255, 255, 255, 0.9)',
                        padding: '0.5rem 1rem',
                        borderRadius: '1rem',
                        border: '2px solid #3b82f6',
                        display: 'inline-block',
                        width: 'auto'
                    }}>
                        Actividad {activity} de {totalActivities}
                    </div>
                </div>

                <div className="progress-section">
                    <div className="score-display" style={{
                        fontSize: '1.1rem',
                        color: '#0c4a6e',
                        fontWeight: '700',
                        background: 'rgba(255, 255, 255, 0.9)',
                        padding: '0.5rem 1rem',
                        borderRadius: '1rem',
                        border: '2px solid #10b981',
                        display: 'inline-block',
                        width: 'auto'
                    }}>
                        ⭐ Puntos: {points}
                    </div>
                </div>

                <button 
                    className="btn-back"
                    onClick={onBackToLevels}
                    style={{
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        border: '3px solid #b91c1c',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '1rem',
                        fontSize: '1rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                    }}
                >
                    ← Volver
                </button>
            </div>

            <div className="question-container">
                <div className="question-content">
                    <div className="anterior-posterior-question">
                        <h3 className="question-title">🔍 Anterior y Posterior</h3>
                        
                        {/* Secuencia visual con espacios para anterior y posterior */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.5rem',
                            margin: '2rem 0',
                            flexWrap: 'wrap'
                        }}>
                            {/* Números anteriores para contexto */}
                            {Array.from({ length: 2 }, (_, i) => question.baseNumber - (3 * question.operation) + (i * question.operation)).map(num => (
                                <div
                                    key={`before-${num}`}
                                    style={{
                                        fontSize: '1.2rem',
                                        color: '#6b7280',
                                        fontWeight: '600',
                                        background: 'rgba(255, 255, 255, 0.7)',
                                        padding: '0.6rem 0.8rem',
                                        borderRadius: '0.8rem',
                                        border: '2px solid #d1d5db'
                                    }}
                                >
                                    {num}
                                </div>
                            ))}
                            
                            {/* Espacio para anterior */}
                            <div style={{
                                fontSize: '1.8rem',
                                color: '#dc2626',
                                fontWeight: '900',
                                background: 'rgba(255, 255, 255, 0.9)',
                                padding: '0.8rem 1rem',
                                borderRadius: '1rem',
                                border: '3px dashed #dc2626',
                                minWidth: '50px',
                                textAlign: 'center'
                            }}>
                                ?
                            </div>
                            
                            {/* Número central */}
                            <div style={{
                                fontSize: '2.2rem',
                                color: '#1e40af',
                                fontWeight: '900',
                                background: 'rgba(255, 255, 255, 0.9)',
                                padding: '1.2rem 1.5rem',
                                borderRadius: '1.5rem',
                                border: '3px solid #3b82f6',
                                minWidth: '70px',
                                textAlign: 'center'
                            }}>
                                {question.baseNumber}
                            </div>
                            
                            {/* Espacio para posterior */}
                            <div style={{
                                fontSize: '1.8rem',
                                color: '#16a34a',
                                fontWeight: '900',
                                background: 'rgba(255, 255, 255, 0.9)',
                                padding: '0.8rem 1rem',
                                borderRadius: '1rem',
                                border: '3px dashed #16a34a',
                                minWidth: '50px',
                                textAlign: 'center'
                            }}>
                                ?
                            </div>
                            
                            {/* Números posteriores para contexto */}
                            {Array.from({ length: 2 }, (_, i) => question.baseNumber + (2 * question.operation) + (i * question.operation)).map(num => (
                                <div
                                    key={`after-${num}`}
                                    style={{
                                        fontSize: '1.2rem',
                                        color: '#6b7280',
                                        fontWeight: '600',
                                        background: 'rgba(255, 255, 255, 0.7)',
                                        padding: '0.6rem 0.8rem',
                                        borderRadius: '0.8rem',
                                        border: '2px solid #d1d5db'
                                    }}
                                >
                                    {num}
                                </div>
                            ))}
                        </div>

                        <div className="anterior-posterior-inputs" style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '3rem',
                            flexWrap: 'wrap'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <label style={{
                                    fontSize: '1.2rem',
                                    fontWeight: '700',
                                    color: '#dc2626',
                                    marginBottom: '1rem',
                                    display: 'block'
                                }}>
                                    ← Anterior
                                </label>
                                <input
                                    type="number"
                                    value={userAnswers.anterior || ''}
                                    onChange={(e) => handleInputChange('anterior', e.target.value)}
                                    className="answer-input"
                                    style={{
                                        fontSize: '1.5rem',
                                        padding: '1rem',
                                        borderRadius: '1rem',
                                        border: '3px solid #dc2626',
                                        textAlign: 'center',
                                        width: '120px'
                                    }}
                                />
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <label style={{
                                    fontSize: '1.2rem',
                                    fontWeight: '700',
                                    color: '#16a34a',
                                    marginBottom: '1rem',
                                    display: 'block'
                                }}>
                                    Posterior →
                                </label>
                                <input
                                    type="number"
                                    value={userAnswers.posterior || ''}
                                    onChange={(e) => handleInputChange('posterior', e.target.value)}
                                    className="answer-input"
                                    style={{
                                        fontSize: '1.5rem',
                                        padding: '1rem',
                                        borderRadius: '1rem',
                                        border: '3px solid #16a34a',
                                        textAlign: 'center',
                                        width: '120px'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cuadro informativo estático */}
                    <div style={{
                        background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)',
                        border: '3px solid #0288d1',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        margin: '2rem auto',
                        maxWidth: '600px',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{
                            fontSize: '1.2rem',
                            fontWeight: '700',
                            color: '#0277bd',
                            marginBottom: '0.5rem'
                        }}>
                            📚 {levelConfig.name}
                        </div>
                        <div style={{
                            fontSize: '1rem',
                            color: '#01579b',
                            fontWeight: '600'
                        }}>
                            {levelConfig.description}
                        </div>
                    </div>

                    <div className="game-actions" style={{
                        textAlign: 'center',
                        marginTop: '2rem',
                        position: 'relative',
                        zIndex: 999
                    }}>
                        <button 
                            className="btn-submit"
                            onClick={onCheckAnswer}
                            style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                border: '3px solid #047857',
                                color: 'white',
                                padding: '0.75rem 2rem',
                                borderRadius: '1rem',
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                position: 'relative',
                                zIndex: 1000
                            }}
                        >
                            🚀 Verificar Respuesta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameScreen;