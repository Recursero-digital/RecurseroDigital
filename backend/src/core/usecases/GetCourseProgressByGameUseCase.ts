import { StudentRepository } from '../infrastructure/StudentRepository';
import { StudentStatisticsRepository } from '../infrastructure/StudentStatisticsRepository';
import { GameLevelRepository } from '../infrastructure/GameLevelRepository';
import { CourseRepository } from '../infrastructure/CourseRepository';
import { Student } from '../models/Student';

export interface GetCourseProgressByGameRequest {
    courseId: string;
}

export interface GameProgressData {
    gameId: string;
    averageProgress: number;
    totalStudents: number;
    studentsWithProgress: number;
}

export interface CourseProgressByGameResponse {
    courseId: string;
    totalStudents: number;
    progressByGame: GameProgressData[];
}

export class GetCourseProgressByGameUseCase {
    constructor(
        private studentRepository: StudentRepository,
        private statisticsRepository: StudentStatisticsRepository,
        private gameLevelRepository: GameLevelRepository,
        private courseRepository: CourseRepository
    ) {}

    async execute(request: GetCourseProgressByGameRequest): Promise<CourseProgressByGameResponse> {
        const { courseId } = request;

        if (!courseId) {
            throw new Error('courseId es requerido');
        }

        const courseStudents = await this.getCourseStudents(courseId);
        const totalStudents = courseStudents.length;

        const allCourseGames = await this.getAllCourseGames(courseId);
        
        if (allCourseGames.length === 0) {
            return this.createEmptyResponse(courseId, totalStudents);
        }

        const gameIds = allCourseGames.map(courseGame => courseGame.getGameId());
        const progressByGame = await this.calculateProgressForAllGames(
            gameIds,
            courseStudents,
            totalStudents
        );

        return {
            courseId,
            totalStudents,
            progressByGame
        };
    }

    private async getCourseStudents(courseId: string): Promise<Student[]> {
        try {
            return await this.studentRepository.getStudentsByCourseId(courseId);
        } catch (error) {
            console.error('Error al obtener estudiantes del curso:', error);
            throw new Error('Error al obtener estudiantes del curso');
        }
    }

    private async getAllCourseGames(courseId: string) {
        try {
            return await this.courseRepository.getAllGamesByCourseId(courseId);
        } catch (error) {
            console.error('Error al obtener juegos del curso:', error);
            throw new Error('Error al obtener juegos del curso');
        }
    }

    private async calculateProgressForAllGames(
        gameIds: string[],
        courseStudents: Student[],
        totalStudents: number
    ): Promise<GameProgressData[]> {
        return Promise.all(
            gameIds.map(gameId => this.calculateGameProgress(gameId, courseStudents, totalStudents))
        );
    }

    private async calculateGameProgress(
        gameId: string,
        courseStudents: Student[],
        totalStudents: number
    ): Promise<GameProgressData> {
        const normalizedGameId = this.normalizeGameId(gameId);
        const totalActivities = await this.gameLevelRepository.getTotalActivitiesCount(gameId);

        if (totalActivities === 0) {
            return this.createEmptyGameProgress(normalizedGameId, totalStudents);
        }

        const { studentProgresses, studentsWithProgress } = await this.calculateAllStudentsProgress(
            courseStudents,
            gameId,
            totalActivities
        );

        const averageProgress = this.calculateAverageProgress(studentProgresses);

        return {
            gameId: normalizedGameId,
            averageProgress,
            totalStudents,
            studentsWithProgress
        };
    }

    private async calculateAllStudentsProgress(
        courseStudents: Student[],
        gameId: string,
        totalActivities: number
    ): Promise<{ studentProgresses: number[]; studentsWithProgress: number }> {
        const studentProgresses: number[] = [];
        let studentsWithProgress = 0;

        for (const student of courseStudents) {
            try {
                const progress = await this.calculateStudentProgress(student.id, gameId, totalActivities);
                studentProgresses.push(progress);
                
                if (progress > 0) {
                    studentsWithProgress++;
                }
            } catch (error) {
                console.warn(`Error al calcular progreso para estudiante ${student.id} y juego ${gameId}:`, error);
                studentProgresses.push(0);
            }
        }

        return { studentProgresses, studentsWithProgress };
    }

    private async calculateStudentProgress(
        studentId: string,
        gameId: string,
        totalActivities: number
    ): Promise<number> {
        const lastActivity = await this.statisticsRepository.getLastCompletedActivity(studentId, gameId);

        if (!lastActivity) {
            return 0;
        }

        const absoluteActivityNumber = await this.calculateAbsoluteActivityNumber(gameId, lastActivity);
        const progressPercentage = (absoluteActivityNumber / totalActivities) * 100;

        return Math.min(progressPercentage, 100);
    }

    private async calculateAbsoluteActivityNumber(
        gameId: string,
        lastActivity: { level: number; activity: number }
    ): Promise<number> {
        const levels = await this.gameLevelRepository.findByGameId(gameId);
        const sortedLevels = levels.sort((a, b) => a.getLevel() - b.getLevel());

        let absoluteActivityNumber = 0;

        for (const level of sortedLevels) {
            if (level.getLevel() < lastActivity.level) {
                absoluteActivityNumber += level.getActivitiesCount();
            } else if (level.getLevel() === lastActivity.level) {
                absoluteActivityNumber += lastActivity.activity;
                break;
            }
        }

        return absoluteActivityNumber;
    }

    private calculateAverageProgress(progresses: number[]): number {
        if (progresses.length === 0) {
            return 0;
        }

        const sum = progresses.reduce((a, b) => a + b, 0);
        return Math.round(sum / progresses.length);
    }

    private createEmptyResponse(courseId: string, totalStudents: number): CourseProgressByGameResponse {
        return {
            courseId,
            totalStudents,
            progressByGame: []
        };
    }

    private createEmptyGameProgress(gameId: string, totalStudents: number): GameProgressData {
        return {
            gameId,
            averageProgress: 0,
            totalStudents,
            studentsWithProgress: 0
        };
    }

    private normalizeGameId(gameId: string): string {
        return gameId.startsWith('game-') ? gameId.replace('game-', '') : gameId;
    }
}

