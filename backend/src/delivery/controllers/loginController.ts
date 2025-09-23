import { Request, Response } from 'express';
import { DependencyContainer } from '../../config/DependencyContainer';
import { InvalidCredentials } from '../../core/models/exceptions/InvalidCredentials';

interface LoginRequest {
    user: string;
    password: string;
}

interface LoginResponse {
    token?: string;
    error?: string;
}

// Obtener las dependencias del contenedor
const dependencyContainer = DependencyContainer.getInstance();
const loginUseCase = dependencyContainer.loginUseCase;

const login = async (req: Request<{}, LoginResponse, LoginRequest>, res: Response<LoginResponse>): Promise<void> => {
    const { user, password } = req.body;

    if (!user) {
        res.status(400).json({ error: 'Falta el usuario' });
        return;
    } 
    
    if (!password) {
        res.status(400).json({ error: 'Falta la contraseña' });
        return;
    } 
    
    try {
        const token = await loginUseCase.execute(user, password);
        res.status(200).json({ token });
    } catch (error) {
        if (error instanceof InvalidCredentials) {
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const loginController = { login };
