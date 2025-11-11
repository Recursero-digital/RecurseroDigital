import { Request, Response } from 'express';
import { DependencyContainer } from '../../config/DependencyContainer';
import { AssignTeacherToCoursesUseCase, AssignTeacherToCoursesRequest } from '../../core/usecases/AssignTeacherToCourseUseCase';
import { TeacherNotFoundError } from '../../core/models/exceptions/TeacherNotFoundError';
import { TeacherInvalidRequestError } from '../../core/models/exceptions/TeacherInvalidRequestError';
import { AuthenticatedRequest } from '../middleware/authMiddleWare';

interface AssignTeacherResponse {
    message?: string;
    error?: string;
}

const dependencyContainer = DependencyContainer.getInstance();

const assignTeacherToCourses = async (
    req: Request<{}, AssignTeacherResponse, AssignTeacherToCoursesRequest>,
    res: Response<AssignTeacherResponse>
): Promise<void> => {
    const { courseIds } = req.body;
    const { teacherId } = req.params as { teacherId: string };

    try {
        if (!teacherId) {
            res.status(400).json({ error: 'teacherId es requerido' });
            return;
        }

        if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
            res.status(400).json({ error: 'courseIds debe ser un array con al menos un elemento' });
            return;
        }

        const assignTeacherUseCase = dependencyContainer.assignTeacherToCoursesUseCase;

        await assignTeacherUseCase.execute({ teacherId, courseIds });
        
        res.status(200).json({ 
            message: 'Profesor asignado a los cursos exitosamente' 
        });
    } catch (error: any) {
        if (error instanceof TeacherInvalidRequestError) {
            res.status(400).json({ error: error.message });
            return;
        }
        
        if (error.message === 'Profesor no encontrado') {
            res.status(404).json({ error: error.message });
            return;
        }
        
        if (error.message.includes('no encontrado')) {
            res.status(404).json({ error: error.message });
            return;
        }
        
        console.error('Error en assignTeacherToCourses:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getTeacherCourses = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }
        const courses = await dependencyContainer.getTeacherCoursesUseCase.execute({ teacherId: req.user.id });
        res.status(200).json({
            courses: courses.map(course => ({
                id: course.id,
                name: course.name
            }))
        });
    } catch (error: any) {
        console.error('Error en getTeacherCourses:', error);
        if (error instanceof TeacherNotFoundError) {
            res.status(404).json({ error: error.message });
            return;
        }
        if (error instanceof TeacherInvalidRequestError) {
            res.status(400).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getMyCourseDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId } = req.params as { courseId: string };
        
        if (!courseId) {
            res.status(400).json({ error: 'courseId es requerido' });
            return;
        }

        const courseDetails = {
            id: courseId,
            name: "3º A",
            statistics: {
                totalEstudiantes: 25,
                juegosActivos: 6,
                progresoPromedio: 78
            }
        };
        
        res.status(200).json(courseDetails);
        
    } catch (error: any) {
        console.error('Error en getMyCourseDetails:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const teacherController = {
    assignTeacherToCourses,
    getTeacherCourses,
    getMyCourseDetails
};