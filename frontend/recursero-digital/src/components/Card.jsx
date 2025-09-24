import Juego from '../assets/juego1.png';
import Juego2 from '../assets/juego2.png';
import '../styles/card.css';

export function Card() {
    return(
        <>
        <scroll>
        <div className='contenedor-card'>
            <box className="card">
                <img src={Juego} alt="Ordenamiento"  className="imagegame"/>
                <div className='textgame'>
                    <h2 className="titlegame">Ordenamiento de Números</h2>  
                    <p className="descriptiongame">¡Aprende a ordenar números de forma divertida! Juega y mejora tus habilidades matemáticas de menor a mayor.</p>
                    <button className="buttongame">Jugar</button>
                </div>
  
            </box>
            <box className="card">
                <img src={Juego2} alt="Numeros y palabras"  className="imagegame"/>
                <div className='textgame'>
                    <h2 className="titlegame">Unir su Número con su Nombre</h2>  
                    <p className="descriptiongame">¡Aprende a unir los numeros con su propio nombre con flechas.</p>
                    <button className="buttongame">Jugar</button>
                </div>
  
            </box>
   
        </div>
        </scroll>
        
        
        </>
    )
}