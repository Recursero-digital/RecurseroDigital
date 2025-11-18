import { StudentRepository } from '../infrastructure/StudentRepository';

export interface DeleteStudentRequest {
    studentId: string;
}

export class DeleteStudentUseCase {
    private studentRepository: StudentRepository;

    constructor(studentRepository: StudentRepository) {
        this.studentRepository = studentRepository;
    }

    async execute(request: DeleteStudentRequest): Promise<void> {
        // Verificar que el estudiante existe
        const existingStudent = await this.studentRepository.findById(request.studentId);
        if (!existingStudent) {
            throw new Error('El estudiante no existe');
        }

        // Eliminar el estudiante
        await this.studentRepository.deleteStudent(request.studentId);
    }
}

