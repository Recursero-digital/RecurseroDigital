import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
//import { apiRequest } from '../../../infrastructure/config/api';
import '../../styles/components/card.css';
import JuegoOrdenamiento from '../../../assets/JuegoOrdenamiento-fontpage.png';
import JuegoEscritura from '../../../assets/JuegoEscritura-fontpage.png';
import JuegoCompoyDesco from '../../../assets/desco y compo.png';
import NumeroPalabras from '../../../assets/NumeroPalabras-fontpage.png';
import JuegoCalculos from '../../../assets/imagen-juegoCalculos.png';

export function Card() {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                // const response = await apiRequest('/api/student/me/games');
                // if (response.ok && response.data && response.data.games) {
                //     const gamesResponse = response.data.games
                //         .map(courseGame => ({
                //             id: courseGame.game.id,
                //             name: courseGame.game.name,
                //             description: courseGame.game.description,
                //             imageUrl: courseGame.game.imageUrl,
                //             route: courseGame.game.route,
                //             difficultyLevel: courseGame.game.difficultyLevel,
                //             orderIndex: courseGame.orderIndex
                //         }));
                //     setGames(gamesResponse);
                // } else {
                //     setGames([]);
                // }

                // MOCK TEMPORAL: Simulando respuesta del backend
                // Esto simula que el alumno tiene acceso a todos los juegos

                // encargarse del apiRequest. mockgames es una respuesta ficticia dle back. Crear la API api/student/games y q el array de games este habilitado para el estudiante.
                //Debo obtener los juegos del curso del alumno

                //La respuesta del backj es la siguiente:

                const mockGames = [
                    {
                        id: 'game-ordenamiento',
                        name: 'Ordenamiento de Números',
                        description: '¡Aprende a ordenar números de forma divertida! Juega y mejora tus habilidades matemáticas de menor a mayor.',
                        imageUrl: JuegoOrdenamiento,
                        route: '/alumno/juegos/ordenamiento',
                        difficultyLevel: 1,
                        orderIndex: 1
                    },
                    {
                        id: 'game-escritura',
                        name: 'Escribir Números en Palabras',
                        description: '¡Aprende a escribir los números en palabras! Arrastra las palabras para formar la respuesta correcta.',
                        imageUrl: NumeroPalabras,
                        route: '/alumno/juegos/escritura',
                        difficultyLevel: 1,
                        orderIndex: 2
                    },
                    {
                        id: 'game-descomposicion',
                        name: 'Arma la Descomposición y Composición de los numeros',
                        description: '¡Aprende a descomponer y componer números! Descubre el misterio de los valores posicionales.',
                        imageUrl: JuegoCompoyDesco,
                        route: '/alumno/juegos/descomposicion',
                        difficultyLevel: 2,
                        orderIndex: 3
                    },
                    {
                        id: 'game-escala',
                        name: 'Escribí el número anterior y el posterior',
                        description: '¡Explora los números anteriores y posteriores! Completa secuencias y descubre patrones numéricos.',
                        imageUrl: JuegoEscritura,
                        route: '/alumno/juegos/escala',
                        difficultyLevel: 2,
                        orderIndex: 4
                    },
                    {
                        id: 'game-calculos',
                        name: 'Juego de Cálculos Mentales',
                        description: '¡Pon a prueba tus habilidades matemáticas! Resuelve sumas, restas y multiplicaciones de diferentes niveles.',
                        imageUrl: JuegoCalculos,
                        route: '/alumno/juegos/calculos',
                        difficultyLevel: 2,
                        orderIndex: 5
                    }
                ];
                setGames(mockGames);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar juegos:', error);
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    const handleJugar = (route) => {
        navigate(route);
    };

    if (loading) {
        return <div className="container">Cargando juegos...</div>;
    }

    return (
        <>
            <div className='contenedor-card'>
                {games
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((game) => (
                        <box className="card" key={game.id}>
                            <img src={game.imageUrl} alt={game.name} className="imagegame"/>
                            <div className='textgame'>
                                <h2 className="titlegame">{game.name}</h2>
                                <p className="descriptiongame">{game.description}</p>
                                <button className="buttongame" onClick={() => handleJugar(game.route)}>Jugar</button>
                            </div>
                        </box>
                    ))
                }
            </div>
        </>
    )
}
