import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/homeAlumno.css";

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

  const handleJugarClick = () => {
    navigate('/alumno/juegos');
  };
  return (
    <div className="main">
      
      <section className="welcome-card">
        <h1>¡Bienvenido {userNameOrEmail}!</h1>
        <p>
          ¡Bienvenido a Recursero Digital! Una plataforma educativa diseñada para hacer que el aprendizaje de las
          matemáticas sea una experiencia divertida y emocionante.
        </p>
        <p>¡Descubre el mundo mágico de los números mientras te divertís!</p>
        
        <h2>¡Aprender matemáticas nunca fue tan divertido!</h2>
        <p>
          Disfruten de estos juegos, son para que aprendan habilidades matemáticas mientras se divierten. Cada juego
          tiene 5 niveles y 3 actividades, numeros impresionantes y acumula puntos{" "}
          <button className="jugar-button" onClick={handleJugarClick}>
            ¡A JUGAR!
          </button>
        </p>
        <h3>
          ¡Comienza tu aventura en las matemáticas ¡Hoy mismo!
        </h3>
      </section>
    </div>
  );
}
