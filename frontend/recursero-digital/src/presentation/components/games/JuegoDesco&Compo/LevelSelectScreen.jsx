import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProgress } from '../../../hooks/useUserProgress';

const LevelSelectScreen = ({ levels, onSelectLevel }) => {
    const navigate = useNavigate();
    const { isLevelUnlocked } = useUserProgress();

    const levelIcons = ['📚', '🏆', '🎯'];

    return (
        <div className="chalkboard">
            <div className="header-controls">
                <button 
                    className="btn-back-to-levels"
                    onClick={() => navigate('/alumno')}
                    title="Volver a juegos"
                >
                    ← Juegos
                </button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: '#ffd700',
                    marginBottom: '1rem',
                    fontFamily: 'Playfair Display, serif',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
                }}>
                    ✨ Elige tu Nivel ✨
                </h2>
                
                <p style={{
                    fontSize: '1.2rem',
                    color: '#e2e8f0',
                    fontWeight: '300'
                }}>
                    Selecciona el nivel que quieres jugar
                </p>
            </div>

            <div className="level-grid">
                {levels.map((level, index) => {
                    const levelNumber = index + 1;
                    const isUnlocked = isLevelUnlocked('descomposicion', levelNumber);
                    const isLocked = !isUnlocked;
                    
                    return (
                        <div 
                            key={index}
                            className={`level-card level-${level.color} ${isLocked ? 'locked' : ''} slide-in`}
                            onClick={() => isUnlocked && onSelectLevel(index)}
                            style={{ 
                                animationDelay: `${index * 0.1}s`,
                                position: 'relative'
                            }}
                        >
                            {isLocked && (
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    fontSize: '1.5rem'
                                }}>
                                    🔒
                                </div>
                            )}
                            
                            <div className="level-icon">
                                {levelIcons[index]}
                            </div>
                            
                            <h3 className="level-title">
                                Nivel {levelNumber}
                            </h3>
                            
                            <h4 style={{
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                color: level.color === 'chocolate' ? '#6f4518' : '#d95114',
                                marginBottom: '0.5rem'
                            }}>
                                {level.name}
                            </h4>
                            
                            <p className="level-range">
                                Números del {level.range}
                            </p>
                            
                            <button 
                                className={`btn ${isLocked ? 'btn-locked' : 'btn-start'}`}
                                disabled={isLocked}
                                style={{
                                    background: isLocked 
                                        ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                                        : level.color === 'chocolate'
                                            ? 'linear-gradient(135deg, #8b5e34 0%, #6f4518 100%)'
                                            : 'linear-gradient(135deg, #e86a1e 0%, #d95114 100%)',
                                    cursor: isLocked ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isLocked ? '🔒 Bloqueado' : '🚀 ¡Jugar!'}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '1.5rem',
                borderRadius: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                maxWidth: '600px',
                margin: '3rem auto 0',
                textAlign: 'center'
            }}>
                <h3 style={{
                    color: '#ffd700',
                    marginBottom: '1rem',
                    fontFamily: 'Playfair Display, serif'
                }}>
                    💡 Instrucciones
                </h3>
                <p style={{
                    color: '#e2e8f0',
                    lineHeight: '1.6',
                    fontSize: '0.95rem'
                }}>
                    Completa cada nivel con al menos 60% de aciertos para desbloquear el siguiente. 
                    ¡Cada nivel tiene 5 preguntas de descomposición y composición!
                </p>
            </div>
        </div>
    );
};

export default LevelSelectScreen;