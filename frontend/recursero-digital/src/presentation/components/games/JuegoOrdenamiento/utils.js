
export const levelData = {
  1: [
    [433, 374, 743, 304, 473, 307],
    [123, 321, 213, 312, 231, 132],
    [456, 465, 654, 564, 645, 546],
    [742, 472, 247, 274, 724, 427],
    [987, 798, 897, 789, 879, 978]
  ],
  2: [
    [1863, 1736, 1836, 1667, 1788, 1879],
    [3452, 2781, 4036, 3905, 2647, 4189],
    [3468, 3486, 3648, 3684, 3846, 3864],
    [2579, 2597, 2759, 2795, 2795, 2975],
    [1689, 1698, 1869, 1896, 1968, 1986]
  ],
  3: [
    [52784, 63291, 47305, 56812, 48976, 69143],
    [36478, 36748, 37468, 37846, 38647, 38764],
    [25879, 25897, 27589, 27958, 28579, 28957],
    [41592, 63478, 54206, 72839, 48165, 69421],
    [13569, 13596, 15369, 15639, 16359, 16935]
  ]
};

export const getNumbersForActivity = (level, activityIndex) => {
  const numbers = levelData[level][activityIndex];
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
    `💡 Para ordenar los números recordá mirar el primer número para saber cuál es más grande. Si hay dos números que empiezan igual, mira el segundo número.`,
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

export const getLevelConfig = (level) => {
  const configs = {
    1: { 
      name: "Nivel 1", 
      description: "Números de 3 dígitos",
      range: "100 - 999"
    },
    2: { 
      name: "Nivel 2", 
      description: "Números de 4 dígitos",
      range: "1.000 - 9.999"
    },
    3: { 
      name: "Nivel 3", 
      description: "Números de 5 dígitos",
      range: "10.000 - 99.999"
    }
  };
  return configs[level] || configs[1];
};

export const formatNumber = (num) => {
  return num.toLocaleString('es-AR');
};

export const getNumbersCount = () => 6;
export const generateNumbers = (level, levelRanges, getNumbersCountFn) => {

  const levelNumber = level + 1;
  const activityIndex = 0; 
  
  if (levelData[levelNumber]) {
    return getNumbersForActivity(levelNumber, activityIndex);
  }

  const { min, max } = levelRanges[level] || levelRanges[0];
  const currentNumbersCount = getNumbersCountFn ? getNumbersCountFn(level) : 6;
  const generatedNumbers = new Set();

  while (generatedNumbers.size < currentNumbersCount) {
    const newNum = Math.floor(Math.random() * (max - min + 1)) + min;
    generatedNumbers.add(newNum);
  }

  const numbersArray = Array.from(generatedNumbers);
  const shuffledNumbers = [...numbersArray].sort(() => Math.random() - 0.5);
  const sorted = [...numbersArray].sort((a, b) => a - b);

  return {
    shuffled: shuffledNumbers,
    original: numbersArray,
    sorted: sorted
  };
};

export const levelRanges = [
    { min: 100, max: 999, name: "Números de 3 dígitos", description: "100 - 999" },
    { min: 1000, max: 9999, name: "Números de 4 dígitos", description: "1.000 - 9.999" },
    { min: 10000, max: 99999, name: "Números de 5 dígitos", description: "10.000 - 99.999" },
];

export const totalActivities = 5;