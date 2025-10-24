import React from 'react';
import { useNavigate } from 'react-router-dom';

const CongratsModal = ({ 
    score, 
    totalQuestions, 
    levelName, 
    levelPassed, 
    nextLevelUnlocked, 
    onPlayAgain,
    onBackToLevels 
}) => {
    const navigate = useNavigate();
    const percentage = Math.round((score / totalQuestions) * 100);

    const getPerformanceMessage = () => {
        if (percentage >= 90) return { emoji: '🌟', message: '¡Increíble! Eres un maestro de los números' };
        if (percentage >= 80) return { emoji: '⭐', message: '¡Excelente trabajo! Muy bien hecho' };
        if (percentage >= 60) return { emoji: '👏', message: '¡Buen trabajo! Has completado el nivel' };
        return { emoji: '💪', message: '¡Sigue practicando! Puedes mejorar' };
    };

    const performance = getPerformanceMessage();

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="congrats-header">
                    <div className="congrats-icon">
                        {performance.emoji}
                    </div>
                    
                    <h2 className="congrats-title">
                        {levelPassed ? '¡Nivel Completado!' : '¡Nivel Terminado!'}
                    </h2>
                    
                    <p className="congrats-subtitle">
                        {performance.message}
                    </p>
                </div>

                <div className="score-summary">
                    <div className="score-circle">
                        <div className="score-percentage">
                            {percentage}%
                        </div>
                        <div className="score-fraction">
                            {score}/{totalQuestions}
                        </div>
                    </div>
                    
                    <div className="level-info">
                        <h3>
                            🌊 {levelName} 🌊
                        </h3>
                        
                        {levelPassed && (
                            <div className="level-passed-info">
                                <p className="level-passed-text">
                                    ✅ ¡Nivel superado con {percentage}%!
                                </p>
                                {nextLevelUnlocked && (
                                    <p className="level-unlocked-text">
                                        🎉 ¡Nuevo nivel desbloqueado!
                                    </p>
                                )}
                            </div>
                        )}
                        
                        {!levelPassed && (
                            <div className="level-failed-info">
                                <p className="level-failed-text">
                                    📚 Necesitas 60% para pasar el nivel
                                </p>
                                <p className="level-retry-text">
                                    ¡Sigue practicando y lo lograrás!
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="congrats-actions">
                    <button 
                        className="btn-play-again btn-main-gradient bg-space-gradient"
                        onClick={onPlayAgain}
                    >
                        🔄 Jugar otra vez
                    </button>
                    
                    <button 
                        className="btn-back-to-levels btn-main-gradient bg-space-gradient"
                        onClick={onBackToLevels}
                    >
                        📋 Elegir nivel
                    </button>
                    
                    <button 
                        className="btn-back-to-games btn-main-gradient bg-space-gradient"
                        onClick={() => navigate('/alumno')}
                    >
                        🎮 Otros juegos
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CongratsModal;