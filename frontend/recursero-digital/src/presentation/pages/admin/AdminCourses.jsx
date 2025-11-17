import React, { useEffect, useState } from 'react';
import '../../styles/pages/adminCourses.css';
import { createCourse, getAllCourses, updateCourse, deleteCourse } from '../../services/adminService';
import AddCourseForm from './AddCourseForm';
import EditCourseForm from './EditCourseForm';
import DeleteCourseForm from './DeleteCourseForm';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [showEditCourseForm, setShowEditCourseForm] = useState(false);
  const [showDeleteCourseForm, setShowDeleteCourseForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
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

  const handleAddCourse = () => {
    setShowAddCourseForm(true);
  };

  const handleCloseForm = () => {
    setShowAddCourseForm(false);
    setShowEditCourseForm(false);
    setShowDeleteCourseForm(false);
    setSelectedCourse(null);
  };

  const handleCreateCourse = async (courseData) => {
    try {
      setLoading(true);
      setError(null);
      const created = await createCourse({ name: courseData.name });

      setCourses(prev => [
        ...prev,
        {
          id: created.id || Date.now(),
          name: created.name || courseData.name,
          teacher: created.teacherName || 'Sin docente asignado',
          students: created.studentsCount || 0,
          status: 'Activo'
        }
      ]);
      setShowAddCourseForm(false);
    } catch (err) {
      console.error('Error al crear curso:', err);
      setError(err.message || 'Error al crear curso');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setShowEditCourseForm(true);
  };

  const handleUpdateCourse = async (courseData) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await updateCourse({ 
        courseId: courseData.id, 
        name: courseData.name 
      });
      
      // Actualizar el estado local con los datos del backend
      setCourses(prev => 
        prev.map(c => 
          c.id === courseData.id 
            ? { 
                ...c, 
                name: updated.name,
                teacher: updated.teacherName || c.teacher,
                students: updated.studentsCount || c.students
              }
            : c
        )
      );
      setShowEditCourseForm(false);
      setSelectedCourse(null);
    } catch (err) {
      console.error('Error al actualizar curso:', err);
      setError(err.message || 'Error al actualizar curso');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = (course) => {
    setSelectedCourse(course);
    setShowDeleteCourseForm(true);
  };

  const handleConfirmDelete = async (course) => {
    try {
      setLoading(true);
      setError(null);
      await deleteCourse(course.id);
      
      // Actualizar el estado local eliminando el curso
      setCourses(prev => prev.filter(c => c.id !== course.id));
      setShowDeleteCourseForm(false);
      setSelectedCourse(null);
    } catch (err) {
      console.error('Error al eliminar curso:', err);
      setError(err.message || 'Error al eliminar curso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-courses">
      <div className="courses-header">
        <h1>Gestión de Cursos</h1>
        <button className="add-course-btn" onClick={handleAddCourse} disabled={loading}>
          {loading ? 'Creando...' : '+ Crear Curso'}
        </button>
      </div>

      {error && <div className="error-message-admin">{error}</div>}


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
              <button
                className="edit-btn-cursos" 
                onClick={() => handleEditCourse(course)}
                disabled={loading}
              >
                Editar
              </button>
              <button 
                className="delete-btn-cursos" 
                onClick={() => handleDeleteCourse(course)}
                disabled={loading}
              >
                Eliminar
              </button>
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

      {showAddCourseForm && (
        <AddCourseForm
          onClose={handleCloseForm}
          onSubmit={handleCreateCourse}
        />
      )}

      {showEditCourseForm && selectedCourse && (
        <EditCourseForm
          onClose={handleCloseForm}
          onSubmit={handleUpdateCourse}
          course={selectedCourse}
        />
      )}

      {showDeleteCourseForm && selectedCourse && (
        <DeleteCourseForm
          onClose={handleCloseForm}
          onConfirm={handleConfirmDelete}
          course={selectedCourse}
        />
      )}
    </div>
  );
}