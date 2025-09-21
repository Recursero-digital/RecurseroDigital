import React, { useState, useEffect, useRef } from 'react';
import Sortable from 'sortablejs';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './JuegoOrdenamiento.css';

// Componente de Error Boundary para capturar errores
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error en JuegoOrdenamiento:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="game-fullscreen">
          <div className="game-content">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2>¡Oops! Algo salió mal</h2>
              <p>Ha ocurrido un error en el juego.</p>
              <button onClick={() => window.location.reload()}>
                Recargar juego
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const JuegoOrdenamientoGame = () => {
  const levelRanges = [
    { min: 1, max: 100 },
    { min: 101, max: 500 },
    { min: 501, max: 1000 },
    { min: 1001, max: 2000 },
    { min: 2001, max: 4000 }
  ];
  const numbersCount = 6;

  const [gameState, setGameState] = useState({
    currentLevel: 1,
    attempts: 0,
    score: 0
  });
  const [numbers, setNumbers] = useState([]);
  const [showGameComplete, setShowGameComplete] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showIncorrectMessage, setShowIncorrectMessage] = useState(false);

  const targetAreaRef = useRef(null);
  const numbersContainerRef = useRef(null);

  const generateNumbers = (level) => {
    // Validar que el nivel esté dentro del rango
    if (level < 1 || level > levelRanges.length) {
      console.error(`Nivel inválido: ${level}. Debe estar entre 1 y ${levelRanges.length}`);
      return;
    }
    
    const { min, max } = levelRanges[level - 1];
    const generatedNumbers = new Set();
    while (generatedNumbers.size < numbersCount) {
      generatedNumbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    const numbersArray = Array.from(generatedNumbers);
    setNumbers(numbersArray.sort(() => Math.random() - 0.5));
  };

  const getOrderInstructionForLevel = (level) => {
    // Validar que el nivel esté dentro del rango
    if (level < 1 || level > levelRanges.length) {
      return 'Nivel inválido';
    }
    return level % 2 === 0 ? 'Ordena los números de menor a mayor' : 'Ordena los números de mayor a menor';
  };

  const isCorrectOrder = (arr, level) => {
    const correctOrder = [...arr].sort((a, b) => (level % 2 === 0 ? a - b : b - a));
    return arr.every((num, i) => num === correctOrder[i]);
  };

  useEffect(() => {
    AOS.init({ duration: 600 });
    generateNumbers(gameState.currentLevel);

    let timeoutId1, timeoutId2; // Para almacenar IDs de timeouts

    // Sortable para área objetivo
    if (targetAreaRef.current && !targetAreaRef.current.dataset.sortable) {
      new Sortable(targetAreaRef.current, {
        group: 'shared',
        animation: 200,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        onAdd: () => {
          try {
            if (!targetAreaRef.current) return;
            
            const currentNumbers = Array.from(targetAreaRef.current.children)
              .filter((el) => el.classList.contains('number-box'))
              .map((el) => {
                const value = parseInt(el.dataset.value);
                return isNaN(value) ? 0 : value;
              });

            if (currentNumbers.length === numbersCount) {
            if (isCorrectOrder(currentNumbers, gameState.currentLevel)) {
              const newScore = gameState.score + 100 * gameState.currentLevel - gameState.attempts * 5;
              setShowLevelUp(true);

              timeoutId1 = setTimeout(() => {
                if (gameState.currentLevel >= levelRanges.length) {
                  setShowGameComplete(true);
                } else {
                  setGameState((prev) => ({
                    ...prev,
                    currentLevel: prev.currentLevel + 1,
                    attempts: 0,
                    score: Math.max(0, newScore)
                  }));
                  // Generar números para el siguiente nivel
                  const nextLevel = gameState.currentLevel + 1;
                  if (nextLevel <= levelRanges.length) {
                    generateNumbers(nextLevel);
                  }
                  // Verificar que el ref existe antes de acceder
                  if (targetAreaRef.current) {
                    targetAreaRef.current.innerHTML = '';
                  }
                  setShowLevelUp(false);
                }
              }, 2000);
            } else {
              setShowIncorrectMessage(true);
              setGameState((prev) => ({ ...prev, attempts: prev.attempts + 1 }));

              timeoutId2 = setTimeout(() => {
                setShowIncorrectMessage(false);
                // Verificar que el ref existe antes de acceder
                if (targetAreaRef.current) {
                  targetAreaRef.current.innerHTML = '';
                }
                generateNumbers(gameState.currentLevel);
              }, 1500);
            }
          }
        } catch (error) {
          console.error('Error en onAdd:', error);
        }
      }
    });
      targetAreaRef.current.dataset.sortable = 'true';
    }

    // Sortable para contenedor de números
    if (numbersContainerRef.current && !numbersContainerRef.current.dataset.sortable) {
      new Sortable(numbersContainerRef.current, {
        group: 'shared',
        animation: 200,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag'
      });
      numbersContainerRef.current.dataset.sortable = 'true';
    }

    // Cleanup function
    return () => {
      if (timeoutId1) clearTimeout(timeoutId1);
      if (timeoutId2) clearTimeout(timeoutId2);
    };
  }, [gameState.currentLevel]);

  return (
    <div className="game-fullscreen">
      <div className="game-content">
        <header className="game-header">
          <h1>Ordenamiento Numérico</h1>
          <p>{getOrderInstructionForLevel(gameState.currentLevel)}</p>
        </header>

        <div className="game-status">
          <div className="status-item">
            <span className="status-label">Nivel</span>
            <span className="status-value">{gameState.currentLevel}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Intentos</span>
            <span className="status-value">{gameState.attempts}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Puntuación</span>
            <span className="status-value">{gameState.score}</span>
          </div>
        </div>

        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${(gameState.currentLevel / levelRanges.length) * 100}%` }}
          />
        </div>

        {!showGameComplete ? (
          <div className="game-play-area">
            <div className="sorting-zone">
              <div className="sorting-area" ref={targetAreaRef}></div>
            </div>

            <div className="numbers-source">
              <div className="numbers-container" ref={numbersContainerRef}>
                {numbers.map((number) => (
                  <div key={number} className="number-box" data-value={number} data-aos="fade-up">
                    {number}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="game-complete">
            <h2>¡Juego Completado!</h2>
            <p>Has completado todos los niveles</p>
            <p>Puntuación final: {gameState.score}</p>
            <button onClick={() => window.location.reload()}>Jugar de nuevo</button>
          </div>
        )}

        {showLevelUp && !showGameComplete && (
          <>
            <div className="overlay"></div>
            <div className="level-up-message">
              <h2>¡Felicitaciones!</h2>
              <p>Has completado el nivel {gameState.currentLevel}</p>
              <p>¡Prepárate para el nivel {gameState.currentLevel + 1}!</p>
              <p className="level-instruction">{getOrderInstructionForLevel(gameState.currentLevel + 1)}</p>
            </div>
          </>
        )}

        {showIncorrectMessage && (
          <>
            <div className="overlay"></div>
            <div className="incorrect-message">
              <h2>¡Orden Incorrecto!</h2>
              <p>Intenta de nuevo</p>
              <p className="instruction">{getOrderInstructionForLevel(gameState.currentLevel)}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Componente principal envuelto en ErrorBoundary
const JuegoOrdenamiento = () => {
  return (
    <ErrorBoundary>
      <JuegoOrdenamientoGame />
    </ErrorBoundary>
  );
};

export default JuegoOrdenamiento;
