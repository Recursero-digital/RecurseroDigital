import { CourseRepository } from '../infrastructure/CourseRepository';
import { StudentRepository } from '../infrastructure/StudentRepository';
import { StudentStatisticsRepository } from '../infrastructure/StudentStatisticsRepository';
import { CourseInvalidRequestError } from '../models/exceptions/CourseInvalidRequestError';
import { CourseNotFoundError } from '../models/exceptions/CourseNotFoundError';

export interface GetCourseStudentsRequest {
  courseId: string;
}

export interface CourseStudentProgress {
  id: string;
  name: string;
  lastname: string;
  userName: string;
  enrollmentDate: string;
  totalGamesPlayed: number;
  averageScore: number;
  lastActivity: string | null;
  progressByGame: Record<
    string,
    {
      completed: number;
      totalTime: number;
      averageScore: number;
    }
  >;
}

export interface GetCourseStudentsResponse {
  courseId: string;
  students: CourseStudentProgress[];
}

export class GetCourseStudentsUseCase {
  private readonly courseRepository: CourseRepository;
  private readonly studentRepository: StudentRepository;
  private readonly statisticsRepository: StudentStatisticsRepository;

  constructor(
    courseRepository: CourseRepository,
    studentRepository: StudentRepository,
    statisticsRepository: StudentStatisticsRepository
  ) {
    this.courseRepository = courseRepository;
    this.studentRepository = studentRepository;
    this.statisticsRepository = statisticsRepository;
  }

  async execute(request: GetCourseStudentsRequest): Promise<GetCourseStudentsResponse> {
    if (!request || !request.courseId || request.courseId.trim() === '') {
      throw new CourseInvalidRequestError('courseId es requerido');
    }

    const course = await this.courseRepository.findById(request.courseId);
    if (!course) {
      throw new CourseNotFoundError();
    }

    const students = await this.studentRepository.getStudentsByCourse(request.courseId);

    const studentsWithProgress = await Promise.all(
      students.map(async (student) => {
        const statistics = await this.statisticsRepository.findByStudent(student.id);

        const progressAccumulator: Record<
          string,
          {
            completed: number;
            totalTime: number;
            scoreSum: number;
            scoreCount: number;
          }
        > = {};

        let totalScoreSum = 0;
        let totalScoreCount = 0;
        let latestActivity: Date | null = null;

        statistics.forEach((stat) => {
          const gameId = stat.gameId;
          if (!progressAccumulator[gameId]) {
            progressAccumulator[gameId] = {
              completed: 0,
              totalTime: 0,
              scoreSum: 0,
              scoreCount: 0
            };
          }

          const entry = progressAccumulator[gameId];
          entry.completed += stat.isCompleted ? 1 : 0;
          entry.totalTime += stat.completionTime ?? 0;

          const hasQuestions = (stat.totalQuestions ?? 0) > 0;
          const accuracy = hasQuestions
            ? ((stat.correctAnswers ?? 0) / (stat.totalQuestions ?? 1)) * 100
            : 0;

          if (hasQuestions) {
            entry.scoreSum += accuracy;
            entry.scoreCount += 1;
            totalScoreSum += accuracy;
            totalScoreCount += 1;
          }

          if (!latestActivity || stat.createdAt > latestActivity) {
            latestActivity = stat.createdAt;
          }
        });

        const progressByGame = Object.entries(progressAccumulator).reduce<
          CourseStudentProgress['progressByGame']
        >((acc, [gameId, data]) => {
          const averageScore =
            data.scoreCount > 0 ? Math.round(data.scoreSum / data.scoreCount) : 0;
          acc[gameId] = {
            completed: data.completed,
            totalTime: data.totalTime,
            averageScore
          };
          return acc;
        }, {});

        const averageScore =
          totalScoreCount > 0 ? Math.round(totalScoreSum / totalScoreCount) : 0;

        const lastActivity = null; //Ver esto

        return {
          id: student.id,
          name: student.name,
          lastname: student.lastname,
          userName: student.getUsername(),
          enrollmentDate: student.createdAt.toISOString(),
          totalGamesPlayed: statistics.length,
          averageScore,
          lastActivity,
          progressByGame
        };
      })
    );

    return {
      courseId: request.courseId,
      students: studentsWithProgress
    };
  }
}

