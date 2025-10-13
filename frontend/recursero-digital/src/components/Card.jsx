import { useNavigate } from "react-router-dom";
import JuegoEscala from "../assets/JuegoEscritura-fontpage.png";
import JuegoDescoCompo from "../assets/JuegoCompoyDesco-fontpage.png";
import JuegoEscritura from "../assets/NumeroPalabras-fontpage.png";
import JuegoOrdenamiento from "../assets/JuegoOrdenamiento-fontpage.png";
import "../styles/card.css";

export default function Card() {
  const navigate = useNavigate();

  const handleJugarOrdenamiento = () => {
    navigate("/alumno/juegos/ordenamiento");
  };

  const handleJugarEscritura = () => {
    navigate("/alumno/juegos/escritura");
  };

  const handleJugarDescomposicion = () => {
    navigate("/alumno/juegos/descomposicion");
  };

  const handleJugarEscala = () => {
    navigate("/alumno/juegos/escala");
  };

  return (
    <>
      <box className="card">
        <img src={JuegoOrdenamiento} alt="Ordenamiento" className="imagegame" />
        <div className="textgame">
          <h2>Ordenamiento de Números</h2>
          <p>
            ¡Aprende a ordenar números de forma divertida! Juega y mejora tus
            habilidades matemáticas de menor a mayor.
          </p>
          <button onClick={handleJugarOrdenamiento}>Jugar</button>
        </div>
      </box>
      <box className="card">
        <img src={JuegoEscritura} alt="Escrbir sus palabras" className="imagegame" />

        <div className="textgame">
          <h2>Escribir Números en Palabras</h2>
          <p>
            ¡Aprende a escribir los números en palabras! Arrastra las palabras
            para formar la respuesta correcta.
          </p>
          <button onClick={handleJugarEscritura}>Jugar</button>
        </div>
      </box>
      <box className="card">
        <img src={JuegoDescoCompo} alt="Descomposicion" className="imagegame" />
        <div className="textgame">
          <h2 className="titlegame">Descomposición y Composición</h2>
          <p className="descriptiongame">
            ¡Aprende a descomponer y componer números! Descubre el misterio de
            los valores posicionales.
          </p>
          <button className="buttongame" onClick={handleJugarDescomposicion}>
            Jugar
          </button>
        </div>
      </box>
      <box className="card">
        <img src={JuegoEscala} alt="Escala" className="imagegame" />
        <div className="textgame">
          <h2 className="titlegame">Escala de Números</h2>
          <p className="descriptiongame">
            ¡Aprende a identificar y crear escalas numéricas! Mejora tu
            comprensión de los números.
          </p>
          <button className="buttongame" onClick={handleJugarEscala}>
            Jugar
          </button>
        </div>
      </box>
    </>
  );
}
