
import "../styles/homeDocente.css";

export default function HomeDocente() {
  return (
    <div className="docente-content">
      <h1>Bienvenido Docente 👨‍🏫</h1>
      <p>Aquí podrás gestionar a tus alumnos y ver estadísticas</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>📊 Estadísticas</h3>
          <p>Ver el progreso de tus estudiantes</p>
        </div>
        <div className="stat-card">
          <h3>👥 Estudiantes</h3>
          <p>Gestionar la lista de alumnos</p>
        </div>
        <div className="stat-card">
          <h3>🎮 Juegos</h3>
          <p>Configurar actividades y juegos</p>
        </div>
      </div>
    </div>
  );
}