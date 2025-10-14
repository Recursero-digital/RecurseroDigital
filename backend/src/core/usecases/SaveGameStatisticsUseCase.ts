import { StudentStatisticsRepository } from '../infrastructure/StudentStatisticsRepository';
import { IdGenerator } from '../infrastructure/IdGenerator';
import { StudentStatistics } from '../models/StudentStatistics';

export interface SaveGameStatisticsRequest {
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
    sessionStartTime?: Date;
    sessionEndTime?: Date;
}

export class SaveGameStatisticsUseCase {
    private statisticsRepository: StudentStatisticsRepository;
    private idGenerator: IdGenerator;

    constructor(
        statisticsRepository: StudentStatisticsRepository,
        idGenerator: IdGenerator
    ) {
        this.statisticsRepository = statisticsRepository;
        this.idGenerator = idGenerator;
    }

    async execute(request: SaveGameStatisticsRequest): Promise<StudentStatistics> {
        const existingStats = await this.statisticsRepository.findLatestStatistics(
            request.studentId, 
            request.gameId
        );

        const totalPoints = existingStats 
            ? existingStats.totalPoints + request.points 
            : request.points;

        const maxUnlockedLevel = request.maxUnlockedLevel || request.level;

        const statistics = new StudentStatistics(
            this.idGenerator.generate(),
            request.studentId,
            request.gameId,
            request.level,
            request.activity,
            request.points,
            totalPoints,
            request.attempts,
            request.isCompleted,
            maxUnlockedLevel,
            new Date(),
            new Date(),
            request.correctAnswers,
            request.totalQuestions,
            request.completionTime,
            request.sessionStartTime,
            request.sessionEndTime
        );

        await this.statisticsRepository.saveStatistics(statistics);
        return statistics;
    }
}
