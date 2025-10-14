import { StudentStatisticsRepository } from '../infrastructure/StudentStatisticsRepository';
import { StudentStatistics } from '../models/StudentStatistics';

export interface GetStudentProgressRequest {
    studentId: string;
    gameId?: string; 
}

export interface StudentProgressResponse {
    studentId: string;
    gameProgress: {
        gameId: string;
        maxUnlockedLevel: number;
        totalPoints: number;
        completionRate: number;
        averageAccuracy: number;
        lastActivity?: Date;
        statistics: StudentStatistics[];
    }[];
    totalPoints: number;
    totalGamesPlayed: number;
}

export class GetStudentProgressUseCase {
    private statisticsRepository: StudentStatisticsRepository;

    constructor(statisticsRepository: StudentStatisticsRepository) {
        this.statisticsRepository = statisticsRepository;
    }

    async execute(request: GetStudentProgressRequest): Promise<StudentProgressResponse> {
        let statistics: StudentStatistics[];

        if (request.gameId) {
            statistics = await this.statisticsRepository.findByStudentAndGame(
                request.studentId, 
                request.gameId
            );
        } else {
            statistics = await this.statisticsRepository.findByStudent(request.studentId);
        }

        const gameGroups = new Map<string, StudentStatistics[]>();
        statistics.forEach(stat => {
            if (!gameGroups.has(stat.gameId)) {
                gameGroups.set(stat.gameId, []);
            }
            gameGroups.get(stat.gameId)!.push(stat);
        });

        const gameProgress = await Promise.all(
            Array.from(gameGroups.entries()).map(async ([gameId, gameStats]) => {
                const latestStat = gameStats.reduce((latest, current) => 
                    current.maxUnlockedLevel > latest.maxUnlockedLevel ? current : latest
                );

                const totalPoints = gameStats.reduce((sum, stat) => sum + stat.points, 0);
                const completionRate = await this.statisticsRepository.getStudentCompletionRate(
                    request.studentId, 
                    gameId
                );
                const averageAccuracy = await this.statisticsRepository.getStudentAverageAccuracy(
                    request.studentId, 
                    gameId
                );

                const lastActivity = gameStats.reduce((latest, current) => 
                    current.createdAt > latest.createdAt ? current : latest
                ).createdAt;

                return {
                    gameId,
                    maxUnlockedLevel: latestStat.maxUnlockedLevel,
                    totalPoints,
                    completionRate,
                    averageAccuracy,
                    lastActivity,
                    statistics: gameStats
                };
            })
        );

        const totalPoints = await this.statisticsRepository.getStudentTotalPoints(request.studentId);
        const totalGamesPlayed = gameGroups.size;

        return {
            studentId: request.studentId,
            gameProgress,
            totalPoints,
            totalGamesPlayed
        };
    }
}
