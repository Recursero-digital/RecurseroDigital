import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTeacherCourses } from '../../../infrastructure/adapters/api/teacherApi';
import "../../styles/components/cursoSelector.css";




export default function CursoSelector() {
  const navigate = useNavigate();
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Colores predefinidos para los cursos
  const coloresDisponibles = ["#7c3aed", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16"];

  const obtenerIcono = (nombreCurso) => {
    return "🔢";
  };

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        setLoading(true);
        const response = await getTeacherCourses();
        
        if (response.courses) {
          const cursosConEstilo = response.courses.map((curso, index) => ({
            id: parseInt(curso.id),
            nombre: curso.name,
            icono: obtenerIcono(curso.name),
            color: coloresDisponibles[index % coloresDisponibles.length]
          }));
          
          setCursos(cursosConEstilo);
        } else {
          setCursos([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar cursos:', error);
        setError('Error al cargar los cursos');
        setLoading(false);
      }
    };

    cargarCursos();
  }, []);

  console.log('CursoSelector renderizado con cursos:', cursos);

  const handleCursoSelect = (curso) => {
    console.log('Curso seleccionado:', curso);
    setCursoSeleccionado(curso);
    // Guardar curso seleccionado en localStorage
    localStorage.setItem('cursoSeleccionado', JSON.stringify(curso));
    console.log('Curso guardado en localStorage:', localStorage.getItem('cursoSeleccionado'));
    // Navegar a la página principal del docente con navbar inmediatamente
    navigate('/docente/dashboard');
  };

  if (loading) {
    return (
      <div className="curso-selector-container">
        <div className="curso-selector-header">
          <h1>Bienvenido Docente</h1>
          <p>Cargando tus cursos...</p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="curso-selector-container">
        <div className="curso-selector-header">
          <h1>Bienvenido Docente</h1>
          <p>Error al cargar los cursos</p>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="curso-selector-container">
      <div className="curso-selector-header">
        <h1>Bienvenido Docente</h1>
        <p>Selecciona el curso que deseas gestionar</p>
      </div>
      
      <div className="cursos-grid">
        {cursos.length === 0 ? (
          <div className="no-courses">
            <p>No tienes cursos asignados</p>
          </div>
        ) : (
          cursos.map((curso) => (
            <div 
              key={curso.id}
              className={`curso-card ${cursoSeleccionado?.id === curso.id ? 'selected' : ''}`}
              onClick={() => handleCursoSelect(curso)}
              onMouseDown={() => handleCursoSelect(curso)}
              onTouchStart={() => handleCursoSelect(curso)}
              style={{ '--curso-color': curso.color }}
            >
              <div className="curso-icono">
                {curso.icono}
              </div>
              <h3 className="curso-nombre">{curso.nombre}</h3>
            </div>
          ))
        )}
      </div>
      
      <div className="curso-selector-footer">
        <p>💡 Podrás cambiar de curso en cualquier momento desde tu perfil</p>
      </div>
    </div>
  );
}