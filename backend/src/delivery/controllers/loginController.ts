import { Request, Response } from 'express';
import { LoginUseCase } from '../../core/usecases/loginUseCase';
import { InMemoryUserRepository } from '../../infrastructure/InMemoryUserRepository';
import { BcryptPasswordEncoder } from '../../infrastructure/BcryptPasswordEncoder';
import { JWTTokenService } from '../../infrastructure/JWTTokenService';
import { InvalidCredentials } from '../../core/models/exceptions/InvalidCredentials';

interface LoginRequest {
    user: string;
    password: string;
}

interface LoginResponse {
    token?: string;
    error?: string;
}

// Instanciar las dependencias
const userRepository = new InMemoryUserRepository();
const passwordEncoder = new BcryptPasswordEncoder();
const tokenService = new JWTTokenService();
const loginUseCase = new LoginUseCase(userRepository, passwordEncoder, tokenService);

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
