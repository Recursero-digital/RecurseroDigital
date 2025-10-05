import { LoginTeacherUseCase } from '../core/usecases/./loginTeacherUseCase';
import { InMemoryTeacherRepository } from '../infrastructure/InMemoryTeacherRepository';
import { InMemoryStudentRepository } from '../infrastructure/InMemoryStudentRepository';
import { InMemoryAdminRepository } from '../infrastructure/InMemoryAdminRepository';
import { BcryptPasswordEncoder } from '../infrastructure/BcryptPasswordEncoder';
import { JWTTokenService } from '../infrastructure/JWTTokenService';
import {LoginStudentUseCase} from "../core/usecases/loginStudentUseCase";
import {LoginAdminUseCase} from "../core/usecases/loginAdminUseCase";
import {AddStudentUseCase} from "../core/usecases/addStudentUseCase";
import {UUIDGenerator} from "../infrastructure/UUIDGenerator";



/**
 * Contenedor simple de dependencias
 * Centraliza la creación de instancias para mantener la separación de responsabilidades
 */
export class DependencyContainer {
    private static instance: DependencyContainer;
    
    // Instancias singleton
    private _teacherRepository: InMemoryTeacherRepository | null = null;
    private _studentRepository: InMemoryStudentRepository | null = null;
    private _adminRepository: InMemoryAdminRepository | null = null;
    private _passwordEncoder: BcryptPasswordEncoder | null = null;
    private _tokenService: JWTTokenService | null = null;
    private _uuidGenerator: UUIDGenerator | null = null;
    private _loginTeacherUseCase: LoginTeacherUseCase | null = null;
    private _loginStudentUseCase: LoginStudentUseCase | null = null;
    private _loginAdminUseCase: LoginAdminUseCase | null = null;
    private _addStudentUseCase: AddStudentUseCase | null = null;


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

    public get adminRepository(): InMemoryAdminRepository {
        if (!this._adminRepository) {
            this._adminRepository = new InMemoryAdminRepository();
        }
        return this._adminRepository;
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

    public get uuidGenerator(): UUIDGenerator {
        if (!this._uuidGenerator) {
            this._uuidGenerator = new UUIDGenerator();
        }
        return this._uuidGenerator;
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

    public get loginAdminsUseCase(): LoginAdminUseCase {
        if (!this._loginAdminUseCase) {
            this._loginAdminUseCase = new LoginAdminUseCase(
                this.adminRepository,
                this.passwordEncoder,
                this.tokenService
            );
        }
        return this._loginAdminUseCase;
    }

    public get addStudentUseCase(): AddStudentUseCase {
        if (!this._addStudentUseCase) {
            this._addStudentUseCase = new AddStudentUseCase(
                this.studentRepository,
                this.passwordEncoder,
                this.uuidGenerator
            );
        }
        return this._addStudentUseCase;
    }

}
