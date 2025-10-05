import { AddStudentUseCase, AddStudentRequest } from "../../../src/core/usecases/addStudentUseCase";
import { MockStudentRepository } from '../../mocks/StudentRepository.mock';
import { MockPasswordEncoder } from '../../mocks/PasswordEncoder.mock';
import { MockIdGenerator } from '../../mocks/IdGenerator.mock';
import {StudentInvalidRequestError} from "../../../src/core/models/exceptions/StudentInvalidRequestError";
import {StudentAlreadyExistsError} from "../../../src/core/models/exceptions/StudentAlreadyExistsError";

describe('AddStudentUseCase', () => {
    let addStudentUseCase: AddStudentUseCase;
    let mockStudentRepository: MockStudentRepository;
    let mockPasswordEncoder: MockPasswordEncoder;
    let mockIdGenerator: MockIdGenerator;

    beforeEach(() => {
        mockStudentRepository = new MockStudentRepository();
        mockPasswordEncoder = new MockPasswordEncoder();
        mockIdGenerator = new MockIdGenerator();
        
        addStudentUseCase = new AddStudentUseCase(
            mockStudentRepository,
            mockPasswordEncoder,
            mockIdGenerator
        );
    });

    afterEach(() => {
        mockStudentRepository.clearStudents();
        mockPasswordEncoder.clearPasswords();
        mockIdGenerator.reset();
    });

    describe('When execute', () => {
        it('should add student successfully', async () => {
            const request: AddStudentRequest = {
                name: 'Juan',
                lastName: 'Pérez',
                username: 'pepito123',
                dni: '12345678',
                password: 'password123'
            };

            await addStudentUseCase.execute(request);

            const allStudents = mockStudentRepository.getAllStudents();
            expect(allStudents).toHaveLength(1);
            
            const createdStudent = allStudents[0];
            expect(createdStudent).toEqual({
                id: '00000000-0000-4000-8000-0000000100000000',
                username: request.username,
                passwordHash: expect.any(String),
                name: request.name,
                lastname: request.lastName,
                dni: request.dni,
                role: 'STUDENT'
            });
        });

        it('should throw error when username is no received', async () => {
            const request: AddStudentRequest = {
                name: 'Juan',
                lastName: 'Pérez',
                dni: '12345678',
                username: '',
                password: 'password123'
            };

            await expect(addStudentUseCase.execute(request))
                .rejects
                .toThrow(StudentInvalidRequestError);
            
            await expect(addStudentUseCase.execute(request))
                .rejects
                .toThrow('El nombre de usuario es obligatorio');
        });

        it('should throw error when student name is no received', async () => {
            const request: AddStudentRequest = {
                name: '',
                lastName: 'Pérez',
                dni: '12345678',
                username: 'pepito123',
                password: 'password123'
            };

            await expect(addStudentUseCase.execute(request))
                .rejects
                .toThrow(StudentInvalidRequestError);
            
            await expect(addStudentUseCase.execute(request))
                .rejects
                .toThrow('El nombre del estudiante es obligatorio');
        });

        it('should throw error when student lastname is no received', async () => {
            const request: AddStudentRequest = {
                name: 'pepito',
                lastName: '',
                dni: '12345678',
                username: 'pepito123',
                password: 'password123'
            };

            await expect(addStudentUseCase.execute(request))
                .rejects
                .toThrow(StudentInvalidRequestError);
            
            await expect(addStudentUseCase.execute(request))
                .rejects
                .toThrow('El apellido del estudiante es obligatorio');
        });

        it('should throw error when student dni is no received', async () => {
            const request: AddStudentRequest = {
                name: 'pepito',
                lastName: 'Perez',
                dni: '',
                username: 'pepito123',
                password: 'password123'
            };

            await expect(addStudentUseCase.execute(request))
                .rejects
                .toThrow(StudentInvalidRequestError);
            
            await expect(addStudentUseCase.execute(request))
                .rejects
                .toThrow('El DNI del estudiante es obligatorio');
        });

        it('should throw error when student password is no received', async () => {
            const request: AddStudentRequest = {
                name: 'pepito',
                lastName: 'Perez',
                dni: '56738093',
                username: 'pepito123',
                password: ''
            };

            await expect(addStudentUseCase.execute(request))
                .rejects
                .toThrow(StudentInvalidRequestError);
            
            await expect(addStudentUseCase.execute(request))
                .rejects
                .toThrow('La contraseña del estudiante es obligatoria');
        });

        it('should throw error when student with same username already exists', async () => {
            const request: AddStudentRequest = {
                name: 'Juan',
                lastName: 'Pérez',
                username: 'pepito123',
                dni: '12345678',
                password: 'password123'
            }
            await addStudentUseCase.execute(request);

            await expect(addStudentUseCase.execute(request))
                .rejects
                .toThrow(StudentAlreadyExistsError);
            
            await expect(addStudentUseCase.execute(request))
                .rejects
                .toThrow('El nombre de usuario ya existe');
        })
    });
});