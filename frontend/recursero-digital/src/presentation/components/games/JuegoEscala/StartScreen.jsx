import React from 'react';
import { useNavigate } from 'react-router-dom';

const StartScreen = ({ onStart }) => {
    const navigate = useNavigate();

    return (
        <div className="ocean-scene bg-space-ui" data-aos="fade-down">
            <div className="landscape"></div>
            <div className="lighthouse"></div>
            <div className="house"></div>
            
            <div className="header-controls">
                <button 
                    className="btn-back-to-levels"
                    onClick={() => navigate('/alumno')}
                    title="Volver a juegos"
                >
                    ← Juegos
                </button>
            </div>

            <div className="start-screen-content slide-in">
                <h1 className="game-title">
                    🔢 ¿Cuál es el numero anterior y posterior? 🔢
                </h1>

                <div className="game-info-card">
                    <h2 className="game-subtitle">
                        Descubre Secuencias Numéricas
                    </h2>
                    
                    <div className="features-grid">
                        <div className="feature-card blue">
                            <div className="feature-icon">🔍</div>
                            <h3 className="feature-title">Anterior y Posterior</h3>
                            <p className="feature-description">
                                Encuentra los números que van antes y después
                            </p>
                        </div>
                        
                        <div className="feature-card green">
                            <div className="feature-icon">📈</div>
                            <h3 className="feature-title">Completa Secuencias</h3>
                            <p className="feature-description">
                                Descubre el patrón y completa los números que faltan
                            </p>
                        </div>
                        
                        <div className="feature-card purple">
                            <div className="feature-icon">🎯</div>
                            <h3 className="feature-title">3 Niveles</h3>
                            <p className="feature-description">
                                +1/-1, +10/-10, +100/-100
                            </p>
                        </div>
                    </div>

                    <div className="objectives-section">
                        <h3 className="objectives-title">
                            📚 Objetivos de Aprendizaje
                        </h3>
                        <ul className="objectives-list">
                            <li>Identificar y completar secuencias numéricas</li>
                            <li>Reconocer el valor posicional de las cifras</li>
                            <li>Anticipar números anteriores y posteriores</li>
                            <li>Trabajar con regularidades matemáticas</li>
                        </ul>
                    </div>
                </div>

                <button 
                    onClick={onStart} 
                    className="btn-start pulse float"
                >
                    🚀 ¡COMENZAR AVENTURA!
                </button>
            </div>
        </div>
    );
};

export default StartScreen;