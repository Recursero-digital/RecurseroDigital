import React, { useState, useEffect, useRef } from 'react';
import Sortable from 'sortablejs';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './JuegoOrdenamiento.css';

const JuegoOrdenarNumeros = () => {
  
    const [gameState, setGameState] = useState({
        currentLevel: 1,
        attempts: 0,
        score: 0,
    });
    const [numbers, setNumbers] = useState([]);
    const [sortedNumbers, setSortedNumbers] = useState([]);
    const [showLevelComplete, setShowLevelComplete] = useState(false);
    const [showGameComplete, setShowGameComplete] = useState(false);

 
    const levelRanges = [
        { min: 1, max: 100 },
        { min: 101, max: 500 },
        { min: 501, max: 1000 },
        { min: 1001, max: 2000 },
        { min: 2001, max: 4000 }
    ];
    const numbersCount = 6;


    const numbersContainerRef = useRef(null);
    const targetAreaUpRef = useRef(null);
    const targetAreaDownRef = useRef(null);


    const generateNumbers = (level) => {
        const levelRange = levelRanges[level - 1];
        const newNumbers = new Set();
        while (newNumbers.size < numbersCount) {
            const num = Math.floor(Math.random() * (levelRange.max - levelRange.min + 1)) + levelRange.min;
            newNumbers.add(num);
        }
        
        const numbersArray = Array.from(newNumbers);
        setNumbers(numbersArray.sort(() => Math.random() - 0.5)); 
        setSortedNumbers([...numbersArray].sort((a, b) => b - a)); 
    };
    

    useEffect(() => {
        AOS.init();
        generateNumbers(gameState.currentLevel);

        const checkOrder = () => {
            const currentNumbersUp = Array.from(targetAreaUpRef.current.querySelectorAll('[data-value]')).map(el => parseInt(el.getAttribute('data-value')));
            
            if (currentNumbersUp.length === numbersCount && JSON.stringify(currentNumbersUp) === JSON.stringify(sortedNumbers)) {
                // El usuario ha ganado el nivel
                const newScore = gameState.score + (100 * gameState.currentLevel) - (gameState.attempts * 5);
                setGameState(prev => ({ ...prev, score: Math.max(0, newScore) }));

                if (gameState.currentLevel >= levelRanges.length) {
                    setShowGameComplete(true);
                } else {
                    setShowLevelComplete(true);
                }
            }
        };

        const sortableOptions = {
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            group: 'shared',
            onEnd: checkOrder,
        };

        // Inicializamos SortableJS en los contenedores
        new Sortable(targetAreaUpRef.current, sortableOptions);
        new Sortable(targetAreaDownRef.current, sortableOptions);
        new Sortable(numbersContainerRef.current, { ...sortableOptions, sort: false });

    }, [gameState.currentLevel]); 


    const handleNextLevel = () => {
        const nextLevel = gameState.currentLevel + 1;
        setGameState({ currentLevel: nextLevel, attempts: 0, score: gameState.score });
        setShowLevelComplete(false);
        generateNumbers(nextLevel);
    };

    const handleRestartGame = () => {
        setGameState({ currentLevel: 1, attempts: 0, score: 0 });
        setShowLevelComplete(false);
        setShowGameComplete(false);
        generateNumbers(1);
    };

    return (
        <div className="juego-container">
            <div className="juego-titulo">
                <h1>Ordenamiento Numérico</h1>
                <p>Arrastra los números para ordenarlos de mayor a menor</p>
            </div>

            <div className="juego-panel" data-aos="fade-up">
                <div className="juego-stats">
                    <div className="stat-item">
                        <span className="stat-label">Nivel:</span>
                        <span className="stat-value">{gameState.currentLevel}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Intentos:</span>
                        <span className="stat-value">{gameState.attempts}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Puntuación:</span>
                        <span className="stat-value">{gameState.score}</span>
                    </div>
                </div>

                <div className="progress-container">
                    <div className="progress-label">
                        <span>Progreso:</span>
                        <span>{gameState.currentLevel}/{levelRanges.length}</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(gameState.currentLevel / levelRanges.length) * 100}%` }}></div>
                    </div>
                </div>

                {!(showLevelComplete || showGameComplete) && (
                    <div id="game-container">
                        <div ref={targetAreaUpRef} className="target-area">
                            <p className="target-area-label">Arrastra los números aquí (de mayor a menor)</p>
                        </div>
                        <div ref={numbersContainerRef} className="numbers-container">
                            {numbers.map(num => (
                                <div key={num} className="draggable-box" data-value={num}>
                                    {num}
                                </div>
                            ))}
                        </div>
                        <div ref={targetAreaDownRef} className="target-area">
                            <p className="target-area-label">Área alternativa de ordenamiento</p>
                        </div>
                    </div>
                )}
                
                {showLevelComplete && (
                     <div className="level-complete">
                        <h2>¡Nivel Completado!</h2>
                        <button onClick={handleNextLevel} className="btn">Siguiente Nivel</button>
                    </div>
                )}

            </div>
            
            {showGameComplete && (
                <div className="game-complete" data-aos="zoom-in">
                    <h2>¡Juego Completado!</h2>
                    <p>Puntuación final: <span className="final-score">{gameState.score}</span></p>
                    <button onClick={handleRestartGame} className="btn">Jugar de Nuevo</button>
                </div>
            )}
        </div>
    );
};

export default JuegoOrdenarNumeros;