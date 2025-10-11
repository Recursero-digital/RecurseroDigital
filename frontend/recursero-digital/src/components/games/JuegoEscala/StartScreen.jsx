import React from 'react';
import { useNavigate } from 'react-router-dom';

const StartScreen = ({ onStart }) => {
    const navigate = useNavigate();

    return (
        <div className="ocean-scene" data-aos="fade-down">
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

            <div className="slide-in" style={{ 
                textAlign: 'center', 
                maxWidth: '900px', 
                margin: '0 auto',
                paddingTop: '4rem',
                position: 'relative',
                zIndex: 10
            }}>
                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: '900',
                    color: '#1e40af',
                    marginBottom: '1rem',
                    fontFamily: 'Fredoka, sans-serif',
                    textShadow: '3px 3px 6px rgba(0, 0, 0, 0.2)',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textAlign: 'center',
                    lineHeight: '1.2',
                    maxWidth: '100%',
                    wordWrap: 'break-word'
                }}>
                    🔢 ¿Cuál es el numero anterior y posterior? 🔢
                </h1>


                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    padding: '2.5rem',
                    borderRadius: '2rem',
                    border: '3px solid #3b82f6',
                    marginBottom: '2rem',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)'
                }}>
                    <h2 style={{
                        fontSize: '1.8rem',
                        color: '#1e40af',
                        marginBottom: '2rem',
                        fontFamily: 'Fredoka, sans-serif',
                        fontWeight: '600'
                    }}>
                        Descubre Secuencias Numéricas
                    </h2>
                    
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                        gap: '1.5rem', 
                        marginBottom: '2rem' 
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                            padding: '1.5rem',
                            borderRadius: '1rem',
                            border: '3px solid #3b82f6',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
                            <h3 style={{ color: '#1e40af', marginBottom: '0.5rem', fontWeight: '700' }}>Anterior y Posterior</h3>
                            <p style={{ color: '#1e40af', fontSize: '0.9rem', fontWeight: '500' }}>
                                Encuentra los números que van antes y después
                            </p>
                        </div>
                        
                        <div style={{
                            background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                            padding: '1.5rem',
                            borderRadius: '1rem',
                            border: '3px solid #10b981',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📈</div>
                            <h3 style={{ color: '#065f46', marginBottom: '0.5rem', fontWeight: '700' }}>Completa Secuencias</h3>
                            <p style={{ color: '#065f46', fontSize: '0.9rem', fontWeight: '500' }}>
                                Descubre el patrón y completa los números que faltan
                            </p>
                        </div>
                        
                        <div style={{
                            background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
                            padding: '1.5rem',
                            borderRadius: '1rem',
                            border: '3px solid #8b5cf6',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯</div>
                            <h3 style={{ color: '#5b21b6', marginBottom: '0.5rem', fontWeight: '700' }}>3 Niveles</h3>
                            <p style={{ color: '#5b21b6', fontSize: '0.9rem', fontWeight: '500' }}>
                                +1/-1, +10/-10, +100/-100
                            </p>
                        </div>
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        border: '3px solid #f59e0b',
                        marginBottom: '2rem',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                    }}>
                        <h3 style={{ color: '#92400e', marginBottom: '1rem', fontWeight: '700' }}>
                            📚 Objetivos de Aprendizaje
                        </h3>
                        <ul style={{ 
                            color: '#a16207', 
                            textAlign: 'left', 
                            lineHeight: '1.6',
                            fontWeight: '500',
                            paddingLeft: '1rem'
                        }}>
                            <li>Identificar y completar secuencias numéricas</li>
                            <li>Reconocer el valor posicional de las cifras</li>
                            <li>Anticipar números anteriores y posteriores</li>
                            <li>Trabajar con regularidades matemáticas</li>
                        </ul>
                    </div>
                </div>

                <button 
                    onClick={onStart} 
                    className="btn btn-start pulse float"
                    style={{ 
                        fontSize: '1.3rem', 
                        padding: '1.2rem 3rem',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        border: '3px solid #1e40af',
                        boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)'
                    }}
                >
                    🚀 ¡COMENZAR AVENTURA!
                </button>
            </div>
        </div>
    );
};

export default StartScreen;