import { useState, useCallback } from 'react';
import useGameScoringAPI from './useGameScoring.api';
import useGameStatistics from './useGameStatistics';

/**
 * Hook personalizado para manejar la lógica de puntuación de los juegos
 * Unifica el sistema de puntos, intentos y cálculos de puntaje entre diferentes juegos
 */
const useGameScoring = () => {
  const [points, setPoints] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const { submitGameScore, isSubmitting, submitError } = useGameScoringAPI();
  const { saveGameStatistics, calculateSessionStats } = useGameStatistics();

  /**
   * Calcula el puntaje de una actividad basado en el nivel y número de intentos
   * @param {number} level - Nivel actual del juego (0-indexed)
   * @param {number} currentAttempts - Número de intentos realizados (opcional, usa el estado actual si no se proporciona)
   * @returns {number} Puntaje calculado para la actividad
   */
  const calculateActivityScore = useCallback((level, currentAttempts = null) => {
    const baseScore = 50 * (level + 1);
    const attemptsToUse = currentAttempts !== null ? currentAttempts : attempts;
    const penaltyForAttempts = attemptsToUse * 5;
    return Math.max(0, baseScore - penaltyForAttempts);
  }, [attempts]);

  /**
   * Añade puntos al total acumulado
   * @param {number} scoreToAdd - Puntos a añadir
   */
  const addPoints = useCallback((scoreToAdd) => {
    setPoints(prev => prev + scoreToAdd);
  }, []);

  /**
   * Incrementa el contador de intentos
   */
  const incrementAttempts = useCallback(() => {
    setAttempts(prev => prev + 1);
  }, []);

  /**
   * Resetea el contador de intentos a 0
   */
  const resetAttempts = useCallback(() => {
    setAttempts(0);
  }, []);

  /**
   * Resetea todos los valores de puntuación a sus valores iniciales
   */
  const resetScoring = useCallback(() => {
    setPoints(0);
    setAttempts(0);
    setSessionStartTime(null);
  }, []);

  /**
   * Inicia una nueva sesión de juego
   */
  const startGameSession = useCallback(() => {
    setSessionStartTime(new Date());
  }, []);

  /**
   * Finaliza la sesión de juego actual
   */
  const endGameSession = useCallback(() => {
    setSessionStartTime(null);
  }, []);

  /**
   * Procesa el completado de una actividad: calcula puntaje, lo añade al total y resetea intentos
   * @param {number} level - Nivel actual del juego (0-indexed)
   * @param {string} gameType - Tipo de juego ('escritura' o 'ordenamiento')
   * @param {number} activity - Actividad actual dentro del nivel
   * @param {number} maxUnlockedLevel - Máximo nivel desbloqueado
   * @param {object} additionalData - Datos adicionales (correctAnswers, totalQuestions, etc.)
   * @param {string} studentId - ID del estudiante (requerido para estadísticas)
   * @returns {number} Puntaje obtenido en la actividad
   */
  const completeActivity = useCallback(async (level, gameType = null, activity = null, maxUnlockedLevel = null, additionalData = {}, studentId = null) => {
    const activityScore = calculateActivityScore(level);
    addPoints(activityScore);
    
    // Si se proporcionan datos del juego, enviar a la base de datos
    if (gameType) {
      try {
        // Enviar al sistema anterior (mantener compatibilidad)
        await submitGameScore({
          gameType,
          level,
          activity,
          points: points + activityScore,
          activityScore,
          attempts,
          maxUnlockedLevel,
          ...additionalData
        });

        // Enviar al nuevo sistema de estadísticas
        if (studentId) {
          const sessionEndTime = new Date();
          const sessionStats = calculateSessionStats({
            startTime: sessionStartTime,
            endTime: sessionEndTime,
            correctAnswers: additionalData.correctAnswers,
            totalQuestions: additionalData.totalQuestions,
            attempts
          });

          await saveGameStatistics({
            studentId,
            gameId: gameType,
            level: level + 1, // Convertir de 0-indexed a 1-indexed
            activity: activity || 1,
            points: activityScore,
            attempts,
            correctAnswers: additionalData.correctAnswers,
            totalQuestions: additionalData.totalQuestions,
            completionTime: sessionStats.completionTime,
            isCompleted: true,
            maxUnlockedLevel: maxUnlockedLevel || (level + 1),
            sessionStartTime,
            sessionEndTime
          });
        }
      } catch (error) {
        console.warn('Error al guardar puntaje en BD, continuando con el juego:', error);
      }
    }
    
    resetAttempts();
    return activityScore;
  }, [calculateActivityScore, addPoints, resetAttempts, submitGameScore, points, attempts, studentId, sessionStartTime, saveGameStatistics, calculateSessionStats]);

  /**
   * Obtiene información detallada del puntaje actual
   * @param {number} level - Nivel actual para calcular el puntaje potencial
   * @returns {object} Objeto con información del puntaje
   */
  const getScoringInfo = useCallback((level) => {
    return {
      totalPoints: points,
      currentAttempts: attempts,
      potentialScore: calculateActivityScore(level),
      baseScore: 50 * (level + 1),
      penalty: attempts * 5
    };
  }, [points, attempts, calculateActivityScore]);

  return {
    // Estado
    points,
    attempts,
    sessionStartTime,
    
    // Funciones de cálculo
    calculateActivityScore,
    getScoringInfo,
    
    // Funciones de modificación
    addPoints,
    incrementAttempts,
    resetAttempts,
    resetScoring,
    completeActivity,
    
    // Funciones de sesión
    startGameSession,
    endGameSession,
    
    // Estado de API
    isSubmitting,
    submitError,
    
    // Función directa para envío manual
    submitGameScore
  };
};

export default useGameScoring;