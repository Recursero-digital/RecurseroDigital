import { useState, useCallback } from 'react';
import { api } from '../config/api';

/**
 * Hook personalizado para manejar las estadísticas de juegos
 * Integra con la API del backend para guardar y obtener estadísticas
 */
const useGameStatistics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Guarda las estadísticas de una actividad de juego
   * @param {Object} statisticsData - Datos de las estadísticas
   * @param {string} statisticsData.studentId - ID del estudiante
   * @param {string} statisticsData.gameId - ID del juego
   * @param {number} statisticsData.level - Nivel del juego
   * @param {number} statisticsData.activity - Actividad dentro del nivel
   * @param {number} statisticsData.points - Puntos obtenidos
   * @param {number} statisticsData.attempts - Número de intentos
   * @param {number} [statisticsData.correctAnswers] - Respuestas correctas
   * @param {number} [statisticsData.totalQuestions] - Total de preguntas
   * @param {number} [statisticsData.completionTime] - Tiempo de completación en segundos
   * @param {boolean} statisticsData.isCompleted - Si la actividad fue completada
   * @param {number} [statisticsData.maxUnlockedLevel] - Nivel máximo desbloqueado
   */
  const saveGameStatistics = useCallback(async (statisticsData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/statistics', {
        studentId: statisticsData.studentId,
        gameId: statisticsData.gameId,
        level: statisticsData.level,
        activity: statisticsData.activity,
        points: statisticsData.points,
        attempts: statisticsData.attempts,
        correctAnswers: statisticsData.correctAnswers,
        totalQuestions: statisticsData.totalQuestions,
        completionTime: statisticsData.completionTime,
        isCompleted: statisticsData.isCompleted,
        maxUnlockedLevel: statisticsData.maxUnlockedLevel,
        sessionStartTime: statisticsData.sessionStartTime?.toISOString(),
        sessionEndTime: statisticsData.sessionEndTime?.toISOString()
      });

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error al guardar estadísticas';
      setError(errorMessage);
      console.error('Error saving game statistics:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Obtiene el progreso de un estudiante
   * @param {string} studentId - ID del estudiante
   * @param {string} [gameId] - ID del juego (opcional)
   */
  const getStudentProgress = useCallback(async (studentId, gameId = null) => {
    setIsLoading(true);
    setError(null);

    try {
      let url = `/api/statistics/student/${studentId}`;
      if (gameId) {
        url += `/game/${gameId}`;
      }

      const response = await api.get(url);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error al obtener progreso del estudiante';
      setError(errorMessage);
      console.error('Error getting student progress:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Obtiene estadísticas generales de un juego (para docentes)
   * @param {string} gameId - ID del juego
   */
  const getGameStatistics = useCallback(async (gameId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/api/statistics/game/${gameId}`);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error al obtener estadísticas del juego';
      setError(errorMessage);
      console.error('Error getting game statistics:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Calcula estadísticas de una sesión de juego
   * @param {Object} sessionData - Datos de la sesión
   */
  const calculateSessionStats = useCallback((sessionData) => {
    const {
      startTime,
      endTime,
      correctAnswers = 0,
      totalQuestions = 0,
      attempts = 0
    } = sessionData;

    const completionTime = endTime && startTime 
      ? Math.round((endTime - startTime) / 1000) 
      : 0;

    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    return {
      completionTime,
      accuracy,
      correctAnswers,
      totalQuestions,
      attempts
    };
  }, []);

  return {
    // Estado
    isLoading,
    error,
    
    // Funciones
    saveGameStatistics,
    getStudentProgress,
    getGameStatistics,
    calculateSessionStats,
    
    // Utilidades
    clearError: () => setError(null)
  };
};

export default useGameStatistics;
