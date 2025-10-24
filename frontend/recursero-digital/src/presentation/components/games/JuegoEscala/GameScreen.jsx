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
        <div className="ocean-scene bg-space-ui">
            <div className="landscape"></div>
            <div className="lighthouse"></div>
            <div className="house"></div>

            <div className="game-header">
                <div className="header-info">
                    <h2 className="game-level-title">
                        🌊 {levelConfig.name} 🌊
                    </h2>
                    
                    <div className="question-counter">
                        Actividad {activity} de {totalActivities}
                    </div>
                </div>

                <div className="progress-section">
                    <div className="score-display">
                        ⭐ Puntos: {points}
                    </div>
                </div>

                <button 
                    className="btn-back"
                    onClick={onBackToLevels}
                >
                    ← Volver
                </button>
            </div>

            <div className="question-container">
                <div className="question-content">
                    <div className="anterior-posterior-question">
                        <h3 className="question-title">🔍 Anterior y Posterior</h3>
                        
                        {/* Secuencia visual con espacios para anterior y posterior */}
                        <div className="sequence-visual">
                            {/* Números anteriores para contexto */}
                            {Array.from({ length: 2 }, (_, i) => question.baseNumber - (3 * question.operation) + (i * question.operation)).map(num => (
                                <div
                                    key={`before-${num}`}
                                    className="context-number"
                                >
                                    {num}
                                </div>
                            ))}
                            
                            {/* Espacio para anterior */}
                            <div className="missing-anterior">
                                ?
                            </div>
                            
                            {/* Número central */}
                            <div className="central-number">
                                {question.baseNumber}
                            </div>
                            
                            {/* Espacio para posterior */}
                            <div className="missing-posterior">
                                ?
                            </div>
                            
                            {/* Números posteriores para contexto */}
                            {Array.from({ length: 2 }, (_, i) => question.baseNumber + (2 * question.operation) + (i * question.operation)).map(num => (
                                <div
                                    key={`after-${num}`}
                                    className="context-number"
                                >
                                    {num}
                                </div>
                            ))}
                        </div>

                        <div className="anterior-posterior-inputs">
                            <div className="input-group">
                                <label className="input-label anterior">
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
                                    className={`answer-input anterior ${inputErrors?.anterior ? 'error' : ''} ${isProcessing ? 'disabled' : ''}`}
                                    placeholder="0"
                                    aria-label="Número anterior en la secuencia"
                                    aria-describedby="anterior-help"
                                    aria-invalid={inputErrors?.anterior}
                                    role="spinbutton"
                                />
                                {inputErrors?.anterior && (
                                    <div className="input-error">
                                        Ingresa un número válido
                                    </div>
                                )}
                            </div>

                            <div className="input-group">
                                <label className="input-label posterior">
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
                                    className={`answer-input posterior ${inputErrors?.posterior ? 'error' : ''} ${isProcessing ? 'disabled' : ''}`}
                                    placeholder="0"
                                    aria-label="Número posterior en la secuencia"
                                    aria-describedby="posterior-help"
                                    aria-invalid={inputErrors?.posterior}
                                    role="spinbutton"
                                />
                                {inputErrors?.posterior && (
                                    <div className="input-error">
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
                        className="game-instructions"
                    >
                        <div className="instructions-title">
                            📚 {levelConfig.name}
                        </div>
                        <div 
                            id="anterior-help"
                            className="instructions-description"
                        >
                            {levelConfig.description}
                        </div>
                        <div 
                            id="posterior-help"
                            className="instructions-help"
                        >
                            Usa Enter para navegar entre campos y verificar tu respuesta
                        </div>
                    </div>

                    <div className="game-actions">
                        <button 
                            className={`btn-submit ${(!userAnswers.anterior || !userAnswers.posterior || inputErrors?.anterior || inputErrors?.posterior || isProcessing) ? 'disabled' : 'enabled'}`}
                            onClick={onCheckAnswer}
                            disabled={!userAnswers.anterior || !userAnswers.posterior || inputErrors?.anterior || inputErrors?.posterior || isProcessing}
                            aria-describedby="game-instructions"
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