import { Request, Response } from 'express';
import { DependencyContainer } from '../../config/DependencyContainer';

const container = DependencyContainer.getInstance();

export const gameController = {
    getGameLevels: async (req: Request, res: Response): Promise<void> => {
        try {
            const { gameId } = req.params as { gameId: string };
            const { onlyActive } = req.query as { onlyActive?: string };

            if (!gameId || gameId.trim() === '') {
                res.status(400).json({ 
                    error: 'gameId es requerido' 
                });
                return;
            }

            const result = await container.getGameLevelsUseCase.execute({
                gameId,
                onlyActive: onlyActive === 'true'
            });

            if (result.levels.length === 0) {
                res.status(200).json({
                    gameId: result.gameId,
                    levels: [],
                    message: `No se encontraron niveles para el juego ${gameId}`
                });
                return;
            }

            res.status(200).json(result);
        } catch (error: any) {
            console.error('Error en getGameLevels:', error);
            
            if (error.message === 'gameId es requerido') {
                res.status(400).json({ error: error.message });
                return;
            }

            res.status(500).json({ 
                error: 'Error interno del servidor al obtener niveles del juego' 
            });
        }
    },

    getGameLevel: async (req: Request, res: Response): Promise<void> => {
        try {
            const { gameId, level } = req.params as { gameId: string; level: string };

            if (!gameId || gameId.trim() === '') {
                res.status(400).json({ error: 'gameId es requerido' });
                return;
            }

            const levelNumber = parseInt(level, 10);
            if (isNaN(levelNumber) || levelNumber < 1) {
                res.status(400).json({ error: 'level debe ser un número entero mayor a 0' });
                return;
            }

            const gameLevel = await container.gameLevelRepository.findByGameIdAndLevel(
                gameId,
                levelNumber
            );

            if (!gameLevel) {
                res.status(404).json({ 
                    error: `Nivel ${levelNumber} no encontrado para el juego ${gameId}` 
                });
                return;
            }

            res.status(200).json({
                id: gameLevel.getId(),
                gameId: gameLevel.getGameId(),
                level: gameLevel.getLevel(),
                name: gameLevel.getName(),
                description: gameLevel.getDescription(),
                difficulty: gameLevel.getDifficulty(),
                activitiesCount: gameLevel.getActivitiesCount(),
                config: gameLevel.getConfig()
            });
        } catch (error: any) {
            console.error('Error en getGameLevel:', error);
            res.status(500).json({ 
                error: 'Error interno del servidor al obtener el nivel del juego' 
            });
        }
    },

    getAllGames: async (req: Request, res: Response): Promise<void> => {
        try {
            res.status(501).json({ 
                message: 'Endpoint aún no implementado - usar endpoint existente de juegos' 
            });
        } catch (error: any) {
            console.error('Error en getAllGames:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

