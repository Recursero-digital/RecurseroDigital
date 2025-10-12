import { Request, Response } from 'express';
import { DependencyContainer } from '../../config/DependencyContainer';

interface SaveGameStatisticsRequest {
    studentId: string;
    gameId: string;
    level: number;
    activity: number;
    points: number;
    attempts: number;
    correctAnswers?: number;
    totalQuestions?: number;
    completionTime?: number;
    isCompleted: boolean;
    maxUnlockedLevel?: number;
    sessionStartTime?: string;
    sessionEndTime?: string;
}

interface GetStudentProgressRequest {
    studentId: string;
    gameId?: string;
}

interface GetGameStatisticsRequest {
    gameId: string;
}

const dependencyContainer = DependencyContainer.getInstance();
const saveGameStatisticsUseCase = dependencyContainer.saveGameStatisticsUseCase;
const getStudentProgressUseCase = dependencyContainer.getStudentProgressUseCase;
const getGameStatisticsUseCase = dependencyContainer.getGameStatisticsUseCase;

const saveGameStatistics = async (
    req: Request<{}, any, SaveGameStatisticsRequest>, 
    res: Response
): Promise<void> => {
    const { 
        studentId, 
        gameId, 
        level, 
        activity, 
        points, 
        attempts, 
        correctAnswers, 
        totalQuestions, 
        completionTime, 
        isCompleted, 
        maxUnlockedLevel,
        sessionStartTime,
        sessionEndTime 
    } = req.body;

    try {
        if (!studentId || !gameId || level === undefined || activity === undefined || points === undefined || attempts === undefined) {
            res.status(400).json({ error: 'Faltan campos obligatorios' });
            return;
        }

        if (level < 1 || activity < 1 || points < 0 || attempts < 0) {
            res.status(400).json({ error: 'Valores inválidos en los campos' });
            return;
        }

        const statistics = await saveGameStatisticsUseCase.execute({
            studentId,
            gameId,
            level,
            activity,
            points,
            attempts,
            correctAnswers,
            totalQuestions,
            completionTime,
            isCompleted,
            maxUnlockedLevel,
            sessionStartTime: sessionStartTime ? new Date(sessionStartTime) : undefined,
            sessionEndTime: sessionEndTime ? new Date(sessionEndTime) : undefined
        });
        
        res.status(201).json({ 
            message: 'Estadísticas guardadas exitosamente',
            statistics: {
                id: statistics.id,
                studentId: statistics.studentId,
                gameId: statistics.gameId,
                level: statistics.level,
                activity: statistics.activity,
                points: statistics.points,
                totalPoints: statistics.totalPoints,
                attempts: statistics.attempts,
                isCompleted: statistics.isCompleted,
                maxUnlockedLevel: statistics.maxUnlockedLevel
            }
        });
    } catch (error) {
        console.error('Error en saveGameStatistics:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getStudentProgress = async (
    req: Request<GetStudentProgressRequest>, 
    res: Response
): Promise<void> => {
    const { studentId, gameId } = req.params;

    try {
        if (!studentId) {
            res.status(400).json({ error: 'ID del estudiante es obligatorio' });
            return;
        }

        const progress = await getStudentProgressUseCase.execute({
            studentId,
            gameId: gameId || undefined
        });
        
        res.status(200).json(progress);
    } catch (error) {
        console.error('Error en getStudentProgress:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getGameStatistics = async (
    req: Request<GetGameStatisticsRequest>, 
    res: Response
): Promise<void> => {
    const { gameId } = req.params;

    try {
        if (!gameId) {
            res.status(400).json({ error: 'ID del juego es obligatorio' });
            return;
        }

        const statistics = await getGameStatisticsUseCase.execute({
            gameId
        });
        
        res.status(200).json(statistics);
    } catch (error) {
        console.error('Error en getGameStatistics:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const statisticsController = { 
    saveGameStatistics, 
    getStudentProgress, 
    getGameStatistics 
};
