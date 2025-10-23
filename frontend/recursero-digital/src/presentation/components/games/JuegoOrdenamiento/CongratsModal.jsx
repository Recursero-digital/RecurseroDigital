import React from 'react';

const CongratsModal = ({ level, results, totalScore, onNextLevel, onBackToLevels }) => {
    const totalAttempts = results.reduce((sum, result) => sum + result.attempts, 0);
    const averageScore = results.length > 0 ? Math.round(totalScore / results.length) : 0;

    return (
        <div className="level-results-overlay">
            <div className="level-results-modal">
                <h2>🎉 ¡Nivel {level} Completado!</h2>
                
                <div className="results-summary">
                    <div className="summary-item">
                        <span className="summary-label">Puntuación Total:</span>
                        <span className="summary-value">{totalScore}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Intentos Totales:</span>
                        <span className="summary-value">{totalAttempts}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Puntuación Promedio:</span>
                        <span className="summary-value">{averageScore}</span>
                    </div>
                </div>

                <div className="activities-results">
                    <h3>Resultados por Actividad:</h3>
                    <div className="activities-list">
                        {results.map((result, index) => (
                            <div key={index} className="activity-result">
                                <span className="activity-number">Actividad {result.activity}</span>
                                <span className="activity-score">{result.score} pts</span>
                                <span className="activity-attempts">{result.attempts} intentos</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="results-actions">
                    <button onClick={onBackToLevels} className="btn btn-secondary">
                        🏠 Volver a Niveles
                    </button>
                    <button onClick={onNextLevel} className="btn btn-primary">
                        Siguiente Nivel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CongratsModal;