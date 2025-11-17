import { GetCourseStudentsUseCase } from '../../../src/core/usecases/GetCourseStudentsUseCase';
import { MockStudentRepository } from '../../mocks/StudentRepository.mock';
import { MockStudentStatisticsRepository } from '../../mocks/StudentStatisticsRepository.mock';
import { User, UserRole } from '../../../src/core/models/User';
import { StudentStatistics } from '../../../src/core/models/StudentStatistics';
import { StudentEntity } from '../../../src/infrastructure/entities/StudentEntity';

describe('GetCourseStudentsUseCase', () => {
    let useCase: GetCourseStudentsUseCase;
    let mockStudentRepository: MockStudentRepository;
    let mockStatisticsRepository: MockStudentStatisticsRepository;

    beforeEach(() => {
        mockStudentRepository = new MockStudentRepository();
        mockStatisticsRepository = new MockStudentStatisticsRepository();

        useCase = new GetCourseStudentsUseCase(
            mockStudentRepository,
            mockStatisticsRepository
        );
    });

    afterEach(() => {
        mockStudentRepository.clearStudents();
        mockStatisticsRepository.clearStatistics();
    });

    describe('execute', () => {
        it('should return empty students array when course has no students', async () => {
            const result = await useCase.execute({ courseId: 'course-1' });

            expect(result.courseId).toBe('course-1');
            expect(result.students).toEqual([]);
        });

        it('should return student details for single student without statistics', async () => {
            const studentEntity = createStudentEntity('student-1', 'Juan', 'Pérez', 'juan.perez', 'course-1');
            mockStudentRepository.addStudentEntity(studentEntity);

            const result = await useCase.execute({ courseId: 'course-1' });

            expect(result.students).toHaveLength(1);
            expect(result.students[0].id).toBe('student-1');
            expect(result.students[0].name).toBe('Juan');
            expect(result.students[0].lastname).toBe('Pérez');
            expect(result.students[0].userName).toBe('juan.perez');
            expect(result.students[0].totalGamesPlayed).toBe(0);
            expect(result.students[0].averageScore).toBe(0);
            expect(result.students[0].lastActivity).toBeNull();
            expect(result.students[0].progressByGame).toEqual({});
        });

        it('should return student details with aggregated statistics', async () => {
            const studentEntity = createStudentEntity('student-1', 'María', 'García', 'maria.garcia', 'course-1');
            mockStudentRepository.addStudentEntity(studentEntity);

            const statistics = [
                createStatistic('stat-1', 'student-1', 'game-ordenamiento', 100, 10, 10, 30),
                createStatistic('stat-2', 'student-1', 'game-ordenamiento', 80, 8, 10, 25),
                createStatistic('stat-3', 'student-1', 'game-escritura', 90, 9, 10, 20)
            ];

            statistics.forEach(stat => mockStatisticsRepository.addStatistics(stat));

            const result = await useCase.execute({ courseId: 'course-1' });

            expect(result.students).toHaveLength(1);
            const studentDetails = result.students[0];
            
            expect(studentDetails.id).toBe('student-1');
            expect(studentDetails.name).toBe('María');
            expect(studentDetails.lastname).toBe('García');
            expect(studentDetails.userName).toBe('maria.garcia');
            expect(studentDetails.enrollmentDate).toBeTruthy();
            expect(studentDetails.totalGamesPlayed).toBe(2);
            expect(studentDetails.averageScore).toBe(90); // (100 + 80 + 90) / 3
            expect(studentDetails.lastActivity).toBeTruthy();
        });

        it('should normalize game IDs by removing "game-" prefix', async () => {
            const studentEntity = createStudentEntity('student-1', 'Carlos', 'López', 'carlos.lopez', 'course-1');
            mockStudentRepository.addStudentEntity(studentEntity);

            const statistics = [
                createStatistic('stat-1', 'student-1', 'game-ordenamiento', 100, 10, 10, 30),
                createStatistic('stat-2', 'student-1', 'game-escritura', 80, 8, 10, 25)
            ];
            statistics.forEach(stat => mockStatisticsRepository.addStatistics(stat));

            const result = await useCase.execute({ courseId: 'course-1' });

            const progressByGame = result.students[0].progressByGame;
            expect(progressByGame['ordenamiento']).toBeDefined();
            expect(progressByGame['escritura']).toBeDefined();
            expect(progressByGame['game-ordenamiento']).toBeUndefined();
            expect(progressByGame['game-escritura']).toBeUndefined();
        });

        it('should handle multiple students correctly', async () => {
            const student1 = createStudentEntity('student-1', 'Ana', 'Martínez', 'ana.martinez', 'course-1');
            const student2 = createStudentEntity('student-2', 'Luis', 'Rodríguez', 'luis.rodriguez', 'course-1');
            
            mockStudentRepository.addStudentEntity(student1);
            mockStudentRepository.addStudentEntity(student2);
            
            const stats1 = [createStatistic('stat-1', 'student-1', 'game-ordenamiento', 100, 10, 10, 30)];
            const stats2 = [createStatistic('stat-2', 'student-2', 'game-escritura', 80, 8, 10, 25)];

            stats1.forEach(stat => mockStatisticsRepository.addStatistics(stat));
            stats2.forEach(stat => mockStatisticsRepository.addStatistics(stat));

            const result = await useCase.execute({ courseId: 'course-1' });

            expect(result.students).toHaveLength(2);
            expect(result.students[0].name).toBe('Ana');
            expect(result.students[1].name).toBe('Luis');
        });

        it('should calculate progress by game correctly', async () => {
            const studentEntity = createStudentEntity('student-1', 'Elena', 'Torres', 'elena.torres', 'course-1');
            mockStudentRepository.addStudentEntity(studentEntity);

            const statistics = [
                createStatistic('stat-1', 'student-1', 'game-ordenamiento', 100, 10, 10, 30, true),
                createStatistic('stat-2', 'student-1', 'game-ordenamiento', 80, 8, 10, 25, true),
                createStatistic('stat-3', 'student-1', 'game-ordenamiento', 90, 9, 10, 20, false)
            ];
            statistics.forEach(stat => mockStatisticsRepository.addStatistics(stat));

            const result = await useCase.execute({ courseId: 'course-1' });

            const progress = result.students[0].progressByGame['ordenamiento'];
            expect(progress.completed).toBe(2); // Solo 2 completadas
            expect(progress.totalTime).toBe(75); // 30 + 25 + 20
            expect(progress.averageScore).toBe(90); // (100 + 80 + 90) / 3
        });
    });

    describe('integration scenarios', () => {
        it('should handle real-world scenario with mixed statistics', async () => {
            const studentEntity = createStudentEntity('student-1', 'Sofia', 'Hernández', 'sofia.hernandez', 'course-1');
            mockStudentRepository.addStudentEntity(studentEntity);

            const statistics = [
                // Ordenamiento - 2 completadas
                createStatistic('stat-1', 'student-1', 'game-ordenamiento', 100, 10, 10, 30, true),
                createStatistic('stat-2', 'student-1', 'game-ordenamiento', 80, 8, 10, 25, true),
                createStatistic('stat-3', 'student-1', 'game-ordenamiento', 90, 9, 10, 20, false),
                // Escritura - 1 completada
                createStatistic('stat-4', 'student-1', 'game-escritura', 85, 8, 10, 15, true),
                // Descomposición - sin completar
                createStatistic('stat-5', 'student-1', 'game-descomposicion', 70, 7, 10, 40, false)
            ];
            statistics.forEach(stat => mockStatisticsRepository.addStatistics(stat));

            const result = await useCase.execute({ courseId: 'course-1' });

            const studentDetails = result.students[0];
            expect(studentDetails.totalGamesPlayed).toBe(3);
            expect(studentDetails.averageScore).toBe(84); // (100 + 80 + 90 + 80 + 70) / 5 = 84

            expect(studentDetails.progressByGame['ordenamiento'].completed).toBe(2);
            expect(studentDetails.progressByGame['ordenamiento'].totalTime).toBe(75);

            expect(studentDetails.progressByGame['escritura'].completed).toBe(1);
            expect(studentDetails.progressByGame['escritura'].totalTime).toBe(15);

            expect(studentDetails.progressByGame['descomposicion'].completed).toBe(0);
            expect(studentDetails.progressByGame['descomposicion'].totalTime).toBe(40);
        });
    });
});

// Helper functions
function createStudentEntity(
    id: string,
    name: string,
    lastname: string,
    username: string,
    courseId: string
): StudentEntity {
    return new StudentEntity(
        id,
        `user-${id}`,
        username,
        'hashedPassword',
        name,
        lastname,
        '12345678',
        courseId
    );
}

function createStatistic(
    id: string,
    studentId: string,
    gameId: string,
    points: number,
    correctAnswers: number,
    totalQuestions: number,
    completionTime: number,
    isCompleted: boolean = true
): StudentStatistics {
    return new StudentStatistics(
        id,
        studentId,
        gameId,
        1,
        1,
        points,
        points,
        1,
        isCompleted,
        1,
        new Date(),
        new Date(),
        correctAnswers,
        totalQuestions,
        completionTime
    );
}

