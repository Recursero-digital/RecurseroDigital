const numberWords = {
    1: "uno", 2: "dos", 3: "tres", 4: "cuatro", 5: "cinco", 6: "seis", 7: "siete", 8: "ocho", 9: "nueve",
    10: "diez", 11: "once", 12: "doce", 13: "trece", 14: "catorce", 15: "quince", 16: "dieciséis",
    17: "diecisiete", 18: "dieciocho", 19: "diecinueve", 20: "veinte", 21: "veintiuno", 22: "veintidós",
    23: "veintitrés", 24: "veinticuatro", 25: "veinticinco", 26: "veintiséis", 27: "veintisiete",
    28: "veintiocho", 29: "veintinueve", 30: "treinta", 40: "cuarenta", 50: "cincuenta",
    60: "sesenta", 70: "setenta", 80: "ochenta", 90: "noventa", 100: "cien", 101: "ciento uno",
    200: "doscientos", 300: "trescientos", 400: "cuatrocientos", 500: "quinientos",
    600: "seiscientos", 700: "setecientos", 800: "ochocientos", 900: "novecientos", 1000: "mil"
};


export const levelRanges = [
    { min: 1, max: 50 },
    { min: 51, max: 200 },
    { min: 201, max: 500 },
    { min: 501, max: 800 },
    { min: 801, max: 1000 }
];


export function numberToWords(num) {
  
    if (num in numberWords) {
        return numberWords[num];
    }
    
    
    if (num >= 31 && num <= 99) {
        const tens = Math.floor(num / 10) * 10;
        const ones = num % 10;
        return `${numberWords[tens]} y ${numberWords[ones]}`;
    }
    
  
    if (num >= 101 && num <= 999) {
        const hundreds = Math.floor(num / 100) * 100;
        const remainder = num % 100;
        
        if (remainder === 0) {
            return numberWords[hundreds];
        }
        
        let hundredsWord = hundreds === 100 ? 'ciento' : numberWords[hundreds];
        let remainderWord = numberToWords(remainder);
        
        return `${hundredsWord} ${remainderWord}`;
    }
    

    if (num > 1000) {
        return num.toString();
    }
    
    return "";
}

export function generateOptions(correctAnswer) {

    const correctWords = Array.isArray(correctAnswer) ? correctAnswer : correctAnswer.split(' ');
    
   
    const allPossibleWords = [
        'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
        'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve',
        'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve',
        'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa',
        'cien', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos',
        'mil'
    ];
    

    const correctWordsSet = new Set(correctWords);
    
    const incorrectWords = allPossibleWords.filter(word => !correctWordsSet.has(word));
    
    const shuffledIncorrect = incorrectWords.sort(() => Math.random() - 0.5);
    const numIncorrectWords = Math.max(4, 8 - correctWords.length);
    const selectedIncorrect = shuffledIncorrect.slice(0, numIncorrectWords);
    
    const allOptions = [...correctWords, ...selectedIncorrect];

    return allOptions.sort(() => Math.random() - 0.5);
}