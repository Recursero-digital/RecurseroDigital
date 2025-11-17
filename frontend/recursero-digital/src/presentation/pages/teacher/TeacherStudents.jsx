import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentList from '../../components/teacher/StudentList';
import '../../styles/pages/teacherStudents.css';

const TeacherStudents = () => {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentView, setCurrentView] = useState('list');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cursoGuardado = localStorage.getItem('cursoSeleccionado');
    if (cursoGuardado) {
      try {
        const curso = JSON.parse(cursoGuardado);
        // El ID ya debería ser un string, pero nos aseguramos
        if (curso && curso.id) {
          setSelectedCourse(curso.id.toString());
          setLoading(false);
        } else {
          console.error('Curso sin ID válido:', curso);
          navigate('/docente');
        }
      } catch (error) {
        console.error('Error al parsear curso seleccionado:', error);
        navigate('/docente');
      }
    } else {
      // Si no hay curso seleccionado, redirigir al selector
      navigate('/docente');
    }
  }, [navigate]);

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setCurrentView('student');
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
    setCurrentView('list');
  };

  if (loading) {
    return (
      <div className="teacher-students">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="teacher-students">
        <div className="error-message">
          <p>No hay curso seleccionado</p>
          <button onClick={() => navigate('/docente')}>Seleccionar Curso</button>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-students">
      <div className="students-header">
        <h1>👥 Gestión de Estudiantes</h1>
        <p>Administra y supervisa el progreso de tus estudiantes</p>
      </div>

      <div className="contenido-alumno">
        {currentView === 'list' && (
          <StudentList 
            courseId={selectedCourse}
            onSelectStudent={handleSelectStudent}
          />
        )}
        
        {currentView === 'student' && selectedStudent && (
          <div className="student-detail">
            <div className="detail-header">
              <button className="back-btn" onClick={handleBackToList}>
                ← Volver a la Lista
              </button>
              <h2>Perfil de {selectedStudent.name}</h2>
            </div>

            <div className="student-profile-placeholder">
              <div className="profile-card">
                <h3>📋 Información del Estudiante</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Nombre:</label>
                    <span>{selectedStudent.name}</span>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{selectedStudent.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Juegos Jugados:</label>
                    <span>{selectedStudent.totalGamesPlayed}</span>
                  </div>
                  <div className="info-item">
                    <label>Promedio:</label>
                    <span>{selectedStudent.averageScore}%</span>
                  </div>
                </div>
              </div>
              
              <div className="games-detail">
                <h3>🎮 Progreso por Juego</h3>
                <div className="games-grid">
                  {Object.entries(selectedStudent.progressByGame || {}).map(([game, progress]) => {
                    const gameNames = {
                      ordenamiento: 'Ordenamiento',
                      escritura: 'Escritura',
                      descomposicion: 'Descomposición',
                      escala: 'Escala Numérica'
                    };

                    return (
                      <div key={game} className="game-detail-card">
                        <h4>{gameNames[game]}</h4>
                        <div className="game-stats">
                          <div className="stat">
                            <span className="stat-label">Completados</span>
                            <span className="stat-value">{progress.completed}</span>
                          </div>
                          <div className="stat">
                            <span className="stat-label">Promedio</span>
                            <span className="stat-value">{progress.averageScore}%</span>
                          </div>
                          <div className="stat">
                            <span className="stat-label">Tiempo Total</span>
                            <span className="stat-value">{Math.round(progress.totalTime / 60)}m</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherStudents;