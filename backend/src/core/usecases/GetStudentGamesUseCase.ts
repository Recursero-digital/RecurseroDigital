import { TokenService } from '../infrastructure/TokenService';
import { StudentRepository } from '../infrastructure/StudentRepository';
import { CourseRepository } from '../infrastructure/CourseRepository';
import { CourseGame } from '../models/CourseGame';

export interface GetStudentGamesRequest {
    token: string;
}

export interface StudentGamesResponse {
    studentId: string;
    courseId: string | null;
    games: CourseGame[];
}

export class GetStudentGamesUseCase {
    private tokenService: TokenService;
    private studentRepository: StudentRepository;
    private courseRepository: CourseRepository;

    constructor(
        tokenService: TokenService,
        studentRepository: StudentRepository,
        courseRepository: CourseRepository
    ) {
        this.tokenService = tokenService;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    async execute(request: GetStudentGamesRequest): Promise<StudentGamesResponse> {
        const userFromToken = this.tokenService.getUserFromToken(request.token);
        if (!userFromToken) {
            throw new Error('Token inválido');
        }

        if (userFromToken.role !== 'student') {
            throw new Error('Usuario no autorizado para esta operación');
        }

        const student = await this.studentRepository.findByUserName(userFromToken.username);
        if (!student) {
            throw new Error('Estudiante no encontrado');
        }

        const courseId = student.getCourseId();
        if (!courseId) {
            return {
                studentId: student.id,
                courseId: null,
                games: []
            };
        }

        const enabledGames = await this.courseRepository.getEnabledGamesByCourseId(courseId);

        return {
            studentId: student.id,
            courseId: courseId,
            games: enabledGames
        };
    }
}
