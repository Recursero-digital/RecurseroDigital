
import { StudentRepository, StudentData } from '../infrastructure/StudentRepository';
import { PasswordEncoder } from '../infrastructure/PasswordEncoder';
import { IdGenerator } from '../infrastructure/IdGenerator';

export interface AddStudentRequest {
    name: string;
    lastName: string;
    email: string;
    password: string;
}

export class AddStudentUseCase {
    private studentRepository: StudentRepository;
    private passwordEncoder: PasswordEncoder;
    private idGenerator: IdGenerator;

    constructor(
        studentRepository: StudentRepository,
        passwordEncoder: PasswordEncoder,
        idGenerator: IdGenerator
    ) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.idGenerator = idGenerator;
    }

    async execute(request: AddStudentRequest): Promise<void> {
        const hashedPassword = await this.passwordEncoder.encode(request.password);
        const id = this.idGenerator.generate();
        
        const studentData: StudentData = {
            id,
            username: request.email,
            password: hashedPassword,
            name: request.name,
            surname: request.lastName
        };

        await this.studentRepository.addStudent(studentData);
    }
}