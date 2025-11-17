import React, { useEffect, useState } from 'react';
import '../../styles/pages/adminCourses.css';
import { createCourse, getAllCourses } from '../../services/adminService';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [newCourseName, setNewCourseName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const data = await getAllCourses();
        setCourses(
          data.map((c) => ({
            id: c.id,
            name: c.name,
            teacher: c.teacherName || 'Sin docente asignado',
            students: c.students || 0,
            status: 'Activo',
          }))
        );
      } catch (err) {
        console.error('Error al cargar cursos:', err);
        setError('No se pudieron cargar los cursos');
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const handleCreateCourse = async () => {
    if (!newCourseName.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const created = await createCourse({ name: newCourseName.trim() });

      setCourses(prev => [
        ...prev,
        {
          id: created.id || Date.now(),
          name: created.name || newCourseName.trim(),
          teacher: created.teacherName || 'Sin docente asignado',
          students: created.studentsCount || 0,
          status: 'Activo'
        }
      ]);
      setNewCourseName('');
    } catch (err) {
      console.error('Error al crear curso:', err);
      setError(err.message || 'Error al crear curso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-courses">
      <div className="courses-header">
        <h1>Gestión de Cursos</h1>
        <div className="create-course-inline">
          <input
            type="text"
            placeholder="Nombre del nuevo curso"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            disabled={loading}
          />
          <button className="add-course-btn" onClick={handleCreateCourse} disabled={loading}>
            {loading ? 'Creando...' : '+ Crear Curso'}
          </button>
        </div>
      </div>

      {error && <div className="error-message-admin">{error}</div>}

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
              <button className="view-btn" disabled>Ver Detalles</button>
              <button className="edit-btn-cursos" disabled>Editar</button>
              <button className="delete-btn-cursos" disabled>Eliminar</button>
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