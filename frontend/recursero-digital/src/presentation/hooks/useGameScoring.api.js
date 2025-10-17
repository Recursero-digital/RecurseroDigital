import { useState } from 'react';
import { apiRequest } from '../../infrastructure/config/api';

/**
 * Hook para manejar el envío de datos de scoring a la base de datos
 */
const useGameScoringAPI = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  /**
   * Genera un ID único para la sesión de juego
   */
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * Prepara los datos de scoring para enviar a la base de datos
   */
  const prepareGameScoreData = ({
    gameType,
    level,
    activity,
    points,
    activityScore,
    attempts,
    maxUnlockedLevel,
    completed = true,
    correctAnswers = null,
    totalQuestions = null,
    sessionId = null
  }) => {
    return {
      // Identificación del usuario
      userEmail: localStorage.getItem('userEmail'),
      userType: localStorage.getItem('userType'),
      
      // Información del juego
      gameType,
      level,
      activity,
      
      // Puntuación
      totalPoints: points,
      activityScore,
      baseScore: 50 * (level + 1),
      penalty: attempts * 5,
      attempts,
      
      // Progreso
      maxUnlockedLevel,
      
      // Resultados específicos
      correctAnswers,
      totalQuestions,
      
      // Metadatos
      timestamp: new Date().toISOString(),
      sessionId: sessionId || generateSessionId(),
      completed
    };
  };

  /**
   * Envía los datos de scoring a la base de datos
   */
  const submitGameScore = async (scoreData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const gameScoreData = prepareGameScoreData(scoreData);
      
      const response = await apiRequest('/api/game-scores', {
        method: 'POST',
        body: JSON.stringify(gameScoreData)
      });

      if (!response.ok) {
        throw new Error('Error al guardar el puntaje');
      }

      console.log('✅ Puntaje guardado exitosamente:', gameScoreData);
      return response.data;
    } catch (error) {
      console.error('❌ Error al guardar puntaje:', error);
      setSubmitError(error.message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Envía el progreso del usuario (niveles desbloqueados)
   */
  const submitUserProgress = async (game, unlockedLevel) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const progressData = {
        userEmail: localStorage.getItem('userEmail'),
        gameType: game,
        maxUnlockedLevel: unlockedLevel,
        timestamp: new Date().toISOString()
      };

      const response = await apiRequest('/api/user-progress', {
        method: 'POST',
        body: JSON.stringify(progressData)
      });

      if (!response.ok) {
        throw new Error('Error al guardar el progreso');
      }

      console.log('✅ Progreso guardado exitosamente:', progressData);
      return response.data;
    } catch (error) {
      console.error('❌ Error al guardar progreso:', error);
      setSubmitError(error.message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitGameScore,
    submitUserProgress,
    prepareGameScoreData,
    isSubmitting,
    submitError,
    generateSessionId
  };
};

export default useGameScoringAPI;