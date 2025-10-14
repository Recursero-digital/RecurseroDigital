import request from 'supertest';
import app from '../../src/config/app';

// Mock del DependencyContainer para usar mocks en lugar de PostgreSQL
jest.mock('../../src/config/DependencyContainer', () => {
  const originalModule = jest.requireActual('../../src/config/DependencyContainer');
  const { MockStudentStatisticsRepository } = require('../mocks/StudentStatisticsRepository.mock');
  const { MockIdGenerator } = require('../mocks/IdGenerator.mock');
  
  return {
    ...originalModule,
    DependencyContainer: class MockDependencyContainer extends originalModule.DependencyContainer {
      private mockStatisticsRepository = new MockStudentStatisticsRepository();
      private mockIdGenerator = new MockIdGenerator();

      get statisticsRepository() {
        return this.mockStatisticsRepository;
      }

      get uuidGenerator() {
        return this.mockIdGenerator;
      }

      get saveGameStatisticsUseCase() {
        const { SaveGameStatisticsUseCase } = require('../../src/core/usecases/SaveGameStatisticsUseCase');
        return new SaveGameStatisticsUseCase(
          this.mockStatisticsRepository,
          this.mockIdGenerator
        );
      }

      get getStudentProgressUseCase() {
        const { GetStudentProgressUseCase } = require('../../src/core/usecases/GetStudentProgressUseCase');
        return new GetStudentProgressUseCase(this.mockStatisticsRepository);
      }

      get getGameStatisticsUseCase() {
        const { GetGameStatisticsUseCase } = require('../../src/core/usecases/GetGameStatisticsUseCase');
        return new GetGameStatisticsUseCase(this.mockStatisticsRepository);
      }

      async clearAllData() {
        this.mockStatisticsRepository.clearStatistics();
        this.mockIdGenerator.reset();
      }
    }
  };
});

