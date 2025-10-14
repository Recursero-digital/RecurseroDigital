# 📊 Integración del Sistema de Estadísticas

Este documento explica cómo integrar el sistema de estadísticas en los juegos existentes del frontend.

## 🚀 Componentes Creados

### 1. **Hooks Personalizados**

#### `useGameStatistics.js`
Hook principal para manejar todas las operaciones de estadísticas:
- `saveGameStatistics()` - Guarda estadísticas de una actividad
- `getStudentProgress()` - Obtiene progreso del estudiante
- `getGameStatistics()` - Obtiene estadísticas generales del juego
- `calculateSessionStats()` - Calcula métricas de sesión

#### `useStudentId.js`
Hook para obtener el ID del estudiante actual:
- Maneja localStorage para desarrollo
- Integración futura con sistema de autenticación

### 2. **Componentes de UI**

#### `StudentProgressDashboard.jsx`
Dashboard completo que muestra:
- Progreso por juego
- Estadísticas agregadas
- Historial de actividades
- Métricas de rendimiento

#### `GameWithStatistics.jsx`
Componente de ejemplo que demuestra:
- Cómo integrar estadísticas en cualquier juego
- Manejo de sesiones
- Registro de actividades
- Completado de niveles

## 🔧 Cómo Integrar en Juegos Existentes

### Paso 1: Importar los Hooks

```javascript
import useGameScoring from '../../hooks/useGameScoring';
import useStudentId from '../../hooks/useStudentId';
```

### Paso 2: Inicializar en el Componente

```javascript
const { studentId } = useStudentId();
const { 
  startGameSession, 
  endGameSession, 
  completeActivity,
  incrementAttempts 
} = useGameScoring();
```

### Paso 3: Iniciar Sesión de Juego

```javascript
const startGame = () => {
  startGameSession();
  // ... lógica existente del juego
};
```

### Paso 4: Registrar Actividades

```javascript
const handleActivityComplete = async (isCorrect, additionalData = {}) => {
  try {
    await completeActivity(
      currentLevel,           // Nivel (0-indexed)
      'game-escritura',      // Tipo de juego
      currentActivity,       // Actividad
      maxUnlockedLevel,      // Nivel máximo desbloqueado
      {
        correctAnswers: correctCount,
        totalQuestions: totalCount,
        ...additionalData
      },
      studentId              // ID del estudiante
    );
  } catch (error) {
    console.error('Error al guardar estadísticas:', error);
  }
};
```

### Paso 5: Finalizar Sesión

```javascript
const endGame = () => {
  endGameSession();
  // ... lógica existente del juego
};
```

## 📋 Mapeo de Juegos

| Juego | gameType | Descripción |
|-------|----------|-------------|
| JuegoEscritura | `game-escritura` | Juego de escritura de números |
| JuegoOrdenamiento | `game-ordenamiento` | Ordenamiento de números |
| JuegoDescomposición | `game-descomposicion` | Descomposición numérica |

## 🎯 Tipos de Datos para Estadísticas

### Datos Básicos Requeridos
- `studentId`: ID del estudiante
- `gameId`: Tipo de juego
- `level`: Nivel (1-indexed)
- `activity`: Actividad dentro del nivel
- `points`: Puntos obtenidos
- `attempts`: Número de intentos
- `isCompleted`: Si la actividad fue completada

### Datos Opcionales
- `correctAnswers`: Respuestas correctas
- `totalQuestions`: Total de preguntas
- `completionTime`: Tiempo en segundos
- `maxUnlockedLevel`: Nivel máximo desbloqueado
- `sessionStartTime`: Inicio de sesión
- `sessionEndTime`: Fin de sesión

## 🔄 Flujo de Integración

1. **Al iniciar el juego**: `startGameSession()`
2. **Durante el juego**: `incrementAttempts()` en cada intento
3. **Al completar actividad**: `completeActivity()` con datos
4. **Al terminar juego**: `endGameSession()`

## 📊 Ejemplo de Uso Completo

```javascript
import React, { useState } from 'react';
import useGameScoring from '../hooks/useGameScoring';
import useStudentId from '../hooks/useStudentId';

const MiJuego = () => {
  const { studentId } = useStudentId();
  const { 
    startGameSession, 
    endGameSession, 
    completeActivity,
    incrementAttempts,
    points,
    attempts 
  } = useGameScoring();

  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  const startGame = () => {
    startGameSession();
    setGameActive(true);
  };

  const handleCorrectAnswer = async () => {
    incrementAttempts();
    
    await completeActivity(
      currentLevel,
      'mi-juego',
      1,
      currentLevel + 1,
      { correctAnswers: 1, totalQuestions: 1 },
      studentId
    );
  };

  const endGame = () => {
    endGameSession();
    setGameActive(false);
  };

  return (
    <div>
      <h2>Mi Juego - Puntos: {points}</h2>
      {!gameActive ? (
        <button onClick={startGame}>Iniciar</button>
      ) : (
        <div>
          <button onClick={handleCorrectAnswer}>Respuesta Correcta</button>
          <button onClick={endGame}>Terminar</button>
        </div>
      )}
    </div>
  );
};
```

## 🎨 Dashboard de Progreso

Para mostrar el progreso del estudiante, simplemente incluye el componente:

```javascript
import StudentProgressDashboard from '../components/StudentProgressDashboard';

const Dashboard = () => {
  const { studentId } = useStudentId();
  
  return (
    <div>
      <h1>Mi Dashboard</h1>
      <StudentProgressDashboard studentId={studentId} />
    </div>
  );
};
```

## 🚨 Consideraciones Importantes

1. **Compatibilidad**: El sistema mantiene compatibilidad con el sistema anterior
2. **Manejo de Errores**: Las estadísticas no bloquean el juego si fallan
3. **Rendimiento**: Las llamadas a la API son asíncronas y no bloquean la UI
4. **Desarrollo**: Usa localStorage para IDs de estudiante en desarrollo

## 🔮 Próximos Pasos

1. Integrar con sistema de autenticación real
2. Agregar más métricas específicas por juego
3. Implementar reportes para docentes
4. Agregar gráficos y visualizaciones avanzadas
