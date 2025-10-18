import { useState } from 'react';

const PROGRESS_KEY = 'userGameProgress';

export const useUserProgress = () => {
  const [unlockedLevels, setUnlockedLevels] = useState(() => {
    const saved = localStorage.getItem(PROGRESS_KEY);
    return saved ? JSON.parse(saved) : { ordenamiento: 1, escritura: 1, descomposicion: 1, escala: 1 };
  });

  const unlockLevel = (game, level) => {
    setUnlockedLevels(prev => {
      const newProgress = {
        ...prev,
        [game]: Math.max(prev[game] || 1, level)
      };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress));
      return newProgress;
    });
  };

  const isLevelUnlocked = (game, level) => {
    return level <= (unlockedLevels[game] || 1);
  };

  const getMaxUnlockedLevel = (game) => {
    return unlockedLevels[game] || 1;
  };

  const resetProgress = () => {
    const defaultProgress = { ordenamiento: 1, escritura: 1, descomposicion: 1, escala: 1 };
    setUnlockedLevels(defaultProgress);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(defaultProgress));
  };

  return {
    unlockedLevels,
    unlockLevel,
    isLevelUnlocked,
    getMaxUnlockedLevel,
    resetProgress
  };
};
