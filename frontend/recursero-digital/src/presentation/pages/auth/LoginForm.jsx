import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiRequest, AUTH_ENDPOINTS } from "../../../infrastructure/config/api";
import "../../styles/pages/loginForm.css";
import Logo from '../../../assets/logo.png';

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("alumno");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
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
      let endpoint;
      if (activeTab === "alumno") {
        endpoint = AUTH_ENDPOINTS.LOGIN_STUDENT;
      } else if (activeTab === "docente") {
        endpoint = AUTH_ENDPOINTS.LOGIN_TEACHER;
      } else if (activeTab === "admin") {
        endpoint = AUTH_ENDPOINTS.LOGIN_ADMIN;
      }
      
      const response = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          user: email,
          password: password
        })
      });

      console.log('Respuesta del login:', response); // Debug

      if (response.ok) {
        // Validar que el token exista en la respuesta
        if (!response.data || !response.data.token) {
          console.error('No se recibió token en la respuesta:', response.data);
          setError('Error: No se recibió token del servidor. Verifica la respuesta del backend.');
          return;
        }

        const token = response.data.token;
        console.log('Token recibido:', token ? 'Token presente' : 'Token vacío'); // Debug
        
        // Guardar el token
        localStorage.setItem('token', token);
        localStorage.setItem('userType', activeTab);
        localStorage.setItem('userEmail', email);
        
        // Verificar que se guardó correctamente
        const savedToken = localStorage.getItem('token');
        console.log('Token guardado en localStorage:', savedToken ? 'Sí' : 'No'); // Debug
        
        if (!savedToken) {
          setError('Error: No se pudo guardar el token. Verifica la configuración del navegador.');
          return;
        }

        if (activeTab === "alumno") {
          navigate("/alumno");
        } else if (activeTab === "docente") {
          navigate("/docente");
        } else if (activeTab === "admin") {
          navigate("/admin");
        }
      } else {
        setError(response.data?.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      setError('Error de conexión. Verifica que el servidor esté ejecutándose.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form-container bg-space bg-space-gradient bg-stars">
      <div className="login-form-content">
        <div className="header-section">
          <img src={Logo} alt="TecnoMente" className="imagen-logo" />
          <h1 className="titulo">¡TecnoMente!</h1>
          <p className="subtitulo">Inicia sesión para continuar</p>
        </div>

        
        <form onSubmit={handleLogin} className="login-form">
          {error && (
            <div className="error-messages">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="text" className="form-label">Username</label>
            <input
              type="text"
              id="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Tu username"
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
            {isLoading ? "Iniciando sesión..." : `Iniciar como ${activeTab === "alumno" ? "Estudiante" : activeTab === "docente" ? "Docente" : "Administrador"}`}
          </button>
        </form>

        <div className="forgot-password">
          <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </div>
  );
}
