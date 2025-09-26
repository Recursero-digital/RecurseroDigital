import React from 'react';
import { useNavigate } from 'react-router-dom';

const GameScreen = ({ 
    level, 
    activity, 
    points, 
    targetNumber, 
    options, 
    selected, 
    onSelect, 
    onRemove, 
    onCheck, 
    onClear 
}) => {
    const navigate = useNavigate();

    const handleVolverDashboard = () => {
        navigate('/alumno/juegos');
    };

    return (
        <div className="chalkboard">
            <div className="game-header">
                <div className="game-hud">
                    <div>Nivel: <span>{level}</span> | Actividad: <span>{activity}</span>/5</div>
                    <div>Puntos: <span>{points}</span></div>
                </div>
                <button 
                    className="btn-volver-dashboard-floating"
                    onClick={handleVolverDashboard}
                    title="Volver al Dashboard"
                >
                    🏠
                </button>
            </div>
        
        <div className="paper-note" data-aos="zoom-in">
            <div className="target-number">{targetNumber}</div>
            <div>Escribe este número en palabras</div>
        </div>
        
        <div className="options-container">
            {options.map((option, index) => (
                <div 
                    key={`option-${index}`} 
                    onClick={() => onSelect(option)} 
                    className="paper-note number-option"
                >
                    {option}
                </div>
            ))}
        </div>
        
        <div className="selected-container">
            {selected.map((word, index) => (
                <div key={`selected-${index}`} className="paper-note selected-word">
                    {word}
                    <span 
                        onClick={() => onRemove(index)} 
                        className="remove-btn"
                        title="Remover palabra"
                    >
                        ✕
                    </span>
                </div>
            ))}
        </div>
        
        <div className="button-group">
            <button 
                onClick={onCheck} 
                className="btn btn-verify"
                disabled={selected.length === 0}
            >
                Verificar
            </button>
            <button 
                onClick={onClear} 
                className="btn btn-clear"
                disabled={selected.length === 0}
            >
                Limpiar
            </button>
        </div>
        </div>
    );
};

export default GameScreen;