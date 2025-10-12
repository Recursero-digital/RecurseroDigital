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
            <p>¡Aprende a ordenar números de menor a mayor!</p>
            
            <div className="start-features">
                <div className="feature-item">
                    <span className="feature-icon">🔢</span>
                    <span className="feature-text">Ordena números</span>
                </div>
                <div className="feature-item">
                    <span className="feature-icon">🎯</span>
                    <span className="feature-text">Arrastra y suelta</span>
                </div>
                <div className="feature-item">
                    <span className="feature-icon">⭐</span>
                    <span className="feature-text">Gana puntos</span>
                </div>
            </div>
            
            <div className="button-group">
                <button onClick={onStart} className="btn btn-start">COMENZAR</button>
            </div>
        </div>
    );
};

export default StartScreen;
