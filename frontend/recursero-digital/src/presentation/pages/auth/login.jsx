import { useNavigate } from "react-router-dom";
import "../../styles/pages/login.css"
import { PiStudentFill } from "react-icons/pi";
import Logo from '../../../assets/Logo.png';


export default function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate("/login-form", { state: { role } });
  }

  return (
      <div className="role-selection-container">
      <div className="role-selection-content">
        <div className="header-section">
          <img src={Logo} alt="TecnoMente" className="logo-image" />

        </div>

        <div className="cards-container">
          <div className="role-card">
            <div className="card-header">
              <div className="card-emoji"> <PiStudentFill/></div>
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