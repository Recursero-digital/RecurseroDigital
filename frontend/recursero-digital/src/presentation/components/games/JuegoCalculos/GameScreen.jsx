import React, { useState, useEffect, useRef } from 'react';
import { 
  getQuestionsForLevel, 
  validateAnswer, 
  getOperationName, 
  getLevelName,
  getRandomEncouragement,
  getRandomMotivation,
  formatNumber
} from './utils';

const GameScreen = ({ 
  operation, 
  level, 
  onGameComplete, 
  onBackToLevelSelect,
  onUpdateScore,
  onUpdateAttempts 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState(''); // 'success' or 'error'
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(1); // Attempts for current question
  const [totalAttempts, setTotalAttempts] = useState(0); // Total attempts for the entire game
  const [correctAnswers, setCorrectAnswers] = useState(0);
  
  const inputRef = useRef(null);
  const questions = getQuestionsForLevel(operation, level);
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Reset game state when operation or level changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setScore(0);
    setShowFeedback(false);
    setFeedbackMessage('');
    setFeedbackType('');
    setIsAnswerSubmitted(false);
    setAttempts(1);
    setTotalAttempts(0);
    setCorrectAnswers(0);
  }, [operation, level]);

  // Focus input on mount and after each question
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentQuestionIndex]);

  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (userAnswer.trim() === '' || isAnswerSubmitted) return;

    const userAnswerNum = parseInt(userAnswer);
    const isCorrect = validateAnswer(userAnswerNum, currentQuestion.respuesta);
    
    setIsAnswerSubmitted(true);
    // Increment total attempts every time a user submits an answer
    setTotalAttempts(prev => prev + 1);
    onUpdateAttempts();

    if (isCorrect) {
      // Correct answer
      const pointsEarned = calculatePoints();
      setScore(prev => prev + pointsEarned);
      setCorrectAnswers(prev => prev + 1);
      onUpdateScore(pointsEarned);
      
      setFeedbackMessage(`${getRandomEncouragement()} +${pointsEarned} puntos`);
      setFeedbackType('success');
      setShowFeedback(true);

      // Move to next question after delay
      setTimeout(() => {
        if (isLastQuestion) {
          // Final score and result calculation
          const finalCorrectAnswers = correctAnswers + 1;
          const finalScore = score + pointsEarned;
          const isWin = finalCorrectAnswers >= Math.ceil(questions.length * 0.6); // Need 60% or more to win
          onGameComplete(isWin, finalScore, finalCorrectAnswers, questions.length, totalAttempts);
        } else {
          nextQuestion();
        }
      }, 1500);
    } else {
      // Wrong answer
      setFeedbackMessage(`${getRandomMotivation()} La respuesta correcta era ${formatNumber(currentQuestion.respuesta)}`);
      setFeedbackType('error');
      setShowFeedback(true);
      setAttempts(prev => prev + 1);

      // Continue to next question after showing feedback
      setTimeout(() => {
        if (isLastQuestion) {
          // Final result calculation
          const isWin = correctAnswers >= Math.ceil(questions.length * 0.6); // Need 60% or more to win
          onGameComplete(isWin, score, correctAnswers, questions.length, totalAttempts);
        } else {
          nextQuestion();
        }
      }, 2000);
    }
  };

  // Calculate points based on level and attempts
  const calculatePoints = () => {
    const levelNumber = parseInt(level.replace('nivel', ''));
    const baseScore = 50 * levelNumber;
    const penalty = (attempts - 1) * 10;
    return Math.max(10, baseScore - penalty);
  };

  // Move to next question
  const nextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setUserAnswer('');
    setShowFeedback(false);
    setIsAnswerSubmitted(false);
    setAttempts(1);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isAnswerSubmitted) {
      handleSubmitAnswer();
    }
  };

  // Progress percentage
  const progressPercentage = ((currentQuestionIndex + (isAnswerSubmitted && feedbackType === 'success' ? 1 : 0)) / questions.length) * 100;

  if (!currentQuestion) {
    return (
      <div className="text-center text-white">
        <p>Error: No se encontraron preguntas para este nivel.</p>
        <button onClick={onBackToLevelSelect} className="btn-secondary mt-4">
          Volver a Niveles
        </button>
      </div>
    );
  }

  return (
    <div className="calculos-game-screen">
      {/* Header */}
      <div className="header-controls">
        <button 
          onClick={onBackToLevelSelect}
          className="btn-back-to-levels"
          title="Volver a niveles"
        >
          ← Volver a Niveles
        </button>
      </div>
      
      <div className="game-header">
        <h1 className="game-title">
          {getOperationName(operation)} - {getLevelName(level)}
        </h1>
        <p className="game-instruction">
          Pregunta {currentQuestionIndex + 1} de {questions.length}
        </p>
      </div>

      {/* Game Stats */}
      <div className="game-status">
        <div className="score-display">
          <div className="stat-label">Puntaje</div>
          <div className="stat-value">{score}</div>
        </div>
        
        <div className="questions-display">
          <div className="stat-label">Progreso</div>
          <div className="stat-value">{currentQuestionIndex + 1}/{questions.length}</div>
        </div>

        <div className="attempts-display">
          <div className="stat-label">Intentos</div>
          <div className="stat-value">{attempts}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Question Area */}
      <div className="game-play-area">
        <div className="question-container">
          {/* Cálculo arriba */}
          <div className="calculation-display">
            <span className="question-text">{currentQuestion.pregunta.replace(' =', '')}</span>
          </div>
          
          {/* Signo igual */}
          <div className="equals-display">
            <span className="equals-sign">=</span>
          </div>
          
          {/* Input de respuesta abajo */}
          <div className="answer-section">
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={userAnswer}
              onChange={(e) => {
                // Solo permitir números
                const value = e.target.value.replace(/[^0-9]/g, '');
                setUserAnswer(value);
              }}
              onKeyPress={handleKeyPress}
              disabled={isAnswerSubmitted}
              className="answer-input"
              placeholder="Tu respuesta"
            />
          </div>
          
          {/* Botón enviar debajo */}
          <div className="submit-section">
            <button
              onClick={handleSubmitAnswer}
              disabled={userAnswer.trim() === '' || isAnswerSubmitted}
              className="btn-check"
            >
              {isAnswerSubmitted ? 'Enviado' : 'Enviar'}
            </button>
          </div>
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className={`feedback-message ${feedbackType === 'success' ? 'feedback-success' : 'feedback-error'}`}>
          {feedbackMessage}
        </div>
      )}

      {/* Help Text */}
      <div className="help-text">
        💡 Presiona Enter para enviar tu respuesta rápidamente
      </div>
    </div>
  );
};

export default GameScreen;