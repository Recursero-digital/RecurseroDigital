import { StudentRepository } from '../core/infrastructure/StudentRepository';
import { Student } from '../core/models/Student';
import { DatabaseConnection } from './DatabaseConnection';

export class PostgreSQLStudentRepository implements StudentRepository {
  private db: DatabaseConnection;

  constructor() {
    this.db = DatabaseConnection.getInstance();
  }

  async findByUserName(userName: string): Promise<Student | null> {
    try {
      const result = await this.db.query(
        'SELECT * FROM students WHERE username = $1',
        [userName]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return new Student(
        row.id,
        row.username,
        row.password_hash,
        row.name,
        row.lastname,
        row.dni
      );
    } catch (error) {
      console.error('Error al buscar estudiante por nombre de usuario:', error);
      throw error;
    }
  }

  async addStudent(studentData: Student): Promise<void> {
    try {
      await this.db.query(
        `INSERT INTO students (id, username, password_hash, name, lastname, dni)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          studentData.id,
          studentData.username,
          studentData.passwordHash,
          studentData.name,
          studentData.lastname,
          studentData.dni
        ]
      );
    } catch (error) {
      console.error('Error al agregar estudiante:', error);
      throw error;
    }
  }

  // Métodos adicionales útiles para administración
  async getAllStudents(): Promise<Student[]> {
    try {
      const result = await this.db.query('SELECT * FROM students ORDER BY created_at DESC');
      return result.rows.map((row: any) => new Student(
        row.id,
        row.username,
        row.password_hash,
        row.name,
        row.lastname,
        row.dni
      ));
    } catch (error) {
      console.error('Error al obtener todos los estudiantes:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Student | null> {
    try {
      const result = await this.db.query(
        'SELECT * FROM students WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return new Student(
        row.id,
        row.username,
        row.password_hash,
        row.name,
        row.lastname,
        row.dni
      );
    } catch (error) {
      console.error('Error al buscar estudiante por ID:', error);
      throw error;
    }
  }

  async updateStudent(studentData: Student): Promise<void> {
    try {
      await this.db.query(
        `UPDATE students 
         SET username = $2, password_hash = $3, name = $4, lastname = $5, dni = $6, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [
          studentData.id,
          studentData.username,
          studentData.passwordHash,
          studentData.name,
          studentData.lastname,
          studentData.dni
        ]
      );
    } catch (error) {
      console.error('Error al actualizar estudiante:', error);
      throw error;
    }
  }

  async deleteStudent(id: string): Promise<void> {
    try {
      await this.db.query('DELETE FROM students WHERE id = $1', [id]);
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
      throw error;
    }
  }
}
