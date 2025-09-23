import React from 'react';

const GameScreen = ({ level, activity, points, targetNumber, options, selected, onSelect, onCheck, onClear }) => (
    <div className="chalkboard">
        <div className="game-hud">
            <div>Nivel: <span>{level}</span> | Actividad: <span>{activity}</span>/5</div>
            <div>Puntos: <span>{points}</span></div>
        </div>
        <div className="paper-note" data-aos="zoom-in">
            <div className="target-number">{targetNumber}</div>
            <div>Escribe este número en palabras</div>
        </div>
        <div className="options-container">
            {options.map((option, index) => (
                <div key={index} onClick={() => onSelect(option)} className="paper-note number-option">{option}</div>
            ))}
        </div>
        <div className="selected-container">
            {selected.map((word, index) => <div key={index} className="paper-note selected-word">{word}</div>)}
        </div>
        <div className="button-group">
            <button onClick={onCheck} className="btn btn-verify">Verificar</button>
            <button onClick={onClear} className="btn btn-clear">Limpiar</button>
        </div>
    </div>
);
export default GameScreen;