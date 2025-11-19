import { StudentRepository } from '../infrastructure/StudentRepository';
import { StudentStatisticsRepository } from '../infrastructure/StudentStatisticsRepository';
import { GameLevelRepository } from '../infrastructure/GameLevelRepository';

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
        private gameLevelRepository: GameLevelRepository
    ) {}

    async execute(request: GetCourseProgressByGameRequest): Promise<CourseProgressByGameResponse> {
        const { courseId } = request;

        if (!courseId) {
            throw new Error('courseId es requerido');
        }

        // Obtener todos los estudiantes del curso
        let courseStudents;
        try {
            courseStudents = await this.studentRepository.getStudentsByCourseId(courseId);
        } catch (error) {
            console.error('Error al obtener estudiantes del curso:', error);
            throw new Error('Error al obtener estudiantes del curso');
        }

        const totalStudents = courseStudents.length;

        // Obtener todos los juegos únicos que tienen estadísticas en el curso
        const allGameIds = new Set<string>();
        for (const student of courseStudents) {
            const statistics = await this.statisticsRepository.findByStudent(student.id);
            statistics.forEach(stat => {
                allGameIds.add(stat.gameId);
            });
        }

        // Si no hay estudiantes o no hay juegos, devolver array vacío
        if (totalStudents === 0 || allGameIds.size === 0) {
            return {
                courseId,
                totalStudents: 0,
                progressByGame: []
            };
        }

        // Para cada juego, calcular el progreso promedio de todos los estudiantes
        const progressByGame: GameProgressData[] = await Promise.all(
            Array.from(allGameIds).map(async (gameId) => {
                const normalizedGameId = this.normalizeGameId(gameId);
                
                // Obtener el total de actividades del juego
                const totalActivities = await this.gameLevelRepository.getTotalActivitiesCount(gameId);
                
                if (totalActivities === 0) {
                    return {
                        gameId: normalizedGameId,
                        averageProgress: 0,
                        totalStudents,
                        studentsWithProgress: 0
                    };
                }

                // Calcular el progreso individual de cada estudiante
                const studentProgresses: number[] = [];
                let studentsWithProgress = 0;

                for (const student of courseStudents) {
                    try {
                        // Obtener la última actividad completada del estudiante en este juego
                        const lastActivity = await this.statisticsRepository.getLastCompletedActivity(
                            student.id,
                            gameId
                        );

                        if (lastActivity) {
                            // Calcular el número de actividad absoluta
                            // Necesitamos contar todas las actividades de los niveles anteriores + la actividad actual
                            const levels = await this.gameLevelRepository.findByGameId(gameId);
                            const sortedLevels = levels.sort((a, b) => a.getLevel() - b.getLevel());
                            
                            let absoluteActivityNumber = 0;
                            for (const level of sortedLevels) {
                                if (level.getLevel() < lastActivity.level) {
                                    // Sumar todas las actividades de niveles anteriores
                                    absoluteActivityNumber += level.getActivitiesCount();
                                } else if (level.getLevel() === lastActivity.level) {
                                    // Sumar las actividades completadas en el nivel actual
                                    absoluteActivityNumber += lastActivity.activity;
                                    break;
                                }
                            }

                            // Calcular el porcentaje de progreso
                            const progressPercentage = (absoluteActivityNumber / totalActivities) * 100;
                            studentProgresses.push(Math.min(progressPercentage, 100)); // Cap at 100%
                            studentsWithProgress++;
                        } else {
                            // Si el estudiante no tiene actividad, su progreso es 0
                            studentProgresses.push(0);
                        }
                    } catch (error) {
                        console.warn(`Error al calcular progreso para estudiante ${student.id} y juego ${gameId}:`, error);
                        studentProgresses.push(0);
                    }
                }

                // Calcular el promedio de progreso de todos los estudiantes
                const averageProgress = studentProgresses.length > 0
                    ? Math.round(studentProgresses.reduce((a, b) => a + b, 0) / studentProgresses.length)
                    : 0;

                return {
                    gameId: normalizedGameId,
                    averageProgress,
                    totalStudents,
                    studentsWithProgress
                };
            })
        );

        return {
            courseId,
            totalStudents,
            progressByGame
        };
    }

    private normalizeGameId(gameId: string): string {
        return gameId.startsWith('game-') ? gameId.replace('game-', '') : gameId;
    }

    private denormalizeGameId(gameId: string): string {
        return gameId.startsWith('game-') ? gameId : `game-${gameId}`;
    }
}

