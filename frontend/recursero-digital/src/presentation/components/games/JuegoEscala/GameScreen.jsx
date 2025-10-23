import React from 'react';
import { isValidNumber } from './util';

const GameScreen = ({ 
    activity,
    totalActivities,
    points,
    question,
    userAnswers,
    onAnswersChange,
    onCheckAnswer,
    onBackToLevels,
    levelConfig,
    inputErrors,
    setInputErrors,
    isProcessing
}) => {

    const handleInputChange = (field, value) => {
        // No permitir cambios mientras se procesa
        if (isProcessing) return;

        // Validación en tiempo real
        const isValid = isValidNumber(value);
        setInputErrors(prev => ({
            ...prev,
            [field]: !isValid
        }));

        if (isValid) {
            onAnswersChange(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleKeyDown = (e, field) => {
        // No permitir navegación mientras se procesa
        if (isProcessing) return;

        // Navegación por teclado
        if (e.key === 'Enter') {
            e.preventDefault();
            if (field === 'anterior') {
                // Mover al input posterior
                const posteriorInput = document.querySelector('input[aria-label="Número posterior en la secuencia"]');
                if (posteriorInput) posteriorInput.focus();
            } else if (field === 'posterior') {
                // Verificar respuesta si ambos campos están llenos y no hay errores
                if (userAnswers.anterior && userAnswers.posterior && !inputErrors?.anterior && !inputErrors?.posterior) {
                    onCheckAnswer();
                }
            }
        }
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
                                    type="text"
                                    value={userAnswers.anterior || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Permitir números enteros (positivos y negativos) y vacío
                                        if (value === '' || /^-?\d+$/.test(value)) {
                                            handleInputChange('anterior', value);
                                        }
                                    }}
                                    onKeyDown={(e) => handleKeyDown(e, 'anterior')}
                                    disabled={isProcessing}
                                    className="answer-input"
                                    style={{
                                        fontSize: '1.5rem',
                                        padding: '1rem',
                                        borderRadius: '1rem',
                                        border: `3px solid ${inputErrors?.anterior ? '#ef4444' : '#dc2626'}`,
                                        textAlign: 'center',
                                        width: '120px',
                                        WebkitAppearance: 'none',
                                        MozAppearance: 'textfield',
                                        backgroundColor: isProcessing ? '#f3f4f6' : (inputErrors?.anterior ? '#fef2f2' : 'white'),
                                        cursor: isProcessing ? 'not-allowed' : 'text',
                                        opacity: isProcessing ? 0.7 : 1
                                    }}
                                    placeholder="0"
                                    aria-label="Número anterior en la secuencia"
                                    aria-describedby="anterior-help"
                                    aria-invalid={inputErrors?.anterior}
                                    role="spinbutton"
                                />
                                {inputErrors?.anterior && (
                                    <div style={{
                                        color: '#dc2626',
                                        fontSize: '0.875rem',
                                        marginTop: '0.25rem'
                                    }}>
                                        Ingresa un número válido
                                    </div>
                                )}
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
                                    type="text"
                                    value={userAnswers.posterior || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Permitir números enteros (positivos y negativos) y vacío
                                        if (value === '' || /^-?\d+$/.test(value)) {
                                            handleInputChange('posterior', value);
                                        }
                                    }}
                                    onKeyDown={(e) => handleKeyDown(e, 'posterior')}
                                    disabled={isProcessing}
                                    className="answer-input"
                                    style={{
                                        fontSize: '1.5rem',
                                        padding: '1rem',
                                        borderRadius: '1rem',
                                        border: `3px solid ${inputErrors?.posterior ? '#ef4444' : '#16a34a'}`,
                                        textAlign: 'center',
                                        width: '120px',
                                        WebkitAppearance: 'none',
                                        MozAppearance: 'textfield',
                                        backgroundColor: isProcessing ? '#f3f4f6' : (inputErrors?.posterior ? '#fef2f2' : 'white'),
                                        cursor: isProcessing ? 'not-allowed' : 'text',
                                        opacity: isProcessing ? 0.7 : 1
                                    }}
                                    placeholder="0"
                                    aria-label="Número posterior en la secuencia"
                                    aria-describedby="posterior-help"
                                    aria-invalid={inputErrors?.posterior}
                                    role="spinbutton"
                                />
                                {inputErrors?.posterior && (
                                    <div style={{
                                        color: '#dc2626',
                                        fontSize: '0.875rem',
                                        marginTop: '0.25rem'
                                    }}>
                                        Ingresa un número válido
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Cuadro informativo estático con ARIA */}
                    <div 
                        id="game-instructions"
                        role="region"
                        aria-label="Instrucciones del juego"
                        style={{
                            background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)',
                            border: '3px solid #0288d1',
                            borderRadius: '1rem',
                            padding: '1.5rem',
                            margin: '2rem auto',
                            maxWidth: '600px',
                            textAlign: 'center',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <div style={{
                            fontSize: '1.2rem',
                            fontWeight: '700',
                            color: '#0277bd',
                            marginBottom: '0.5rem'
                        }}>
                            📚 {levelConfig.name}
                        </div>
                        <div 
                            id="anterior-help"
                            style={{
                                fontSize: '1rem',
                                color: '#01579b',
                                fontWeight: '600'
                            }}
                        >
                            {levelConfig.description}
                        </div>
                        <div 
                            id="posterior-help"
                            style={{
                                fontSize: '0.875rem',
                                color: '#01579b',
                                marginTop: '0.5rem'
                            }}
                        >
                            Usa Enter para navegar entre campos y verificar tu respuesta
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
                            disabled={!userAnswers.anterior || !userAnswers.posterior || inputErrors?.anterior || inputErrors?.posterior || isProcessing}
                            aria-describedby="game-instructions"
                            style={{
                                background: (!userAnswers.anterior || !userAnswers.posterior || inputErrors?.anterior || inputErrors?.posterior || isProcessing) 
                                    ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                border: '3px solid #047857',
                                color: 'white',
                                padding: '0.75rem 2rem',
                                borderRadius: '1rem',
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                cursor: (!userAnswers.anterior || !userAnswers.posterior || inputErrors?.anterior || inputErrors?.posterior || isProcessing) 
                                    ? 'not-allowed' 
                                    : 'pointer',
                                position: 'relative',
                                zIndex: 1000,
                                opacity: (!userAnswers.anterior || !userAnswers.posterior || inputErrors?.anterior || inputErrors?.posterior || isProcessing) 
                                    ? 0.6 
                                    : 1
                            }}
                        >
                            {isProcessing ? '⏳ Procesando...' : '🚀 Verificar Respuesta'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameScreen;