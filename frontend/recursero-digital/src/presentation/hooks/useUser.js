import { useMemo } from "react";

/**
 * Hook reutilizable para obtener información del usuario
 * 
 * TODO BACKEND: Reemplazar localStorage por llamada a API
 * - Eliminar: localStorage.getItem calls
 * - Agregar: fetch a /api/user/profile o endpoint correspondiente
 */
export const useUser = () => {
  return useMemo(() => {
    // TODO BACKEND: Reemplazar con llamada a API
    const storedEmail = localStorage.getItem("userEmail");
    const storedName = localStorage.getItem("userName");
    
    if (storedName) return storedName.toUpperCase();
    if (storedEmail) {
      const nameFromEmail = storedEmail.split("@")[0];
      return nameFromEmail.toUpperCase();
    }
    return "ALUMNO";
  }, []);
};