import React from 'react';
import { useNavigate } from 'react-router-dom';

const StartScreen = ({ onStart }) => {
    const navigate = useNavigate();

    return (
        <div className="ocean-scene bg-space-ui" data-aos="fade-down">
            <div className="landscape"></div>
            <div className="lighthouse"></div>
            <div className="house"></div>
            
            {/* Usar estructura global de start-screen */}
            <div className="start-screen">
                <div className="header-controls">
                    <button 
                        className="btn-back-to-levels"
                        onClick={() => navigate('/alumno')}
                        title="Volver a juegos"
                    >
                        ← Juegos
                    </button>
                </div>

                <h1>🔢 ¿Cuál es el numero anterior y posterior?</h1>
                <p>Descubre Secuencias Numéricas</p>

                <div className="start-features">
                    <div className="feature-item">
                        <span className="feature-icon">🔍</span>
                        <span className="feature-text">Anterior y Posterior</span>
                    </div>
                    
                    <div className="feature-item">
                        <span className="feature-icon">📈</span>
                        <span className="feature-text">Completa Secuencias</span>
                    </div>
                    
                    <div className="feature-item">
                        <span className="feature-icon">🎯</span>
                        <span className="feature-text">3 Niveles: +1/-1, +10/-10, +100/-100</span>
                    </div>
                </div>

                <div className="button-group">
                    <button 
                        onClick={onStart} 
                        className="btn btn-start"
                    >
                        🚀 COMENZAR AVENTURA
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StartScreen;