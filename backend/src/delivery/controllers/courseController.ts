import { Request, Response } from 'express';
import { DependencyContainer } from '../../config/DependencyContainer';
import { AssignGameToCourseUseCase } from '../../core/usecases/AssignGameToCourseUseCase';
import { CreateCourseUseCase } from '../../core/usecases/CreateCourseUseCase';

const container = DependencyContainer.getInstance();

export const courseController = {
    getAllCourses: async (req: Request, res: Response): Promise<void> => {
        try {
            const courses = await container.courseRepository.getAllCourses();
            res.status(200).json({
                courses: courses.map(course => ({
                    id: course.id,
                    name: course.name,
                    teacherId: course.teacher_id,
                    students: course.students || 0
                }))
            });
        } catch (error: any) {
            console.error('Error en getAllCourses:', error);
            res.status(500).json({ error: error?.message ?? 'Error interno del servidor' });
        }
    },

    addGameToCourse: async (req: Request, res: Response): Promise<void> => {
        try {
            const { courseId } = req.params as { courseId: string };
            const { gameId } = req.body as { gameId: string };

            if (!gameId) {
                res.status(400).json({ error: 'gameId es requerido' });
                return;
            }

            const useCase = new AssignGameToCourseUseCase(
                container.courseRepository,
                container.uuidGenerator
            );
            await useCase.execute({ courseId, gameId });

            res.status(201).json({ message: 'Juego asignado al curso correctamente' });
        } catch (error: any) {
            res.status(500).json({ error: error?.message ?? 'Error interno del servidor' });
        }
    },

    createCourse: async (req: Request, res: Response): Promise<void> => {
        try {
            const { name } = req.body as { name: string };

            if (!name || name.trim() === '') {
                res.status(400).json({ error: 'El nombre del curso es requerido' });
                return;
            }

            const useCase = new CreateCourseUseCase(
                container.courseRepository,
                container.uuidGenerator
            );

            const result = await useCase.execute({ name: name.trim() });

            res.status(201).json({
                message: 'Curso creado exitosamente',
                course: result
            });
        } catch (error: any) {
            if (error.message === 'Ya existe un curso con ese nombre') {
                res.status(409).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: error?.message ?? 'Error interno del servidor' });
        }
    },

    getCourseStudents: async (req: Request, res: Response): Promise<void> => {
        try {
            const { courseId } = req.params as { courseId: string };

            if (!courseId) {
                res.status(400).json({ error: 'courseId es requerido' });
                return;
            }

            // Mock comentado - reemplazado por implementación real
            // const students = [
            //     {
            //         id: "student_1",
            //         name: "Ana",
            //         lastname: "García",
            //         userName: "ana.garcia",
            //         enrollmentDate: "2024-01-15",
            //         totalGamesPlayed: 45,
            //         averageScore: 88,
            //         lastActivity: "2024-10-12T10:30:00Z",
            //         progressByGame: {
            //             ordenamiento: { completed: 15, totalTime: 450, averageScore: 92 },
            //             escritura: { completed: 12, totalTime: 360, averageScore: 85 },
            //             descomposicion: { completed: 10, totalTime: 300, averageScore: 90 },
            //             escala: { completed: 8, totalTime: 240, averageScore: 86 }
            //         }
            //     },
            //     {
            //         id: "student_2",
            //         name: "Carlos",
            //         lastname: "López",
            //         userName: "carlos.lopez",
            //         enrollmentDate: "2024-01-15",
            //         totalGamesPlayed: 32,
            //         averageScore: 76,
            //         lastActivity: "2024-10-11T14:20:00Z",
            //         progressByGame: {
            //             ordenamiento: { completed: 10, totalTime: 350, averageScore: 78 },
            //             escritura: { completed: 8, totalTime: 280, averageScore: 74 },
            //             descomposicion: { completed: 8, totalTime: 240, averageScore: 80 },
            //             escala: { completed: 6, totalTime: 180, averageScore: 72 }
            //         }
            //     },
            //     {
            //         id: "student_3",
            //         name: "María",
            //         lastname: "Rodríguez",
            //         userName: "maria.rodriguez",
            //         enrollmentDate: "2024-01-20",
            //         totalGamesPlayed: 28,
            //         averageScore: 94,
            //         lastActivity: "2024-10-12T16:45:00Z",
            //         progressByGame: {
            //             ordenamiento: { completed: 8, totalTime: 200, averageScore: 96 },
            //             escritura: { completed: 7, totalTime: 175, averageScore: 93 },
            //             descomposicion: { completed: 7, totalTime: 210, averageScore: 95 },
            //             escala: { completed: 6, totalTime: 150, averageScore: 92 }
            //         }
            //     },
            //     {
            //         id: "student_4",
            //         name: "Diego",
            //         lastname: "Martínez",
            //         userName: "diego.martinez",
            //         enrollmentDate: "2024-02-01",
            //         totalGamesPlayed: 18,
            //         averageScore: 82,
            //         lastActivity: "2024-10-10T11:15:00Z",
            //         progressByGame: {
            //             ordenamiento: { completed: 6, totalTime: 180, averageScore: 84 },
            //             escritura: { completed: 4, totalTime: 120, averageScore: 79 },
            //             descomposicion: { completed: 5, totalTime: 150, averageScore: 85 },
            //             escala: { completed: 3, totalTime: 90, averageScore: 80 }
            //         }
            //     },
            //     {
            //         id: "student_5",
            //         name: "Sofia",
            //         lastname: "Hernández",
            //         userName: "sofia.hernandez",
            //         enrollmentDate: "2024-01-18",
            //         totalGamesPlayed: 52,
            //         averageScore: 79,
            //         lastActivity: "2024-10-12T09:30:00Z",
            //         progressByGame: {
            //             ordenamiento: { completed: 18, totalTime: 540, averageScore: 81 },
            //             escritura: { completed: 14, totalTime: 420, averageScore: 77 },
            //             descomposicion: { completed: 12, totalTime: 360, averageScore: 82 },
            //             escala: { completed: 8, totalTime: 240, averageScore: 76 }
            //         }
            //     }
            // ];

            const allStudents = await container.studentRepository.getAllStudents();
            const courseStudents = allStudents.filter(student => student.courseId === courseId);

            const db = container.databaseConnection;
            const studentsWithDetails = await Promise.all(
                courseStudents.map(async (student) => {
                    // Obtener fecha de inscripción
                    const studentResult = await db.query(
                        `SELECT created_at FROM students WHERE id = $1`,
                        [student.id]
                    );
                    const enrollmentDate = studentResult.rows[0]?.created_at 
                        ? new Date(studentResult.rows[0].created_at).toISOString().split('T')[0]
                        : null;

                    const statistics = await container.statisticsRepository.findByStudent(student.id);


                    const uniqueGames = new Set(statistics.map(stat => stat.gameId));
                    const totalGamesPlayed = uniqueGames.size;
                    
                    let totalAccuracy = 0;
                    let accuracyCount = 0;
                    statistics.forEach(stat => {
                        if (stat.totalQuestions && stat.totalQuestions > 0 && stat.correctAnswers !== undefined) {
                            const accuracy = (stat.correctAnswers / stat.totalQuestions) * 100;
                            totalAccuracy += accuracy;
                            accuracyCount++;
                        }
                    });
                    const averageScore = accuracyCount > 0 ? Math.round(totalAccuracy / accuracyCount) : 0;

                    // Obtener última actividad
                    let lastActivity: string | null = null;
                    if (statistics.length > 0) {
                        const latestStat = statistics.reduce((latest, current) => {
                            return current.createdAt > latest.createdAt ? current : latest;
                        });
                        lastActivity = latestStat.createdAt.toISOString();
                    }

                    // Calcular progreso por juego
                    const progressByGame: Record<string, { completed: number; totalTime: number; averageScore: number }> = {};
                    const gameStatsMap = new Map<string, { completed: number; totalTime: number; scores: number[] }>();

                    statistics.forEach(stat => {
                        const gameId = stat.gameId;
                        if (!gameStatsMap.has(gameId)) {
                            gameStatsMap.set(gameId, { completed: 0, totalTime: 0, scores: [] });
                        }
                        const gameStats = gameStatsMap.get(gameId)!;
                        
                        if (stat.isCompleted) {
                            gameStats.completed++;
                        }
                        if (stat.completionTime) {
                            gameStats.totalTime += stat.completionTime;
                        }
                        if (stat.totalQuestions && stat.totalQuestions > 0 && stat.correctAnswers !== undefined) {
                            const score = (stat.correctAnswers / stat.totalQuestions) * 100;
                            gameStats.scores.push(score);
                        }
                    });

                    // Convertir a formato esperado
                    gameStatsMap.forEach((stats, gameId) => {
                        const avgScore = stats.scores.length > 0
                            ? Math.round(stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length)
                            : 0;
                        progressByGame[gameId] = {
                            completed: stats.completed,
                            totalTime: stats.totalTime,
                            averageScore: avgScore
                        };
                    });

                    return {
                        id: student.id,
                        name: student.name,
                        lastname: student.lastname,
                        userName: student.getUsername(),
                        enrollmentDate: enrollmentDate || null,
                        totalGamesPlayed,
                        averageScore,
                        lastActivity: lastActivity || null,
                        progressByGame
                    };
                })
            );

            res.status(200).json({
                courseId,
                students: studentsWithDetails
            });
        } catch (error: any) {
            console.error('Error en getCourseStudents:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};
