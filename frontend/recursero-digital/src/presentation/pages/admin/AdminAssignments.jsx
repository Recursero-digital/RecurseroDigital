import React, { useState } from 'react';
import '../../styles/pages/adminAssignments.css';

export default function AdminAssignments() {
  const [assignments] = useState([
    {
      id: 1,
      courseName: 'Matemáticas Básicas',
      teacherName: 'Prof. Ana Martín',
      studentsCount: 25,
      startDate: '2025-01-15',
      endDate: '2025-06-15',
      status: 'Activa'
    },
    {
      id: 2,
      courseName: 'Álgebra Intermedia',
      teacherName: 'Prof. Luis Rodríguez',
      studentsCount: 18,
      startDate: '2025-02-01',
      endDate: '2025-07-01',
      status: 'Activa'
    },
    {
      id: 3,
      courseName: 'Geometría',
      teacherName: 'Prof. Carmen López',
      studentsCount: 22,
      startDate: '2025-01-10',
      endDate: '2025-05-10',
      status: 'Finalizada'
    }
  ]);

  return (
    <div className="admin-assignments">
      <div className="assignments-header">
        <h1>Gestión de Asignaciones</h1>
        <button className="add-assignment-btn">+ Nueva Asignación</button>
      </div>

      <div className="assignments-stats">
        <div className="stat-card-assignments">
          <h3>Total Asignaciones</h3>
          <div className="stat-number">{assignments.length}</div>
        </div>
        <div className="stat-card-assignments">
          <h3>Asignaciones Activas</h3>
          <div className="stat-number">{assignments.filter(a => a.status === 'Activa').length}</div>
        </div>
        <div className="stat-card-assignments">
          <h3>Estudiantes Asignados</h3>
          <div className="stat-number">{assignments.reduce((acc, a) => acc + a.studentsCount, 0)}</div>
        </div>
        <div className="stat-card-assignments">
          <h3>Cursos Únicos</h3>
          <div className="stat-number">{new Set(assignments.map(a => a.courseName)).size}</div>
        </div>
      </div>

      <div className="assignments-content">
        <div className="assignments-filters">
          <div className="filter-group">
            <label>Filtrar por estado:</label>
            <select>
              <option value="all">Todas</option>
              <option value="active">Activas</option>
              <option value="finished">Finalizadas</option>
              <option value="pending">Pendientes</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Filtrar por docente:</label>
            <select>
              <option value="all">Todos los docentes</option>
              <option value="ana">Prof. Ana Martín</option>
              <option value="luis">Prof. Luis Rodríguez</option>
              <option value="carmen">Prof. Carmen López</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Buscar asignación:</label>
            <input type="text" placeholder="Curso o docente..." />
          </div>
        </div>

        <div className="assignments-table">
          <table>
            <thead>
              <tr>
                <th>Curso</th>
                <th>Docente</th>
                <th>Estudiantes</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(assignment => (
                <tr key={assignment.id}>
                  <td>
                    <div className="course-info">
                      <strong>{assignment.courseName}</strong>
                    </div>
                  </td>
                  <td>{assignment.teacherName}</td>
                  <td>
                    <span className="students-count">{assignment.studentsCount}</span>
                  </td>
                  <td>{new Date(assignment.startDate).toLocaleDateString('es-ES')}</td>
                  <td>{new Date(assignment.endDate).toLocaleDateString('es-ES')}</td>
                  <td>
                    <span className={`assignment-status ${assignment.status.toLowerCase()}`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="view-btn-asig">Ver</button>
                      <button className="edit-btn-asig">Editar</button>
                      <button className="students-btn-asig">Estudiantes</button>
                      <button className="delete-btn-asig">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
      </div>
    </div>
  );
}