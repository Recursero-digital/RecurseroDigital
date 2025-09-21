// Ubicación: src/components/games/JuegoOrdenamiento.jsx

import React, { useState, useEffect, useRef } from 'react';
import Sortable from 'sortablejs';
import AOS from 'aos'; 
import 'aos/dist/aos.css';
import './JuegoOrdenamiento.css'; 

const JuegoOrdenamiento = () => {
 
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

            const currentNumbersUp = Array.from(targetAreaUpRef.current.children).map(el => parseInt(el.dataset.value));
            const currentNumbersDown = Array.from(targetAreaDownRef.current.children).map(el => parseInt(el.dataset.value));
            
            let correct = false;

            if (JSON.stringify(currentNumbersUp) === JSON.stringify(sortedNumbers)) correct = true;
            if (JSON.stringify(currentNumbersDown) === JSON.stringify(sortedNumbers)) correct = true;

            if (correct) {
                const newScore = gameState.score + (100 * gameState.currentLevel) - (gameState.attempts * 5);
                setGameState(prev => ({ ...prev, score: Math.max(0, newScore) }));

                if (gameState.currentLevel >= levelRanges.length) {
                    setShowGameComplete(true);
                } else {
                    setShowLevelComplete(true);
                }
            } else if (currentNumbersUp.length + currentNumbersDown.length === numbersCount) {

                setGameState(prev => ({ ...prev, attempts: prev.attempts + 1 }));
            }
        };

        const sortableOptions = {
            animation: 150,
            ghostClass: 'bg-indigo-100', 
            group: 'shared', 
            onEnd: checkOrder, 
        };


        if (targetAreaUpRef.current) new Sortable(targetAreaUpRef.current, sortableOptions);
        if (targetAreaDownRef.current) new Sortable(targetAreaDownRef.current, sortableOptions);
        if (numbersContainerRef.current) new Sortable(numbersContainerRef.current, { ...sortableOptions, group: 'shared', sort: false });

    }, [gameState.currentLevel]); 


    const handleNextLevel = () => {
        const nextLevel = gameState.currentLevel + 1;
        setGameState({ currentLevel: nextLevel, attempts: 0, score: gameState.score });
        setShowLevelComplete(false);
    };

    const handleRestartGame = () => {
        setGameState({ currentLevel: 1, attempts: 0, score: 0 });
        setShowLevelComplete(false);
        setShowGameComplete(false);
    };


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-indigo-700 mb-2">Ordenamiento Numérico</h1>
                <p className="text-lg text-gray-600">Arrastra los números para ordenarlos de mayor a menor</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-8" data-aos="fade-up">
 
                <div className="flex justify-between items-center mb-6">
                    <div><span className="text-gray-600">Nivel:</span><span id="level-display" className="ml-2 text-xl font-bold text-indigo-600">{gameState.currentLevel}</span></div>
                    <div><span className="text-gray-600">Intentos:</span><span id="attempts-display" className="ml-2 text-xl font-bold text-indigo-600">{gameState.attempts}</span></div>
                    <div><span className="text-gray-600">Puntuación:</span><span id="score-display" className="ml-2 text-xl font-bold text-indigo-600">{gameState.score}</span></div>
                </div>


                <div className="mb-8">
                    <div className="flex justify-between mb-2"><span className="text-gray-600">Progreso:</span><span id="progress-display">{gameState.currentLevel}/{levelRanges.length}</span></div>
                    <div className="w-full bg-gray-200 rounded-full h-4"><div id="progress-bar" className="bg-indigo-500 h-4 rounded-full" style={{ width: `${(gameState.currentLevel / levelRanges.length) * 100}%` }}></div></div>
                </div>
                
    
                {!showGameComplete && !showLevelComplete && (
                    <div id="game-container">
                        <div ref={targetAreaUpRef} className="target-area border-2 border-dashed border-gray-300 rounded-lg p-4 mb-6 flex flex-wrap gap-3 items-center justify-center"></div>
                        <div ref={numbersContainerRef} className="flex flex-wrap gap-4 justify-center mb-8 min-h-[80px]">
                            {numbers.map(num => (
                                <div key={num} className="draggable-box bg-indigo-500 text-white font-bold text-xl w-16 h-16 rounded-lg flex items-center justify-center cursor-move shadow-md hover:shadow-lg" data-value={num}>
                                    {num}
                                </div>
                            ))}
                        </div>
                        <div ref={targetAreaDownRef} className="target-area border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-wrap gap-3 items-center justify-center"></div>
                    </div>
                )}
                
                {showLevelComplete && (
                    <div id="level-complete-screen" className="text-center py-12">
                        <h2 className="text-3xl font-bold text-green-600 mb-4 level-complete">¡Nivel Completado!</h2>
                        <button id="next-level-btn" onClick={handleNextLevel} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition-all">Siguiente Nivel</button>
                    </div>
                )}
            </div>
            
            {showGameComplete && (
                <div id="game-complete-screen" className="bg-white rounded-xl shadow-lg p-8 text-center" data-aos="zoom-in">
                    <h2 className="text-4xl font-bold text-indigo-700 mb-4">¡Juego Completado!</h2>
                    <p className="text-xl text-gray-600 mb-6">Puntuación final: <span id="final-score" className="font-bold text-indigo-600">{gameState.score}</span></p>
                    <button id="restart-game-btn" onClick={handleRestartGame} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition-all">Jugar de Nuevo</button>
                </div>
            )}
        </div>
    );
};

export default JuegoOrdenamiento;