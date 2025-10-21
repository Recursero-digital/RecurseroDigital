// Utility functions for JuegoOrdenamiento

/**
 * Generate random numbers for a specific level
 * @param {number} level - The current level (0-based)
 * @param {Array} levelRanges - Array of level configurations with min/max values
 * @param {Function} getNumbersCount - Function to get the count of numbers for a level
 * @returns {Object} - Object containing shuffled numbers and sorted numbers
 */
export const generateNumbers = (level, levelRanges, getNumbersCount) => {
    const { min, max } = levelRanges[level];
    const currentNumbersCount = getNumbersCount(level);
    const generatedNumbers = new Set();

    while (generatedNumbers.size < currentNumbersCount) {
        const newNum = Math.floor(Math.random() * (max - min + 1)) + min;
        generatedNumbers.add(newNum);
    }

    const numbersArray = Array.from(generatedNumbers);
    const shuffledNumbers = [...numbersArray].sort(() => Math.random() - 0.5);
    const sorted = [...numbersArray].sort((a, b) => b - a);

    return {
        shuffled: shuffledNumbers,
        sorted: sorted
    };
};

/**
 * Get the order instruction text for a level
 * @param {number} level - The current level (1-based)
 * @returns {string} - The instruction text
 */
export const getOrderInstruction = (level) => {
    return level % 2 === 0 ? "📈 ORDENA DE MENOR A MAYOR 📈": "📉 ORDENA DE MAYOR A MENOR 📉";
};

/**
 * Generate a hint for the current level
 * @param {number} currentLevel - The current level (0-based)
 * @param {Array} sortedNumbers - Array of sorted numbers
 * @returns {string} - The hint text
 */
export const generateHint = (currentLevel, sortedNumbers) => {
    const isEvenLevel = (currentLevel + 1) % 2 === 0;
    const sortedArray = [...sortedNumbers].sort((a, b) => isEvenLevel ? a - b : b - a);
    
    const baseHints = isEvenLevel ? [
        `💡 Recuerda: Debes ordenar de MENOR a MAYOR`,
        `🔢 El número más pequeño es: ${Math.min(...sortedNumbers)}`,
        `➡️ Comienza colocando el número ${sortedArray[0]} primero`,
        `🎯 El orden correcto empieza: ${sortedArray[0]}, ${sortedArray[1]}, ${sortedArray[2]}...`
    ] : [
        `💡 Recuerda: Debes ordenar de MAYOR a MENOR`,
        `🔢 El número más grande es: ${Math.max(...sortedNumbers)}`,
        `➡️ Comienza colocando el número ${sortedArray[0]} primero`,
        `🎯 El orden correcto empieza: ${sortedArray[0]}, ${sortedArray[1]}, ${sortedArray[2]}...`
    ];
    
    return baseHints[Math.floor(Math.random() * baseHints.length)];
};

/**
 * Check if the current order is correct
 * @param {Array} currentNumbers - Array of numbers in current order
 * @param {number} currentLevel - The current level (0-based)
 * @param {Array} sortedNumbers - Array of sorted numbers
 * @returns {boolean} - True if order is correct
 */
export const checkOrder = (currentNumbers, currentLevel, sortedNumbers) => {
    const isEvenLevel = (currentLevel + 1) % 2 === 0;
    const correctOrder = [...sortedNumbers].sort((a, b) => isEvenLevel ? a - b : b - a);
    return JSON.stringify(currentNumbers) === JSON.stringify(correctOrder);
};

/**
 * Get the count of numbers for a specific level
 * @param {number} level - The current level (0-based)
 * @returns {number} - The count of numbers
 */
export const getNumbersCount = (level) => 6 + (level * 2);

/**
 * Level configurations
 */
export const levelRanges = [
    { min: 25, max: 250, name: "Números Pequeños", description: "Del 25 al 250" },
    { min: 251, max: 500, name: "Números Medianos", description: "Del 251 al 500" },
    { min: 501, max: 1000, name: "Números Grandes", description: "Del 501 al 1000" },
];

/**
 * Total number of activities per level
 */
export const totalActivities = 5;