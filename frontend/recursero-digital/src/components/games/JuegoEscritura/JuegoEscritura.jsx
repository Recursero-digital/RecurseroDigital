import React, { useState, useEffect, useCallback } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './JuegoEscritura.css';
import { numberToWords, levelRanges, generateOptions } from './utils'; 
import StartScreen from './StartScreen';
import LevelSelectScreen from './LevelSelectScreen';
import GameScreen from './GameScreen';
import FeedbackModal from './FeedbackModal';
import CongratsModal from './CongratsModal';
import { useUserProgress } from '../../hooks/useUserProgress';

const JuegoEscritura = () => {
    const { unlockLevel } = useUserProgress();
    const [gameState, setGameState] = useState('start');
    const [currentLevel, setCurrentLevel] = useState(0);
    const [currentActivity, setCurrentActivity] = useState(0);
    const [points, setPoints] = useState(0);
    const [targetNumber, setTargetNumber] = useState(0);
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [correctAnswer, setCorrectAnswer] = useState([]);
    const [feedback, setFeedback] = useState({ title: '', text: '', isCorrect: false });
    
    useEffect(() => { 
        AOS.init(); 
    }, []);
    
    const startNewActivity = useCallback(() => {
        const range = levelRanges[currentLevel];
        if (!range) return;

        const randomNumber = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        const correctAnswerText = numberToWords(randomNumber);
        const correctAnswerWords = correctAnswerText.split(' ');
        const newOptions = generateOptions(correctAnswerWords);

        setTargetNumber(randomNumber);
        setCorrectAnswer(correctAnswerWords);
        setOptions(newOptions);
        setSelectedOptions([]);
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
    
    const handleSelectOption = (word) => {
        setSelectedOptions(prev => [...prev, word]);
        setOptions(prev => prev.filter(option => option !== word));
    };
    
    const handleRemoveOption = (index) => {
        const removedWord = selectedOptions[index];
        setSelectedOptions(prev => prev.filter((_, i) => i !== index));
        setOptions(prev => [...prev, removedWord]);
    };
    
    const handleCheckAnswer = () => {
        const isCorrect = selectedOptions.join(' ') === correctAnswer.join(' ');
        if (isCorrect) {
            if (currentActivity < 4) {
                setFeedback({ 
                    title: '✅ ¡Correcto!', 
                    text: '¡Muy bien! Avanza a la siguiente actividad.', 
                    isCorrect: true 
                });
                setGameState('feedback');
            } else {
                // Solo otorgar puntos cuando se complete toda la actividad (5 ejercicios)
                setPoints(prev => prev + (currentLevel + 1) * 50);
                // Desbloquear siguiente nivel
                unlockLevel('escritura', currentLevel + 2);
                setGameState('congrats');
            }
        } else {
            setFeedback({ 
                title: '❌ Incorrecto', 
                text: `La respuesta correcta es: "${correctAnswer.join(' ')}".`, 
                isCorrect: false 
            });
            setGameState('feedback');
        }
    };
    
    const handleClear = () => {
        setOptions(prev => [...prev, ...selectedOptions]);
        setSelectedOptions([]);
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
                targetNumber={targetNumber}
                options={options}
                selected={selectedOptions}
                onSelect={handleSelectOption}
                onRemove={handleRemoveOption}
                onCheck={handleCheckAnswer}
                onClear={handleClear}
            />}
            
            {gameState === 'feedback' && <FeedbackModal feedback={feedback} onContinue={handleContinue} />}
            
            {gameState === 'congrats' && <CongratsModal level={currentLevel + 1} onNextLevel={() => setGameState('level-select')} />}
        </div>
    );
};

export default JuegoEscritura;
