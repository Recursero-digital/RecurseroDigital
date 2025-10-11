import { LoginTeacherUseCase } from '../core/usecases/./loginTeacherUseCase';
import { PostgreSQLTeacherRepository } from '../infrastructure/PostgreSQLTeacherRepository';
import { PostgreSQLStudentRepository } from '../infrastructure/PostgreSQLStudentRepository';
import { PostgreSQLAdminRepository } from '../infrastructure/PostgreSQLAdminRepository';
import { InMemoryTeacherRepository } from '../infrastructure/InMemoryTeacherRepository';
import { InMemoryStudentRepository } from '../infrastructure/InMemoryStudentRepository';
import { InMemoryAdminRepository } from '../infrastructure/InMemoryAdminRepository';
import { DatabaseConnection } from '../infrastructure/DatabaseConnection';
import { BcryptPasswordEncoder } from '../infrastructure/BcryptPasswordEncoder';
import { JWTTokenService } from '../infrastructure/JWTTokenService';
import {LoginStudentUseCase} from "../core/usecases/loginStudentUseCase";
import {LoginAdminUseCase} from "../core/usecases/loginAdminUseCase";
import {AddStudentUseCase} from "../core/usecases/addStudentUseCase";
import {UUIDGenerator} from "../infrastructure/UUIDGenerator";
import {PostgreSQLCourseRepository} from "../infrastructure/PostgreSQLCoursesRepository";
import {InMemoryCourseRepository} from "../infrastructure/InMemoryCourseRepository";



/**
 * Contenedor simple de dependencias
 * Centraliza la creación de instancias para mantener la separación de responsabilidades
 */
export class DependencyContainer {
    private static instance: DependencyContainer;
    
    private _teacherRepository: PostgreSQLTeacherRepository | InMemoryTeacherRepository | null = null;
    private _studentRepository: PostgreSQLStudentRepository | InMemoryStudentRepository | null = null;
    private _adminRepository: PostgreSQLAdminRepository | InMemoryAdminRepository | null = null;
    private _courseRepository: PostgreSQLCourseRepository | InMemoryCourseRepository | null = null;
    private _databaseConnection: DatabaseConnection | null = null;
    private _passwordEncoder: BcryptPasswordEncoder | null = null;
    private _tokenService: JWTTokenService | null = null;
    private _uuidGenerator: UUIDGenerator | null = null;
    private _loginTeacherUseCase: LoginTeacherUseCase | null = null;
    private _loginStudentUseCase: LoginStudentUseCase | null = null;
    private _loginAdminUseCase: LoginAdminUseCase | null = null;
    private _addStudentUseCase: AddStudentUseCase | null = null;


    private constructor() {
        // Solo inicializar base de datos si no estamos en modo test
        if (process.env.NODE_ENV !== 'test') {
            this.initializeDatabase();
        }
    }

    private async initializeDatabase(): Promise<void> {
        try {
            console.log('Inicializando base de datos PostgreSQL...');
            const db = DatabaseConnection.getInstance();
            await db.initializeTables();
            console.log('Base de datos inicializada correctamente');
        } catch (error) {
            console.error('Error al inicializar la base de datos:', error);

        }
    }

    public static getInstance(): DependencyContainer {
        if (!DependencyContainer.instance) {
            DependencyContainer.instance = new DependencyContainer();
        }
        return DependencyContainer.instance;
    }

    public get teacherRepository(): PostgreSQLTeacherRepository | InMemoryTeacherRepository {
        if (!this._teacherRepository) {
            if (process.env.NODE_ENV === 'test') {
                this._teacherRepository = new InMemoryTeacherRepository();
            } else {
                this._teacherRepository = new PostgreSQLTeacherRepository();
            }
        }
        return this._teacherRepository;
    }

    public get studentRepository(): PostgreSQLStudentRepository | InMemoryStudentRepository {
        if (!this._studentRepository) {
            if (process.env.NODE_ENV === 'test') {
                this._studentRepository = new InMemoryStudentRepository();
            } else {
                this._studentRepository = new PostgreSQLStudentRepository();
            }
        }
        return this._studentRepository;
    }

    public get adminRepository(): PostgreSQLAdminRepository | InMemoryAdminRepository {
        if (!this._adminRepository) {
            if (process.env.NODE_ENV === 'test') {
                this._adminRepository = new InMemoryAdminRepository();
            } else {
                this._adminRepository = new PostgreSQLAdminRepository();
            }
        }
        return this._adminRepository;
    }

    public get courseRepository(): PostgreSQLCourseRepository | InMemoryCourseRepository {
        if (!this._courseRepository) {
            if (process.env.NODE_ENV === 'test') {
                this._courseRepository = new InMemoryCourseRepository();
            } else {
                this._courseRepository = new PostgreSQLCourseRepository();
            }
        }
        return this._courseRepository;
    }

    public get databaseConnection(): DatabaseConnection {
        if (!this._databaseConnection) {
            this._databaseConnection = DatabaseConnection.getInstance();
        }
        return this._databaseConnection;
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


    public async clearAllData(): Promise<void> {
        if (process.env.NODE_ENV === 'test') {
            await (this.teacherRepository as InMemoryTeacherRepository).clearUsers();
            await (this.studentRepository as InMemoryStudentRepository).clearStudents();
            await (this.adminRepository as InMemoryAdminRepository).clearUsers();
            await (this.courseRepository as InMemoryCourseRepository).clearCourses();



            await this.initializeTestData();
        }
    }

    private async initializeTestData(): Promise<void> {
        const testContainer = DependencyContainer.getInstance();
        
        await (testContainer.adminRepository as InMemoryAdminRepository).addUser({
            id: '2',
            username: 'julian',
            password: '$2b$10$T9xOluqoDwlRMZ/LeIdsL.MUagpZUkBOtq.ZR95Bp98tbYCr/yKr6', // Recursero2025!
            role: 'admin'
        });

        await (testContainer.teacherRepository as InMemoryTeacherRepository).addUser({
            id: '1',
            username: 'Mariana@gmail.com',
            password: '$2b$10$pxoWnWCOR5f5tWmjLemzSuyeDzx3R8NFv4n80.F.Onh7hYKWMFYni', // abcd1234
            role: 'docente'
        });

        await (testContainer.studentRepository as InMemoryStudentRepository).addStudent({
            id: '1',
            username: 'nico@gmail.com',
            passwordHash: '$2b$10$T9xOluqoDwlRMZ/LeIdsL.MUagpZUkBOtq.ZR95Bp98tbYCr/yKr6', // Recursero2025!
            name: 'Nicolás',
            lastname: 'García',
            dni: '12345678',
            role: 'student'
        });

        // await (testContainer.courseRepository as InMemoryCourseRepository).addCourse({
        //     id: '1',
        //     name: 'A',
        //     teacher_id: '$2b$10$pxoWnWCOR5f5tWmjLemzSuyeDzx3R8NFv4n80.F.Onh7hYKWMFYni', // abcd1234
        //     students: 'docente'
        // });
    }

}
