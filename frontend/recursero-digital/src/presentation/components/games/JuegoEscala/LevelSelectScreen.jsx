import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProgress } from '../../../hooks/useUserProgress';

const LevelSelectScreen = ({ levels, onSelectLevel }) => {
    const navigate = useNavigate();
    const { isLevelUnlocked } = useUserProgress();

    const levelIcons = ['🔍', '📈', '🎯'];
    const levelColors = ['blue', 'green', 'purple'];

    return (
        <div className="ocean-scene">
            <div className="landscape"></div>
            <div className="lighthouse"></div>
            <div className="house"></div>
            
            <div className="header-controls" style={{ zIndex: 999, position: 'relative' }}>
                <button 
                    className="btn-back-to-levels"
                    onClick={() => navigate('/alumno')}
                    title="Volver a juegos"
                    style={{
                        position: 'relative',
                        zIndex: 1000
                    }}
                >
                    ← Juegos
                </button>
            </div>

            <div style={{ 
                textAlign: 'center', 
                paddingTop: '4rem',
                position: 'relative',
                zIndex: 10
            }}>
                <h2 style={{
                    fontSize: '3.5rem',
                    fontWeight: '900',
                    color: '#1e3a8a',
                    marginBottom: '1rem',
                    fontFamily: 'Fredoka, sans-serif',
                    textShadow: '3px 3px 6px rgba(0, 0, 0, 0.2)',
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 20%, #6366f1 40%, #8b5cf6 60%, #7c3aed 80%, #5b21b6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    ⚡ Elige tu Aventura ⚡
                </h2>
                
                <p style={{
                    fontSize: '1.3rem',
                    color: '#0c4a6e',
                    fontWeight: '600',
                    marginBottom: '3rem',
                    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
                }}>
                    Selecciona el nivel de dificultad
                </p>
            </div>

            <div className="level-grid">
                {levels.map((level, index) => {
                    const levelNumber = index + 1;
                    const isUnlocked = isLevelUnlocked('escala', levelNumber);
                    const isLocked = !isUnlocked;
                    const color = levelColors[index];
                    
                    return (
                        <div 
                            key={index}
                            className={`level-card ${color} ${isLocked ? 'locked' : ''} slide-in`}
                            onClick={() => isUnlocked && onSelectLevel(index)}
                            style={{ 
                                animationDelay: `${index * 0.2}s`,
                                position: 'relative'
                            }}
                        >
                            {isLocked && (
                                <div style={{
                                    position: 'absolute',
                                    top: '1.5rem',
                                    right: '1.5rem',
                                    fontSize: '2rem',
                                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                                }}>
                                    🔒
                                </div>
                            )}
                            
                            <div className={`level-icon ${color} ${isLocked ? '' : 'float'}`}>
                                {levelIcons[index]}
                            </div>
                            
                            <h3 className="level-title">
                                Nivel {levelNumber}
                            </h3>
                            
                            <h4 style={{
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                color: color === 'blue' ? '#1e40af' : 
                                       color === 'green' ? '#065f46' : '#5b21b6',
                                marginBottom: '1rem',
                                fontFamily: 'Fredoka, sans-serif'
                            }}>
                                {level.name}
                            </h4>
                            
                            <p className="level-description">
                                {level.description}
                            </p>
                            
                            <p className="level-range">
                                Números del {level.range}
                            </p>
                            
                            <div style={{
                                background: color === 'blue' ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)' :
                                           color === 'green' ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)' :
                                           'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(91, 33, 182, 0.1) 100%)',
                                padding: '1rem',
                                borderRadius: '1rem',
                                marginBottom: '1.5rem',
                                border: `2px solid ${color === 'blue' ? '#1e3a8a' : 
                                                    color === 'green' ? '#6366f1' : '#7c3aed'}`
                            }}>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '900',
                                    color: color === 'blue' ? '#1e40af' : 
                                           color === 'green' ? '#065f46' : '#5b21b6'
                                }}>
                                    {level.operation > 1 ? `±${level.operation}` : '±1'}
                                </div>
                                <div style={{
                                    fontSize: '0.9rem',
                                    color: color === 'blue' ? '#1e40af' : 
                                           color === 'green' ? '#065f46' : '#5b21b6',
                                    fontWeight: '600'
                                }}>
                                    Saltos de {level.operation}
                                </div>
                            </div>
                            
                            <button 
                                className={`btn ${isLocked ? 'btn-locked' : 'btn-start'}`}
                                disabled={isLocked}
                                style={{
                                    background: isLocked 
                                        ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                                        : color === 'blue'
                                            ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 20%, #6366f1 40%, #8b5cf6 60%, #7c3aed 80%, #5b21b6 100%)'
                                            : color === 'green'
                                                ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 20%, #6366f1 40%, #8b5cf6 60%, #7c3aed 80%, #5b21b6 100%)'
                                                : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 20%, #6366f1 40%, #8b5cf6 60%, #7c3aed 80%, #5b21b6 100%)',
                                    border: `3px solid ${isLocked ? '#6b7280' : '#1e3a8a'}`,
                                    cursor: isLocked ? 'not-allowed' : 'pointer',
                                    fontSize: '1.1rem',
                                    fontWeight: '700'
                                }}
                            >
                                {isLocked ? '🔒 Bloqueado' : '🚀 ¡Explorar!'}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                padding: '2rem',
                borderRadius: '2rem',
                border: '3px solid #3b82f6',
                maxWidth: '700px',
                margin: '3rem auto 2rem',
                textAlign: 'center',
                position: 'relative',
                zIndex: 10,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
            }}>
                <h3 style={{
                    color: '#1e40af',
                    marginBottom: '1rem',
                    fontFamily: 'Fredoka, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: '700'
                }}>
                    💡 Instrucciones de Juego
                </h3>
                <div style={{
                    color: '#0c4a6e',
                    lineHeight: '1.7',
                    fontSize: '1rem',
                    fontWeight: '500',
                    textAlign: 'left'
                }}>
                    <p style={{ marginBottom: '1rem' }}>
                        🎯 <strong>Objetivo:</strong> Completa cada nivel con al menos 60% de aciertos para desbloquear el siguiente.
                    </p>
                    <p style={{ marginBottom: '1rem' }}>
                        📝 <strong>Modalidades:</strong> Encontrar números anteriores/posteriores y completar secuencias numéricas.
                    </p>
                    <p style={{ margin: 0 }}>
                        ⭐ <strong>Puntuación:</strong> ¡Cada nivel tiene 5 actividades emocionantes!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LevelSelectScreen;