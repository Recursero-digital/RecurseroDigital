import { StudentRepository } from '../infrastructure/StudentRepository';
import { StudentStatisticsRepository } from '../infrastructure/StudentStatisticsRepository';
import { StudentStatisticsAggregator } from '../services/StudentStatisticsAggregator';

interface StudentDetails {
    id: string;
    name: string;
    lastname: string;
    userName: string;
    enrollmentDate: string | null;
    totalGamesPlayed: number;
    averageScore: number;
    lastActivity: string | null;
    progressByGame: Record<string, {
        completed: number;
        totalTime: number;
        averageScore: number;
    }>;
}

interface GetCourseStudentsRequest {
    courseId: string;
}

interface GetCourseStudentsResponse {
    courseId: string;
    students: StudentDetails[];
}

export class GetCourseStudentsUseCase {
    private statisticsAggregator: StudentStatisticsAggregator;

    constructor(
        private studentRepository: StudentRepository,
        private statisticsRepository: StudentStatisticsRepository
    ) {
        this.statisticsAggregator = new StudentStatisticsAggregator();
    }

    async execute(request: GetCourseStudentsRequest): Promise<GetCourseStudentsResponse> {
        const { courseId } = request;

        const courseStudents = await this.studentRepository.getStudentsByCourseId(courseId);

        const studentsWithDetails = await Promise.all(
            courseStudents.map(student => this.buildStudentDetails(student))
        );

        return {
            courseId,
            students: studentsWithDetails
        };
    }

    private async buildStudentDetails(student: any): Promise<StudentDetails> {
        const enrollmentDate = await this.getFormattedEnrollmentDate(student.id);
        const statistics = await this.statisticsRepository.findByStudent(student.id);
        const aggregatedStats = this.statisticsAggregator.aggregate(statistics);

        return {
            id: student.id,
            name: student.name,
            lastname: student.lastname,
            userName: student.getUsername(),
            enrollmentDate,
            ...aggregatedStats
        };
    }

    private async getFormattedEnrollmentDate(studentId: string): Promise<string | null> {
        const enrollmentDate = await this.studentRepository.getEnrollmentDate(studentId);
        return enrollmentDate ? enrollmentDate.toISOString().split('T')[0] : null;
    }
}

