import React from 'react';

const FeedbackModal = ({ feedback, onContinue }) => (
    <div className="modal-overlay">
        <div className="modal-content slide-in" data-aos="zoom-in">
            <div style={{
                fontSize: '4rem',
                textAlign: 'center',
                marginBottom: '1rem'
            }}>
                {feedback.isCorrect ? '🎉' : '😢'}
            </div>
            
            <h3 className={feedback.isCorrect ? 'feedback-correct' : 'feedback-incorrect'}
                style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    fontFamily: 'Playfair Display, serif'
                }}>
                {feedback.title}
            </h3>
            
            <p style={{
                fontSize: '1.1rem',
                textAlign: 'center',
                marginBottom: '2rem',
                color: '#4a5568',
                lineHeight: '1.5'
            }}>
                {feedback.text}
            </p>
            
            <div style={{ textAlign: 'center' }}>
                <button 
                    onClick={onContinue} 
                    className="btn btn-check"
                    style={{
                        padding: '0.75rem 2rem',
                        fontSize: '1.1rem'
                    }}
                >
                    {feedback.isCorrect ? '🚀 Continuar' : '📚 Siguiente'}
                </button>
            </div>
        </div>
    </div>
);

export default FeedbackModal;