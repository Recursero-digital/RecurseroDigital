import { AdminRepository, User } from '../core/infrastructure/AdminRepository';
import { DatabaseConnection } from './DatabaseConnection';

export class PostgreSQLAdminRepository implements AdminRepository {
  private db: DatabaseConnection;

  constructor() {
    this.db = DatabaseConnection.getInstance();
  }

  async findByUserName(userName: string): Promise<User | null> {
    try {
      const result = await this.db.query(
        'SELECT * FROM admins WHERE username = $1',
        [userName]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        username: row.username,
        password: row.password,
        role: row.role
      };
    } catch (error) {
      console.error('Error al buscar administrador por nombre de usuario:', error);
      throw error;
    }
  }

  async addUser(user: User): Promise<void> {
    try {
      await this.db.query(
        `INSERT INTO admins (id, username, password, role)
         VALUES ($1, $2, $3, $4)`,
        [user.id, user.username, user.password, user.role]
      );
    } catch (error) {
      console.error('Error al agregar administrador:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const result = await this.db.query('SELECT * FROM admins ORDER BY created_at DESC');
      return result.rows.map((row: any) => ({
        id: row.id,
        username: row.username,
        password: row.password,
        role: row.role
      }));
    } catch (error) {
      console.error('Error al obtener todos los administradores:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const result = await this.db.query(
        'SELECT * FROM admins WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        username: row.username,
        password: row.password,
        role: row.role
      };
    } catch (error) {
      console.error('Error al buscar administrador por ID:', error);
      throw error;
    }
  }

  async updateUser(user: User): Promise<void> {
    try {
      await this.db.query(
        `UPDATE admins 
         SET username = $2, password = $3, role = $4, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [user.id, user.username, user.password, user.role]
      );
    } catch (error) {
      console.error('Error al actualizar administrador:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.db.query('DELETE FROM admins WHERE id = $1', [id]);
    } catch (error) {
      console.error('Error al eliminar administrador:', error);
      throw error;
    }
  }
}
