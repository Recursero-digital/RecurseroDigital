import React from 'react';
import '../../styles/pages/adminTeachers.css';

export default function AdminTeachers({ teachers = [] }) {
  // Si no hay teachers, mostrar mensaje
  if (!teachers || teachers.length === 0) {
    return (
      <div className="admin-teachers">
        <p>No hay docentes registrados</p>
      </div>
    );
  }

  return (
    <div className="admin-teachers">
      <div className="teachers-stats">
        <div className="cartas-docente">
          <h3>Total Docentes</h3>
          <div className="docente-numeros">{teachers.length}</div>
        </div>
        <div className="cartas-docente">
          <h3>Docentes Activos</h3>
          <div className="docente-numeros">{teachers.filter(t => t.status === 'Activo').length}</div>
        </div>
        <div className="cartas-docente">
          <h3>Total Cursos</h3>
          <div className="docente-numeros">{teachers.reduce((acc, t) => acc + t.courses, 0)}</div>
        </div>
      </div>

      {/*      <div className="stat-card">
          <h3>Total Estudiantes</h3>
          <div className="stat-number">{teachers.reduce((acc, t) => acc + t.students, 0)}</div>
        </div>*/}

      <div className="teachers-content">
        <div className="teachers-filters">
          <div className="filter-group">
            <label>Filtrar por estado:</label>
            <select>
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Buscar docente:</label>
            <input type="text" placeholder="Nombre o email..." />
          </div>
        </div>

        <div className="teachers-grid">
          {teachers.map(teacher => (
            <div key={teacher.id} className="teacher-card">
              <div className="teacher-header">
                <h3>{teacher.name}</h3>
                <span className={`teacher-status ${teacher.status.toLowerCase()}`}>
                  {teacher.status}
                </span>
              </div>
              <div className="teacher-info">
                <p><strong>Email:</strong> {teacher.email}</p>
                <p><strong>Username:</strong> {teacher.username}</p>
                <div className="teacher-metrics">
                  <div className="metric">
                    <span className="metric-value">-</span>
                    <span className="metric-label">Cursos</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">-</span>
                    <span className="metric-label">Estudiantes</span>
                  </div>
                </div>
              </div>
              <div className="teacher-actions">
                <button className="view-boton">Ver Perfil</button>
                <button className="edit-boton">Editar</button>
                <button className="courses-boton">Ver Cursos</button>
                <button className="delete-boton">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}