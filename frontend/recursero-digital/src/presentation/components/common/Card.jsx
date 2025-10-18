import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiRequest } from '../../../infrastructure/config/api';
import '../../styles/components/card.css';
import Juego from '../../../assets/JuegoOrdenamiento-fontpage.png';
import Juego2 from '../../../assets/JuegoEscritura-fontpage.png';
import JuegoEscala from '../../../assets/juegoEsc.png';

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
                        imageUrl: Juego,
                        route: '/alumno/juegos/ordenamiento',
                        difficultyLevel: 1,
                        orderIndex: 1
                    },
                    {
                        id: 'game-escritura',
                        name: 'Escribir Números en Palabras',
                        description: '¡Aprende a escribir los números en palabras! Arrastra las palabras para formar la respuesta correcta.',
                        imageUrl: Juego2,
                        route: '/alumno/juegos/escritura',
                        difficultyLevel: 1,
                        orderIndex: 2
                    },
                    {
                        id: 'game-descomposicion',
                        name: 'Descomposición y Composición',
                        description: '¡Aprende a descomponer y componer números! Descubre el misterio de los valores posicionales.',
                        imageUrl: Juego,
                        route: '/alumno/juegos/descomposicion',
                        difficultyLevel: 2,
                        orderIndex: 3
                    },
                    {
                        id: 'game-escala',
                        name: 'Escala Numérica',
                        description: '¡Explora los números anteriores y posteriores! Completa secuencias y descubre patrones numéricos.',
                        imageUrl: JuegoEscala,
                        route: '/alumno/juegos/escala',
                        difficultyLevel: 2,
                        orderIndex: 4
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
            <div className="scroll-container">
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
            </div>
        </>
    )
}
