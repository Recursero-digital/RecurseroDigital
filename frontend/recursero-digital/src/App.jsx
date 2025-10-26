import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./presentation/pages/auth/login";
import LoginForm from "./presentation/pages/auth/LoginForm";
import HomeAlumno from "./presentation/pages/student/homeAlumno";
import HomeDocente from "./presentation/pages/teacher/homeDocente";
import DocenteDashboard from "./presentation/pages/teacher/DocenteDashboard";
import TeacherStudents from "./presentation/pages/teacher/TeacherStudents";
import TeacherGames from "./presentation/pages/teacher/TeacherGames";
import MainLayout from "./presentation/layouts/MainLayout";
//import DocenteConCurso from "./pages/docenteConCurso";
import JuegoOrdenamiento from "./presentation/components/games/JuegoOrdenamiento/JuegoOrdenamiento.jsx";
import JuegoEscritura from "./presentation/components/games/JuegoEscritura/JuegoEscritura.jsx";
import DashboardAlumno from "./presentation/pages/student/DashboardAlumno.jsx";
import PerfilAlumno from "./presentation/pages/student/perfilAlumno.jsx";
import JuegoDescomposicion from './presentation/components/games/JuegoDesco&Compo/JuegoDescomposicion.jsx';
import JuegoEscala from './presentation/components/games/JuegoEscala/JuegoEscala.jsx';
import JuegoCalculos from './presentation/components/games/JuegoCalculos/JuegoCalculos.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login-form" element={<LoginForm />} />
        <Route
          path="/alumno"
          element={
            <MainLayout userRole="alumno">
              <HomeAlumno />
            </MainLayout>
          }
        />
        <Route
          path="/docente"
          element={
            <MainLayout userRole="docente">
              <HomeDocente />
            </MainLayout>
          }
        />
        <Route
          path="/docente/dashboard"
          element={
            <MainLayout userRole="docente">
              <DocenteDashboard />
            </MainLayout>
          }
        />
        <Route
          path="/alumno/juegos"
          element={
            <MainLayout userRole="alumno">
              <DashboardAlumno/>
            </MainLayout>
          }
        />
        <Route
          path="/alumno/juegos/ordenamiento"
          element={
            <MainLayout userRole="alumno">
              <JuegoOrdenamiento />
            </MainLayout>
          }
        />
        <Route
          path="/alumno/juegos/escritura"
          element={
            <MainLayout userRole="alumno">
              <JuegoEscritura />
            </MainLayout>
          }
        />
        <Route path="/alumno/juegos/descomposicion" element={<JuegoDescomposicion />} />
        <Route path="/alumno/juegos/escala" element={<JuegoEscala />} />
        <Route 
          path="/alumno/juegos/calculos" 
          element={
            <MainLayout userRole="alumno">
              <JuegoCalculos />
            </MainLayout>
          } 
        />
        <Route
          path="/alumno/perfil"
          element={
            <MainLayout userRole="alumno">
              <PerfilAlumno />
            </MainLayout>
          }
        />
        <Route
          path="/docente/estudiantes"
          element={
            <MainLayout userRole="docente">
              <TeacherStudents />
            </MainLayout>
          }
        />
        <Route
          path="/docente/juegos"
          element={
            <MainLayout userRole="docente">
              <TeacherGames />
            </MainLayout>
          }
        />
        <Route
          path="/docente/perfil"
          element={
            <MainLayout userRole="docente">
              <HomeDocente />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
