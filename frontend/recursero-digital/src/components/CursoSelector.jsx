import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/cursoSelector.css";
import { BiMath } from "react-icons/bi";
import { PiMathOperationsFill } from "react-icons/pi";



export default function CursoSelector() {
  const navigate = useNavigate();
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  
  const cursos = [
    { 
      id: 1, 
      nombre: "Matemática 3º Grado A", 
      icono:  <BiMath color="violet" />,
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
      icono: <PiMathOperationsFill color="green"/>,
      color: "#10b981"
    },

  ];

  const handleCursoSelect = (curso) => {
    setCursoSeleccionado(curso);
    // Guardar curso seleccionado en localStorage
    localStorage.setItem('cursoSeleccionado', JSON.stringify(curso));
    // Navegar a la página principal del docente con navbar
    setTimeout(() => {
      navigate('/docente/dashboard');
    }, 500);
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