import { LoginTeacherUseCase } from '../core/usecases/./loginTeacherUseCase';
import { InMemoryTeacherRepository } from '../infrastructure/InMemoryTeacherRepository';
import { BcryptPasswordEncoder } from '../infrastructure/BcryptPasswordEncoder';
import { JWTTokenService } from '../infrastructure/JWTTokenService';

/**
 * Contenedor simple de dependencias
 * Centraliza la creación de instancias para mantener la separación de responsabilidades
 */
export class DependencyContainer {
    private static instance: DependencyContainer;
    
    // Instancias singleton
    private _teacherRepository: InMemoryTeacherRepository | null = null;
    private _passwordEncoder: BcryptPasswordEncoder | null = null;
    private _tokenService: JWTTokenService | null = null;
    private _loginTeacherUseCase: LoginTeacherUseCase | null = null;

    private constructor() {}

    public static getInstance(): DependencyContainer {
        if (!DependencyContainer.instance) {
            DependencyContainer.instance = new DependencyContainer();
        }
        return DependencyContainer.instance;
    }

    // Getters lazy para las dependencias
    public get teacherRepository(): InMemoryTeacherRepository {
        if (!this._teacherRepository) {
            this._teacherRepository = new InMemoryTeacherRepository();
        }
        return this._teacherRepository;
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

    public get loginTeacherUseCase(): LoginTeacherUseCase {
        if (!this._loginTeacherUseCase) {
            this._loginTeacherUseCase = new LoginTeacherUseCase(
                this.teacherRepository,
                this.passwordEncoder,
                this.tokenService
            );
        }
        return this._loginTeacherUseCase;
    }
}
