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

const JuegoEscritura = () => {
    const [gameState, setGameState] = useState('start');
    const [currentLevel, setCurrentLevel] = useState(0);
    const [currentActivity, setCurrentActivity] = useState(0);
    const [points, setPoints] = useState(0);
    const [targetNumber, setTargetNumber] = useState(0);
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [correctAnswer, setCorrectAnswer] = useState([]);
    const [feedback, setFeedback] = useState({ title: '', text: '', isCorrect: false });
    
    useEffect(() => { AOS.init(); }, []);
    
       const startNewActivity = useCallback(() => {
        const range = levelRanges[currentLevel];
        if (!range) return;

        const randomNumber = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        const correctAnswerWords = numberToWords(randomNumber).split(' ');
        const newOptions = generateOptions(correctAnswerWords);

        setTargetNumber(randomNumber);
        setCorrectAnswer(correctAnswerWords);
        setOptions(newOptions);
        setSelectedOptions([]);
    }, [currentLevel]);
    
    useEffect(() => {
        AOS.init();
    }, []);

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
    
    const handleCheckAnswer = () => {
        const isCorrect = selectedOptions.join(' ') === correctAnswer.join(' ');
        if (isCorrect) {
            setPoints(prev => prev + (currentLevel + 1) * 10);
            if (currentActivity < 4) {
                setFeedback({ title: '✅ ¡Correcto!', text: '¡Muy bien! Avanza a la siguiente actividad.', isCorrect: true });
                setGameState('feedback');
            } else {
                setGameState('congrats');
            }
        } else {
            setFeedback({ title: '❌ Incorrecto', text: `La respuesta correcta es: "${correctAnswer.join(' ')}".`, isCorrect: false });
            setGameState('feedback');
        }
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
                onSelect={(word) => setSelectedOptions(prev => [...prev, word])}
                onCheck={handleCheckAnswer}
                onClear={() => setSelectedOptions([])}
            />}
            
            {gameState === 'feedback' && <FeedbackModal feedback={feedback} onContinue={handleContinue} />}
            
            {gameState === 'congrats' && <CongratsModal level={currentLevel + 1} onNextLevel={() => setGameState('level-select')} />}
        </div>
    );
};

export default JuegoEscritura;