import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './JuegoDescomposicion.css';
import StartScreen from './StartScreen';
import LevelSelectScreen from './LevelSelectScreen';
import GameScreen from './GameScreen';
import FeedbackModal from './FeedbackModal';
import CongratsModal from './CongratsModal';
import HintModal from '../../shared/HintModal';
import { useUserProgress } from '../../../hooks/useUserProgress';
import useGameScoring from '../../../hooks/useGameScoring';

const JuegoDescomposicion = () => {
    const { unlockLevel } = useUserProgress();
    const { 
        points, 
        attempts, 
        incrementAttempts, 
        resetAttempts, 
        resetScoring, 
        completeActivity,
        startActivityTimer
    } = useGameScoring();
    const [gameState, setGameState] = useState('start');
    const [currentLevel, setCurrentLevel] = useState(0);
    const [currentActivity, setCurrentActivity] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [showCongrats, setShowCongrats] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [feedback, setFeedback] = useState({ title: '', text: '', isCorrect: false });
    const [questions, setQuestions] = useState([]);
    const [totalQuestions] = useState(5);

    useEffect(() => {
        AOS.init();
    }, []);

    const levels = useMemo(() => [
        { name: "Fácil", range: "0 al 99", min: 10, max: 99, color: "chocolate" },
        { name: "Intermedio", range: "100 al 999", min: 100, max: 999, color: "terracotta" },
        { name: "Avanzado", range: "1.000 al 9.999", min: 1000, max: 9999, color: "chocolate" }
    ], []);

    const generateNumber = useCallback((level) => {
        const levelConfig = levels[level];
        return Math.floor(Math.random() * (levelConfig.max - levelConfig.min + 1)) + levelConfig.min;
    }, [levels]);

    const decomposeNumber = useCallback((num) => {
        const str = num.toString();
        let decomposition = [];
        
        for (let i = 0; i < str.length; i++) {
            const digit = parseInt(str[i]);
            const placeValue = Math.pow(10, str.length - 1 - i);
            const value = digit * placeValue;
            if (value > 0) {
                decomposition.push(value);
            }
        }
        
        return decomposition;
    }, []);

    const generateQuestions = useCallback((level) => {
        const newQuestions = [];
        
        for (let i = 0; i < totalQuestions; i++) {
            const gameType = Math.random() > 0.5 ? 'decomposition' : 'composition';
            const number = generateNumber(level);
            const decomposition = decomposeNumber(number);
            
            if (gameType === 'decomposition') {
                newQuestions.push({
                    type: 'decomposition',
                    number: number,
                    correctAnswer: decomposition,
                    hint: "Cada cifra ocupa un lugar: unidades, decenas, centenas, miles"
                });
            } else {
                newQuestions.push({
                    type: 'composition',
                    decomposition: decomposition,
                    correctAnswer: number,
                    hint: "Suma todos los números para obtener el resultado"
                });
            }
        }
        
        return newQuestions;
    }, [generateNumber, decomposeNumber, totalQuestions]);

    const handleStartGame = useCallback(() => {
        setGameState('levelSelect');
    }, []);

    const handleSelectLevel = useCallback((level) => {
        setCurrentLevel(level);
        setCurrentActivity(0);
        setQuestions(generateQuestions(level));
        resetScoring();
                    resetAttempts();
        setGameState('playing');
    }, [generateQuestions, resetScoring, resetAttempts]);

    useEffect(() => {
        if (gameState === 'playing' && questions.length > 0) {
            setCurrentQuestion(questions[currentActivity]);
            setUserAnswer('');
            startActivityTimer();
        }
    }, [gameState, currentActivity, questions, startActivityTimer]);

    const handleCheckAnswer = useCallback(() => {
        if (!currentQuestion || !userAnswer.trim()) return;

        incrementAttempts();
        let isCorrect = false;

        if (currentQuestion.type === 'decomposition') {
            const userParts = userAnswer.split('+').map(part => parseInt(part.trim())).filter(n => !isNaN(n));
            const correctParts = currentQuestion.correctAnswer;
            isCorrect = JSON.stringify(userParts.sort((a, b) => a - b)) === 
                       JSON.stringify(correctParts.sort((a, b) => a - b));
        } else {
            isCorrect = parseInt(userAnswer) === currentQuestion.correctAnswer;
        }

        if (isCorrect) {
            const activityScore = 50 * (currentLevel + 1);
            completeActivity(currentLevel, 'descomposicion', currentActivity, currentLevel);
            setFeedback({
                title: '¡Correcto!',
                text: `¡Excelente! Ganaste ${activityScore} puntos`,
                isCorrect: true
            });
        } else {
            setFeedback({
                title: '¡Incorrecto!',
                text: `La respuesta correcta era: ${
                    currentQuestion.type === 'decomposition' 
                        ? currentQuestion.correctAnswer.join(' + ')
                        : currentQuestion.correctAnswer
                }`,
                isCorrect: false
            });
        }

        setShowFeedback(true);
    }, [currentQuestion, userAnswer, incrementAttempts, currentLevel, attempts, completeActivity]);

    const handleContinue = useCallback(() => {
        setShowFeedback(false);
        
        if (currentActivity + 1 >= totalQuestions) {
            const percentage = Math.round((points / (totalQuestions * 50 * (currentLevel + 1))) * 100);
            if (percentage >= 60 && currentLevel < 2) {
                unlockLevel('descomposicion', currentLevel + 2);
            }
            setShowCongrats(true);
        } else {
            setCurrentActivity(prev => prev + 1);
            resetAttempts();
            startActivityTimer();
        }
    }, [currentActivity, totalQuestions, points, currentLevel, unlockLevel, resetAttempts, startActivityTimer]);

    const handleNextLevel = useCallback(() => {
        setShowCongrats(false);
        if (currentLevel < 2) {
            handleSelectLevel(currentLevel + 1);
        } else {
            setGameState('levelSelect');
        }
    }, [currentLevel, handleSelectLevel]);

    const handleBackToLevels = useCallback(() => {
        setGameState('levelSelect');
    }, []);

    const handleShowHint = useCallback(() => {
        setShowHint(true);
    }, []);

    const formatNumber = useCallback((num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }, []);

    return (
        <div className="game-wrapper">
            {gameState === 'start' && (
                <StartScreen onStart={handleStartGame} />
            )}
            
            {gameState === 'levelSelect' && (
                <LevelSelectScreen 
                    levels={levels}
                    onSelectLevel={handleSelectLevel}
                />
            )}
            
            {gameState === 'playing' && currentQuestion && (
                <GameScreen
                    level={currentLevel + 1}
                    activity={currentActivity + 1}
                    totalActivities={totalQuestions}
                    points={points}
                    attempts={attempts}
                    question={currentQuestion}
                    userAnswer={userAnswer}
                    onAnswerChange={setUserAnswer}
                    onCheckAnswer={handleCheckAnswer}
                    onShowHint={handleShowHint}
                    onBackToLevels={handleBackToLevels}
                    formatNumber={formatNumber}
                />
            )}

            {showFeedback && (
                <FeedbackModal
                    feedback={feedback}
                    onContinue={handleContinue}
                />
            )}

            {showCongrats && (
                <CongratsModal
                    level={currentLevel + 1}
                    points={points}
                    hasNextLevel={currentLevel < 2}
                    onNextLevel={handleNextLevel}
                    onBackToLevels={handleBackToLevels}
                />
            )}

            {showHint && currentQuestion && (
                <HintModal
                    hint={currentQuestion.hint}
                    onClose={() => setShowHint(false)}
                    theme="descomposicion"
                    title="¡Aquí tienes una pista!"
                    icon="💡"
                    buttonText="✨ ¡Entendido!"
                />
            )}
        </div>
    );
};

export default JuegoDescomposicion;