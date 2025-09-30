import React from 'react';

const StartScreen = ({ onStart, onBackToGames }) => {
    return (
        <div className="start-screen">
            <div className="header-controls">
                <button 
                    className="btn-back-to-levels"
                    onClick={onBackToGames}
                    title="Volver a juegos"
                >
                    ← Juegos
                </button>
            </div>
            <h1>🎯 Ordenamiento Numérico</h1>
            <p>¡Aprende a ordenar números de forma divertida!</p>
            <div className="button-group">
                <button onClick={onStart} className="btn btn-start">COMENZAR</button>
            </div>
        </div>
    );
};

export default StartScreen;
