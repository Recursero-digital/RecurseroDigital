import React, { useState, useEffect, useRef } from 'react';
import Sortable from 'sortablejs';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './JuegoOrdenamiento.css';

const JuegoOrdenamiento = () => {
 
    const [gameState, setGameState] = useState({
        currentLevel: 1,
        attempts: 0,
        score: 0
    });
    const [numbers, setNumbers] = useState([]);
    const [sortedNumbers, setSortedNumbers] = useState([]);
    const [showGameComplete, setShowGameComplete] = useState(false);
    const [showLevelUp, setShowLevelUp] = useState(false);

    const levelRanges = [
        { min: 1, max: 100 },
        { min: 101, max: 500 },
        { min: 501, max: 1000 },
        { min: 1001, max: 2000 },
        { min: 2001, max: 4000 }
    ];
    
    const numbersCount = 6;
    const targetAreaRef = useRef(null);
    const numbersContainerRef = useRef(null);

    // Función mejorada para generar números
    const generateNumbers = (level) => {
        const { min, max } = levelRanges[level - 1];
        const generatedNumbers = new Set();
        
        while (generatedNumbers.size < numbersCount) {
            const newNum = Math.floor(Math.random() * (max - min + 1)) + min;
            if (!generatedNumbers.has(newNum)) {
                generatedNumbers.add(newNum);
            }
        }
        
        const numbersArray = Array.from(generatedNumbers);
        setNumbers([...numbersArray].sort(() => Math.random() - 0.5));
        setSortedNumbers([...numbersArray].sort((a, b) => b - a));
    };

    useEffect(() => {
        AOS.init();
        generateNumbers(gameState.currentLevel);

        // Configuración para el área de destino
        if (targetAreaRef.current) {
            new Sortable(targetAreaRef.current, {
                group: 'shared',
                animation: 150,
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',
                onAdd: () => {  // Removed unused evt parameter
                    const currentNumbers = Array.from(targetAreaRef.current.children)
                        .filter(el => el.classList.contains('number-box'))
                        .map(el => parseInt(el.dataset.value));

                    if (currentNumbers.length === numbersCount) {
                        const isEvenLevel = gameState.currentLevel % 2 === 0;
                        const correctOrder = [...sortedNumbers].sort((a, b) => 
                            isEvenLevel ? a - b : b - a
                        );
                        const isCorrect = JSON.stringify(currentNumbers) === JSON.stringify(correctOrder);

                        if (isCorrect) {
                            const newScore = gameState.score + (100 * gameState.currentLevel) - (gameState.attempts * 5);
                            
                            // Mostrar mensaje de nivel completado
                            setShowLevelUp(true);

                            // Esperar que se muestre el mensaje antes de cambiar de nivel
                            setTimeout(() => {
                                if (gameState.currentLevel >= levelRanges.length) {
                                    setShowGameComplete(true);
                            } else {
                                setGameState(prev => ({
                                    ...prev,
                                    currentLevel: prev.currentLevel + 1,
                                    attempts: 0,
                                    score: Math.max(0, newScore)
                                }));
                                generateNumbers(gameState.currentLevel + 1);
                                targetAreaRef.current.innerHTML = '';
                                setShowLevelUp(false);
                            }
                        }, 2000);
                        } else {
                            setGameState(prev => ({
                                ...prev,
                                attempts: prev.attempts + 1
                            }));
                            setTimeout(() => {
                                targetAreaRef.current.innerHTML = '';
                            generateNumbers(gameState.currentLevel);
                        }, 500);
                        }
                    }
                }
            });
        }

        // Configuración para el contenedor de números
        if (numbersContainerRef.current) {
            new Sortable(numbersContainerRef.current, {
                group: 'shared',
                animation: 150,
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag'
            });
        }
    }, [gameState.currentLevel]);

    const getOrderInstructionForLevel = (level) => {
        return level % 2 === 0 ? 
            "Ordena los números de menor a mayor" : 
            "Ordena los números de mayor a menor";
    };

    return (
        <div className="game-fullscreen">
            <div className="game-content">
                <header className="game-header">
                    <h1>Ordenamiento Numérico</h1>
                    <p>{getOrderInstructionForLevel(gameState.currentLevel)}</p>
                </header>

                <div className="game-status">
                    <div className="status-item">
                        <span className="status-label">Nivel</span>
                        <span className="status-value">{gameState.currentLevel}</span>
                    </div>
                    <div className="status-item">
                        <span className="status-label">Intentos</span>
                        <span className="status-value">{gameState.attempts}</span>
                    </div>
                    <div className="status-item">
                        <span className="status-label">Puntuación</span>
                        <span className="status-value">{gameState.score}</span>
                    </div>
                </div>

                <div className="progress-container">
                    <div 
                        className="progress-bar" 
                        style={{width: `${(gameState.currentLevel / levelRanges.length) * 100}%`}}
                    />
                </div>

                {!showGameComplete ? (
                    <div className="game-play-area">
                        <div className="sorting-zone">
                            <div className="sorting-area" ref={targetAreaRef}>
                            </div>
                        </div>
                        
                        <div className="numbers-source">
                            <div className="numbers-container" ref={numbersContainerRef}>
                                {numbers.map(number => (
                                    <div 
                                        key={number}
                                        className="number-box"
                                        data-value={number}
                                    >
                                        {number}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="game-complete">
                        <h2>¡Juego Completado!</h2>
                        <p>Has completado todos los niveles</p>
                        <p>Puntuación final: {gameState.score}</p>
                        <button onClick={() => window.location.reload()}>
                            Jugar de nuevo
                        </button>
                    </div>
                )}

                {showLevelUp && !showGameComplete && (
                    <div className="level-up-message">
                        <h2>¡Felicitaciones!</h2>
                        <p>Has completado el nivel {gameState.currentLevel}</p>
                        <p>¡Prepárate para el nivel {gameState.currentLevel + 1}!</p>
                        <p className="level-instruction">
                            {getOrderInstructionForLevel(gameState.currentLevel + 1)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JuegoOrdenamiento;