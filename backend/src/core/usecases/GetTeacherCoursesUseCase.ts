import { TokenService } from '../infrastructure/TokenService';
import { TeacherRepository } from '../infrastructure/TeacherRepository';
import { CourseRepository } from '../infrastructure/CourseRepository';
import { Course } from '../models/Course';

export interface GetTeacherCoursesRequest {
  token: string;
}

export class GetTeacherCoursesUseCase {
  private tokenService: TokenService;
  private teacherRepository: TeacherRepository;
  private courseRepository: CourseRepository;

  constructor(
    tokenService: TokenService,
    teacherRepository: TeacherRepository,
    courseRepository: CourseRepository
  ) {
    this.tokenService = tokenService;
    this.teacherRepository = teacherRepository;
    this.courseRepository = courseRepository;
  }

  async execute(request: GetTeacherCoursesRequest): Promise<Course[]> {
    if (!request || !request.token) {
      throw new Error('Token no proporcionado');
    }

    const userFromToken = this.tokenService.getUserFromToken(request.token);
    if (!userFromToken) {
      throw new Error('Token inválido');
    }

    if (userFromToken.role !== 'TEACHER') {
      throw new Error('Usuario no autorizado para esta operación');
    }

    const teacher = await this.teacherRepository.findByUserName(userFromToken.username);
    if (!teacher) {
      throw new Error('Profesor no encontrado');
    }

    return this.courseRepository.getCoursesByTeacherId(teacher.id);
  }
}

