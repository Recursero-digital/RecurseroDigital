import React from 'react';
import { useNavigate } from 'react-router-dom';

const StartScreen = ({ onStart }) => {
    const navigate = useNavigate();

    return (
        <div className="chalkboard" data-aos="fade-down">
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

                <h1>🔢 NumeroMágico ✨</h1>
                <p>¡Descubre el misterio de los números!</p>

                <div className="start-features">
                    <div className="feature-item">
                        <span className="feature-icon">🧩</span>
                        <span className="feature-text">Descomposición: Separa en unidades, decenas, centenas</span>
                    </div>
                    
                    <div className="feature-item">
                        <span className="feature-icon">🔧</span>
                        <span className="feature-text">Composición: Junta las partes del número</span>
                    </div>
                    
                    <div className="feature-item">
                        <span className="feature-icon">🎯</span>
                        <span className="feature-text">Aprende valor posicional</span>
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