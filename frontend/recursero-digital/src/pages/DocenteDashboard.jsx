import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/docenteDashboard.css";

export default function DocenteDashboard() {
  const navigate = useNavigate();
  const [cursoActual, setCursoActual] = useState(null);
  const [estadisticas, setEstadisticas] = useState({
    totalEstudiantes: 0,
    juegosActivos: 0,
    progresoPromedio: 0
  });

  useEffect(() => {
    // Cargar curso seleccionado desde localStorage
    const cursoGuardado = localStorage.getItem('cursoSeleccionado');
    if (cursoGuardado) {
      setCursoActual(JSON.parse(cursoGuardado));
      // Simular carga de estadísticas
      setEstadisticas({
        totalEstudiantes: 25,
        juegosActivos: 6,
        progresoPromedio: 78
      });
    } else {
      // Si no hay curso seleccionado, redirigir a selección
      navigate('/docente');
    }
  }, [navigate]);

  const cambiarCurso = () => {
    localStorage.removeItem('cursoSeleccionado');
    navigate('/docente');
  };

  if (!cursoActual) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="docente-dashboard">
      <div className="dashboard-header">
        <div className="curso-info">
          <div className="curso-badge" style={{ backgroundColor: cursoActual.color }}>
            {cursoActual.icono}
          </div>
          <div className="curso-details">
            <h1>{cursoActual.nombre}</h1>
          </div>
        </div>
        <button className="cambiar-curso-btn" onClick={cambiarCurso}>
          🔄 Cambiar Curso
        </button>
      </div>

      <div className="estadisticas-grid">
        <div className="stat-card estudiantes">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{estadisticas.totalEstudiantes}</h3>
            <p>Estudiantes</p>
          </div>
        </div>

        <div className="stat-card juegos">
          <div className="stat-icon">🎮</div>
          <div className="stat-info">
            <h3>{estadisticas.juegosActivos}</h3>
            <p>Juegos Activos</p>
          </div>
        </div>

        <div className="stat-card progreso">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{estadisticas.progresoPromedio}%</h3>
            <p>Progreso Promedio</p>
          </div>
        </div>
      </div>

      <div className="acciones-rapidas">
        <h2>🚀 Acciones Rápidas</h2>
        <div className="acciones-grid">
          <div className="accion-card" onClick={() => navigate('/docente/estudiantes')}>
            <div className="accion-icon">👨‍🎓</div>
            <h3>Ver Estudiantes</h3>
            <p>Gestiona el progreso de tus estudiantes</p>
          </div>

          <div className="accion-card" onClick={() => navigate('/docente/juegos')}>
            <div className="accion-icon">🎯</div>
            <h3>Configurar Juegos</h3>
            <p>Asigna y configura actividades</p>
          </div>

          <div className="accion-card" onClick={() => navigate('/docente/reportes')}>
            <div className="accion-icon">📈</div>
            <h3>Ver Reportes</h3>
            <p>Analiza el rendimiento del curso</p>
          </div>

          <div className="accion-card" onClick={() => navigate('/docente/perfil')}>
            <div className="accion-icon">⚙️</div>
            <h3>Configuración</h3>
            <p>Ajusta las preferencias del curso</p>
          </div>
        </div>
      </div>
    </div>
  );
}