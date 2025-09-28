import { AddStudentUseCase, AddStudentRequest } from "../../../src/core/usecases/addStudentUseCase";
import { MockStudentRepository } from '../../mocks/StudentRepository.mock';
import { MockPasswordEncoder } from '../../mocks/PasswordEncoder.mock';
import { MockIdGenerator } from '../../mocks/IdGenerator.mock';

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
        mockStudentRepository.clearUsers();
        mockPasswordEncoder.clearPasswords();
        mockIdGenerator.reset();
    });

    describe('execute', () => {
        it('debe dar de alta un alumno exitosamente', async () => {
            const request: AddStudentRequest = {
                name: 'Juan',
                lastName: 'Pérez',
                email: 'juan.perez@email.com',
                password: 'password123'
            };

            await addStudentUseCase.execute(request);

            const allStudents = mockStudentRepository.getAllStudents();
            expect(allStudents).toHaveLength(1);
            
            const createdStudent = allStudents[0];
            expect(createdStudent).toEqual({
                id: '00000000-0000-4000-8000-0000000100000000',
                username: request.email,
                password: expect.any(String),
                name: request.name,
                surname: request.lastName
            });
        });
    });
});