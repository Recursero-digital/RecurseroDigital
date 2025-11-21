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
        // Baja lógica: deshabilitar el docente (enable = false)
        // El repositorio verifica la existencia antes de deshabilitar
        await this.teacherRepository.deleteTeacher(request.teacherId);
    }
}

