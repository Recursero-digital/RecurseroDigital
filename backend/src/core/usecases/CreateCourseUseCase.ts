import { CourseRepository } from '../infrastructure/CourseRepository';
import { IdGenerator } from '../infrastructure/IdGenerator';
import { Course } from '../models/Course';

export interface CreateCourseRequest {
    name: string;
    teacherId?: string;
}

export interface CreateCourseResponse {
    id: string;
    name: string;
    teacherId?: string;
}

export class CreateCourseUseCase {
    private courseRepository: CourseRepository;
    private idGenerator: IdGenerator;

    constructor(
        courseRepository: CourseRepository,
        idGenerator: IdGenerator
    ) {
        this.courseRepository = courseRepository;
        this.idGenerator = idGenerator;
    }

    async execute(request: CreateCourseRequest): Promise<CreateCourseResponse> {
        if (!request.name || request.name.trim() === '') {
            throw new Error('El nombre del curso es requerido');
        }

        const existingCourse = await this.courseRepository.findByCourseName(request.name.trim());
        if (existingCourse) {
            throw new Error('Ya existe un curso con ese nombre');
        }

        const courseId = this.idGenerator.generate();

        const course = new Course(
            courseId,
            request.name.trim(),
            request.teacherId || '',
            [] // Array vacío de estudiantes inicialmente
        );

        await this.courseRepository.addCourse(course);

        return {
            id: courseId,
            name: course.name,
            teacherId: course.teacher_id
        };
    }
}
