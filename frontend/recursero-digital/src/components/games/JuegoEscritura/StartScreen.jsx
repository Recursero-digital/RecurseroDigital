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
            <h1>✏️ Números en Letras ✏️</h1>
            <p>¡Aprende a escribir los números en palabras!</p>
            <div className="button-group">
                <button onClick={onStart} className="btn btn-start">COMENZAR</button>
            </div>
        </div>
    );
};

export default StartScreen;