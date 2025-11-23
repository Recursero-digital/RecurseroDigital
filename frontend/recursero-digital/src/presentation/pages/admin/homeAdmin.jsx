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

  const handleConfigJuegos = () => {
    navigate('/admin/config-juegos');
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
          <div className="card-icon">📋</div>
          <div className="card-content">
            <h3>Asignaciones</h3>
            <p>Administra asignaciones activas</p>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon">🎮</div>
          <div className="card-content">
            <h3>Configuración Juegos</h3>
            <p>Gestiona niveles y configuraciones de juegos</p>
          </div>
        </div>
      </div>




    </div>
  );
}