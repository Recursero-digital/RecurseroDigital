
import { StudentRepository } from '../infrastructure/StudentRepository';
import { PasswordEncoder } from '../infrastructure/PasswordEncoder';
import { IdGenerator } from '../infrastructure/IdGenerator';
import {StudentInvalidRequestError} from "../models/exceptions/StudentInvalidRequestError";
import {Student} from "../models/Student";

export interface AddStudentRequest {
    name: string;
    lastName: string;
    username: string;
    password: string;
    dni: string;
}

function validateStudentRequest(request: AddStudentRequest) {
    if(!request.name) {
        throw new StudentInvalidRequestError('El nombre del estudiante es obligatorio');
    }
    if(!request.lastName) {
        throw new StudentInvalidRequestError('El apellido del estudiante es obligatorio');
    }
    if(!request.username) {
        throw new StudentInvalidRequestError('El nombre de usuario es obligatorio');
    }
    if(!request.password) {
        throw new StudentInvalidRequestError('La contraseña del estudiante es obligatoria');
    }
    if(!request.dni) {
        throw new StudentInvalidRequestError('El DNI del estudiante es obligatorio');
    }
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
        validateStudentRequest(request);
        const hashedPassword = await this.passwordEncoder.encode(request.password);
        const id = this.idGenerator.generate();
        
        const student = new Student(
            id,
            request.username,
            hashedPassword,
            request.name,
            request.lastName,
            request.dni
        )

        await this.studentRepository.addStudent(student);
    }
}