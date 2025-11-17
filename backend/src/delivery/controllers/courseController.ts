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

            const result = await container.getCourseStudentsUseCase.execute({ courseId });
            
            res.status(200).json(result);
        } catch (error: any) {
            console.error('Error en getCourseStudents:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};
