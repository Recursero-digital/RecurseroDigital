import { useNavigate } from 'react-router-dom';
import Juego from '../assets/juego1.png';
import Juego2 from '../assets/juego2.png';
import '../styles/card.css';

export default function Card() {
    const navigate = useNavigate();

    const handleJugarOrdenamiento = () => {
        navigate('/alumno/juegos/ordenamiento');
    };

    const handleJugarEscritura = () => {
        navigate('/alumno/juegos/escritura');
    };

    return(
        <>
        <scroll>
        <div className='contenedor-card'>
            <box className="card">
                <img src={Juego} alt="Ordenamiento"  className="imagegame"/>
                <div className='textgame'>
                    <h2>Ordenamiento de Números</h2>  
                    <p>¡Aprende a ordenar números de forma divertida! Juega y mejora tus habilidades matemáticas de menor a mayor.</p>
                    <button onClick={handleJugarOrdenamiento}>Jugar</button>
                </div>
  
            </box>
            <box className="card">
                <img src={Juego2} alt="Numeros y palabras"  className="imagegame"/>
                <div className='textgame'>
                    <h2>Escribir Números en Palabras</h2>  
                    <p>¡Aprende a escribir los números en palabras! Arrastra las palabras para formar la respuesta correcta.</p>
                    <button onClick={handleJugarEscritura}>Jugar</button>
                </div>
  
            </box>
   
        </div>
        </scroll>
        

        </>
    )
}