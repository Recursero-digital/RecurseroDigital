import { LoginTeacherUseCase } from '../core/usecases/./loginTeacherUseCase';
import { InMemoryTeacherRepository } from '../infrastructure/InMemoryTeacherRepository';
import { InMemoryStudentRepository } from '../infrastructure/InMemoryStudentRepository';
import { BcryptPasswordEncoder } from '../infrastructure/BcryptPasswordEncoder';
import { JWTTokenService } from '../infrastructure/JWTTokenService';
import {LoginStudentUseCase} from "../core/usecases/loginStudentUseCase";

/**
 * Contenedor simple de dependencias
 * Centraliza la creación de instancias para mantener la separación de responsabilidades
 */
export class DependencyContainer {
    private static instance: DependencyContainer;
    
    // Instancias singleton
    private _teacherRepository: InMemoryTeacherRepository | null = null;
    private _studentRepository: InMemoryStudentRepository | null = null;
    private _passwordEncoder: BcryptPasswordEncoder | null = null;
    private _tokenService: JWTTokenService | null = null;
    private _loginTeacherUseCase: LoginTeacherUseCase | null = null;
    private _loginStudentUseCase: LoginStudentUseCase | null = null;

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

    public get studentRepository(): InMemoryStudentRepository {
        if (!this._studentRepository) {
            this._studentRepository = new InMemoryStudentRepository();
        }
        return this._studentRepository;
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

    public get loginStudentUseCase(): LoginStudentUseCase {
        if (!this._loginStudentUseCase) {
            this._loginStudentUseCase = new LoginStudentUseCase(
                this.studentRepository,
                this.passwordEncoder,
                this.tokenService
            );
        }
        return this._loginStudentUseCase;
    }
}
