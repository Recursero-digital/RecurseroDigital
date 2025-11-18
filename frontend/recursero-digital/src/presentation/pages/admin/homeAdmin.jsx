import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/homeAdmin.css';

export default function HomeAdmin() {
  const navigate = useNavigate();

  const handleAgregarUsuario = () => {
    navigate('/admin/usuarios');
  };

  const handleCrearCurso = () => {
    navigate('/admin/cursos');
  };

  const handleNuevaAsignacion = () => {
    navigate('/admin/asignaciones');
  };

  const handleConfigurarJuegos = () => {
    navigate('/admin/juegos');
  };

  return (
    <div className="home-admin">
      <div className="admin-welcome">
        <h1>Bienvenido, Administrador</h1>
        <p>Panel de control principal del sistema TecnoMente</p>
      </div>

      <div className="admin-overview">
        <div className="overview-card">
          <div className="card-icon"> 👥</div>
          <div className="card-content">
            <h3> Usuarios</h3>
            <p>Gestiona estudiantes y docentes</p>
            <span className="card-number">145 usuarios</span>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon">📚</div>
          <div className="card-content">
            <h3>Cursos</h3>
            <p>Administra cursos del sistema</p>
            <span className="card-number">25 cursos</span>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon">👨‍🏫</div>
          <div className="card-content">
            <h3>Docentes</h3>
            <p>Gestiona el personal docente</p>
            <span className="card-number">12 docentes</span>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon">📋</div>
          <div className="card-content">
            <h3>Asignaciones</h3>
            <p>Administra asignaciones activas</p>
            <span className="card-number">18 asignaciones</span>
          </div>
        </div>
      </div>

      <div className="admin-quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="actions-grid">
          <button className="action-card-admin" onClick={handleAgregarUsuario}> 
            <span className="action-icon">➕</span>
            <span className="action-text">Agregar Usuario</span>
          </button>
          <button className="action-card-admin" onClick={handleCrearCurso}>
            <span className="action-icon">📖</span>
            <span className="action-text">Crear Curso</span>
          </button>
          <button className="action-card-admin" onClick={handleNuevaAsignacion}>
            <span className="action-icon">🔗</span>
            <span className="action-text">Nueva Asignación</span>
          </button>
          <button className="action-card-admin" onClick={handleConfigurarJuegos}>
            <span className="action-icon">🎮</span>
            <span className="action-text">Configurar Juegos</span>
          </button>
        </div>
      </div>

      <div className="admin-activity">
        <h2>Actividad Reciente</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">👤</div>
            <div className="activity-content">
              <p><strong>Nuevo estudiante registrado:</strong> Juan Pérez</p>
              <span className="activity-time">Hace 2 horas</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📚</div>
            <div className="activity-content">
              <p><strong>Curso creado:</strong> Matemáticas Avanzadas</p>
              <span className="activity-time">Hace 5 horas</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">🔗</div>
            <div className="activity-content">
              <p><strong>Asignación completada:</strong> Álgebra - Prof. García</p>
              <span className="activity-time">Hace 1 día</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}