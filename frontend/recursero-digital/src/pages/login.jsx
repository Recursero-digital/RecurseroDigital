/*import { useState } from "react";
import { useNavigate } from "react-router-dom";*/


/*export default function Login() {
  const [role, setRole] = useState("alumno");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (role === "alumno") navigate("/alumno");
    else navigate("/docente");
  };

  return (
    <div>
      <h1>Recursera Digital - Login</h1>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="alumno">Alumno</option>
        <option value="docente">Docente</option>
      </select>
      <button onClick={handleLogin}>Ingresar</button>
    </div>
  );
}*/
import "../styles/login.css"
export default function RoleSelection() {

  const handleRoleSelect = (role) => {
    // Redirect to login page based on role
    if (role === "alumno") {
      window.location.href = "/alumno";
    } else if (role === "docente") {
      window.location.href = "/docente";
    }}

  return (
      <div className="role-selection-container">
      <div className="role-selection-content">
        <div className="header-section">
          <img src="src\assets\logo.png" alt="Recursera Digital" className="logo-image" />
          <h1 className="main-title">¡Recursera Digital!</h1>
          <p className="subtitle">Selecciona tu rol para comenzar</p>
        </div>

        <div className="cards-container">
          <div className="role-card">
            <div className="card-header">
              <div className="card-emoji">🎓</div>
              <h2 className="card-title student">Estudiante</h2>
              <p className="card-description student">¡Aprende matemáticas jugando!</p>
            </div>
            <button onClick={() => handleRoleSelect("alumno")} className="role-button student">
              Soy Estudiante
            </button>
          </div>

          <div className="role-card">
            <div className="card-header">
              <div className="card-emoji">👨‍🏫</div>
              <h2 className="card-title teacher">Docente</h2>
              <p className="card-description teacher">Gestiona y enseña a tus estudiantes</p>
            </div>
            <button onClick={() => handleRoleSelect("docente")} className="role-button teacher">
              Soy Docente
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}