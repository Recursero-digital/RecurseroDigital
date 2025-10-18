import { useMemo } from "react";
import "../../styles/pages/homeAlumno.css";
import { useNavigate } from "react-router-dom";
import { IoLogoGameControllerA } from "react-icons/io";

export default function HomeAlumno() {
  const navigate = useNavigate();

  const userNameOrEmail = useMemo(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedName = localStorage.getItem("userName");
    if (storedName) return storedName.toUpperCase();
    if (storedEmail) {
      const nameFromEmail = storedEmail.split('@')[0];
      return nameFromEmail.toUpperCase();
    }
    return "ALUMNO";
  }, []);
  return (
    <div className="main">
      
      <section class="welcome-card">
        <h1>¡Bienvenido {userNameOrEmail}!</h1>
        <p>
          ¿Estás preparado para jugar y aprender con estos juegos de matemática?
        </p>
        <p>¡Descubre el mundo mágico de los números mientras te divertís!</p>
      </section>
      <section class="info-card">
        <h2>¡Aprender matemáticas nunca fue tan divertido!</h2>
        <p>
          Los juegos son para que ustedes aprendan habilidades matemáticas mientras se divierten. Cada juego
          tiene 5 niveles y 3 actividades, numeros impresionantes y acumula puntos ¡A JUGAR!
        </p>
        <h3>
          ¡Comienza tu aventura en las matemáticas ¡Hoy mismo!
        </h3>
      </section>
      <button className="botonJugar" onClick={() => navigate("/alumno/juegos")}>
        <IoLogoGameControllerA />
        Ir a Jugar
      </button>
    </div>
  );
}
