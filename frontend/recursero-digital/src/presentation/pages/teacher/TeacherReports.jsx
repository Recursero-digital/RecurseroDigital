import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/teacherReports.css";

export default function TeacherReports() {
  const navigate = useNavigate();
  const [cursoActual, setCursoActual] = useState(null);
  
  useEffect(() => {
    const cursoGuardado = localStorage.getItem('cursoSeleccionado');
    if (cursoGuardado) {
      const curso = JSON.parse(cursoGuardado);
      setCursoActual(curso);
    } else {
      // Si no hay curso seleccionado, redirigir a la selección
      navigate('/docente');
    }
  }, [navigate]);
  
  // Mock data - más adelante se reemplazará por endpoint real
  const alumnos = [
    {
      id: 'default-student-1',
      nombre: 'Alumno Por Defecto',
      apellido: 'García',
      curso: cursoActual ? cursoActual.nombre : 'Cargando...'
    }
  ];

  const handleVerReporte = (alumnoId) => {
    navigate(`/reportes/${alumnoId}`);
  };

  const handleVolver = () => {
    navigate('/docente/dashboard');
  };

  if (!cursoActual) {
    return (
      <div className="teacher-reports-container">
        <button className="reports-back-button" onClick={handleVolver}>
          ← Volver al Dashboard
        </button>
        <div className="teacher-reports-wrapper">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando curso...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-reports-container">
      <button className="reports-back-button" onClick={handleVolver}>
        ← Volver al Dashboard
      </button>
      <div className="teacher-reports-wrapper">
        <div className="teacher-reports-header">
          <h1>Reportes de Estudiantes - {cursoActual.nombre}</h1>
          <p>Consulta el progreso y rendimiento de tus alumnos</p>
        </div>

        <div className="alumnos-table-container">
          <table className="alumnos-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Curso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map((alumno) => (
                <tr key={alumno.id}>
                  <td>{alumno.nombre}</td>
                  <td>{alumno.apellido}</td>
                  <td>{alumno.curso}</td>
                  <td>
                    <button 
                      className="btn-ver-reporte"
                      onClick={() => handleVerReporte(alumno.id)}
                    >
                      📊 Ver reporte
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {alumnos.length === 0 && (
          <div className="no-alumnos">
            <p>No hay alumnos registrados en este curso</p>
          </div>
        )}
      </div>
    </div>
  );
}
