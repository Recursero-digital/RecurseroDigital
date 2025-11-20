import { useState, useEffect } from 'react';

export const useGameLevels = (gameId, onlyActive = true) => {
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!gameId) {
            setLoading(false);
            return;
        }

        const fetchLevels = async () => {
            try {
                setLoading(true);
                setError(null);

                const fullGameId = gameId.startsWith('game-') ? gameId : `game-${gameId}`;
                const url = `http://localhost:3000/api/games/${fullGameId}/levels${onlyActive ? '?onlyActive=true' : ''}`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error al obtener niveles: ${response.statusText}`);
                }

                const data = await response.json();
                setLevels(data.levels || []);
            } catch (err) {
                console.error('Error al cargar niveles del juego:', err);
                setError(err.message);
                setLevels([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLevels();
    }, [gameId, onlyActive]);

    return { levels, loading, error };
};

export const transformToDescomposicionFormat = (levels) => {
    return levels.map(level => ({
        name: level.name,
        range: level.config.range || `${level.config.min} al ${level.config.max}`,
        min: level.config.min,
        max: level.config.max,
        color: level.config.color
    }));
};

export const transformToEscalaFormat = (levels) => {
    return levels.map(level => ({
        name: level.name,
        range: level.config.range || `${level.config.min} al ${level.config.max}`,
        operation: level.config.operation,
        min: level.config.min,
        max: level.config.max,
        color: level.config.color,
        description: level.description
    }));
};

export const transformToOrdenamientoFormat = (levels) => {
    return levels.map(level => ({
        min: level.config.min,
        max: level.config.max,
        numbersCount: level.config.numbersCount || 6,
        name: level.name,
        description: level.description,
        color: level.config.color || 'blue'
    }));
};

export const transformToEscrituraFormat = (levels) => {
    return levels.map(level => ({
        min: level.config.min,
        max: level.config.max
    }));
};

export const fetchGameLevel = async (gameId, levelNumber) => {
    try {
        const fullGameId = gameId.startsWith('game-') ? gameId : `game-${gameId}`;
        const response = await fetch(`http://localhost:3000/api/games/${fullGameId}/levels/${levelNumber}`);

        if (!response.ok) {
            throw new Error(`Error al obtener nivel: ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error(`Error al cargar nivel ${levelNumber} del juego ${gameId}:`, err);
        throw err;
    }
};

export const useGameLevel = (gameId, levelNumber) => {
    const [level, setLevel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!gameId || !levelNumber) {
            setLoading(false);
            return;
        }

        const fetchLevel = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchGameLevel(gameId, levelNumber);
                setLevel(data);
            } catch (err) {
                setError(err.message);
                setLevel(null);
            } finally {
                setLoading(false);
            }
        };

        fetchLevel();
    }, [gameId, levelNumber]);

    return { level, loading, error };
};

