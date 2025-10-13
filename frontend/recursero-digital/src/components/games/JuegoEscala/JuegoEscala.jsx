import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './JuegoEscala.css';
import StartScreen from './StartScreen';
import LevelSelectScreen from './LevelSelectScreen';
import GameScreen from './GameScreen';
import FeedbackModal from './FeedbackModal';
import CongratsModal from './CongratsModal';
import HintModal from './HintModal';
import { useUserProgress } from '../../../hooks/useUserProgress';
import useGameScoring from '../../../hooks/useGameScoring';

const JuegoEscala = () => {
    const { unlockLevel } = useUserProgress();
    const { 
        points, 
        attempts, 
        incrementAttempts, 
        resetAttempts, 
        resetScoring, 
        completeActivity
    } = useGameScoring();
    
    const [gameState, setGameState] = useState('start');
    const [currentLevel, setCurrentLevel] = useState(0);
    const [currentActivity, setCurrentActivity] = useState(0);
    const [userAnswers, setUserAnswers] = useState({ anterior: '', posterior: '' });
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showCongrats, setShowCongrats] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [feedback, setFeedback] = useState({ title: '', text: '', isCorrect: false });
    const [isValidationError, setIsValidationError] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [totalQuestions] = useState(5);

    useEffect(() => {
        AOS.init();
    }, []);

    const levels = useMemo(() => [
        { 
            name: "Vecinos Cercanos", 
            range: "1 al 100", 
            operation: 1, 
            min: 5, 
            max: 95, 
            color: "blue",
            description: "Encuentra el anterior y posterior (+1 y -1)"
        },
        { 
            name: "Saltos de 10", 
            range: "20 al 500", 
            operation: 10, 
            min: 30, 
            max: 490, 
            color: "green",
            description: "Encuentra el anterior y posterior (+10 y -10)"
        },
        { 
            name: "Grandes Saltos", 
            range: "200 al 1000", 
            operation: 100, 
            min: 300, 
            max: 900, 
            color: "purple",
            description: "Encuentra el anterior y posterior (+100 y -100)"
        }
    ], []);

    const generateNumber = useCallback((level) => {
        const levelConfig = levels[level];
        return Math.floor(Math.random() * (levelConfig.max - levelConfig.min + 1)) + levelConfig.min;
    }, [levels]);

    const generateQuestions = useCallback((level) => {
        const newQuestions = [];
        const levelConfig = levels[level];
        
        // TODAS las preguntas serán de tipo "Anterior y Posterior"
        for (let i = 0; i < totalQuestions; i++) {
            const baseNumber = generateNumber(level);
            newQuestions.push({
                type: 'anteriorPosterior',
                baseNumber,
                correctAnterior: baseNumber - levelConfig.operation,
                correctPosterior: baseNumber + levelConfig.operation,
                operation: levelConfig.operation,
                hint: `El anterior es ${levelConfig.operation} menos, el posterior es ${levelConfig.operation} más`
            });
        }
        
        return newQuestions;
    }, [generateNumber, levels, totalQuestions]);

    const handleStartGame = useCallback(() => {
        setGameState('levelSelect');
    }, []);

    const handleSelectLevel = useCallback((level) => {
        setCurrentLevel(level);
        setCurrentActivity(0);
        setUserAnswers({ anterior: '', posterior: '' });
        setShowFeedback(false);
        setIsValidationError(false);
        
        const newQuestions = generateQuestions(level);
        setQuestions(newQuestions);
        
        resetScoring();
        setGameState('playing');
    }, [generateQuestions, resetScoring]);

    useEffect(() => {
        if (gameState === 'playing' && questions.length > 0 && currentActivity < questions.length) {
            setCurrentQuestion(questions[currentActivity]);
            setUserAnswers({ anterior: '', posterior: '' });
            resetAttempts();
        }
    }, [gameState, currentActivity, questions, resetAttempts]);

    const handleCheckAnswer = useCallback(() => {
        if (!currentQuestion) return;

        // VALIDACIÓN: Solo verificamos anterior y posterior (ya no hay secuencias)
        if (!userAnswers.anterior || !userAnswers.posterior) {
            setIsValidationError(true);
            setFeedback({
                title: '⚠️ Campos incompletos',
                text: 'Por favor, completa tanto el número anterior como el posterior antes de verificar.',
                isCorrect: false
            });
            setShowFeedback(true);
            return;
        }

        // Reset validation error flag para respuestas normales
        setIsValidationError(false);

        incrementAttempts();
        
        // VALIDACIÓN: Solo anterior y posterior
        const anteriorCorrect = parseInt(userAnswers.anterior) === currentQuestion.correctAnterior;
        const posteriorCorrect = parseInt(userAnswers.posterior) === currentQuestion.correctPosterior;
        const isCorrect = anteriorCorrect && posteriorCorrect;

        if (isCorrect) {
            const activityScore = 50 * (currentLevel + 1);
            completeActivity(currentLevel, attempts + 1);
            
            // Mensajes de felicitaciones variados
            const successMessages = [
                '¡Excelente trabajo!',
                '¡Muy bien hecho!',
                '¡Correcto, sigue así!',
                '¡Fantástico!',
                '¡Perfecto!',
                '¡Genial!'
            ];
            const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
            
            setFeedback({
                title: `🎉 ${randomMessage}`,
                text: `¡Has ganado ${activityScore} puntos! Continúa con la siguiente actividad.`,
                isCorrect: true
            });
        } else {
            // Solo anterior/posterior, mensaje directo
            const correctText = `El anterior es ${currentQuestion.correctAnterior} y el posterior es ${currentQuestion.correctPosterior}`;
            
            setFeedback({
                title: '❌ Respuesta incorrecta',
                text: `${correctText}. ¡No te rindas, inténtalo de nuevo!`,
                isCorrect: false
            });
        }

        setShowFeedback(true);
    }, [currentQuestion, userAnswers, incrementAttempts, currentLevel, attempts, completeActivity]);

    const handleContinue = useCallback(() => {
        setShowFeedback(false);
        setUserAnswers({ anterior: '', posterior: '' });
        
        if (currentActivity + 1 >= totalQuestions) {
            const percentage = Math.round((points / (totalQuestions * 50 * (currentLevel + 1))) * 100);
            if (percentage >= 60 && currentLevel < 2) {
                unlockLevel('escala', currentLevel + 2);
            }
            setShowCongrats(true);
        } else {
            setCurrentActivity(prev => prev + 1);
        }
    }, [currentActivity, totalQuestions, points, currentLevel, unlockLevel]);

    const handleCloseFeedback = useCallback(() => {
        setShowFeedback(false);
        setIsValidationError(false);
        // No limpiar userAnswers para validaciones, permitir que el usuario corrija
    }, []);

    const handleNextLevel = useCallback(() => {
        setShowCongrats(false);
        if (currentLevel < 2) {
            handleSelectLevel(currentLevel + 1);
        } else {
            setGameState('levelSelect');
        }
    }, [currentLevel, handleSelectLevel]);

    const handleBackToLevels = useCallback(() => {
        setShowCongrats(false);
        setGameState('levelSelect');
    }, []);

    const handlePlayAgain = useCallback(() => {
        setShowCongrats(false);
        handleSelectLevel(currentLevel);
    }, [currentLevel, handleSelectLevel]);

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
                    activity={currentActivity + 1}
                    totalActivities={totalQuestions}
                    points={points}
                    question={currentQuestion}
                    userAnswers={userAnswers}
                    onAnswersChange={setUserAnswers}
                    onCheckAnswer={() => handleCheckAnswer()}
                    onBackToLevels={handleBackToLevels}
                    levelConfig={levels[currentLevel]}
                />
            )}

            {showFeedback && (
                <FeedbackModal
                    feedback={feedback}
                    onNext={handleContinue}
                    onClose={handleCloseFeedback}
                    isValidationError={isValidationError}
                    isLastQuestion={currentActivity >= totalQuestions - 1}
                />
            )}

            {showCongrats && (
                <CongratsModal
                    level={currentLevel + 1}
                    points={points}
                    hasNextLevel={currentLevel < 2}
                    onNextLevel={handleNextLevel}
                    onPlayAgain={handlePlayAgain}
                    onBackToLevels={handleBackToLevels}
                />
            )}

            {showHint && currentQuestion && (
                <HintModal
                    hint={currentQuestion.hint}
                    onClose={() => setShowHint(false)}
                />
            )}
        </div>
    );
};

export default JuegoEscala;