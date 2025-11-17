import React, { useState, useEffect } from 'react';
import '../../styles/pages/adminAssignments.css';
import '../../styles/pages/addUserForm.css';
import { getAllCourses, getAllTeachers, getAllStudents, assignCourseToStudent, assignTeacherToCourses, getCourseStudents } from '../../services/adminService';

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]); // Para asignar múltiples cursos a un docente

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar cursos, docentes y estudiantes
        const [coursesData, teachersData, studentsData] = await Promise.all([
          getAllCourses(),
          getAllTeachers(),
          getAllStudents()
        ]);
        
        setCourses(coursesData);
        setTeachers(teachersData);
        setStudents(studentsData);
        
        // Construir asignaciones desde los cursos
        const assignmentsData = await Promise.all(
          coursesData.map(async (course) => {
            // Obtener estudiantes del curso
            let studentsCount = 0;
            try {
              const courseStudents = await getCourseStudents(course.id);
              studentsCount = courseStudents.length;
            } catch (err) {
              console.warn(`No se pudieron obtener estudiantes del curso ${course.id}:`, err);
            }
            
            // Buscar docente del curso
            const teacher = teachersData.find(t => {
              // Buscar el docente por el teacherId del curso
              return course.teacherId && t.id === course.teacherId;
            });
            
            return {
              id: course.id,
              courseName: course.name,
              courseId: course.id,
              teacherName: teacher ? (teacher.name || teacher.fullName || `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim()) : 'Sin docente asignado',
              teacherId: course.teacherId || null,
              studentsCount,
              status: course.teacherId ? 'Activa' : 'Pendiente'
            };
          })
        );
        
        setAssignments(assignmentsData);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError(err.message || 'No se pudieron cargar las asignaciones');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleOpenStudentModal = () => {
    setShowStudentModal(true);
  };

  const handleOpenTeacherModal = () => {
    setShowTeacherModal(true);
  };

  const handleCloseStudentModal = () => {
    setShowStudentModal(false);
    setSelectedStudent('');
    setSelectedCourse('');
    setError(null);
  };

  const handleCloseTeacherModal = () => {
    setShowTeacherModal(false);
    setSelectedTeacher('');
    setSelectedCourses([]);
    setError(null);
  };

  const handleSubmitStudentAssignment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!selectedStudent || !selectedCourse) {
        setError('Debes seleccionar un estudiante y un curso');
        return;
      }
      
      await assignCourseToStudent({
        studentId: selectedStudent,
        courseId: selectedCourse
      });
      
      // Recargar datos
      const [coursesData, teachersData] = await Promise.all([
        getAllCourses(),
        getAllTeachers()
      ]);
      
      setCourses(coursesData);
      setTeachers(teachersData);
      
      // Reconstruir asignaciones
      const assignmentsData = await Promise.all(
        coursesData.map(async (course) => {
          let studentsCount = 0;
          try {
            const courseStudents = await getCourseStudents(course.id);
            studentsCount = courseStudents.length;
          } catch (err) {
            console.warn(`No se pudieron obtener estudiantes del curso ${course.id}:`, err);
          }
          
          const teacher = teachersData.find(t => course.teacherId && t.id === course.teacherId);
          
          return {
            id: course.id,
            courseName: course.name,
            courseId: course.id,
            teacherName: teacher ? (teacher.name || teacher.fullName || `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim()) : 'Sin docente asignado',
            teacherId: course.teacherId || null,
            studentsCount,
            status: course.teacherId ? 'Activa' : 'Pendiente'
          };
        })
      );
      
      setAssignments(assignmentsData);
      handleCloseStudentModal();
    } catch (err) {
      console.error('Error al asignar estudiante a curso:', err);
      setError(err.message || 'Error al asignar estudiante al curso');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTeacherAssignment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!selectedTeacher || selectedCourses.length === 0) {
        setError('Debes seleccionar un docente y al menos un curso');
        return;
      }
      
      await assignTeacherToCourses({
        teacherId: selectedTeacher,
        courseIds: selectedCourses
      });
      
      // Recargar datos
      const [coursesData, teachersData] = await Promise.all([
        getAllCourses(),
        getAllTeachers()
      ]);
      
      setCourses(coursesData);
      setTeachers(teachersData);
      
      // Reconstruir asignaciones
      const assignmentsData = await Promise.all(
        coursesData.map(async (course) => {
          let studentsCount = 0;
          try {
            const courseStudents = await getCourseStudents(course.id);
            studentsCount = courseStudents.length;
          } catch (err) {
            console.warn(`No se pudieron obtener estudiantes del curso ${course.id}:`, err);
          }
          
          const teacher = teachersData.find(t => course.teacherId && t.id === course.teacherId);
          
          return {
            id: course.id,
            courseName: course.name,
            courseId: course.id,
            teacherName: teacher ? (teacher.name || teacher.fullName || `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim()) : 'Sin docente asignado',
            teacherId: course.teacherId || null,
            studentsCount,
            status: course.teacherId ? 'Activa' : 'Pendiente'
          };
        })
      );
      
      setAssignments(assignmentsData);
      handleCloseTeacherModal();
    } catch (err) {
      console.error('Error al asignar docente a cursos:', err);
      setError(err.message || 'Error al asignar docente a los cursos');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseToggle = (courseId) => {
    setSelectedCourses(prev => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };

  return (
    <div className="admin-assignments">
      <div className="assignments-header">
        <h1>Gestión de Asignaciones</h1>
        <div className="assignment-buttons">
          <button 
            className="add-assignment-btn student-btn" 
            onClick={handleOpenStudentModal}
            disabled={loading}
          >
            📚 Asignar Estudiante a Curso
          </button>
          <button 
            className="add-assignment-btn teacher-btn" 
            onClick={handleOpenTeacherModal}
            disabled={loading}
          >
            👨‍🏫 Asignar Docente a Cursos
          </button>
        </div>
      </div>

      {error && <div className="error-message-admin">{error}</div>}

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

      {/* Modal para asignar estudiante a curso */}
      {showStudentModal && (
        <div className="add-user-overlay" onClick={handleCloseStudentModal}>
          <div className="add-user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Asignar Estudiante a Curso</h2>
              <button className="close-btn" onClick={handleCloseStudentModal}>×</button>
            </div>
            
            <form className="user-form" onSubmit={(e) => { e.preventDefault(); handleSubmitStudentAssignment(); }}>
              {error && <div className="error-message-admin">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="student-select">Estudiante *</label>
                <select 
                  id="student-select"
                  value={selectedStudent} 
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className={!selectedStudent && error ? "error" : ""}
                >
                  <option value="">Selecciona un estudiante</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.username})
                    </option>
                  ))}
                </select>
                {!selectedStudent && error && (
                  <span className="error-message">Debes seleccionar un estudiante</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="course-select">Curso *</label>
                <select 
                  id="course-select"
                  value={selectedCourse} 
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className={!selectedCourse && error ? "error" : ""}
                >
                  <option value="">Selecciona un curso</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
                {!selectedCourse && error && (
                  <span className="error-message">Debes seleccionar un curso</span>
                )}
              </div>

              <div className="form-buttons">
                <button 
                  type="button"
                  className="cancel-btn" 
                  onClick={handleCloseStudentModal}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="submit-btn" 
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Asignar Estudiante'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para asignar docente a cursos */}
      {showTeacherModal && (
        <div className="add-user-overlay" onClick={handleCloseTeacherModal}>
          <div className="add-user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Asignar Docente a Cursos</h2>
              <button className="close-btn" onClick={handleCloseTeacherModal}>×</button>
            </div>
            
            <form className="user-form" onSubmit={(e) => { e.preventDefault(); handleSubmitTeacherAssignment(); }}>
              {error && <div className="error-message-admin">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="teacher-select">Docente *</label>
                <select 
                  id="teacher-select"
                  value={selectedTeacher} 
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className={!selectedTeacher && error ? "error" : ""}
                >
                  <option value="">Selecciona un docente</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name || `${teacher.firstName} ${teacher.lastName}`} ({teacher.email})
                    </option>
                  ))}
                </select>
                {!selectedTeacher && error && (
                  <span className="error-message">Debes seleccionar un docente</span>
                )}
              </div>
              
              <div className="form-group">
                <label>Cursos (selecciona uno o más) *</label>
                <div className="courses-checkbox-list">
                  {courses.map(course => (
                    <label key={course.id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course.id)}
                        onChange={() => handleCourseToggle(course.id)}
                      />
                      {course.name}
                    </label>
                  ))}
                </div>
                {selectedCourses.length === 0 && error && (
                  <span className="error-message">Debes seleccionar al menos un curso</span>
                )}
                {selectedCourses.length > 0 && (
                  <p className="selected-count">
                    {selectedCourses.length} curso(s) seleccionado(s)
                  </p>
                )}
              </div>

              <div className="form-buttons">
                <button 
                  type="button"
                  className="cancel-btn" 
                  onClick={handleCloseTeacherModal}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="submit-btn" 
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Asignar Docente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}