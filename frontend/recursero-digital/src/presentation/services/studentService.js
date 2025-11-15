/**
 * Servicio para obtener datos del estudiante
 * Actualmente usa datos mock, preparado para backend
 * 
 * TODO BACKEND: Implementar llamadas reales a la API
 * - Eliminar: Toda la función getMockStudentData
 * - Agregar: fetch a endpoints reales del backend  
 * - Mantener: La estructura de datos que retorna (para compatibilidad con UI)
 */

// TODO BACKEND: Eliminar esta función mock completa
const getMockStudentData = (userName) => {
  return {
    name: userName,
    level: 15,
    totalScore: 22300,
    stats: {
      ordenamiento: {
        highScore: 12500,
        gamesPlayed: 42,
        accuracy: "92%",
        stars: 3,
      },
      escritura: {
        highScore: 9800,
        gamesPlayed: 35,
        accuracy: "88%",
        stars: 3,
      },
    },
  };
};

/**
 * Obtiene las estadísticas y perfil del estudiante
 * 
 * TODO BACKEND: Reemplazar implementación mock con llamada real
 * @param {string} studentId - ID del estudiante 
 * @returns {Promise<Object>} Datos del estudiante
 */
export const getStudentProfile = async (studentId) => {
  // TODO BACKEND: Reemplazar con fetch real
  // const response = await fetch(`/api/students/${studentId}/profile`);
  // return await response.json();
  
  // Mock implementation - mantener estructura de datos para UI
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockStudentData(studentId));
    }, 100); // Simula delay de red
  });
};

/**
 * Obtiene estadísticas de juegos del estudiante
 * 
 * TODO BACKEND: Implementar endpoint real
 * @param {string} studentId - ID del estudiante
 * @returns {Promise<Object>} Estadísticas de juegos
 */
export const getStudentGameStats = async (studentId) => {
  // TODO BACKEND: Implementar llamada real
  // const response = await fetch(`/api/students/${studentId}/game-stats`);
  // return await response.json();
  
  // Mock - eliminar cuando backend esté listo
  return getStudentProfile(studentId);
};