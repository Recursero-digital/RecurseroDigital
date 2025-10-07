import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import { Header } from "../components/Header";
import { useLocation } from "react-router-dom";
import "../styles/layout.css";
import "../styles/darkMode.css";


export default function MainLayout({ children, userRole = "alumno" }) {
  const [activeTab, setActiveTab] = useState("home");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  // Detectar automáticamente qué tab debe estar activo basado en la URL
  useEffect(() => {
    const path = location.pathname;
    
    if (path.includes('/juegos')) {
      setActiveTab("games");
    } else if (path.includes('/perfil')) {
      setActiveTab("profile");
    } else if (path.includes('/estudiantes')) {
      setActiveTab("students");
    } else {
      setActiveTab("home");
    }
  }, [location.pathname]);
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const tabs = userRole === "alumno" 
    ? [
        { id: "home", label: "🏠 Inicio", path: "/alumno" },
        { id: "games", label: "🎮 Juegos", path: "/alumno/juegos" },
        { id: "profile", label: "👨‍🎓 Perfil", path: "/alumno/perfil" }
       ]
    : [
        { id: "home", label: "🏠 Inicio", path: "/docente" },
        { id: "students", label: "👥 Estudiantes", path: "/docente/estudiantes" },
        { id: "games", label: "🎮 Juegos", path: "/docente/juegos" },
        { id: "profile", label: "👤 Perfil", path: "/docente/perfil" }
      ];

  return (
    <div className="main-layout">
      /*<Header isDarkMode={isDarkMode} toggleDarkMode={() => toggleDarkMode()} />
      <NavBar 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        userRole={userRole}
      />*/
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
