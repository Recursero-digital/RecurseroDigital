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
import ErrorPopup from './ErrorPopup';
import { useUserProgress } from '../../../hooks/useUserProgress';
import useGameScoring from '../../../hooks/useGameScoring';

const JuegoEscritura = () => {
    const { unlockLevel, getMaxUnlockedLevel } = useUserProgress();
    const { 
        points, 
        attempts, 
        incrementAttempts, 
        resetAttempts, 
        resetScoring, 
        completeActivity,
        isSubmitting,
        submitError 
    } = useGameScoring();
    
    const [gameState, setGameState] = useState('start');
    const [currentLevel, setCurrentLevel] = useState(0);
    const [currentActivity, setCurrentActivity] = useState(0);
    const [numbers, setNumbers] = useState([]);
    const [wordPairs, setWordPairs] = useState([]);
    const [dragAnswers, setDragAnswers] = useState({});
    const [usedNumbers, setUsedNumbers] = useState(new Set());
    const [feedback, setFeedback] = useState({ title: '', text: '', isCorrect: false });
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    
    useEffect(() => { 
        AOS.init(); 
    }, []);
    
    const startNewActivity = useCallback(() => {
        const activityData = generateDragDropActivity(currentLevel);
        setNumbers(activityData.numbers);
        setWordPairs(activityData.wordPairs);
        setDragAnswers({});
        setUsedNumbers(new Set());
        resetAttempts();
    }, [currentLevel]);
    
    useEffect(() => {
        if (gameState === 'game') {
            startNewActivity();
        }
    }, [gameState, currentLevel, currentActivity, startNewActivity]);
    
    const handleStartGame = (level) => {
        setCurrentLevel(level - 1);
        setCurrentActivity(0);
        resetScoring();
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
        const isCorrect = validateNumberWordPair(draggedNumber, targetWordPair.word);
        
        if (isCorrect) {
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
            // Si no es correcto, incrementamos intentos y mostramos popup de error
            incrementAttempts();
            setShowErrorPopup(true);
        }
    };
    
    const handleCheckAnswer = async () => {
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
            const activityScore = await completeActivity(currentLevel);
            
            if (currentActivity < 4) {
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



    
    const handleContinue = () => {
        if (feedback.isCorrect) {
            setCurrentActivity(prev => prev + 1);
        }
        setGameState('game');
    };

    const handleCloseErrorPopup = () => {
        setShowErrorPopup(false);
    };

    return (
        <div className="game-container">
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
            
            {gameState === 'congrats' && <CongratsModal level={currentLevel + 1} points={points} onNextLevel={() => setGameState('level-select')} />}
            
            <ErrorPopup show={showErrorPopup} onClose={handleCloseErrorPopup} />

        </div>
    );
};

export default JuegoEscritura;
