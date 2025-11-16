import { useState, useEffect } from "react";
import { getStudentProfile } from "../services/studentService";
import { useUser } from "./useUser";

/**
 * Hook para gestionar datos del perfil del estudiante
 * Preparado para backend con funcionalidad mock actual
 * 
 * TODO BACKEND: Cuando implementen los endpoints reales:
 * 1. Reemplazar getStudentProfile con fetch real al API
 * 2. Mantener la estructura de datos que retorna
 * 3. Agregar manejo de tokens de autenticación si es necesario
 * 4. Implementar WebSocket/SSE para actualizaciones en tiempo real
 */
export const useStudentProfile = () => {
  const userName = useUser();
  
  // Estados principales
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userName) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // TODO BACKEND: Reemplazar con fetch real al API
        // const response = await fetch(`/api/students/${studentId}/profile`);
        // const profileData = await response.json();
        const profileData = await getStudentProfile(userName);
        setData(profileData);
        
      } catch (err) {
        // TODO BACKEND: Ajustar manejo de errores según API real
        setError('Error al cargar el perfil del estudiante');
        console.error('Error fetching student profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userName]);

  // TODO BACKEND: Función para recargar datos manualmente
  const refreshProfile = async () => {
    if (userName) {
      try {
        setLoading(true);
        setError(null);
        const profileData = await getStudentProfile(userName);
        setData(profileData);
      } catch (err) {
        setError('Error al recargar el perfil del estudiante');
        console.error('Error refreshing student profile:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    data,
    loading,
    error,
    refreshProfile
  };
};