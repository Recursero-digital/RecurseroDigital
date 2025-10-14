import { useState, useEffect } from 'react';

/**
 * Hook para obtener el ID del estudiante actual
 * En una implementación real, esto vendría del contexto de autenticación
 */
const useStudentId = () => {
  const [studentId, setStudentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular obtención del ID del estudiante desde localStorage o contexto
    // En producción, esto vendría del sistema de autenticación
    const getStudentId = () => {
      try {
        // Intentar obtener del localStorage (para desarrollo)
        const storedStudentId = localStorage.getItem('studentId');
        
        if (storedStudentId) {
          setStudentId(storedStudentId);
        } else {
          // Generar un ID temporal para desarrollo
          const tempStudentId = 'student-' + Date.now();
          localStorage.setItem('studentId', tempStudentId);
          setStudentId(tempStudentId);
        }
      } catch (error) {
        console.error('Error getting student ID:', error);
        // Fallback para desarrollo
        setStudentId('demo-student-123');
      } finally {
        setIsLoading(false);
      }
    };

    getStudentId();
  }, []);

  return { studentId, isLoading };
};

export default useStudentId;
