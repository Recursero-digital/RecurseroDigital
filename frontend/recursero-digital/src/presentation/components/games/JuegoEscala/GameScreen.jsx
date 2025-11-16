import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidNumber } from './util';

const GameScreen = ({ 
    activity,
    totalActivities,
    points,
    attempts,
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
    const navigate = useNavigate();

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
        <div className="game-content">
            <header className="desco-game-header">
                <div className="header-controls">
                    <div className="buttons-group">
                        <button 
                            className="btn-back-to-dashboard"
                            onClick={() => navigate('/alumno/juegos')}
                            title="Volver al dashboard"
                        >
                            ← Juegos
                        </button>
                        <button 
                            className="btn-back-to-levels"
                            onClick={onBackToLevels}
                            title="Volver a niveles"
                        >
                            ← Niveles
                        </button>
                    </div>
                    
                    <div className="game-status">
                        <div className="status-item">
                            <div className="status-icon">🏆</div>
                            <div className="status-label">Nivel</div>
                            <div className="status-value">{levelConfig.name}</div>
                        </div>
                        <div className="status-item">
                            <div className="status-icon">📝</div>
                            <div className="status-label">Actividad</div>
                            <div className="status-value">{activity}/{totalActivities}</div>
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
                
                <h1 className="game-title">⚡ Anterior y Posterior ⚡</h1>
                <p className="game-instruction">
                    🔍 Encuentra los números anterior y posterior en la secuencia
                </p>
            </header>

            <div className="game-play-area">
                {/* Secuencia visual */}
                <div className="question-card">
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
                </div>

                {/* Sección de respuesta */}
                <div className="answer-card">
                    <p className="answer-instruction">
                        Completa la secuencia:
                    </p>

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

                    <div className="button-group">
                        <button
                            onClick={onCheckAnswer}
                            disabled={!userAnswers.anterior || !userAnswers.posterior || inputErrors?.anterior || inputErrors?.posterior || isProcessing}
                            className="btn-verify"
                            title="Verificar respuesta"
                        >
                            {isProcessing ? '⏳ Procesando...' : '✓ Verificar'}
                        </button>
                        
                        <button
                            onClick={() => onAnswersChange({ anterior: '', posterior: '' })}
                            className="btn-clear"
                            title="Limpiar respuestas"
                            disabled={isProcessing}
                        >
                            ↺ Limpiar
                        </button>
                    </div>
                </div>
            </div>

            {/* Pista permanente */}
            <div className="permanent-hint">
                <div className="permanent-hint-header">
                    <span className="hint-icon">💡</span>
                    <h4>Ayuda</h4>
                </div>
                <div className="permanent-hint-content">
                    <p className="hint-text">
                        {levelConfig.description}
                    </p>
                    <p className="hint-text">
                        Usa Enter para navegar entre campos y verificar tu respuesta
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GameScreen;