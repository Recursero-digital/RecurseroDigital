import React from 'react';

const FeedbackModal = ({ feedback, onContinue }) => (
    <div className="modal-overlay">
        <div className="modal-content slide-in" data-aos="zoom-in">
            <div className="desco-feedback-icon">
                {feedback.isCorrect ? '🎉' : '😢'}
            </div>
            
            <h3 className={`desco-feedback-title ${feedback.isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
                {feedback.title}
            </h3>
            
            <p className="desco-feedback-text">
                {feedback.text}
            </p>
            
            <div className="desco-feedback-button-container">
                <button 
                    onClick={onContinue} 
                    className="btn btn-check desco-feedback-button"
                >
                    {feedback.isCorrect ? '🚀 Continuar' : '📚 Siguiente'}
                </button>
            </div>
        </div>
    </div>
);

export default FeedbackModal;