
/**
 * Genera números aleatorios para una actividad basado en la configuración del nivel
 * @param {Object|number} levelConfigOrIndex - Configuración del nivel del backend o índice del nivel
 * @param {Array} levelRanges - Array de configuraciones de niveles (opcional)
 * @returns {Object} - Objeto con números mezclados, originales y ordenados
 */
export const getNumbersForActivity = (levelConfigOrIndex, levelRanges = null) => {
  let levelConfig;

  // Determinar si se pasó una configuración directa o un índice
  if (typeof levelConfigOrIndex === 'number') {
    // Se pasó un índice, buscar en levelRanges
    const levelIndex = levelConfigOrIndex - 1; // Convertir de 1-indexed a 0-indexed
    levelConfig = levelRanges && levelRanges[levelIndex] ? levelRanges[levelIndex] : null;
  } else if (typeof levelConfigOrIndex === 'object' && levelConfigOrIndex !== null) {
    // Se pasó una configuración directa
    levelConfig = levelConfigOrIndex;
  }

  // Validar que tenemos una configuración válida
  if (!levelConfig || (!levelConfig.min && levelConfig.min !== 0) || !levelConfig.max) {
    console.warn('No se encontró configuración del nivel válida, usando valores por defecto:', {
      levelConfigOrIndex,
      levelConfig,
      levelRanges
    });
    // Usar valores por defecto basados en el índice si es posible
    const defaultConfigs = [
      { min: 0, max: 99, numbersCount: 6 },
      { min: 100, max: 999, numbersCount: 6 },
      { min: 1000, max: 9999, numbersCount: 6 }
    ];
    const levelIndex = typeof levelConfigOrIndex === 'number' ? levelConfigOrIndex - 1 : 0;
    levelConfig = defaultConfigs[levelIndex] || defaultConfigs[0];
  }

  const { min, max, numbersCount = 6 } = levelConfig;
  const generatedNumbers = new Set();

  // Generar números únicos aleatorios dentro del rango
  while (generatedNumbers.size < numbersCount) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    generatedNumbers.add(randomNumber);
  }

  const numbers = Array.from(generatedNumbers);
  const shuffledNumbers = [...numbers].sort(() => Math.random() - 0.5);
  
  return {
    shuffled: shuffledNumbers,
    original: numbers,
    sorted: [...numbers].sort((a, b) => a - b)
  };
};

export const getOrderInstruction = () => {
  return "📈 ORDENA DE MENOR A MAYOR 📈";
};

export const generateHint = (numbers) => {
  const sortedNumbers = [...numbers].sort((a, b) => a - b);
  const smallest = sortedNumbers[0];
  const largest = sortedNumbers[sortedNumbers.length - 1];
  
  const hints = [
    `🔢 El número más pequeño es: ${smallest.toLocaleString()}`,
    `🔢 El número más grande es: ${largest.toLocaleString()}`,
    `➡️ Comienza colocando el número ${smallest.toLocaleString()} primero`,
    `🎯 El orden correcto empieza: ${sortedNumbers.slice(0, 3).map(n => n.toLocaleString()).join(', ')}...`
  ];
  
  return hints[Math.floor(Math.random() * hints.length)];
};

export const checkOrder = (currentNumbers, originalNumbers) => {
  const correctOrder = [...originalNumbers].sort((a, b) => a - b);
  return JSON.stringify(currentNumbers) === JSON.stringify(correctOrder);
};

/**
 * Obtiene la configuración de un nivel (mantenido por compatibilidad)
 * @param {number} level - Número del nivel
 * @returns {Object} - Configuración básica del nivel
 */
export const getLevelConfig = (level) => {
  const configs = {
    1: { 
      name: "Nivel 1", 
      description: "Números del 0 al 99",
      range: "0 - 99"
    },
    2: { 
      name: "Nivel 2", 
      description: "Números del 100 al 999",
      range: "100 - 999"
    },
    3: { 
      name: "Nivel 3", 
      description: "Números del 1.000 al 9.999",
      range: "1.000 - 9.999"
    }
  };
  return configs[level] || configs[1];
};

export const formatNumber = (num) => {
  return num.toLocaleString('es-AR');
};

// getNumbersCount ahora se calcula dinámicamente desde el nivel en el componente
// Esta función se mantiene por compatibilidad pero ya no se usa
export const getNumbersCount = () => 6;
/**
 * Genera números aleatorios para el juego basado en la configuración del nivel
 * @param {number} level - Número del nivel (0-indexed)
 * @param {Array} levelRanges - Configuraciones de niveles del backend
 * @returns {Object} - Objeto con números generados
 */
export const generateNumbers = (level, levelRanges) => {
  const levelConfig = levelRanges[level] || levelRanges[0];
  
  if (!levelConfig) {
    console.warn('No se encontró configuración para el nivel', level);
    return getNumbersForActivity({ min: 0, max: 99, numbersCount: 6 });
  }

  // Usar la configuración del backend directamente
  return getNumbersForActivity(levelConfig);
};

/**
 * Rangos de niveles por defecto (usado como fallback)
 * Estos valores deberían venir del backend en producción
 */
export const levelRanges = [
    { min: 0, max: 99, name: "Números del 0 al 99", description: "0 - 99", numbersCount: 6 },
    { min: 100, max: 999, name: "Números del 100 al 999", description: "100 - 999", numbersCount: 6 },
    { min: 1000, max: 9999, name: "Números del 1.000 al 9.999", description: "1.000 - 9.999", numbersCount: 6 },
];

// totalActivities ahora se obtiene dinámicamente desde level.activitiesCount en el componente
// Esta constante se mantiene por compatibilidad pero ya no se usa
export const totalActivities = 5;