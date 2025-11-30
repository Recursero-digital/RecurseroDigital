
export const gameData = {
    suma: {
        nivel1: [
            { pregunta: "30 + 30 =", respuesta: 60 },
            { pregunta: "20 + 32 =", respuesta: 52 },
            { pregunta: "50 + 16 =", respuesta: 66 },
            { pregunta: "10 + 27 =", respuesta: 37 },
            { pregunta: "30 + 48 =", respuesta: 78 }
        ],
        nivel2: [
            { pregunta: "248 + 330 =", respuesta: 578 },
            { pregunta: "560 + 240 =", respuesta: 800 },
            { pregunta: "385 + 215 =", respuesta: 600 },
            { pregunta: "120 + 180 =", respuesta: 300 },
            { pregunta: "235 + 160 =", respuesta: 395 }
        ],
        nivel3: [
            { pregunta: "1.000 + 2.000 =", respuesta: 3000 },
            { pregunta: "1.250 + 3.500 =", respuesta: 4750 },
            { pregunta: "4.300 + 2.400 =", respuesta: 6700 },
            { pregunta: "2.800 + 3.200 =", respuesta: 6000 },
            { pregunta: "8.625 + 1.240 =", respuesta: 9865 }
        ]
    },
    resta: {
        nivel1: [
            { pregunta: "48 − 20 =", respuesta: 28 },
            { pregunta: "63 − 31 =", respuesta: 32 },
            { pregunta: "72 − 40 =", respuesta: 32 },
            { pregunta: "56 − 29 =", respuesta: 27 },
            { pregunta: "94 − 52 =", respuesta: 42 }
        ],
        nivel2: [
            { pregunta: "320 − 110 =", respuesta: 210 },
            { pregunta: "450 − 200 =", respuesta: 250 },
            { pregunta: "580 − 330 =", respuesta: 250 },
            { pregunta: "720 − 400 =", respuesta: 320 },
            { pregunta: "690 − 250 =", respuesta: 440 }
        ],
        nivel3: [
            { pregunta: "3.200 − 1.100 =", respuesta: 2100 },
            { pregunta: "4.500 − 2.300 =", respuesta: 2200 },
            { pregunta: "5.800 − 3.600 =", respuesta: 2200 },
            { pregunta: "5.800 − 3.600 =", respuesta: 2200 },
            { pregunta: "6.400 − 2.200 =", respuesta: 4200 }
        ]
    },
    multiplicacion: {
        nivel1: [
            { pregunta: "2 x 4 =", respuesta: 8 },
            { pregunta: "3 x 7 =", respuesta: 21 },
            { pregunta: "4 x 6 =", respuesta: 24 },
            { pregunta: "5 x 8 =", respuesta: 40 },
            { pregunta: "6 x 3 =", respuesta: 18 }
        ],
        nivel2: [
            { pregunta: "9 x ___ = 81", respuesta: 9 },
            { pregunta: "4 x ___ = 40", respuesta: 10 },
            { pregunta: "7 x ___ = 49", respuesta: 7 },
            { pregunta: "8 x ___ = 16", respuesta: 2 },
            { pregunta: "3 x ___ = 9", respuesta: 3 }
        ],
        nivel3: [
            { pregunta: "11 x 10 =", respuesta: 110 },
            { pregunta: "33 x 100 =", respuesta: 3300 },
            { pregunta: "653 x 10 =", respuesta: 6530 },
            { pregunta: "11 x 1.000 =", respuesta: 11000 },
            { pregunta: "35 x 100 =", respuesta: 3500 }
        ]
    }
};


export const operationConfig = {
    suma: {
        name: 'Sumas',
        icon: '➕',
        color: 'from-green-400 to-emerald-500',
        textColor: 'text-green-600'
    },
    resta: {
        name: 'Restas', 
        icon: '➖',
        color: 'from-red-400 to-pink-500',
        textColor: 'text-red-600'
    },
    multiplicacion: {
        name: 'Multiplicación',
        icon: '✖️',
        color: 'from-blue-400 to-indigo-500',
        textColor: 'text-blue-600'
    }
};


export const levelConfig = [
    {
        name: 'Nivel 1',
        description: '¡Principiante! Operaciones simples',
        color: 'from-green-400 to-emerald-500',
        textColor: 'text-green-600',
        number: 1
    },
    {
        name: 'Nivel 2', 
        description: '¡Intermedio! Un poco más difícil',
        color: 'from-blue-400 to-indigo-500',
        textColor: 'text-blue-600',
        number: 2
    },
    {
        name: 'Nivel 3',
        description: '¡Experto! El desafío máximo', 
        color: 'from-purple-400 to-pink-500',
        textColor: 'text-purple-600',
        number: 3
    }
];


export const getTotalActivities = (operation, level) => {
    return gameData[operation]?.[level]?.length || 0;
};

export const getQuestionsForLevel = (operation, level) => {
    return gameData[operation]?.[level] || [];
};


export const validateAnswer = (userAnswer, correctAnswer) => {
    return parseInt(userAnswer) === correctAnswer;
};

export const getOperationName = (operation) => {
    return operationConfig[operation]?.name || operation;
};

export const getLevelName = (level) => {
    const levelNumber = level.replace('nivel', '');
    return `Nivel ${levelNumber}`;
};

export const getLevelNumber = (level) => {
    const levelNumber = level.replace('nivel', '');
    return levelNumber;
};

export const calculateScore = (level, attempts = 1) => {
    const levelNumber = parseInt(level.replace('nivel', ''));
    const baseScore = 50 * levelNumber;
    const penalty = (attempts - 1) * 10;
    return Math.max(10, baseScore - penalty);
};


export const getRandomEncouragement = () => {
    const messages = [
        '¡Excelente! 🎉',
        '¡Muy bien! ⭐',
        '¡Perfecto! 👏',
        '¡Genial! 🚀',
        '¡Fantástico! 🌟',
        '¡Correcto! ✨',
        '¡Increíble! 🎯'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
};

export const getRandomMotivation = () => {
    const messages = [
        '¡Sigue intentando! 💪',
        '¡Casi lo tienes! 🎯',
        '¡No te rindas! 🌟',
        '¡Inténtalo de nuevo! 🚀',
        '¡Tú puedes! ⭐',
        '¡Piensa un poco más! 🤔',
        '¡Revisa el cálculo! 📝'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
};

export const getNextLevel = (currentLevel) => {
    switch(currentLevel) {
        case 'nivel1': return 'nivel2';
        case 'nivel2': return 'nivel3';
        case 'nivel3': return null;
        default: return null;
    }
};

export const isLastLevel = (level) => {
    return level === 'nivel3';
};

export const formatNumber = (num) => {
    return num.toLocaleString('es-ES');
};