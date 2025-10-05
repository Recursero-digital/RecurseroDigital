import { Request, Response } from 'express';
import { DependencyContainer } from '../../config/DependencyContainer';
import { StudentInvalidRequestError } from '../../core/models/exceptions/StudentInvalidRequestError';
import { StudentAlreadyExistsError } from '../../core/models/exceptions/StudentAlreadyExistsError';

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
        
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const studentController = { addStudent };
