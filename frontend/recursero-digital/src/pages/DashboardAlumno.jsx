import React from 'react';
import JuegoOrdenarNumeros from '../components/games/JuegoOrdenarNumeros'; // Importamos el juego

function DashboardAlumno() {
  return (
    <div className="dashboard-alumno">
      <h1 className="text-2xl font-bold mb-4">¡Bienvenido! Aquí están tus actividades</h1>
      
      <JuegoOrdenarNumeros />
    
    </div>
  );
}

export default DashboardAlumno;