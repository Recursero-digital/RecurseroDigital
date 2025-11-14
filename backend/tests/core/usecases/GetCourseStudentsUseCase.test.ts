import { GetCourseStudentsUseCase } from '../../../src/core/usecases/GetCourseStudentsUseCase';
import { InMemoryCourseRepository } from '../../../src/infrastructure/InMemoryCourseRepository';
import { MockStudentRepository } from '../../mocks/StudentRepository.mock';
import { MockStudentStatisticsRepository } from '../../mocks/StudentStatisticsRepository.mock';
import { Course } from '../../../src/core/models/Course';
import { StudentEntity } from '../../../src/infrastructure/entities/StudentEntity';
import { CourseInvalidRequestError } from '../../../src/core/models/exceptions/CourseInvalidRequestError';
import { CourseNotFoundError } from '../../../src/core/models/exceptions/CourseNotFoundError';
import { StudentStatistics } from '../../../src/core/models/StudentStatistics';

describe('GetCourseStudentsUseCase', () => {
  const courseId = 'course-1';
  let courseRepository: InMemoryCourseRepository;
  let studentRepository: MockStudentRepository;
  let statisticsRepository: MockStudentStatisticsRepository;
  let useCase: GetCourseStudentsUseCase;

  beforeEach(() => {
    courseRepository = new InMemoryCourseRepository();
    studentRepository = new MockStudentRepository();
    statisticsRepository = new MockStudentStatisticsRepository();
    useCase = new GetCourseStudentsUseCase(
      courseRepository,
      studentRepository,
      statisticsRepository
    );
  });

  it('debería devolver los estudiantes del curso con su progreso agregado', async () => {
    const enrollmentDate = new Date('2024-01-15T00:00:00Z');
    const updatedDate = new Date('2024-01-16T00:00:00Z');

    await courseRepository.addCourse(new Course(courseId, 'Curso A', 'teacher-1', []));

    const studentA = new StudentEntity(
      'student-1',
      'user-1',
      'ana.garcia',
      'hash',
      'Ana',
      'García',
      '12345678',
      courseId,
      enrollmentDate,
      updatedDate
    );

    const studentB = new StudentEntity(
      'student-2',
      'user-2',
      'carlos.lopez',
      'hash',
      'Carlos',
      'López',
      '87654321',
      courseId,
      enrollmentDate,
      updatedDate
    );

    studentRepository = new MockStudentRepository([studentA, studentB]);
    useCase = new GetCourseStudentsUseCase(
      courseRepository,
      studentRepository,
      statisticsRepository
    );

    const statCreatedAt = new Date('2024-02-01T10:00:00Z');
    const statCreatedAt2 = new Date('2024-02-05T12:00:00Z');

    statisticsRepository = new MockStudentStatisticsRepository([
      new StudentStatistics(
        'stat-1',
        'student-1',
        'ordenamiento',
        1,
        1,
        100,
        100,
        1,
        true,
        1,
        statCreatedAt,
        statCreatedAt,
        9,
        10,
        120
      ),
      new StudentStatistics(
        'stat-2',
        'student-1',
        'escritura',
        1,
        1,
        80,
        80,
        1,
        false,
        1,
        statCreatedAt2,
        statCreatedAt2,
        7,
        10,
        200
      )
    ]);

    useCase = new GetCourseStudentsUseCase(
      courseRepository,
      studentRepository,
      statisticsRepository
    );

    const result = await useCase.execute({ courseId });

    expect(result.courseId).toBe(courseId);
    expect(result.students).toHaveLength(2);

    const firstStudent = result.students.find((student) => student.id === 'student-1');
    const secondStudent = result.students.find((student) => student.id === 'student-2');

    expect(firstStudent).toBeDefined();
    expect(firstStudent?.userName).toBe('ana.garcia');
    expect(firstStudent?.totalGamesPlayed).toBe(2);
    expect(firstStudent?.lastActivity).toBe(statCreatedAt2.toISOString());
    expect(firstStudent?.averageScore).toBe(80); // (90% + 70%) / 2 = 80
    expect(firstStudent?.progressByGame).toEqual({
      ordenamiento: {
        completed: 1,
        totalTime: 120,
        averageScore: 90
      },
      escritura: {
        completed: 0,
        totalTime: 200,
        averageScore: 70
      }
    });

    expect(secondStudent).toBeDefined();
    expect(secondStudent?.totalGamesPlayed).toBe(0);
    expect(secondStudent?.averageScore).toBe(0);
    expect(secondStudent?.lastActivity).toBeNull();
    expect(secondStudent?.progressByGame).toEqual({});
  });

  it('debería lanzar un error si no se envía courseId', async () => {
    await expect(useCase.execute({ courseId: '' })).rejects.toThrow(
      CourseInvalidRequestError
    );
  });

  it('debería lanzar un error si el curso no existe', async () => {
    await expect(useCase.execute({ courseId })).rejects.toThrow(CourseNotFoundError);
  });
});


