import React from 'react';

const StartScreen = ({ onStart, onBackToGames }) => {
    return (
        <div className="game-content">
            <div className="start-screen">
                <div className="header-controls">
                    <div className="buttons-group">
                        <button 
                            className="btn-back-to-levels"
                            onClick={onBackToGames}
                            title="Volver a juegos"
                        >
                            ← Juegos
                        </button>
                    </div>
                </div>
                <div className="start-content">
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
            </div>
        </div>
    );
};

export default StartScreen;
