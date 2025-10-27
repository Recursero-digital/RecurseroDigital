import React, { useState } from 'react';
import '../../styles/pages/adminCourses.css';

export default function AdminCourses() {
  const [courses] = useState([
    { id: 1, name: 'Matemáticas Básicas', teacher: 'Prof. Ana Martín', students: 25, status: 'Activo' },
    { id: 2, name: 'Álgebra Intermedia', teacher: 'Prof. Luis Rodríguez', students: 18, status: 'Activo' },
    { id: 3, name: 'Geometría', teacher: 'Prof. Ana Martín', students: 22, status: 'Inactivo' }
  ]);

  return (
    <div className="admin-courses">
      <div className="courses-header">
        <h1>Gestión de Cursos</h1>
        <button className="add-course-btn">+ Crear Curso</button>
      </div>

      <div className="courses-filters">
        <div className="filter-group">
          <label>Filtrar por estado:</label>
          <select>
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Buscar curso:</label>
          <input type="text" placeholder="Nombre del curso..." />
        </div>
      </div>

      <div className="courses-grid">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-header">
              <h3>{course.name}</h3>
              <span className={`course-status ${course.status.toLowerCase()}`}>
                {course.status}
              </span>
            </div>
            <div className="course-info">
              <p><strong>Docente:</strong> {course.teacher}</p>
              <p><strong>Estudiantes:</strong> {course.students}</p>
            </div>
            <div className="course-actions">
              <button className="view-btn">Ver Detalles</button>
              <button className="edit-btn-cursos">Editar</button>
              <button className="delete-btn-cursos">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      <div className="courses-summary">
        <div className="summary-item">
          <span className="summary-number">{courses.length}</span>
          <span className="summary-label">Total Cursos</span>
        </div>
        <div className="summary-item">
          <span className="summary-number">{courses.filter(c => c.status === 'Activo').length}</span>
          <span className="summary-label">Cursos Activos</span>
        </div>
        <div className="summary-item">
          <span className="summary-number">{courses.reduce((acc, c) => acc + c.students, 0)}</span>
          <span className="summary-label">Total Estudiantes</span>
        </div>
      </div>
    </div>
  );
}