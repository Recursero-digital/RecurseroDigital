import React, { useState, useEffect, useCallback } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './JuegoEscritura.css';
import { generateDragDropActivity, validateNumberWordPair } from './utils'; 
import StartScreen from './StartScreen';
import LevelSelectScreen from './LevelSelectScreen';
import GameScreen from './GameScreen';
import FeedbackModal from './FeedbackModal';
import CongratsModal from './CongratsModal';
import { useUserProgress } from '../../../hooks/useUserProgress';

const JuegoEscritura = () => {
    const { unlockLevel } = useUserProgress();
    const [gameState, setGameState] = useState('start');
    const [currentLevel, setCurrentLevel] = useState(0);
    const [currentActivity, setCurrentActivity] = useState(0);
    const [points, setPoints] = useState(0);
    const [numbers, setNumbers] = useState([]);
    const [wordPairs, setWordPairs] = useState([]);
    const [dragAnswers, setDragAnswers] = useState({});
    const [usedNumbers, setUsedNumbers] = useState(new Set());
    const [attempts, setAttempts] = useState(0);
    const [showHelp, setShowHelp] = useState(false);
    const [feedback, setFeedback] = useState({ title: '', text: '', isCorrect: false });
    
    useEffect(() => { 
        AOS.init(); 
    }, []);
    
    const startNewActivity = useCallback(() => {
        const activityData = generateDragDropActivity(currentLevel);
        setNumbers(activityData.numbers);
        setWordPairs(activityData.wordPairs);
        setDragAnswers({});
        setUsedNumbers(new Set());
        setAttempts(0);
    }, [currentLevel]);
    
    useEffect(() => {
        if (gameState === 'game') {
            startNewActivity();
        }
    }, [gameState, currentLevel, currentActivity, startNewActivity]);
    
    const handleStartGame = (level) => {
        setCurrentLevel(level - 1);
        setCurrentActivity(0);
        setPoints(0);
        setGameState('game');
    };
    
    const handleDragStart = (e, number) => {
        e.dataTransfer.setData('text/plain', number.toString());
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, wordPairIndex) => {
        e.preventDefault();
        const draggedNumber = parseInt(e.dataTransfer.getData('text/plain'));
        const targetWordPair = wordPairs[wordPairIndex];
        
        // Validar si el número coincide con la palabra
        const isCorrect = validateNumberWordPair(draggedNumber, targetWordPair.word);
        
        if (isCorrect) {
            // Si es correcto, lo colocamos
            const currentNumber = dragAnswers[wordPairIndex];
            if (currentNumber) {
                setUsedNumbers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(currentNumber);
                    return newSet;
                });
            }
            
            setUsedNumbers(prev => new Set([...prev, draggedNumber]));
            
            setDragAnswers(prev => ({
                ...prev,
                [wordPairIndex]: draggedNumber
            }));
        } else {
            // Si no es correcto, incrementamos intentos
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            
            // Mostrar ayuda después de 5 intentos fallidos
            if (newAttempts >= 5) {
                setShowHelp(true);
            }
        }
    };
    
    const handleCheckAnswer = () => {
        // Verificar si todos los campos están llenos
        const allAnswersProvided = wordPairs.every((_, index) => dragAnswers[index] !== undefined);
        
        if (!allAnswersProvided) {
            setFeedback({ 
                title: '⚠️ Faltan respuestas', 
                text: 'Por favor completa todos los campos antes de verificar.', 
                isCorrect: false 
            });
            setGameState('feedback');
            return;
        }

        // Verificar cada respuesta
        let correctCount = 0;
        let incorrectAnswers = [];

        wordPairs.forEach((wordPair, index) => {
            const userAnswer = dragAnswers[index];
            const isCorrect = validateNumberWordPair(userAnswer, wordPair.word);
            
            if (isCorrect) {
                correctCount++;
            } else {
                incorrectAnswers.push(`${userAnswer} → ${wordPair.word}`);
            }
        });

        const allCorrect = correctCount === wordPairs.length;

        if (allCorrect) {
            const baseScore = 50 * (currentLevel + 1);
            const penaltyForAttempts = attempts * 5;
            const activityScore = Math.max(0, baseScore - penaltyForAttempts);
            
            setPoints(prev => prev + activityScore);
            
            if (currentActivity < 2) {
                setFeedback({ 
                    title: '✅ ¡Perfecto!', 
                    text: `¡Excelente! Todas las respuestas son correctas. Ganaste ${activityScore} puntos. Avanza a la siguiente actividad.`, 
                    isCorrect: true 
                });
                setGameState('feedback');
            } else {
                unlockLevel('escritura', currentLevel + 2);
                setGameState('congrats');
            }
        } else {
            setFeedback({ 
                title: '❌ Algunas respuestas incorrectas', 
                text: `Tienes ${correctCount}/${wordPairs.length} correctas. Revisa las respuestas marcadas.`, 
                isCorrect: false 
            });
            setGameState('feedback');
        }
    };
    
    const handleRemoveNumber = (wordPairIndex) => {
        const numberToRemove = dragAnswers[wordPairIndex];
        if (numberToRemove) {
            setUsedNumbers(prev => {
                const newSet = new Set(prev);
                newSet.delete(numberToRemove);
                return newSet;
            });
            
            setDragAnswers(prev => {
                const newAnswers = { ...prev };
                delete newAnswers[wordPairIndex];
                return newAnswers;
            });
        }
    };


    const handleCloseHelp = () => {
        setShowHelp(false);
    };
    
    const handleContinue = () => {
        if (feedback.isCorrect) {
            setCurrentActivity(prev => prev + 1);
        }
        setGameState('game');
    };

    return (
        <div className="game-wrapper">
            {gameState === 'start' && <StartScreen onStart={() => setGameState('level-select')} />}
            
            {gameState === 'level-select' && <LevelSelectScreen onSelectLevel={handleStartGame} />}
            
            {gameState === 'game' && <GameScreen
                level={currentLevel + 1}
                activity={currentActivity + 1}
                points={points}
                attempts={attempts}
                numbers={numbers}
                wordPairs={wordPairs}
                dragAnswers={dragAnswers}
                usedNumbers={usedNumbers}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onRemoveNumber={handleRemoveNumber}
                onCheck={handleCheckAnswer}
                onBackToLevels={() => setGameState('level-select')}
            />}
            
            {gameState === 'feedback' && <FeedbackModal feedback={feedback} onContinue={handleContinue} />}
            
            {gameState === 'congrats' && <CongratsModal level={currentLevel + 1} onNextLevel={() => setGameState('level-select')} />}
            
            {showHelp && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="help-title">💡 Ayuda - Pista para completar la actividad</h2>
                        <div className="help-content">
                            <p>Has tenido 5 intentos fallidos. Aquí tienes una pista:</p>
                            <div className="help-example">
                                <p><strong>Ejemplo:</strong> El número <span className="example-number">123</span> se escribe como <span className="example-word">"ciento veintitres"</span></p>
                                <p><strong>Consejo:</strong> Lee cada palabra cuidadosamente y encuentra el número que le corresponde.</p>
                            </div>
                            <div className="help-numbers">
                                <p><strong>Números en esta actividad:</strong></p>
                                <div className="help-numbers-list">
                                    {wordPairs.map((pair, index) => (
                                        <div key={index} className="help-number-pair">
                                            <span className="help-number">{pair.number}</span> → <span className="help-word">{pair.word}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button 
                            className="btn btn-continue"
                            onClick={handleCloseHelp}
                        >
                            Entendido, continuar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JuegoEscritura;
