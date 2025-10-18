const numberWords = {

    1: "uno", 2: "dos", 3: "tres", 4: "cuatro", 5: "cinco", 6: "seis", 7: "siete", 8: "ocho", 9: "nueve",
    10: "diez", 11: "once", 12: "doce", 13: "trece", 14: "catorce", 15: "quince", 16: "dieciseis",
    17: "diecisiete", 18: "dieciocho", 19: "diecinueve", 20: "veinte", 21: "veintiuno", 22: "veintidos",
    23: "veintitres", 24: "veinticuatro", 25: "veinticinco", 26: "veintiseis", 27: "veintisiete",
    28: "veintiocho", 29: "veintinueve", 30: "treinta",
    31: "treinta y uno", 32: "treinta y dos", 35: "treinta y cinco", 37: "treinta y siete", 39: "treinta y nueve",
    40: "cuarenta", 42: "cuarenta y dos", 45: "cuarenta y cinco", 48: "cuarenta y ocho",
    50: "cincuenta", 53: "cincuenta y tres", 56: "cincuenta y seis", 58: "cincuenta y nueve",
    60: "sesenta", 62: "sesenta y dos", 65: "sesenta y cinco", 67: "sesenta y siete", 69: "sesenta y nueve",
    70: "setenta", 73: "setenta y tres", 76: "setenta y seis", 78: "setenta y ocho",
    80: "ochenta", 81: "ochenta y uno", 84: "ochenta y cuatro", 87: "ochenta y siete", 89: "ochenta y nueve",
    90: "noventa", 92: "noventa y dos", 95: "noventa y cinco", 97: "noventa y siete", 99: "noventa y nueve",
    100: "cien", 101: "ciento uno", 105: "ciento cinco", 108: "ciento ocho", 112: "ciento doce",
    115: "ciento quince", 118: "ciento dieciocho", 123: "ciento veintitres", 126: "ciento veintiseis",
    130: "ciento treinta", 135: "ciento treinta y cinco", 140: "ciento cuarenta", 145: "ciento cuarenta y cinco",
    150: "ciento cincuenta", 155: "ciento cincuenta y cinco", 160: "ciento sesenta", 165: "ciento sesenta y cinco",
    170: "ciento setenta", 175: "ciento setenta y cinco", 180: "ciento ochenta", 185: "ciento ochenta y cinco",
    190: "ciento noventa", 195: "ciento noventa y cinco", 199: "ciento noventa y nueve",
    200: "doscientos", 205: "doscientos cinco", 210: "doscientos diez", 215: "doscientos quince",
    220: "doscientos veinte", 225: "doscientos veinticinco", 230: "doscientos treinta", 235: "doscientos treinta y cinco",
    240: "doscientos cuarenta", 245: "doscientos cuarenta y cinco", 250: "doscientos cincuenta", 255: "doscientos cincuenta y cinco",
    260: "doscientos sesenta", 265: "doscientos sesenta y cinco", 270: "doscientos setenta", 275: "doscientos setenta y cinco",
    280: "doscientos ochenta", 285: "doscientos ochenta y cinco", 290: "doscientos noventa", 295: "doscientos noventa y cinco",
    299: "doscientos noventa y nueve",
    300: "trescientos", 305: "trescientos cinco", 310: "trescientos diez", 320: "trescientos veinte",
    330: "trescientos treinta", 340: "trescientos cuarenta", 350: "trescientos cincuenta", 360: "trescientos sesenta",
    370: "trescientos setenta", 380: "trescientos ochenta", 390: "trescientos noventa", 399: "trescientos noventa y nueve",
    400: "cuatrocientos", 405: "cuatrocientos cinco", 420: "cuatrocientos veinte", 430: "cuatrocientos treinta",
    440: "cuatrocientos cuarenta", 450: "cuatrocientos cincuenta", 460: "cuatrocientos sesenta",
    470: "cuatrocientos setenta", 480: "cuatrocientos ochenta", 490: "cuatrocientos noventa", 499: "cuatrocientos noventa y nueve",
    500: "quinientos", 510: "quinientos diez", 520: "quinientos veinte", 530: "quinientos treinta",
    540: "quinientos cuarenta", 550: "quinientos cincuenta", 560: "quinientos sesenta",
    570: "quinientos setenta", 580: "quinientos ochenta", 590: "quinientos noventa", 599: "quinientos noventa y nueve",
    600: "seiscientos", 610: "seiscientos diez", 620: "seiscientos veinte", 630: "seiscientos treinta",
    640: "seiscientos cuarenta", 650: "seiscientos cincuenta", 660: "seiscientos sesenta",
    670: "seiscientos setenta", 680: "seiscientos ochenta", 690: "seiscientos noventa", 699: "seiscientos noventa y nueve",
    700: "setecientos", 710: "setecientos diez", 720: "setecientos veinte", 730: "setecientos treinta",
    740: "setecientos cuarenta", 750: "setecientos cincuenta", 760: "setecientos sesenta",
    770: "setecientos setenta", 780: "setecientos ochenta", 790: "setecientos noventa", 799: "setecientos noventa y nueve",
    800: "ochocientos", 810: "ochocientos diez", 820: "ochocientos veinte", 830: "ochocientos treinta",
    840: "ochocientos cuarenta", 850: "ochocientos cincuenta", 860: "ochocientos sesenta",
    870: "ochocientos setenta", 880: "ochocientos ochenta", 890: "ochocientos noventa", 899: "ochocientos noventa y nueve",
    900: "novecientos", 910: "novecientos diez", 920: "novecientos veinte", 930: "novecientos treinta",
    940: "novecientos cuarenta", 950: "novecientos cincuenta", 960: "novecientos sesenta",
    970: "novecientos setenta", 980: "novecientos ochenta", 990: "novecientos noventa", 999: "novecientos noventa y nueve",
    1000: "mil"
};


