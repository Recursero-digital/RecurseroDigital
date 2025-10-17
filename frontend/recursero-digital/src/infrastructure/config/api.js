// Configuración de la API
export const API_BASE_URL = 'http://localhost:3000';

// Endpoints de autenticación
export const AUTH_ENDPOINTS = {
  LOGIN_STUDENT: '/login/student',
  LOGIN_TEACHER: '/login/teacher',
  LOGIN_ADMIN: '/login/admin',
  LOGOUT: '/logout'
};

// Función helper para hacer peticiones a la API
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Agregar token de autorización si existe
  const token = localStorage.getItem('token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    return {
      ok: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    console.error('Error en la petición API:', error);
    throw error;
  }
};
