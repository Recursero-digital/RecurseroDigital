# useGameScoring Hook

## Descripción
Hook personalizado que unifica la lógica de puntuación entre diferentes juegos del sistema. Maneja puntos, intentos y cálculos de puntaje de manera consistente.

## Funcionalidades
- **Cálculo de puntaje**: Puntaje base de 50 × (nivel + 1) con penalización de 5 puntos por intento
- **Gestión de intentos**: Incremento, reseteo y tracking de intentos
- **Acumulación de puntos**: Suma puntos al total del juego
- **Reseteo completo**: Restaura todos los valores a su estado inicial

## API

### Estados expuestos
```javascript
const { points, attempts } = useGameScoring();
```

### Funciones disponibles
```javascript
const {
  // Cálculo
  calculateActivityScore,
  getScoringInfo,
  
  // Modificación
  addPoints,
  incrementAttempts,
  resetAttempts,
  resetScoring,
  completeActivity
} = useGameScoring();
```

## Ejemplo de uso

```javascript
import useGameScoring from '../../../hooks/useGameScoring';

const MiJuego = () => {
  const { 
    points, 
    attempts, 
    incrementAttempts, 
    resetAttempts, 
    resetScoring, 
    completeActivity 
  } = useGameScoring();

  const [currentLevel, setCurrentLevel] = useState(0);

  // Al iniciar un nuevo juego
  const handleStartGame = (level) => {
    setCurrentLevel(level - 1);
    resetScoring(); // Resetea puntos y intentos
  };

  // Cuando el usuario falla un intento
  const handleFailedAttempt = () => {
    incrementAttempts();
  };

  // Cuando el usuario completa una actividad
  const handleActivityComplete = () => {
    const scoreEarned = completeActivity(currentLevel);
    console.log(`¡Ganaste ${scoreEarned} puntos!`);
    // Los puntos ya están añadidos automáticamente
    // Los intentos ya están reseteados automáticamente
  };

  return (
    <div>
      <div>Puntos: {points}</div>
      <div>Intentos: {attempts}</div>
    </div>
  );
};
```

## Beneficios de la unificación

1. **Consistencia**: Todos los juegos usan la misma fórmula de puntuación
2. **Mantenibilidad**: Cambios en la lógica de puntuación se aplican a todos los juegos
3. **Reutilización**: El hook se puede usar en futuros juegos
4. **Separación de responsabilidades**: La lógica de puntuación está separada de la lógica del juego
5. **Testing**: Se puede testear la lógica de puntuación de forma aislada

## Juegos que utilizan este hook
- ✅ JuegoEscritura
- ✅ JuegoOrdenamiento
- 🔄 Futuros juegos pueden implementarlo fácilmente