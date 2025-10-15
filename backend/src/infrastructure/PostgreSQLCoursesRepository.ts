import { CourseRepository } from '../core/infrastructure/CourseRepository';
import{Course} from "@/core/models/Course";
import { CourseGame } from '../core/models/CourseGame';
import { Game } from '../core/models/Game';
import { DatabaseConnection } from './DatabaseConnection';

export class PostgreSQLCourseRepository implements CourseRepository {
  private db: DatabaseConnection;

  constructor() {
    this.db = DatabaseConnection.getInstance();
  }

  async findByCourseName(courseName: string): Promise<Course | null> {
    try {
      const result = await this.db.query(
        'SELECT * FROM courses WHERE name = $1',
        [courseName]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
          teacher_id: row.teacher_id,
          students: row.students
      };
    } catch (error) {
      console.error('Error al buscar el curso por el nombre de curso:', error);
      throw error;
    }
  }

  async addCourse(course: Course): Promise<void> {
    try {
      await this.db.query(
        `INSERT INTO courses (id, name, teacher_id, students)
         VALUES ($1, $2, $3, $4)`,
        [course.id, course.name, course.teacher_id, course.students]
      );
    } catch (error) {
      console.error('Error al agregar curso:', error);
      throw error;
    }
  }

  async getAllCourses(): Promise<Course[]> {
    try {
      const result = await this.db.query('SELECT * FROM courses ORDER BY created_at DESC');
      return result.rows.map((row: any) => ({
        id: row.id,
          name: row.name,
          teacher_id: row.teacher_id,
          students: row.students
      }));
    } catch (error) {
      console.error('Error al obtener todos los cursos:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Course | null> {
    try {
      const result = await this.db.query(
        'SELECT * FROM courses WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
          name: row.name,
          teacher_id: row.teacher_id,
          students: row.students
      };
    } catch (error) {
      console.error('Error al buscar el curso por ID:', error);
      throw error;
    }
  }

  async updateCourse(course: Course): Promise<void> {
    try {
      await this.db.query(
        `UPDATE courses 
         SET name = $2, teacher_id = $3, students = $4, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [course.id, course.name, course.teacher_id, course.students]
      );
    } catch (error) {
      console.error('Error al actualizar el curso:', error);
      throw error;
    }
  }

  async deleteCourse(id: string): Promise<void> {
    try {
      await this.db.query('DELETE FROM courses WHERE id = $1', [id]);
    } catch (error) {
      console.error('Error al eliminar curso:', error);
      throw error;
    }
  }

  async getEnabledGamesByCourseId(courseId: string): Promise<CourseGame[]> {
    try {
      const result = await this.db.query(
        `SELECT 
           cg.id,
           cg.course_id,
           cg.game_id,
           cg.is_enabled,
           cg.order_index,
           cg.created_at,
           cg.updated_at,
           g.name as game_name,
           g.description as game_description,
           g.image_url as game_image_url,
           g.route as game_route,
           g.difficulty_level as game_difficulty_level,
           g.is_active as game_is_active,
           g.created_at as game_created_at,
           g.updated_at as game_updated_at
         FROM courses_games cg
         JOIN games g ON cg.game_id = g.id
         WHERE cg.course_id = $1 
           AND cg.is_enabled = true 
           AND g.is_active = true
         ORDER BY cg.order_index ASC`,
        [courseId]
      );

      return result.rows.map((row: any) => {
        const game = new Game(
          row.game_id,
          row.game_name,
          row.game_description,
          row.game_image_url,
          row.game_route,
          row.game_difficulty_level,
          row.game_is_active,
          row.game_created_at,
          row.game_updated_at
        );

        return new CourseGame(
          row.id,
          row.course_id,
          row.game_id,
          row.is_enabled,
          row.order_index,
          game,
          row.created_at,
          row.updated_at
        );
      });
    } catch (error) {
      console.error('Error al obtener juegos habilitados del curso:', error);
      throw error;
    }
  }


  async addGameToCourse(courseId: string, gameId: string): Promise<void> {
    try {
      await this.db.query(
        `INSERT INTO courses_games (id, course_id, game_id, is_enabled, order_index)
         VALUES (
           gen_random_uuid(),
           $1,
           $2,
           true,
           COALESCE((SELECT MAX(order_index) + 1 FROM courses_games WHERE course_id = $1), 0)
         )
         ON CONFLICT (course_id, game_id)
         DO UPDATE SET is_enabled = EXCLUDED.is_enabled, updated_at = CURRENT_TIMESTAMP`,
        [courseId, gameId]
      );
    } catch (error) {
      console.error('Error al agregar juego al curso:', error);
      throw error;
    }
  }

  async createCourse(name: string, teacherId?: string): Promise<Course> {
    try {
      //ID para el curso
      const courseId = `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await this.db.query(
        `INSERT INTO courses (id, name, teacher_id, created_at, updated_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [courseId, name, teacherId || null]
      );

      return new Course(courseId, name, teacherId || '', []);
    } catch (error) {
      console.error('Error al crear curso:', error);
      throw error;
    }
  }
}
