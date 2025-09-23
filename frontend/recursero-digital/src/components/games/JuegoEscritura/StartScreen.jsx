import React from 'react';

const StartScreen = ({ onStart }) => (
    <div className="chalkboard" data-aos="fade-down">
        <h1>✏️ Números en Letras ✏️</h1>
        <p>¡Aprende a escribir los números en palabras!</p>
        <button onClick={onStart} className="btn btn-start">COMENZAR</button>
    </div>
);

export default StartScreen;