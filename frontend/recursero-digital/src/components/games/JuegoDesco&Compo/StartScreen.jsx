import React from 'react';
import { useNavigate } from 'react-router-dom';

const StartScreen = ({ onStart }) => {
    const navigate = useNavigate();

    return (
        <div className="chalkboard" data-aos="fade-down">
            <div className="header-controls">
                <button 
                    className="btn-back-to-levels"
                    onClick={() => navigate('/alumno')}
                    title="Volver a juegos"
                >
                    ← Juegos
                </button>
            </div>

            <div className="slide-in" style={{ textAlign: 'center', maxWidth: '800px' }}>
                <h1 style={{
                    fontSize: '4rem',
                    fontWeight: 'bold',
                    color: '#ffd700',
                    marginBottom: '1rem',
                    fontFamily: 'Playfair Display, serif',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
                }}>
                    🔢 NumeroMágico ✨
                </h1>
                
                <p style={{
                    fontSize: '1.5rem',
                    color: '#e2e8f0',
                    marginBottom: '2rem',
                    fontWeight: '300'
                }}>
                    ¡Descubre el misterio de los números!
                </p>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    padding: '2rem',
                    borderRadius: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        color: '#ffd700',
                        marginBottom: '1rem',
                        fontFamily: 'Playfair Display, serif'
                    }}>
                        Descomposición y Composición Numérica
                    </h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{
                            background: 'rgba(139, 94, 52, 0.2)',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(139, 94, 52, 0.3)'
                        }}>
                            <h3 style={{ color: '#fcd34d', marginBottom: '0.5rem' }}>🧩 Descomposición</h3>
                            <p style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                                Separa el número en unidades, decenas, centenas y miles
                            </p>
                        </div>
                        
                        <div style={{
                            background: 'rgba(232, 106, 30, 0.2)',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(232, 106, 30, 0.3)'
                        }}>
                            <h3 style={{ color: '#fcd34d', marginBottom: '0.5rem' }}>🔧 Composición</h3>
                            <p style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                                Junta las partes para formar el número completo
                            </p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={onStart} 
                    className="btn btn-start pulse"
                    style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}
                >
                    🚀 COMENZAR AVENTURA
                </button>
            </div>
        </div>
    );
};

export default StartScreen;