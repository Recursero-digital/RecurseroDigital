import { Request, Response } from 'express';
import { DependencyContainer } from '../../config/DependencyContainer';
import { TeacherInvalidRequestError } from '../../core/models/exceptions/TeacherInvalidRequestError';
import { AssignTeacherToCoursesUseCase, AssignTeacherToCoursesRequest } from '../../core/usecases/AssignTeacherToCourseUseCase';

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

export const teacherController = {
    assignTeacherToCourses
};