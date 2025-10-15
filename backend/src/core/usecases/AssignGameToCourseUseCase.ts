import { CourseRepository } from '../infrastructure/CourseRepository';

export interface AssignGameToCourseRequest {
    courseId: string;
    gameId: string;
}

export class AssignGameToCourseUseCase {
    private courseRepository: CourseRepository;

    constructor(courseRepository: CourseRepository) {
        this.courseRepository = courseRepository;
    }

    async execute(request: AssignGameToCourseRequest): Promise<void> {
        if (!request.courseId || !request.gameId) {
            throw new Error('courseId y gameId son requeridos');
        }
        await this.courseRepository.addGameToCourse(request.courseId, request.gameId);
    }
}


