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

 

  return (
    <div className="home-admin">
      <div className="admin-welcome">
        <h1>Bienvenido, Administrador</h1>
        <p>Panel de control principal del sistema</p>
      </div>

      <div className="admin-overview">
        <div className="overview-card">
          <div className="card-icon"> 👥</div>
          <div className="card-content">
            <h3> Usuarios</h3>
            <p>Gestiona estudiantes y docentes</p>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon">📚</div>
          <div className="card-content">
            <h3>Cursos</h3>
            <p>Administra cursos del sistema</p>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon">👨‍🏫</div>
          <div className="card-content">
            <h3>Docentes</h3>
            <p>Gestiona el personal docente</p>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon">📋</div>
          <div className="card-content">
            <h3>Asignaciones</h3>
            <p>Administra asignaciones activas</p>
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
        </div>
      </div>


    </div>
  );
}