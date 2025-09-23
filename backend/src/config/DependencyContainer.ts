import { LoginUseCase } from '../core/usecases/loginUseCase';
import { InMemoryUserRepository } from '../infrastructure/InMemoryUserRepository';
import { BcryptPasswordEncoder } from '../infrastructure/BcryptPasswordEncoder';
import { JWTTokenService } from '../infrastructure/JWTTokenService';

/**
 * Contenedor simple de dependencias
 * Centraliza la creación de instancias para mantener la separación de responsabilidades
 */
export class DependencyContainer {
    private static instance: DependencyContainer;
    
    // Instancias singleton
    private _userRepository: InMemoryUserRepository | null = null;
    private _passwordEncoder: BcryptPasswordEncoder | null = null;
    private _tokenService: JWTTokenService | null = null;
    private _loginUseCase: LoginUseCase | null = null;

    private constructor() {}

    public static getInstance(): DependencyContainer {
        if (!DependencyContainer.instance) {
            DependencyContainer.instance = new DependencyContainer();
        }
        return DependencyContainer.instance;
    }

    // Getters lazy para las dependencias
    public get userRepository(): InMemoryUserRepository {
        if (!this._userRepository) {
            this._userRepository = new InMemoryUserRepository();
        }
        return this._userRepository;
    }

    public get passwordEncoder(): BcryptPasswordEncoder {
        if (!this._passwordEncoder) {
            this._passwordEncoder = new BcryptPasswordEncoder();
        }
        return this._passwordEncoder;
    }

    public get tokenService(): JWTTokenService {
        if (!this._tokenService) {
            this._tokenService = new JWTTokenService();
        }
        return this._tokenService;
    }

    public get loginUseCase(): LoginUseCase {
        if (!this._loginUseCase) {
            this._loginUseCase = new LoginUseCase(
                this.userRepository,
                this.passwordEncoder,
                this.tokenService
            );
        }
        return this._loginUseCase;
    }
}