describe('Statistics Integration Tests', () => {
  beforeEach(async () => {
    // Limpiar datos antes de cada test
    const { DependencyContainer } = await import('../../src/config/DependencyContainer');
    const container = DependencyContainer.getInstance();
    await container.clearAllData();
  });

  describe('POST /api/statistics', () => {
    it('should save game statistics successfully', async () => {
      const statisticsData = {
        studentId: 'student-123',
        gameId: 'game-escritura',
        level: 1,
        activity: 1,
        points: 100,
        attempts: 2,
        correctAnswers: 8,
        totalQuestions: 10,
        completionTime: 120,
        isCompleted: true,
        maxUnlockedLevel: 2,
        sessionStartTime: new Date().toISOString(),
        sessionEndTime: new Date().toISOString()
      };

      const response = await request(app)
        .post('/api/statistics')
        .send(statisticsData)
        .expect(201);

      expect(response.body.message).toBe('Estadísticas guardadas exitosamente');
      expect(response.body.statistics).toBeDefined();
      expect(response.body.statistics.studentId).toBe(statisticsData.studentId);
      expect(response.body.statistics.gameId).toBe(statisticsData.gameId);
      expect(response.body.statistics.level).toBe(statisticsData.level);
      expect(response.body.statistics.points).toBe(statisticsData.points);
    });

    it('should return error when required fields are missing', async () => {
      const incompleteData = {
        studentId: 'student-123',
        gameId: 'game-escritura'
        // Faltan campos obligatorios
      };

      const response = await request(app)
        .post('/api/statistics')
        .send(incompleteData)
        .expect(400);

      expect(response.body.error).toBe('Faltan campos obligatorios');
    });

    it('should return error when values are invalid', async () => {
      const invalidData = {
        studentId: 'student-123',
        gameId: 'game-escritura',
        level: -1, // Nivel inválido
        activity: 1,
        points: 100,
        attempts: 2,
        isCompleted: true
      };

      const response = await request(app)
        .post('/api/statistics')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBe('Valores inválidos en los campos');
    });

    it('should handle optional fields correctly', async () => {
      const minimalData = {
        studentId: 'student-123',
        gameId: 'game-escritura',
        level: 1,
        activity: 1,
        points: 100,
        attempts: 2,
        isCompleted: true
      };

      const response = await request(app)
        .post('/api/statistics')
        .send(minimalData)
        .expect(201);

      expect(response.body.statistics).toBeDefined();
      expect(response.body.statistics.points).toBe(100);
    });
  });

  describe('GET /api/statistics/student/:studentId', () => {
    it('should return student progress for all games', async () => {
      // Primero crear algunas estadísticas
      const statisticsData1 = {
        studentId: 'student-123',
        gameId: 'game-escritura',
        level: 1,
        activity: 1,
        points: 100,
        attempts: 2,
        isCompleted: true
      };

      const statisticsData2 = {
        studentId: 'student-123',
        gameId: 'game-ordenamiento',
        level: 1,
        activity: 1,
        points: 80,
        attempts: 1,
        isCompleted: true
      };

      await request(app)
        .post('/api/statistics')
        .send(statisticsData1);

      await request(app)
        .post('/api/statistics')
        .send(statisticsData2);

      const response = await request(app)
        .get('/api/statistics/student/student-123')
        .expect(200);

      expect(response.body.studentId).toBe('student-123');
      expect(response.body.gameProgress).toHaveLength(2);
      expect(response.body.totalPoints).toBe(180); // 100 + 80
      expect(response.body.totalGamesPlayed).toBe(2);
    });

    it('should return empty progress when student has no statistics', async () => {
      const response = await request(app)
        .get('/api/statistics/student/student-nonexistent')
        .expect(200);

      expect(response.body.studentId).toBe('student-nonexistent');
      expect(response.body.gameProgress).toHaveLength(0);
      expect(response.body.totalPoints).toBe(0);
      expect(response.body.totalGamesPlayed).toBe(0);
    });

    it('should return error when studentId is missing', async () => {
      const response = await request(app)
        .get('/api/statistics/student/')
        .expect(404);
    });
  });

  describe('GET /api/statistics/student/:studentId/game/:gameId', () => {
    it('should return student progress for specific game', async () => {
      // Crear estadísticas para un juego específico
      const statisticsData = {
        studentId: 'student-123',
        gameId: 'game-escritura',
        level: 1,
        activity: 1,
        points: 100,
        attempts: 2,
        isCompleted: true
      };

      await request(app)
        .post('/api/statistics')
        .send(statisticsData);

      const response = await request(app)
        .get('/api/statistics/student/student-123/game/game-escritura')
        .expect(200);

      expect(response.body.studentId).toBe('student-123');
      expect(response.body.gameProgress).toHaveLength(1);
      expect(response.body.gameProgress[0].gameId).toBe('game-escritura');
      expect(response.body.gameProgress[0].totalPoints).toBe(100);
    });

    it('should return empty progress when student has no statistics for specific game', async () => {
      const response = await request(app)
        .get('/api/statistics/student/student-123/game/game-nonexistent')
        .expect(200);

      expect(response.body.studentId).toBe('student-123');
      expect(response.body.gameProgress).toHaveLength(0);
    });
  });

  describe('GET /api/statistics/game/:gameId', () => {
    it('should return game statistics for teachers/admins', async () => {
      // Crear estadísticas de múltiples estudiantes para el mismo juego
      const students = ['student-1', 'student-2', 'student-3'];
      
      for (const studentId of students) {
        const statisticsData = {
          studentId,
          gameId: 'game-escritura',
          level: 1,
          activity: 1,
          points: 100,
          attempts: 2,
          isCompleted: true
        };

        await request(app)
          .post('/api/statistics')
          .send(statisticsData);
      }

      const response = await request(app)
        .get('/api/statistics/game/game-escritura')
        .expect(200);

      expect(response.body.gameId).toBe('game-escritura');
      expect(response.body.totalStudents).toBe(3);
      expect(response.body.studentProgress).toHaveLength(3);
      expect(response.body.averagePoints).toBe(100);
    });

    it('should return empty statistics when game has no data', async () => {
      const response = await request(app)
        .get('/api/statistics/game/game-nonexistent')
        .expect(200);

      expect(response.body.gameId).toBe('game-nonexistent');
      expect(response.body.totalStudents).toBe(0);
      expect(response.body.averagePoints).toBe(0);
      expect(response.body.averageAccuracy).toBe(0);
      expect(response.body.completionRate).toBe(0);
      expect(response.body.studentProgress).toHaveLength(0);
    });

    it('should return error when gameId is missing', async () => {
      const response = await request(app)
        .get('/api/statistics/game/')
        .expect(404);
    });
  });

  describe('Statistics workflow', () => {
    it('should handle complete student journey', async () => {
      const studentId = 'student-journey';
      const gameId = 'game-escritura';

      // 1. Primera actividad
      const activity1 = {
        studentId,
        gameId,
        level: 1,
        activity: 1,
        points: 50,
        attempts: 1,
        correctAnswers: 8,
        totalQuestions: 10,
        completionTime: 60,
        isCompleted: true,
        maxUnlockedLevel: 1
      };

      const response1 = await request(app)
        .post('/api/statistics')
        .send(activity1)
        .expect(201);

      expect(response1.body.statistics.totalPoints).toBe(50);

      // 2. Segunda actividad en el mismo nivel
      const activity2 = {
        studentId,
        gameId,
        level: 1,
        activity: 2,
        points: 75,
        attempts: 2,
        correctAnswers: 9,
        totalQuestions: 10,
        completionTime: 90,
        isCompleted: true,
        maxUnlockedLevel: 1
      };

      const response2 = await request(app)
        .post('/api/statistics')
        .send(activity2)
        .expect(201);

      expect(response2.body.statistics.totalPoints).toBe(125); // 50 + 75

      // 3. Verificar progreso del estudiante
      const progressResponse = await request(app)
        .get(`/api/statistics/student/${studentId}/game/${gameId}`)
        .expect(200);

      expect(progressResponse.body.gameProgress).toHaveLength(1);
      expect(progressResponse.body.gameProgress[0].totalPoints).toBe(125);
      expect(progressResponse.body.gameProgress[0].completionRate).toBe(100);

      // 4. Verificar estadísticas del juego
      const gameStatsResponse = await request(app)
        .get(`/api/statistics/game/${gameId}`)
        .expect(200);

      expect(gameStatsResponse.body.totalStudents).toBe(1);
      expect(gameStatsResponse.body.averagePoints).toBe(125);
      expect(gameStatsResponse.body.completionRate).toBe(100);
    });
  });
});
