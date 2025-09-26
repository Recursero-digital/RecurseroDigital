

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import LoginForm from "./pages/LoginForm";
import HomeAlumno from "./pages/homeAlumno";
import HomeDocente from "./pages/homeDocente";
import MainLayout from "./layouts/MainLayout";
//import DocenteConCurso from "./pages/docenteConCurso";
import JuegoOrdenamiento from './components/games/JuegoOrdenamiento/JuegoOrdenamiento.jsx';
import JuegoEscritura from './components/games/JuegoEscritura/JuegoEscritura.jsx';

function App() {
  return (
      //Descomentar para correr juego y comentar lo del Router
      //return (
      //     <>
      //       <JuegoOrdenamiento />
      //     </>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login-form" element={<LoginForm />} />
        <Route path="/alumno" element={<MainLayout userRole="alumno"><HomeAlumno /></MainLayout>} />
        <Route path="/docente" element={<MainLayout userRole="docente"><HomeDocente /></MainLayout>} />
        {/* Rutas adicionales para tabs */}

        <Route path="/alumno/juegos" element={<MainLayout userRole="alumno"><HomeAlumno /></MainLayout>} />
        <Route path="/alumno/juegos/ordenamiento" element={<MainLayout userRole="alumno"><JuegoOrdenamiento /></MainLayout>} />
        <Route path="/alumno/juegos/escritura" element={<MainLayout userRole="alumno"><JuegoEscritura /></MainLayout>} />
        <Route path="/alumno/perfil" element={<MainLayout userRole="alumno"><HomeAlumno /></MainLayout>} />
        <Route path="/docente/estudiantes" element={<MainLayout userRole="docente"><HomeDocente /></MainLayout>} />
        <Route path="/docente/juegos" element={<MainLayout userRole="docente"><HomeDocente /></MainLayout>} />
        <Route path="/docente/perfil" element={<MainLayout userRole="docente"><HomeDocente /></MainLayout>} />

      </Routes>
    </Router>
  );
}

export default App;
