// ===== CONSTANTES DE CONFIGURACIÓN =====
export const GAME_CONFIG = {
    TOTAL_QUESTIONS: 5,
    BASE_SCORE: 50,
    PASSING_PERCENTAGE: 60,
    MAX_LEVELS: 3,
    PENALTY_PER_ATTEMPT: 5,
    MAX_ATTEMPTS_FOR_HINT: 3
};

export const VALIDATION = {
    NUMBER_REGEX: /^-?\d+$/,
    EMPTY_OR_NUMBER_REGEX: /^$|^-?\d+$/
};

export const UI_STATES = {
    INPUT_STATES: {
        NEUTRAL: 'neutral',
        TYPING: 'typing', 
        CORRECT: 'correct',
        INCORRECT: 'incorrect',
        ERROR: 'error'
    },
    GAME_STATES: {
        START: 'start',
        LEVEL_SELECT: 'levelSelect', 
        PLAYING: 'playing'
    }
};

export const MESSAGES = {
    SUCCESS: [
        '¡Excelente trabajo!',
        '¡Muy bien hecho!',
        '¡Correcto, sigue así!',
        '¡Fantástico!',
        '¡Perfecto!',
        '¡Genial!'
    ],
    VALIDATION_ERRORS: {
        INCOMPLETE_FIELDS: 'Por favor, completa tanto el número anterior como el posterior antes de verificar.',
        INVALID_NUMBER: 'Por favor, ingresa un número válido.',
        REQUIRED_FIELD: 'Este campo es obligatorio.'
    },
    PROGRESSIVE_HINTS: {
        ATTEMPT_2: 'Recuerda: anterior significa restar, posterior significa sumar',
        ATTEMPT_3: (baseNumber, operation) => `Para ${baseNumber}, el anterior es ${baseNumber - operation} y el posterior es ${baseNumber + operation}`,
        DEFAULT: (operation) => `El anterior es ${operation} menos, el posterior es ${operation} más`
    }
};

// ===== FUNCIONES UTILITARIAS =====

/**
 * Calcula el puntaje de una actividad basado en el nivel y número de intentos
 * @param {number} level - Nivel actual del juego (0-indexed)
 * @param {number} attempts - Número de intentos realizados
 * @returns {number} Puntaje calculado para la actividad
 */
export const calculateActivityScore = (level, attempts = 0) => {
    const baseScore = GAME_CONFIG.BASE_SCORE * (level + 1);
    const penalty = attempts * GAME_CONFIG.PENALTY_PER_ATTEMPT;
    return Math.max(0, baseScore - penalty);
};

/**
 * Selecciona un mensaje aleatorio de una lista
 * @param {string[]} messages - Array de mensajes
 * @returns {string} Mensaje seleccionado aleatoriamente
 */
export const getRandomMessage = (messages) => {
    return messages[Math.floor(Math.random() * messages.length)];
};

/**
 * Valida si un valor es un número entero válido
 * @param {string} value - Valor a validar
 * @returns {boolean} True si es válido
 */
export const isValidNumber = (value) => {
    if (value === '') return true; // Permitir campo vacío
    return VALIDATION.NUMBER_REGEX.test(value);
};

/**
 * Valida si una respuesta es correcta
 * @param {string|number} answer - Respuesta del usuario
 * @param {number} expected - Respuesta esperada
 * @returns {boolean} True si es correcta
 */
export const isAnswerCorrect = (answer, expected) => {
    const parsed = parseInt(answer?.toString().trim());
    return !isNaN(parsed) && parsed === expected;
};

/**
 * Calcula el porcentaje de progreso
 * @param {number} points - Puntos obtenidos
 * @param {number} totalQuestions - Total de preguntas
 * @param {number} level - Nivel actual
 * @returns {number} Porcentaje redondeado
 */
export const calculatePercentage = (points, totalQuestions, level) => {
    const maxPossiblePoints = totalQuestions * GAME_CONFIG.BASE_SCORE * (level + 1);
    return Math.round((points / maxPossiblePoints) * 100);
};

/**
 * Genera un hint progresivo basado en el número de intentos
 * @param {number} attempts - Número de intentos
 * @param {object} question - Objeto de la pregunta actual
 * @returns {string} Hint apropiado
 */
export const getProgressiveHint = (attempts, question) => {
    if (attempts === 2) {
        return MESSAGES.PROGRESSIVE_HINTS.ATTEMPT_2;
    }
    if (attempts >= 3) {
        return MESSAGES.PROGRESSIVE_HINTS.ATTEMPT_3(question.baseNumber, question.operation);
    }
    return MESSAGES.PROGRESSIVE_HINTS.DEFAULT(question.operation);
};

/**
 * Genera un número aleatorio dentro del rango del nivel
 * @param {object} levelConfig - Configuración del nivel
 * @returns {number} Número aleatorio generado
 */
export const generateRandomNumber = (levelConfig) => {
    return Math.floor(Math.random() * (levelConfig.max - levelConfig.min + 1)) + levelConfig.min;
};

/**
 * Crea una pregunta de anterior y posterior
 * @param {object} levelConfig - Configuración del nivel
 * @returns {object} Objeto de pregunta
 */
export const createAnteriorPosteriorQuestion = (levelConfig) => {
    const baseNumber = generateRandomNumber(levelConfig);
    return {
        type: 'anteriorPosterior',
        baseNumber,
        correctAnterior: baseNumber - levelConfig.operation,
        correctPosterior: baseNumber + levelConfig.operation,
        operation: levelConfig.operation,
        hint: MESSAGES.PROGRESSIVE_HINTS.DEFAULT(levelConfig.operation)
    };
};

/**
 * Determina si un nivel ha sido aprobado
 * @param {number} points - Puntos obtenidos
 * @param {number} totalQuestions - Total de preguntas
 * @param {number} level - Nivel actual
 * @returns {boolean} True si aprobó
 */
export const isLevelPassed = (points, totalQuestions, level) => {
    const percentage = calculatePercentage(points, totalQuestions, level);
    return percentage >= GAME_CONFIG.PASSING_PERCENTAGE;
};