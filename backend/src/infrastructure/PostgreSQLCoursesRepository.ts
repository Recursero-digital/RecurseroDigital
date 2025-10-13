import { CourseRepository } from '../core/infrastructure/CourseRepository';
import{Course} from "@/core/models/Course";
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
}
