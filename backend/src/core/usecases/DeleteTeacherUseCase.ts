import { TeacherRepository } from '../infrastructure/TeacherRepository';

export interface DeleteTeacherRequest {
    teacherId: string;
}

export class DeleteTeacherUseCase {
    private teacherRepository: TeacherRepository;

    constructor(teacherRepository: TeacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    async execute(request: DeleteTeacherRequest): Promise<void> {
        // Verificar que el docente existe
        const existingTeacher = await this.teacherRepository.findById(request.teacherId);
        if (!existingTeacher) {
            throw new Error('El docente no existe');
        }

        // Eliminar el docente
        await this.teacherRepository.deleteTeacher(request.teacherId);
    }
}

