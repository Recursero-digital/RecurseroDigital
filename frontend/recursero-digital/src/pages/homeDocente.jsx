

import { useNavigate } from "react-router-dom";
import "../styles/homeDocente.css";
import { useState } from "react";

export default function HomeDocente() {
  const navigate = useNavigate();
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");

  const cursos = [
    { id: 1, nombre: "Matemática 3º" },
    { id: 2, nombre: "Matemática 4º" },
    { id: 3, nombre: "Matemática 5º" },
  ];

  const handleCursoClick = () => {
    setMostrarMenu(!mostrarMenu); // abre o cierra menú
  };

  const handleSeleccion = (e) => {
    const idCurso = e.target.value;
    setCursoSeleccionado(idCurso);
    navigate(`/docente/cursos/${idCurso}`); // redirige con id del curso
  };

  return (
    <div className="docente-content">
      <h1>Bienvenido Docente 👨‍🏫</h1>
      <p>Aqui vas a seleccionar tu curso </p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Curso</h3>
          <p>Gestiona tu curso</p>
          <button onClick={handleCursoClick}>Curso</button>
          {mostrarMenu && (
            <select aria-label="Seleccionar curso" onChange={handleSeleccion} value={cursoSeleccionado}>
              <option value="" disabled>
                Selecciona un curso
              </option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.nombre}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
}