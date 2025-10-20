import { Request, Response } from 'express';
import { DependencyContainer } from '../../config/DependencyContainer';
import { AssignGameToCourseUseCase } from '../../core/usecases/AssignGameToCourseUseCase';
import { UserRole } from '../../core/models/User';
import { protectRoute } from '../middleware/authMiddleWare';
import { CreateCourseUseCase } from '../../core/usecases/CreateCourseUseCase';

const container = DependencyContainer.getInstance();

export const courseController = {
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

            const students = [
                {
                    id: "student_1",
                    name: "Ana",
                    lastname: "García",
                    userName: "ana.garcia",
                    enrollmentDate: "2024-01-15",
                    totalGamesPlayed: 45,
                    averageScore: 88,
                    lastActivity: "2024-10-12T10:30:00Z",
                    progressByGame: {
                        ordenamiento: { completed: 15, totalTime: 450, averageScore: 92 },
                        escritura: { completed: 12, totalTime: 360, averageScore: 85 },
                        descomposicion: { completed: 10, totalTime: 300, averageScore: 90 },
                        escala: { completed: 8, totalTime: 240, averageScore: 86 }
                    }
                },
                {
                    id: "student_2", 
                    name: "Carlos",
                    lastname: "López",
                    userName: "carlos.lopez",
                    enrollmentDate: "2024-01-15",
                    totalGamesPlayed: 32,
                    averageScore: 76,
                    lastActivity: "2024-10-11T14:20:00Z",
                    progressByGame: {
                        ordenamiento: { completed: 10, totalTime: 350, averageScore: 78 },
                        escritura: { completed: 8, totalTime: 280, averageScore: 74 },
                        descomposicion: { completed: 8, totalTime: 240, averageScore: 80 },
                        escala: { completed: 6, totalTime: 180, averageScore: 72 }
                    }
                },
                {
                    id: "student_3",
                    name: "María",
                    lastname: "Rodríguez", 
                    userName: "maria.rodriguez",
                    enrollmentDate: "2024-01-20",
                    totalGamesPlayed: 28,
                    averageScore: 94,
                    lastActivity: "2024-10-12T16:45:00Z",
                    progressByGame: {
                        ordenamiento: { completed: 8, totalTime: 200, averageScore: 96 },
                        escritura: { completed: 7, totalTime: 175, averageScore: 93 },
                        descomposicion: { completed: 7, totalTime: 210, averageScore: 95 },
                        escala: { completed: 6, totalTime: 150, averageScore: 92 }
                    }
                },
                {
                    id: "student_4",
                    name: "Diego",
                    lastname: "Martínez",
                    userName: "diego.martinez", 
                    enrollmentDate: "2024-02-01",
                    totalGamesPlayed: 18,
                    averageScore: 82,
                    lastActivity: "2024-10-10T11:15:00Z",
                    progressByGame: {
                        ordenamiento: { completed: 6, totalTime: 180, averageScore: 84 },
                        escritura: { completed: 4, totalTime: 120, averageScore: 79 },
                        descomposicion: { completed: 5, totalTime: 150, averageScore: 85 },
                        escala: { completed: 3, totalTime: 90, averageScore: 80 }
                    }
                },
                {
                    id: "student_5",
                    name: "Sofia",
                    lastname: "Hernández",
                    userName: "sofia.hernandez",
                    enrollmentDate: "2024-01-18", 
                    totalGamesPlayed: 52,
                    averageScore: 79,
                    lastActivity: "2024-10-12T09:30:00Z",
                    progressByGame: {
                        ordenamiento: { completed: 18, totalTime: 540, averageScore: 81 },
                        escritura: { completed: 14, totalTime: 420, averageScore: 77 },
                        descomposicion: { completed: 12, totalTime: 360, averageScore: 82 },
                        escala: { completed: 8, totalTime: 240, averageScore: 76 }
                    }
                }
            ];

            res.status(200).json({
                courseId: courseId,
                students: students
            });

        } catch (error: any) {
            console.error('Error en getCourseStudents:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
