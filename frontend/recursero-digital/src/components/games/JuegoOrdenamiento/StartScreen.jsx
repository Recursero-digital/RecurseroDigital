import React from 'react';

const StartScreen = ({ onStart }) => {
    return (
        <div className="start-screen">
            <h1>🎯 Ordenamiento Numérico</h1>
            <p>¡Aprende a ordenar números de forma divertida!</p>
            <div className="button-group">
                <button onClick={onStart} className="btn btn-start">COMENZAR</button>
            </div>
        </div>
    );
};

export default StartScreen;
