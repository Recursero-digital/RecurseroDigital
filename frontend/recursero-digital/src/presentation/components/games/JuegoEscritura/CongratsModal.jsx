import React from 'react';

const CongratsModal = ({ level, points, onNextLevel }) => (
    <div className="modal-overlay">
        <div className="paper-note modal-content congrats" data-aos="zoom-in">
            <h2>¡Felicidades!</h2>
            <p>Completaste el Nivel {level}!</p>
            <div className="points-display">
                <p><strong>Puntos totales: {points} 🎯</strong></p>
            </div>
            <p>¡Desbloqueaste el siguiente nivel!</p>
            <button onClick={onNextLevel} className="btn btn-next-level">
                Siguiente Nivel
            </button>
        </div>
    </div>
);

export default CongratsModal;