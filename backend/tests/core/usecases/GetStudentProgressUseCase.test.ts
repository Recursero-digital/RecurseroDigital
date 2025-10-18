import { GetStudentProgressUseCase, GetStudentProgressRequest } from '../../../src/core/usecases/GetStudentProgressUseCase';
import { MockStudentStatisticsRepository } from '../../mocks/StudentStatisticsRepository.mock';
import { StudentStatistics } from '../../../src/core/models/StudentStatistics';

describe('GetStudentProgressUseCase', () => {
  let getStudentProgressUseCase: GetStudentProgressUseCase;
  let mockStatisticsRepository: MockStudentStatisticsRepository;

  beforeEach(() => {
    mockStatisticsRepository = new MockStudentStatisticsRepository();
    getStudentProgressUseCase = new GetStudentProgressUseCase(mockStatisticsRepository);
  });

  afterEach(() => {
    mockStatisticsRepository.clearStatistics();
  });

  const createTestStatistics = () => {
    const stats: StudentStatistics[] = [
      // Estadísticas del estudiante 1 en juego de escritura
      new StudentStatistics(
        'stat-1',
        'student-1',
        'game-escritura',
        1,
        1,
        50,
        50,
        1,
        true,
        2,
        new Date('2024-01-01T10:00:00Z'),
        new Date('2024-01-01T10:05:00Z'),
        8,
        10,
        60
      ),
      new StudentStatistics(
        'stat-2',
        'student-1',
        'game-escritura',
        2,
        1,
        75,
        125,
        2,
        true,
        2,
        new Date('2024-01-01T11:00:00Z'),
        new Date('2024-01-01T11:10:00Z'),
        9,
        10,
        90
      ),
      // Estadísticas del estudiante 1 en juego de ordenamiento
      new StudentStatistics(
        'stat-3',
        'student-1',
        'game-ordenamiento',
        1,
        1,
        60,
        60,
        1,
        true,
        1,
        new Date('2024-01-01T12:00:00Z'),
        new Date('2024-01-01T12:05:00Z'),
        7,
        10,
        120
      ),
      // Estadísticas del estudiante 2 en juego de escritura
      new StudentStatistics(
        'stat-4',
        'student-2',
        'game-escritura',
        1,
        1,
        40,
        40,
        3,
        true,
        1,
        new Date('2024-01-01T13:00:00Z'),
        new Date('2024-01-01T13:15:00Z'),
        6,
        10,
        180
      )
    ];

    stats.forEach(stat => mockStatisticsRepository.addStatistics(stat));
    return stats;
  };

  describe('When execute with specific game', () => {
    it('should return progress for specific student and game', async () => {
      createTestStatistics();
      
      const request: GetStudentProgressRequest = {
        studentId: 'student-1',
        gameId: 'game-escritura'
      };

      const result = await getStudentProgressUseCase.execute(request);

      expect(result.studentId).toBe('student-1');
      expect(result.gameProgress).toHaveLength(1);
      expect(result.gameProgress[0].gameId).toBe('game-escritura');
      expect(result.gameProgress[0].maxUnlockedLevel).toBe(2);
      expect(result.gameProgress[0].totalPoints).toBe(125); // 50 + 75
      expect(result.gameProgress[0].statistics).toHaveLength(2);
    });

    it('should return empty progress when student has no statistics for game', async () => {
      createTestStatistics();
      
      const request: GetStudentProgressRequest = {
        studentId: 'student-1',
        gameId: 'game-descomposicion'
      };

      const result = await getStudentProgressUseCase.execute(request);

      expect(result.studentId).toBe('student-1');
      expect(result.gameProgress).toHaveLength(0);
      expect(result.totalPoints).toBe(0);
      expect(result.totalGamesPlayed).toBe(0);
    });
  });

  describe('When execute for all games', () => {
    it('should return progress for all games of a student', async () => {
      createTestStatistics();
      
      const request: GetStudentProgressRequest = {
        studentId: 'student-1'
      };

      const result = await getStudentProgressUseCase.execute(request);

      expect(result.studentId).toBe('student-1');
      expect(result.gameProgress).toHaveLength(2); // escritura y ordenamiento
      expect(result.totalPoints).toBe(185); // 125 (escritura) + 60 (ordenamiento)
      expect(result.totalGamesPlayed).toBe(2);

      // Verificar progreso por juego
      const escrituraProgress = result.gameProgress.find(gp => gp.gameId === 'game-escritura');
      expect(escrituraProgress).toBeDefined();
      expect(escrituraProgress!.maxUnlockedLevel).toBe(2);
      expect(escrituraProgress!.totalPoints).toBe(125);

      const ordenamientoProgress = result.gameProgress.find(gp => gp.gameId === 'game-ordenamiento');
      expect(ordenamientoProgress).toBeDefined();
      expect(ordenamientoProgress!.maxUnlockedLevel).toBe(1);
      expect(ordenamientoProgress!.totalPoints).toBe(60);
    });

    it('should return empty progress when student has no statistics', async () => {
      createTestStatistics();
      
      const request: GetStudentProgressRequest = {
        studentId: 'student-nonexistent'
      };

      const result = await getStudentProgressUseCase.execute(request);

      expect(result.studentId).toBe('student-nonexistent');
      expect(result.gameProgress).toHaveLength(0);
      expect(result.totalPoints).toBe(0);
      expect(result.totalGamesPlayed).toBe(0);
    });
  });

  describe('Progress calculation', () => {
    it('should calculate completion rate correctly', async () => {
      // Crear estadísticas con diferentes estados de completado
      const stats = [
        new StudentStatistics(
          'stat-1',
          'student-1',
          'game-escritura',
          1,
          1,
          50,
          50,
          1,
          true, // completado
          1,
          new Date(),
          new Date()
        ),
        new StudentStatistics(
          'stat-2',
          'student-1',
          'game-escritura',
          1,
          2,
          60,
          110,
          2,
          true, // completado
          1,
          new Date(),
          new Date()
        ),
        new StudentStatistics(
          'stat-3',
          'student-1',
          'game-escritura',
          2,
          1,
          30,
          140,
          3,
          false, // no completado
          1,
          new Date(),
          new Date()
        )
      ];

      stats.forEach(stat => mockStatisticsRepository.addStatistics(stat));

      const request: GetStudentProgressRequest = {
        studentId: 'student-1',
        gameId: 'game-escritura'
      };

      const result = await getStudentProgressUseCase.execute(request);

      const gameProgress = result.gameProgress[0];
      expect(gameProgress.completionRate).toBeCloseTo(66.67, 1);
    });

    it('should calculate average accuracy correctly', async () => {
      const stats = [
        new StudentStatistics(
          'stat-1',
          'student-1',
          'game-escritura',
          1,
          1,
          50,
          50,
          1,
          true,
          1,
          new Date(),
          new Date(),
          8, // 80% accuracy
          10
        ),
        new StudentStatistics(
          'stat-2',
          'student-1',
          'game-escritura',
          1,
          2,
          60,
          110,
          1,
          true,
          1,
          new Date(),
          new Date(),
          6, // 60% accuracy
          10
        )
      ];

      stats.forEach(stat => mockStatisticsRepository.addStatistics(stat));

      const request: GetStudentProgressRequest = {
        studentId: 'student-1',
        gameId: 'game-escritura'
      };

      const result = await getStudentProgressUseCase.execute(request);

      const gameProgress = result.gameProgress[0];
      expect(gameProgress.averageAccuracy).toBe(70); // (80 + 60) / 2
    });

    it('should find latest activity correctly', async () => {
      const baseDate = new Date('2024-01-01T10:00:00Z');
      const stats = [
        new StudentStatistics(
          'stat-1',
          'student-1',
          'game-escritura',
          1,
          1,
          50,
          50,
          1,
          true,
          1,
          new Date(baseDate.getTime()),
          new Date(baseDate.getTime() + 5000)
        ),
        new StudentStatistics(
          'stat-2',
          'student-1',
          'game-escritura',
          1,
          2,
          60,
          110,
          1,
          true,
          1,
          new Date(baseDate.getTime() + 60000), // 1 minuto después
          new Date(baseDate.getTime() + 70000)
        )
      ];

      stats.forEach(stat => mockStatisticsRepository.addStatistics(stat));

      const request: GetStudentProgressRequest = {
        studentId: 'student-1',
        gameId: 'game-escritura'
      };

      const result = await getStudentProgressUseCase.execute(request);

      const gameProgress = result.gameProgress[0];
      expect(gameProgress.lastActivity).toEqual(new Date(baseDate.getTime() + 60000));
    });
  });

  describe('Edge cases', () => {
    it('should handle statistics with no questions correctly', async () => {
      const stats = [
        new StudentStatistics(
          'stat-1',
          'student-1',
          'game-escritura',
          1,
          1,
          50,
          50,
          1,
          true,
          1,
          new Date(),
          new Date()
        )
      ];

      stats.forEach(stat => mockStatisticsRepository.addStatistics(stat));

      const request: GetStudentProgressRequest = {
        studentId: 'student-1',
        gameId: 'game-escritura'
      };

      const result = await getStudentProgressUseCase.execute(request);

      const gameProgress = result.gameProgress[0];
      expect(gameProgress.averageAccuracy).toBe(0); // Sin preguntas, accuracy = 0
    });

    it('should handle single activity correctly', async () => {
      const stats = [
        new StudentStatistics(
          'stat-1',
          'student-1',
          'game-escritura',
          1,
          1,
          100,
          100,
          1,
          true,
          1,
          new Date(),
          new Date()
        )
      ];

      stats.forEach(stat => mockStatisticsRepository.addStatistics(stat));

      const request: GetStudentProgressRequest = {
        studentId: 'student-1',
        gameId: 'game-escritura'
      };

      const result = await getStudentProgressUseCase.execute(request);

      expect(result.gameProgress).toHaveLength(1);
      expect(result.gameProgress[0].completionRate).toBe(100);
      expect(result.gameProgress[0].totalPoints).toBe(100);
    });
  });
});
