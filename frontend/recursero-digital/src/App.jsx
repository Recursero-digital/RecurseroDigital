import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/login";
import LoginForm from "./pages/LoginForm";
import HomeAlumno from "./pages/homeAlumno";
import HomeDocente from "./pages/homeDocente";
import DocenteDashboard from "./pages/DocenteDashboard";
import TeacherStudents from "./pages/TeacherStudents";
import TeacherGames from "./pages/TeacherGames";
import MainLayout from "./layouts/MainLayout";
//import DocenteConCurso from "./pages/docenteConCurso";
import JuegoOrdenamiento from "./components/games/JuegoOrdenamiento/JuegoOrdenamiento.jsx";
import JuegoEscritura from "./components/games/JuegoEscritura/JuegoEscritura.jsx";
import DashboardAlumno from "./pages/DashboardAlumno.jsx";
import PerfilAlumno from "./pages/perfilAlumno.jsx";
import JuegoDescomposicion from './components/games/JuegoDesco&Compo/JuegoDescomposicion.jsx';
import JuegoEscala from './components/games/JuegoEscala/JuegoEscala.jsx';

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
          element={<HomeDocente />}
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
