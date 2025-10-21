import React from 'react';

const FeedbackModal = ({ feedback, onNext, onClose, isLastQuestion, isValidationError }) => {
    const { isCorrect, title, text } = feedback;

    return (
        <div className="modal-overlay">
            <div className={`feedback-modal ${isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="modal-content">
                    <div className="feedback-icon">
                        {isValidationError ? '⚠️' : (isCorrect ? '🌟' : '❌')}
                    </div>
                    
                    <h3 className="feedback-title">
                        {title}
                    </h3>
                    
                    <p className="feedback-explanation">
                        {text}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {/* Botón para cerrar (validaciones y respuestas incorrectas) */}
                        {(isValidationError || !isCorrect) && (
                            <button 
                                className="btn btn-close"
                                onClick={onClose}
                                style={{
                                    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 20%, #6366f1 40%, #8b5cf6 60%, #7c3aed 80%, #5b21b6 100%)',
                                    border: '3px solid #1e3a8a',
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '1rem',
                                    cursor: 'pointer',
                                    color: 'white',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                ✖️ Cerrar
                            </button>
                        )}
                        
                        {/* Botón siguiente pregunta (solo respuestas correctas) */}
                        {isCorrect && !isValidationError && (
                            <button 
                                className="btn btn-success"
                                onClick={onNext}
                                style={{
                                    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 20%, #6366f1 40%, #8b5cf6 60%, #7c3aed 80%, #5b21b6 100%)',
                                    border: '3px solid #1e3a8a',
                                    fontSize: '1.2rem',
                                    fontWeight: '700',
                                    padding: '1rem 2rem',
                                    borderRadius: '1rem',
                                    cursor: 'pointer',
                                    color: 'white',
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {isLastQuestion ? '🏁 Ver resultados' : '➡️ Siguiente pregunta'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;