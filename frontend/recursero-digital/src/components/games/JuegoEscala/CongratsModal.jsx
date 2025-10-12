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
            <div className="congrats-modal">
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
                            <h3 style={{
                                color: '#1e40af',
                                fontFamily: 'Fredoka, sans-serif',
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                marginBottom: '1rem'
                            }}>
                                🌊 {levelName} 🌊
                            </h3>
                            
                            {levelPassed && (
                                <div style={{
                                    background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                                    border: '2px solid #10b981',
                                    borderRadius: '1rem',
                                    padding: '1rem',
                                    marginBottom: '1rem'
                                }}>
                                    <p style={{
                                        color: '#065f46',
                                        fontWeight: '700',
                                        margin: 0
                                    }}>
                                        ✅ ¡Nivel superado con {percentage}%!
                                    </p>
                                    {nextLevelUnlocked && (
                                        <p style={{
                                            color: '#065f46',
                                            fontWeight: '600',
                                            margin: '0.5rem 0 0 0',
                                            fontSize: '0.9rem'
                                        }}>
                                            🎉 ¡Nuevo nivel desbloqueado!
                                        </p>
                                    )}
                                </div>
                            )}
                            
                            {!levelPassed && (
                                <div style={{
                                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                                    border: '2px solid #f59e0b',
                                    borderRadius: '1rem',
                                    padding: '1rem',
                                    marginBottom: '1rem'
                                }}>
                                    <p style={{
                                        color: '#92400e',
                                        fontWeight: '700',
                                        margin: 0
                                    }}>
                                        📚 Necesitas 60% para pasar el nivel
                                    </p>
                                    <p style={{
                                        color: '#92400e',
                                        fontWeight: '600',
                                        margin: '0.5rem 0 0 0',
                                        fontSize: '0.9rem'
                                    }}>
                                        ¡Sigue practicando y lo lograrás!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="congrats-actions">
                        <button 
                            className="btn btn-play-again"
                            onClick={onPlayAgain}
                            style={{
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                border: '3px solid #1e40af',
                                color: 'white',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                padding: '1rem 2rem',
                                borderRadius: '1rem',
                                cursor: 'pointer',
                                marginRight: '1rem',
                                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)'
                            }}
                        >
                            🔄 Jugar otra vez
                        </button>
                        
                        <button 
                            className="btn btn-back-to-levels"
                            onClick={onBackToLevels}
                            style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                border: '3px solid #047857',
                                color: 'white',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                padding: '1rem 2rem',
                                borderRadius: '1rem',
                                cursor: 'pointer',
                                marginRight: '1rem',
                                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
                            }}
                        >
                            📋 Elegir nivel
                        </button>
                        
                        <button 
                            className="btn btn-back-to-games"
                            onClick={() => navigate('/alumno')}
                            style={{
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                border: '3px solid #6d28d9',
                                color: 'white',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                padding: '1rem 2rem',
                                borderRadius: '1rem',
                                cursor: 'pointer',
                                boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)'
                            }}
                        >
                            🎮 Otros juegos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CongratsModal;