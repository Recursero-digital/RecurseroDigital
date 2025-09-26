import React from 'react';
import { useNavigate } from 'react-router-dom';

const StartScreen = ({ onStart }) => {
    const navigate = useNavigate();

    const handleVolverDashboard = () => {
        navigate('/alumno/juegos');
    };

    return (
        <div className="chalkboard" data-aos="fade-down">
            <h1>✏️ Números en Letras ✏️</h1>
            <p>¡Aprende a escribir los números en palabras!</p>
            <div className="button-group">
                <button onClick={onStart} className="btn btn-start">COMENZAR</button>
                <button onClick={handleVolverDashboard} className="btn btn-secondary">🏠 Volver al Dashboard</button>
            </div>
        </div>
    );
};

export default StartScreen;