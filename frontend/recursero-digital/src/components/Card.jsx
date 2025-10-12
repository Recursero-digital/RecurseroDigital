import { useNavigate } from 'react-router-dom';
import JuegoEscala from '../assets/JuegoEscritura-fontpage.png';
import JuegoDescoCompo from '../assets/JuegoCompoyDesco-fontpage.png';
import JuegoEscritura from '../assets/NumeroPalabras-fontpage.png';
import JuegoOrdenamiento from '../assets/JuegoOrdenamiento-fontpage.png';
import '../styles/card.css';

export default function Card() {
  const navigate = useNavigate();

  const handleJugarOrdenamiento = () => {
    navigate("/alumno/juegos/ordenamiento");
  };

  const handleJugarEscritura = () => {
    navigate('/alumno/juegos/escritura');
  };

  const handleJugarDescomposicion = () => {
    navigate('/alumno/juegos/descomposicion');
  };

  const handleJugarEscala = () => {
    navigate('/alumno/juegos/escala');
  };

  return (
    <>
      <div className="scroll-container">
        <div className='contenedor-card'>
          <div className="card">
            <img src={JuegoOrdenamiento} alt="Ordenamiento" className="imagegame"/>
            <div className='textgame'>
              <h2 className="titlegame">Ordenamiento de Números</h2>  
              <p className="descriptiongame">¡Aprende a ordenar números de forma divertida! Juega y mejora tus habilidades matemáticas de menor a mayor.</p>
              <button className="buttongame" onClick={handleJugarOrdenamiento}>Jugar</button>
            </div>
          </div>
          
          <div className="card">
            <img src={JuegoEscritura} alt="Numeros y palabras" className="imagegame"/>
            <div className='textgame'>
              <h2 className="titlegame">Escribir Números en Palabras</h2>  
              <p className="descriptiongame">¡Aprende a escribir los números en palabras! Arrastra las palabras para formar la respuesta correcta.</p>
              <button className="buttongame" onClick={handleJugarEscritura}>Jugar</button>
            </div>
          </div>
          
          <div className="card">
            <img src={JuegoDescoCompo} alt="Descomposicion" className="imagegame"/>
            <div className='textgame'>
              <h2 className="titlegame">Descomposición y Composición</h2>  
              <p className="descriptiongame">¡Aprende a descomponer y componer números! Descubre el misterio de los valores posicionales.</p>
              <button className="buttongame" onClick={handleJugarDescomposicion}>Jugar</button>
            </div>
          </div>

          <div className="card">
            <img src={JuegoEscala} alt="Escala" className="imagegame"/>
            <div className='textgame'>
              <h2 className="titlegame">Escala Numérica</h2>  
              <p className="descriptiongame">¡Explora los números anteriores y posteriores! Completa secuencias y descubre patrones numéricos.</p>
              <button className="buttongame" onClick={handleJugarEscala}>Jugar</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
