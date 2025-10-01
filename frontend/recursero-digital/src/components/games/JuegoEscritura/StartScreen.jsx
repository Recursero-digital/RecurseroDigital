import React from 'react';

const StartScreen = ({ onStart }) => {
    return (
        <div className="chalkboard" data-aos="fade-down">
            <h1>✏️ Números en Letras ✏️</h1>
            <p>¡Aprende a escribir los números en palabras!</p>
            <div className="button-group">
                <button onClick={onStart} className="btn btn-start">COMENZAR</button>
            </div>
        </div>
    );
};

export default StartScreen;