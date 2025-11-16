import { Request, Response } from 'express';
import { DependencyContainer } from '../../config/DependencyContainer';
import { StudentAlreadyExistsError } from '../../core/models/exceptions/StudentAlreadyExistsError';
import { AuthenticatedRequest } from '../middleware/authMiddleWare';
import { StudentNotFoundError } from '../../core/models/exceptions/StudentNotFoundError';
import { StudentInvalidRequestError } from '../../core/models/exceptions/StudentInvalidRequestError';

interface AddStudentRequest {
    name: string;
    lastName: string;
    username: string;
    password: string;
    dni: string;
}

interface AddStudentResponse {
    message?: string;
    error?: string;
}

const dependencyContainer = DependencyContainer.getInstance();
const addStudentUseCase = dependencyContainer.addStudentUseCase;

const addStudent = async (req: Request<{}, AddStudentResponse, AddStudentRequest>, res: Response<AddStudentResponse>): Promise<void> => {
    const { name, lastName, username, password, dni } = req.body;

    try {
        await addStudentUseCase.execute({
            name,
            lastName,
            username,
            password,
            dni
        });
        
        res.status(201).json({ message: 'Estudiante creado exitosamente' });
    } catch (error) {
        if (error instanceof StudentInvalidRequestError) {
            res.status(400).json({ error: error.message });
            return;
        }
        
        if (error instanceof StudentAlreadyExistsError) {
            res.status(409).json({ error: error.message });
            return;
        }
        
        console.error('Error en addStudent:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getAllStudents = async (req: Request, res: Response): Promise<void> => {
    try {
        const students = await dependencyContainer.studentRepository.getAllStudents();
        res.status(200).json({
            students: students.map(student => ({
                id: student.id,
                name: `${student.name} ${student.lastname}`,
                firstName: student.name,
                lastName: student.lastname,
                username: student.user.username,
                dni: student.dni
            }))
        });
    } catch (error) {
        console.error('Error en getAllStudents:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getMyGames = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }
        const result = await dependencyContainer.getStudentGamesUseCase.execute({ studentId: req.user.id });

        res.status(200).json(result);
    } catch (error: any) {
        if (error instanceof StudentNotFoundError) {
            res.status(404).json({ error: error.message });
            return;
        }
        if (error instanceof StudentInvalidRequestError) {
            res.status(400).json({ error: error.message });
            return;
        }
        
        console.error('Error en getMyGames:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const studentController = { addStudent, getMyGames, getAllStudents };

export const assignCourseToStudent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { studentId } = req.params as { studentId: string };
        const { courseId } = req.body as { courseId: string };

        if (!courseId) {
            res.status(400).json({ error: 'courseId es requerido' });
            return;
        }

        await dependencyContainer.assignCourseToStudentUseCase.execute({ studentId, courseId });

        res.status(200).json({ message: 'Curso asignado al estudiante correctamente' });
    } catch (error: any) {
        if (error.message === 'Estudiante no encontrado') {
            res.status(404).json({ error: error.message });
            return;
        }
        if (error.message === 'Curso no encontrado') {
            res.status(404).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: error?.message ?? 'Error interno del servidor' });
    }
};

export const studentExtendedController = { addStudent, getMyGames, assignCourseToStudent };
