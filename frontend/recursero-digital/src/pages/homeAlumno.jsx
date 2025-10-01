import { useMemo } from "react";
import "../styles/homeAlumno.css";
import { useNavigate } from "react-router-dom";
import { IoLogoGameControllerA } from "react-icons/io";

export default function HomeAlumno() {
  const navigate = useNavigate();

  const userNameOrEmail = useMemo(() => {
    // If you store name elsewhere, replace this with that key
    const storedEmail = localStorage.getItem("userEmail");
    const storedName = localStorage.getItem("userName");
    return (storedName || storedEmail || "Alumno").toUpperCase();
  }, []);
  return (
    <div className="container">
      <section class="card-header">
        <div class="math-animation">+</div>
        <div class="math-animation">−</div>
        <div class="math-animation">×</div>
        <div class="math-animation">÷</div>
        <h1>¡Bienvenido {userNameOrEmail}!</h1>
        <p>
          ¿Estás preparado para jugar y aprender con estos juegos de matemática?
        </p>
        <p>¡Descubre el mundo mágico de los números mientras te diviertes!</p>
      </section>
      <section class="motivation-section">
        <h2>¡Aprender matemáticas nunca fue tan divertido!</h2>
        <p>
          Nuestros juegos están diseñados especialmente para que los niños
          desarrollen habilidades matemáticas mientras se divierten. Cada juego
          incluye personajes coloridos, animaciones emocionantes y recompensas
          que mantendrán a los niños motivados. ¡Comienza tu aventura matemática
          hoy mismo!
        </p>
      </section>
      <button className="botonJugar" onClick={() => navigate("/alumno/juegos")}>
        <IoLogoGameControllerA />
        Ir a Jugar
      </button>
    </div>
  );
}
