import { useEffect, useState } from "react";
import { NavBar } from "../components/common/NavBar";
import { Header } from "../components/common/Header";
import { useLocation } from "react-router-dom";
import "../styles/layouts/layout.css";


export default function MainLayout({ children, userRole = "alumno" }) {
  const [activeTab, setActiveTab] = useState("home");
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    
    if (path.includes('/juegos')) {
      setActiveTab("games");
    } else if (path.includes('/perfil')) {
      setActiveTab("profile");
    } else if (path.includes('/estudiantes')) {
      setActiveTab("students");
    } else if (path.includes('/dashboard')) {
      setActiveTab("dashboard");
    } else if (path.includes('/usuarios')) {
      setActiveTab("users");
    } else if (path.includes('/cursos')) {
      setActiveTab("courses");
    } else if (path.includes('/estadisticas')) {
      setActiveTab("statistics");
    } else if (path.includes('/asignaciones')) {
      setActiveTab("assignments");
    } else {
      setActiveTab("home");
    }
  }, [location.pathname]);

  const tabs = userRole === "alumno" 
    ? [
        { id: "home", label: "🏠 Inicio", path: "/alumno" },
        { id: "games", label: "🎮 Juegos", path: "/alumno/juegos" },
        { id: "profile", label: "👨‍🎓 Perfil", path: "/alumno/perfil" }
       ]
    : userRole === "docente"
    ? [
        { id: "home", label: "🏠 Inicio", path: "/docente/dashboard" },
        { id: "students", label: "👥 Estudiantes", path: "/docente/estudiantes" },
        { id: "games", label: "🎮 Juegos", path: "/docente/juegos" },
        { id: "profile", label: "👤 Perfil", path: "/docente/perfil" }
      ]
    : [
        { id: "home", label: "🏠 Inicio", path: "/admin" },
        { id: "courses", label: "📚 Cursos", path: "/admin/cursos" },
        { id: "statistics", label: "📊 Estadisticas", path: "/admin/estadisticas" },
        { id: "users", label: "👥 Usuarios", path: "/admin/usuarios" },
        { id: "assignments", label: "📋 Asignaciones", path: "/admin/asignaciones" }
      ];

  return (
    <div className="main-layout">
      <Header />
      <NavBar 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        userRole={userRole}
      />
      <main className="main-content bg-space bg-space-gradient bg-stars scrollbar-space">
        {children}
      </main>
    </div>
  );
}