export const levelRanges = [
    { min: 1, max: 50 },
    { min: 51, max: 200 },
    { min: 201, max: 500 }
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

export function normalizeText(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[áàäâ]/g, 'a')
        .replace(/[éèëê]/g, 'e')
        .replace(/[íìïî]/g, 'i')
        .replace(/[óòöô]/g, 'o')
        .replace(/[úùüû]/g, 'u');
}

export function validateAnswer(userAnswer, correctAnswer) {
    const normalizedUserAnswer = normalizeText(userAnswer);
    const normalizedCorrectAnswer = normalizeText(correctAnswer);
    
    return normalizedUserAnswer === normalizedCorrectAnswer;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function generateDragDropActivity(level) {
    const range = levelRanges[level];
    if (!range) return { numbers: [], wordPairs: [] };
    
    const baseNumbers = [];
    const usedNumbers = new Set();
    
    while (baseNumbers.length < 5) {
        const randomNumber = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

        if (!usedNumbers.has(randomNumber)) {
            baseNumbers.push(randomNumber);
            usedNumbers.add(randomNumber);
        }
    }

    const distractorNumbers = [];
    while (distractorNumbers.length < 3) {
        const randomNumber = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

        if (!usedNumbers.has(randomNumber)) {
            distractorNumbers.push(randomNumber);
            usedNumbers.add(randomNumber);
        }
    }
    
    const wordPairs = baseNumbers.map(number => ({
        number: number,
        word: numberToWords(number)
    }));
    
    const shuffledWordPairs = shuffleArray(wordPairs);
    const allNumbers = [...baseNumbers, ...distractorNumbers];
    const shuffledNumbers = shuffleArray(allNumbers);
    
    return { numbers: shuffledNumbers, wordPairs: shuffledWordPairs };
}


export function validateNumberWordPair(number, word) {
    const correctWord = numberToWords(number);
    return normalizeText(word) === normalizeText(correctWord);
}