export const generateAnteriorPosteriorQuestion = (level) => {
    const { range: [min, max], operation } = level;
    
    const targetNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    
    const questionTypes = [
        {
            type: 'anterior',
            question: `¿Cuál es el número anterior a ${targetNumber}?`,
            correct: targetNumber - operation,
            explanation: `El número anterior a ${targetNumber} es ${targetNumber - operation}, porque ${targetNumber} - ${operation} = ${targetNumber - operation}`
        },
        {
            type: 'posterior',
            question: `¿Cuál es el número posterior a ${targetNumber}?`,
            correct: targetNumber + operation,
            explanation: `El número posterior a ${targetNumber} es ${targetNumber + operation}, porque ${targetNumber} + ${operation} = ${targetNumber + operation}`
        }
    ];
    
    const selectedQuestion = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    const options = generateOptions(selectedQuestion.correct, min, max, operation);
    
    return {
        ...selectedQuestion,
        targetNumber,
        options,
        hint: `Recuerda: ${selectedQuestion.type === 'anterior' ? 'anterior significa restar' : 'posterior significa sumar'} ${operation}`
    };
};

export const generateSequenceQuestion = (level) => {
    const { range: [min, max], operation } = level;
    
    const sequenceLength = 5;
    const missingIndex = Math.floor(Math.random() * sequenceLength);
    
    const startNum = Math.floor(Math.random() * (max - min - (sequenceLength * operation))) + min;
    
    const sequence = [];
    for (let i = 0; i < sequenceLength; i++) {
        if (i === missingIndex) {
            sequence.push('?');
        } else {
            sequence.push(startNum + (i * operation));
        }
    }
    
    const correct = startNum + (missingIndex * operation);
    const options = generateOptions(correct, min, max, operation);
    
    return {
        question: `Completa la secuencia:`,
        sequence,
        correct,
        options,
        explanation: `El número que falta es ${correct}. La secuencia aumenta de ${operation} en ${operation}.`,
        hint: `Esta secuencia aumenta de ${operation} en ${operation}. Cuenta hacia adelante o hacia atrás desde los números que conoces.`
    };
};

const generateOptions = (correct, min, max, operation) => {
    const options = [correct];
    
    while (options.length < 4) {
        const variation = (Math.random() - 0.5) * operation * 4;
        const option = Math.round(correct + variation);
        
        if (option !== correct && 
            option >= min && 
            option <= max && 
            !options.includes(option)) {
            options.push(option);
        }
    }
    
    return shuffleArray(options);
};

const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};