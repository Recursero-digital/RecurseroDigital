import React, { useEffect, useRef } from 'react';

const FeedbackModal = ({ feedback, onContinue }) => {
    // Referencia para el botón
    const buttonRef = useRef(null);

    useEffect(() => {
        // 1. Enfocar el botón automáticamente cuando se abre el modal
        if (buttonRef.current) {
            buttonRef.current.focus();
        }

        // 2. Función para manejar el evento de teclado
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                onContinue();
            }
        };

        // Escuchar el evento en toda la ventana
        window.addEventListener('keydown', handleKeyDown);

        // Limpiar el evento cuando el modal se cierra (desmonta)
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onContinue]);

    return (
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
                        ref={buttonRef} // Asignamos la referencia aquí
                        onClick={onContinue} 
                        className="btn btn-check desco-feedback-button"
                    >
                        {feedback.isCorrect ? '🚀 Continuar' : '📚 Siguiente'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;