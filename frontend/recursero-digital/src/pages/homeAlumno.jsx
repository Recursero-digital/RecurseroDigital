
import "../styles/homeAlumno.css";
import "../styles/darkMode.css";
import { Header } from "../components/Header";
import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import { Card } from "../components/Card";
export default function HomeAlumno() {
    const [isDarkMode, setIsDarkMode] = useState(false);

  // Usa useEffect para aplicar la clase 'dark-mode'
  useEffect(() => {
    // Si isDarkMode es verdadero, aplica la clase al body
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      // Si no, la remueve
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]); // Este efecto se ejecuta cada vez que isDarkMode cambia

  // La función que cambia el estado al hacer clic en el botón
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  return (
    <>
    <div className="container">
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <NavBar />
        <scroll>
        <Card />
        </scroll>
        

    </div>
    </>
  );
}