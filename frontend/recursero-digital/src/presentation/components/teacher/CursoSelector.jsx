import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/cursoSelector.css";




export default function CursoSelector() {
  const navigate = useNavigate();
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  
  const cursos = [
    { 
      id: 1, 
      nombre: "Matemática 3º Grado A", 
      icono:   "🔢",
      color: "#7c3aed"
    },
    { 
      id: 2, 
      nombre: "Matemática 3º Grado B", 
      icono: "🔢",
      color: "#3b82f6"
    },
    { 
      id: 3, 
      nombre: "Matemática 3º Grado C", 
      icono:  "🔢",
      color: "#10b981"
    },

  ];

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

  return (
    <div className="curso-selector-container">
      <div className="curso-selector-header">
        <h1> Bienvenido Docente</h1>
        <p>Selecciona el curso que deseas gestionar</p>
      </div>
      
      <div className="cursos-grid">
        {cursos.map((curso) => (
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
        ))}
      </div>
      
      <div className="curso-selector-footer">
        <p>💡 Podrás cambiar de curso en cualquier momento desde tu perfil</p>
      </div>
    </div>
  );
}