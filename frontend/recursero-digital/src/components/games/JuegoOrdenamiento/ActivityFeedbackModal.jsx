import React from 'react';

const ActivityFeedbackModal = ({ isSuccess, onContinue, onRetry }) => {
    if (isSuccess) {
        return (
            <div className="activity-feedback-overlay">
                <div className="activity-feedback-modal success">
                    <h2>🎉 ¡Bien Hecho!</h2>
                    <p>¡Pasaste al siguiente nivel!</p>
                    <button onClick={onContinue} className="btn btn-success">
                        Continuar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="activity-feedback-overlay">
            <div className="activity-feedback-modal error">
                <h2>❌ Inténtalo de nuevo</h2>
                <p>No te preocupes, ¡puedes intentarlo otra vez!</p>
                <button onClick={onRetry} className="btn btn-retry">
                    Reintentar
                </button>
            </div>
        </div>
    );
};

export default ActivityFeedbackModal;
