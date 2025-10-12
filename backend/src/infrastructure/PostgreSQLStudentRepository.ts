import { StudentRepository } from '../core/infrastructure/StudentRepository';
import { Student } from '../core/models/Student';
import { User, UserRole } from '../core/models/User';
import { DatabaseConnection } from './DatabaseConnection';

export class PostgreSQLStudentRepository implements StudentRepository {
  private db: DatabaseConnection;

  constructor() {
    this.db = DatabaseConnection.getInstance();
  }

  async findByUserName(userName: string): Promise<Student | null> {
    try {
      const result = await this.db.query(
        `SELECT s.*, u.username, u.password_hash, u.role 
         FROM students s 
         JOIN users u ON s.user_id = u.id 
         WHERE u.username = $1`,
        [userName]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      const user = new User(row.username, row.username, row.password_hash, row.role as UserRole);
      return new Student(
        row.id,
        row.name,
        row.lastname,
        row.dni,
        user
      );
    } catch (error) {
      console.error('Error al buscar estudiante por nombre de usuario:', error);
      throw error;
    }
  }

  async addStudent(studentData: Student): Promise<void> {
    try {
      // Primero insertar el usuario
      await this.db.query(
        `INSERT INTO users (id, username, password_hash, role)
         VALUES ($1, $2, $3, $4)`,
        [
          studentData.user.id,
          studentData.user.username,
          studentData.user.passwordHash,
          studentData.user.role
        ]
      );

      // Luego insertar el estudiante
      await this.db.query(
        `INSERT INTO students (id, user_id, name, lastname, dni)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          studentData.id,
          studentData.user.id,
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
      const result = await this.db.query(
        `SELECT s.*, u.username, u.password_hash, u.role 
         FROM students s 
         JOIN users u ON s.user_id = u.id 
         ORDER BY s.created_at DESC`
      );
      return result.rows.map((row: any) => {
        const user = new User(row.username, row.username, row.password_hash, row.role);
        return new Student(
          row.id,
          row.name,
          row.lastname,
          row.dni,
          user
        );
      });
    } catch (error) {
      console.error('Error al obtener todos los estudiantes:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Student | null> {
    try {
      const result = await this.db.query(
        `SELECT s.*, u.username, u.password_hash, u.role 
         FROM students s 
         JOIN users u ON s.user_id = u.id 
         WHERE s.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      const user = new User(row.username, row.username, row.password_hash, row.role as UserRole);
      return new Student(
        row.id,
        row.name,
        row.lastname,
        row.dni,
        user
      );
    } catch (error) {
      console.error('Error al buscar estudiante por ID:', error);
      throw error;
    }
  }

  async updateStudent(studentData: Student): Promise<void> {
    try {
      await this.db.query(
        `UPDATE users 
         SET username = $2, password_hash = $3, role = $4, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [
          studentData.user.id,
          studentData.user.username,
          studentData.user.passwordHash,
          studentData.user.role
        ]
      );

      await this.db.query(
        `UPDATE students 
         SET name = $2, lastname = $3, dni = $4, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [
          studentData.id,
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
      const student = await this.findById(id);
      if (!student) {
        throw new Error('Estudiante no encontrado');
      }

      await this.db.query('DELETE FROM students WHERE id = $1', [id]);
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
      throw error;
    }
  }
}
