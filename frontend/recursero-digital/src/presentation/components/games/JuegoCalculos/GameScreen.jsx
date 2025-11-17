import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getQuestionsForLevel, 
  validateAnswer, 
  getOperationName, 
  getLevelName,
  getRandomEncouragement,
  getRandomMotivation,
  formatNumber,
  getLevelNumber
} from './utils';

const GameScreen = ({ 
  operation, 
  level, 
  onGameComplete, 
  onBackToLevelSelect,
  onUpdateScore,
  onUpdateAttempts 
}) => {
  const navigate = useNavigate();
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
    <div className="game-content">
      <header className="desco-game-header">
        <div className="header-controls">
          <div className="buttons-group">
            <button 
              onClick={() => navigate('/alumno/juegos')}
              className="btn-back-to-dashboard"
              title="Volver a juegos"
            >
              ← Juegos
            </button>
            <button 
              onClick={onBackToLevelSelect}
              className="btn-back-to-levels"
              title="Volver a niveles"
            >
              ← Niveles
            </button>
          </div>
          
          <div className="game-status">
            <div className="status-item">
              <div className="status-icon">🏆</div>
              <div className="status-label">Nivel</div>
              <div className="status-value">{getLevelNumber(level)}</div>
            </div>
            <div className="status-item">
              <div className="status-icon">📝</div>
              <div className="status-label">Actividad</div>
              <div className="status-value">{currentQuestionIndex + 1}/{questions.length}</div>
            </div>
            <div className="status-item">
              <div className="status-icon">⭐</div>
              <div className="status-label">Puntos</div>
              <div className="status-value">{score}</div>
            </div>
            <div className="status-item">
              <div className="status-icon">🎯</div>
              <div className="status-label">Intentos</div>
              <div className="status-value">{totalAttempts}</div>
            </div>
          </div>
        </div>
        
        <h1 className="game-title">
          🧮 {getOperationName(operation)} - {getLevelName(level)}
        </h1>
        <p className="game-instruction">
          Resuelve la operación y escribe el resultado
        </p>
      </header>

      <div className="calculos-game-play-area">
        

        {/* Sección de respuesta */}
        <div className="answer-card">
          <div className="answer-section">
            <div className="calculation-display">
              <span className="question-text">{currentQuestion.pregunta.replace(' =', '')}</span>
            </div>
          <div className="equals-display">
            <span className="equals-sign">=</span>
          </div>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={userAnswer}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setUserAnswer(value);
              }}
              onKeyPress={handleKeyPress}
              disabled={isAnswerSubmitted}
              className="answer-input-styled"
              placeholder="Tu respuesta"
            />
          </div>

          <div className="calculos-button-group">
            <button
              onClick={handleSubmitAnswer}
              disabled={userAnswer.trim() === '' || isAnswerSubmitted}
              className="btn-verify"
              title="Verificar respuesta"
            >
              {isAnswerSubmitted ? '⏳ Enviado' : '✓ Verificar'}
            </button>
            
            <button
              onClick={() => setUserAnswer('')}
              className="btn-clear"
              title="Limpiar respuesta"
              disabled={isAnswerSubmitted}
            >
              ↺ Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Feedback y pista */}
      {showFeedback && (
        <div className={`feedback-message ${feedbackType === 'success' ? 'feedback-success' : 'feedback-error'}`}>
          {feedbackMessage}
        </div>
      )}

      {/* Pista permanente */}
      <div className="permanent-hint">
        <div className="permanent-hint-header">
          <span className="hint-icon">💡</span>
          <h4>Ayuda</h4>
        </div>
        <div className="permanent-hint-content">
          <p className="hint-text">
            Presiona Enter para enviar tu respuesta rápidamente
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;