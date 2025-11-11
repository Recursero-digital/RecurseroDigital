import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../../infrastructure/config/api';

const PROGRESS_KEY = 'userGameProgress';

const DEFAULT_PROGRESS = {
  ordenamiento: 1,
  escritura: 1,
  descomposicion: 1,
  escala: 1,
  'calculos-suma': 1,
  'calculos-resta': 1,
  'calculos-multiplicacion': 1
};

const loadLocalProgress = () => {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (!saved) {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(DEFAULT_PROGRESS));
      return DEFAULT_PROGRESS;
    }

    const parsed = JSON.parse(saved);
    const merged = {
      ...DEFAULT_PROGRESS,
      ...parsed
    };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(merged));
    return merged;
  } catch (error) {
    console.warn('No se pudo cargar progreso local, se usa default:', error);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(DEFAULT_PROGRESS));
    return DEFAULT_PROGRESS;
  }
};

const getStudentIdFromToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.id || payload?.userId || null;
  } catch (error) {
    console.warn('No se pudo obtener el studentId desde el token:', error);
    return null;
  }
};

const mapGameIdToProgressKey = (gameId) => {
  if (!gameId) {
    return null;
  }

  if (gameId.startsWith('game-calculos')) {
    return `calculos-${gameId.split('-')[2] || 'suma'}`;
  }

  const map = {
    'game-ordenamiento': 'ordenamiento',
    'game-escritura': 'escritura',
    'game-descomposicion': 'descomposicion',
    'game-escala': 'escala'
  };

  return map[gameId] || null;
};

const mergeProgress = (baseProgress, backendProgress) => {
  if (!Array.isArray(backendProgress)) {
    return baseProgress;
  }

  const merged = { ...baseProgress };

  backendProgress.forEach((progressItem) => {
    const progressKey = mapGameIdToProgressKey(progressItem.gameId);
    if (!progressKey) {
      return;
    }

    const backendMax = progressItem.maxUnlockedLevel || 1;
    const highestLevel = Math.max(
      backendMax,
      ...(Array.isArray(progressItem.statistics)
        ? progressItem.statistics.map((stat) => stat.level || 1)
        : [1])
    );

    merged[progressKey] = Math.max(baseProgress[progressKey] || 1, highestLevel);
  });

  return merged;
};

export const useUserProgress = () => {
  const studentId = getStudentIdFromToken();
  const [unlockedLevels, setUnlockedLevels] = useState(() => loadLocalProgress());
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [progressError, setProgressError] = useState(null);

  const syncWithBackend = useCallback(async () => {
    if (!studentId) {
      return;
    }

    try {
      setLoadingProgress(true);
      setProgressError(null);

      const response = await apiRequest(`/statistics/student/${studentId}`);

      if (response.ok && response.data && Array.isArray(response.data.gameProgress)) {
        const merged = mergeProgress(loadLocalProgress(), response.data.gameProgress);
        setUnlockedLevels(merged);
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(merged));
      } else {
        throw new Error('Respuesta inválida del backend.');
      }
    } catch (error) {
      console.warn('No se pudo sincronizar progreso desde el backend:', error);
      setProgressError('No se pudo obtener el progreso más reciente. Se utiliza el progreso guardado en el dispositivo.');
      setUnlockedLevels(loadLocalProgress());
    } finally {
      setLoadingProgress(false);
    }
  }, [studentId]);

  useEffect(() => {
    syncWithBackend();
  }, [syncWithBackend]);

  const unlockLevel = useCallback((game, level) => {
    setUnlockedLevels((prev) => {
      const newProgress = {
        ...prev,
        [game]: Math.max(prev[game] || 1, level)
      };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress));
      return newProgress;
    });
  }, []);

  const isLevelUnlocked = useCallback((game, level) => {
    return level <= (unlockedLevels[game] || 1);
  }, [unlockedLevels]);

  const getMaxUnlockedLevel = useCallback((game) => {
    return unlockedLevels[game] || 1;
  }, [unlockedLevels]);

  const resetProgress = useCallback(() => {
    setUnlockedLevels(DEFAULT_PROGRESS);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(DEFAULT_PROGRESS));
  }, []);

  return {
    unlockedLevels,
    unlockLevel,
    isLevelUnlocked,
    getMaxUnlockedLevel,
    resetProgress,
    syncWithBackend,
    loadingProgress,
    progressError
  };
};
