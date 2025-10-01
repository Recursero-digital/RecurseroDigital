import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiRequest, AUTH_ENDPOINTS } from "../config/api";
import "../styles/loginForm.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("alumno");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Establecer el rol inicial basado en el 
  // estado pasado desde la página anterior
  useEffect(() => {
    if (location.state?.role) {
      setActiveTab(location.state.role);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Determinar el endpoint según el tipo de usuario
      const endpoint = activeTab === "alumno" ? AUTH_ENDPOINTS.LOGIN_STUDENT : AUTH_ENDPOINTS.LOGIN_TEACHER;
      
      // Petición al backend
      const response = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          user: email,
          password: password
        })
      });

      if (response.ok) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', activeTab);
        localStorage.setItem('userEmail', email);
        
        //Navegar según el tipo de usuario
        if (activeTab === "alumno") {
          navigate("/alumno");
        } else {
          navigate("/docente");
        }
      } else {
        setError(response.data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      setError('Error de conexión. Verifica que el servidor esté ejecutándose.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form-content">
        <div className="header-section">
          <img src="src/assets/logo.png" alt="Recursera Digital" className="imagen-logo" />
          <h1 className="titulo">¡Recursero Digital!</h1>
          <p className="subtitulo">Inicia sesión para continuar</p>
        </div>

        
        <form onSubmit={handleLogin} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Tu contraseña"
              required
            />
          </div>

          <button 
            type="submit" 
            className={`login-button ${activeTab}`}
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : `Iniciar como ${activeTab === "alumno" ? "Estudiante" : "Docente"}`}
          </button>
        </form>

        <div className="forgot-password">
          <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </div>
  );
}
