import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './JuegoEscala.css';
import StartScreen from './StartScreen';
import LevelSelectScreen from './LevelSelectScreen';
import GameScreen from './GameScreen';
import FeedbackModal from './FeedbackModal';
import CongratsModal from './CongratsModal';
import HintModal from '../../shared/HintModal';
import { useUserProgress } from '../../../hooks/useUserProgress';
import useGameScoring from '../../../hooks/useGameScoring';
import { 
    GAME_CONFIG, 
    MESSAGES, 
    UI_STATES,
    calculateActivityScore,
    getRandomMessage,
    calculatePercentage,
    isLevelPassed,
    createAnteriorPosteriorQuestion,
    getProgressiveHint
} from './util';

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
    
    const [gameState, setGameState] = useState(UI_STATES.GAME_STATES.START);
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
    const [inputErrors, setInputErrors] = useState({ anterior: false, posterior: false });
    const [errorNotification, setErrorNotification] = useState('');
    const [isProcessing, setIsProcessing] = useState(false); // Prevenir doble envío
    const [totalQuestions] = useState(GAME_CONFIG.TOTAL_QUESTIONS);

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
            newQuestions.push(createAnteriorPosteriorQuestion(levelConfig));
        }
        
        return newQuestions;
    }, [levels, totalQuestions]);

    const handleStartGame = useCallback(() => {
        setGameState(UI_STATES.GAME_STATES.LEVEL_SELECT);
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
        setGameState(UI_STATES.GAME_STATES.PLAYING);
    }, [generateQuestions, resetScoring]);

    useEffect(() => {
        if (gameState === UI_STATES.GAME_STATES.PLAYING && questions.length > 0 && currentActivity < questions.length) {
            setCurrentQuestion(questions[currentActivity]);
            setUserAnswers({ anterior: '', posterior: '' });
            setInputErrors({ anterior: false, posterior: false });
            setIsProcessing(false); // Reset processing state para nueva pregunta
            resetAttempts();
        }
    }, [gameState, currentActivity, questions, resetAttempts]);

    const handleCheckAnswer = useCallback(() => {
        if (!currentQuestion || isProcessing) return; // Prevenir múltiples envíos

        // VALIDACIÓN: Solo verificamos anterior y posterior
        if (!userAnswers.anterior || !userAnswers.posterior) {
            setIsValidationError(true);
            setFeedback({
                title: '⚠️ Campos incompletos',
                text: MESSAGES.VALIDATION_ERRORS.INCOMPLETE_FIELDS,
                isCorrect: false
            });
            setShowFeedback(true);
            return;
        }

        // Marcar como procesando para prevenir doble envío
        setIsProcessing(true);

        // Reset validation error flag para respuestas normales
        setIsValidationError(false);

        incrementAttempts();
        const currentAttempts = attempts + 1;
        
        // VALIDACIÓN: Solo anterior y posterior usando funciones utilitarias
        const anteriorCorrect = parseInt(userAnswers.anterior) === currentQuestion.correctAnterior;
        const posteriorCorrect = parseInt(userAnswers.posterior) === currentQuestion.correctPosterior;
        const isCorrect = anteriorCorrect && posteriorCorrect;

        if (isCorrect) {
            try {
                const activityScore = calculateActivityScore(currentLevel, currentAttempts);
                completeActivity(
                    currentLevel, 
                    'escala', 
                    currentActivity + 1, 
                    Math.max(currentLevel + 1, 1), 
                    {
                        correctAnswers: 1,
                        totalQuestions: totalQuestions
                    }
                );
                
                // Mensaje aleatorio de felicitaciones
                const randomMessage = getRandomMessage(MESSAGES.SUCCESS);
                
                setFeedback({
                    title: `🎉 ${randomMessage}`,
                    text: `¡Has ganado ${activityScore} puntos! Continúa con la siguiente actividad.`,
                    isCorrect: true
                });
            } catch (error) {
                console.error('Error al guardar puntaje:', error);
                setErrorNotification('No se pudo guardar el progreso, pero puedes continuar jugando');
                
                // Continuar con el feedback positivo aunque haya error en BD
                const randomMessage = getRandomMessage(MESSAGES.SUCCESS);
                setFeedback({
                    title: `🎉 ${randomMessage}`,
                    text: `¡Respuesta correcta! Continúa con la siguiente actividad.`,
                    isCorrect: true
                });
            }
        } else {
            // Usar hint progresivo basado en intentos
            const progressiveHint = getProgressiveHint(currentAttempts, currentQuestion);
            
            setFeedback({
                title: '❌ Respuesta incorrecta',
                text: `${progressiveHint}. ¡No te rindas, inténtalo de nuevo!`,
                isCorrect: false
            });

            // Solo resetear processing si es incorrecto para permitir reintento
            setIsProcessing(false);
        }

        setShowFeedback(true);
    }, [currentQuestion, userAnswers, incrementAttempts, currentLevel, attempts, completeActivity, currentActivity, totalQuestions, isProcessing]);

    const handleContinue = useCallback(() => {
        setShowFeedback(false);
        setUserAnswers({ anterior: '', posterior: '' });
        setInputErrors({ anterior: false, posterior: false });
        setIsProcessing(false); // Reset processing state
        
        if (currentActivity + 1 >= totalQuestions) {
            const levelPassed = isLevelPassed(points, totalQuestions, currentLevel);
            if (levelPassed && currentLevel < GAME_CONFIG.MAX_LEVELS - 1) {
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
        setInputErrors({ anterior: false, posterior: false });
        setIsProcessing(false); // Reset processing state para permitir nuevo intento
        // No limpiar userAnswers para validaciones, permitir que el usuario corrija
    }, []);

    const handleNextLevel = useCallback(() => {
        setShowCongrats(false);
        if (currentLevel < GAME_CONFIG.MAX_LEVELS - 1) {
            handleSelectLevel(currentLevel + 1);
        } else {
            setGameState(UI_STATES.GAME_STATES.LEVEL_SELECT);
        }
    }, [currentLevel, handleSelectLevel]);

    const handleBackToLevels = useCallback(() => {
        setShowCongrats(false);
        setGameState(UI_STATES.GAME_STATES.LEVEL_SELECT);
    }, []);

    const handlePlayAgain = useCallback(() => {
        setShowCongrats(false);
        handleSelectLevel(currentLevel);
    }, [currentLevel, handleSelectLevel]);

    return (
        <div className="game-wrapper">
            {/* Notificación de error si existe */}
            {errorNotification && (
                <div className="error-notification">
                    <div className="error-notification-text">
                        ⚠️ {errorNotification}
                    </div>
                    <button 
                        onClick={() => setErrorNotification('')}
                        className="error-notification-close"
                    >
                        Cerrar
                    </button>
                </div>
            )}

            {gameState === UI_STATES.GAME_STATES.START && (
                <StartScreen onStart={handleStartGame} />
            )}
            
            {gameState === UI_STATES.GAME_STATES.LEVEL_SELECT && (
                <LevelSelectScreen 
                    levels={levels}
                    onSelectLevel={handleSelectLevel}
                />
            )}
            
            {gameState === UI_STATES.GAME_STATES.PLAYING && currentQuestion && (
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
                    inputErrors={inputErrors}
                    setInputErrors={setInputErrors}
                    isProcessing={isProcessing}
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
                    score={points}
                    totalQuestions={totalQuestions * GAME_CONFIG.BASE_SCORE * (currentLevel + 1)}
                    levelName={levels[currentLevel].name}
                    levelPassed={isLevelPassed(points, totalQuestions, currentLevel)}
                    nextLevelUnlocked={currentLevel < GAME_CONFIG.MAX_LEVELS - 1}
                    onPlayAgain={handlePlayAgain}
                    onBackToLevels={handleBackToLevels}
                />
            )}

            {showHint && currentQuestion && (
                <HintModal
                    hint={currentQuestion.hint}
                    onClose={() => setShowHint(false)}
                    theme="escala"
                    title="Pista Útil"
                    icon="💡"
                    buttonText="✅ Entendido"
                />
            )}
        </div>
    );
};

export default JuegoEscala;