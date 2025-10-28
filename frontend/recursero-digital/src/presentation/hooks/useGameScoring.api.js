import { useState } from 'react';
import { apiRequest } from '../../infrastructure/config/api';

/**
 * Hook para manejar el envío de datos de scoring a la base de datos
 */
const useGameScoringAPI = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  /**
   * Extrae el userId del token JWT almacenado
   */
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return '';
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || '';
    } catch (error) {
      console.error('Error al extraer userId del token:', error);
      return '';
    }
  };

  const getGameId = (gameType) => {
    const gameIdMap = {
      'ordenamiento': 'game-ordenamiento',
      'escritura': 'game-escritura',
      'descomposicion': 'game-descomposicion',
      'escala': 'game-escala'
    };
    return gameIdMap[gameType] || gameType;
  };

  /**
   * Prepara los datos de scoring para enviar a la base de datos
   */
  const prepareGameScoreData = ({
    gameType,
    level,
    activity,
    activityScore,
    attempts,
    maxUnlockedLevel,
    completed = true,
    startTime = null,
    endTime = null
  }) => {
    const userId = getUserIdFromToken();
    
    const gameId = getGameId(gameType);
    
    let completionTime = null;
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      completionTime = Math.round((end - start) / 1000); // en segundos
    }
    
    return {
      studentId: userId,
      gameId: gameId,
      level: level + 1,
      activity: activity !== null && activity !== undefined ? activity + 1 : 1,

      points: activityScore || 0,

      attempts,

      completionTime: completionTime,

      isCompleted: completed,

      maxUnlockedLevel: maxUnlockedLevel !== null && maxUnlockedLevel !== undefined 
        ? maxUnlockedLevel + 1 
        : (level + 2)
    };
  };

  /**
   * Envía los datos de scoring a la base de datos
   */
  const submitGameScore = async (scoreData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      console.log('📤 Enviando estadísticas al backend:', scoreData);
      
      const response = await apiRequest('/statistics', {
        method: 'POST',
        body: JSON.stringify(scoreData)
      });

      if (!response.ok) {
        throw new Error(`Error al guardar el puntaje: ${response.data?.error || 'Error desconocido'}`);
      }

      console.log('✅ Puntaje guardado exitosamente:', response.data);
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
    getUserIdFromToken,
    getGameId
  };
};

export default useGameScoringAPI;