import { Request, Response } from 'express';
import { DependencyContainer } from '../../config/DependencyContainer';
import { StudentInvalidRequestError } from '../../core/models/exceptions/StudentInvalidRequestError';
import { StudentAlreadyExistsError } from '../../core/models/exceptions/StudentAlreadyExistsError';
import { GetStudentGamesUseCase } from '../../core/usecases/GetStudentGamesUseCase';

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

const getMyGames = async (req: Request, res: Response): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Token no proporcionado' });
            return;
        }

        const token = authHeader.split(' ')[1];
        
        const useCase = new GetStudentGamesUseCase(
            dependencyContainer.tokenService,
            dependencyContainer.studentRepository,
            dependencyContainer.courseRepository
        );

        const result = await useCase.execute({ token });

        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Token inválido') {
            res.status(401).json({ error: error.message });
            return;
        }
        if (error.message === 'Usuario no autorizado para esta operación') {
            res.status(403).json({ error: error.message });
            return;
        }
        if (error.message === 'Estudiante no encontrado') {
            res.status(404).json({ error: error.message });
            return;
        }
        
        console.error('Error en getMyGames:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const studentController = { addStudent, getMyGames };
