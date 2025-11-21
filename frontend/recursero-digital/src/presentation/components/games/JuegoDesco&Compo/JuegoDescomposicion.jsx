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
import { useGameLevels, transformToDescomposicionFormat } from '../../../../hooks/useGameLevels';

const JuegoDescomposicion = () => {
    const { unlockLevel, getLastActivity } = useUserProgress();
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
    const [isAnswered, setIsAnswered] = useState(false);

    const { levels: backendLevels, loading: levelsLoading } = useGameLevels('descomposicion', true);
    const levels = useMemo(() => transformToDescomposicionFormat(backendLevels), [backendLevels]);

    // Obtener totalQuestions del nivel actual desde el backend
    const totalQuestions = useMemo(() => {
        if (backendLevels.length > 0 && currentLevel >= 0 && currentLevel < backendLevels.length) {
            return backendLevels[currentLevel]?.activitiesCount || 5;
        }
        return 5; // Fallback por defecto
    }, [backendLevels, currentLevel]);

    useEffect(() => {
        AOS.init();
    }, []);

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

    const generateQuestions = useCallback((level, questionsCount) => {
        const newQuestions = [];
        
        for (let i = 0; i < questionsCount; i++) {
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
    }, [generateNumber, decomposeNumber]);

    const handleStartGame = useCallback(() => {
        setGameState('levelSelect');
    }, []);

    const handleSelectLevel = useCallback((level) => {
        setCurrentLevel(level);
        
        const lastActivity = getLastActivity('descomposicion');
        
        let startingActivity = 0;
        if (lastActivity && lastActivity.level === level + 1) {
            const lastActivityIndex = lastActivity.activity - 1;
            
            if (lastActivityIndex + 1 < totalQuestions) {
                startingActivity = lastActivityIndex + 1;
            } else {
                startingActivity = 0;
            }
        } else {
            startingActivity = 0;
        }
        
        setCurrentActivity(startingActivity);
        const questionsCount = backendLevels[level]?.activitiesCount || 5;
        setQuestions(generateQuestions(level, questionsCount));
        resetScoring();
        resetAttempts();
        setGameState('playing');
    }, [generateQuestions, resetScoring, resetAttempts, getLastActivity, backendLevels]);

    useEffect(() => {
        if (gameState === 'playing' && questions.length > 0) {
            setCurrentQuestion(questions[currentActivity]);
            setUserAnswer('');
            setIsAnswered(false);
            startActivityTimer();
        }
    }, [gameState, currentActivity, questions, startActivityTimer]);

    const handleCheckAnswer = useCallback(() => {
        if (!currentQuestion || !userAnswer.trim() || isAnswered) return;

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
            setIsAnswered(true);
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
    }, [currentQuestion, userAnswer, incrementAttempts, currentLevel, attempts, completeActivity, isAnswered]);

    const handleContinue = useCallback(() => {
        setShowFeedback(false);
        
        if (currentActivity + 1 >= totalQuestions) {
            // Siempre desbloquea el siguiente nivel al completar todas las actividades
            if (currentLevel < levels.length - 1) {
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
        if (currentLevel < levels.length - 1) {
            handleSelectLevel(currentLevel + 1);
        } else {
            setGameState('levelSelect');
        }
    }, [currentLevel, handleSelectLevel, levels.length]);

    const handleBackToLevels = useCallback(() => {
        setShowCongrats(false);
        setGameState('levelSelect');
    }, []);

    const handleShowHint = useCallback(() => {
        setShowHint(true);
    }, []);

    const formatNumber = useCallback((num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }, []);

    if (levelsLoading) {
        return <div className="game-container"><div>Cargando niveles...</div></div>;
    }

    return (
        <div className="game-container">
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
                    hasNextLevel={currentLevel < levels.length - 1}
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