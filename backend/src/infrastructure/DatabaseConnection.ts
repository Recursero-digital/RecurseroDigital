import { Pool, PoolClient } from 'pg';
import { databaseConfig } from '../config/database';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool(databaseConfig);

    this.pool.on('error', (err) => {
      console.error('Error inesperado en el cliente PostgreSQL:', err);
    });
  }

  private async waitForDatabase(maxRetries: number = 10, delayMs: number = 2000): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const client = await this.pool.connect();
        await client.query('SELECT 1');
        client.release();
        console.log('Conexión a PostgreSQL establecida');
        return;
      } catch (error) {
        console.log(`Esperando PostgreSQL... (intento ${i + 1}/${maxRetries})`);
        if (i === maxRetries - 1) {
          throw new Error(`No se pudo conectar a PostgreSQL después de ${maxRetries} intentos`);
        }
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  public async query(text: string, params?: any[]): Promise<any> {
    const client = await this.getClient();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }

  public async initializeTables(): Promise<void> {
    try {
      await this.waitForDatabase();

      console.log('Creando tablas en PostgreSQL...');

      await this.query(`
        CREATE TABLE IF NOT EXISTS students (
          id VARCHAR(255) PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          lastname VARCHAR(255) NOT NULL,
          dni VARCHAR(20) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.query(`
        CREATE TABLE IF NOT EXISTS admins (
          id VARCHAR(255) PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'admin',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.query(`
        CREATE TABLE IF NOT EXISTS teachers (
          id VARCHAR(255) PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'teacher',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.query('CREATE INDEX IF NOT EXISTS idx_students_username ON students(username)');
      await this.query('CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username)');
      await this.query('CREATE INDEX IF NOT EXISTS idx_teachers_username ON teachers(username)');

      await this.createDefaultUsers();

      console.log('Tablas inicializadas correctamente en PostgreSQL');
    } catch (error) {
      console.error('Error al inicializar las tablas:', error);
      throw error;
    }
  }

  private async createDefaultUsers(): Promise<void> {
    try {
      console.log('Creando usuarios por defecto...');

      await this.query(`
        INSERT INTO teachers (id, username, password, role) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (username) DO NOTHING
      `, ['default-teacher-1', 'docente@email.com', '$2b$10$Zfjew4nsyIgb/5obd3xeGuLjlp9MtWYfAyYCnlyfVgXk3CRYo2X5K', 'teacher']);

      await this.query(`
        INSERT INTO students (id, username, password_hash, name, lastname, dni) 
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (username) DO NOTHING
      `, ['default-student-1', 'alumno@email.com', '$2b$10$Zfjew4nsyIgb/5obd3xeGuLjlp9MtWYfAyYCnlyfVgXk3CRYo2X5K', 'Alumno', 'Por Defecto', '12345678']);

      await this.query(`
        INSERT INTO admins (id, username, password, role) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (username) DO NOTHING
      `, ['default-admin-1', 'admin@email.com', '$2b$10$Zfjew4nsyIgb/5obd3xeGuLjlp9MtWYfAyYCnlyfVgXk3CRYo2X5K', 'admin']);

      console.log('Usuarios por defecto creados:');
      console.log('   docente / 123456');
      console.log('   alumno / 123456');
      console.log('   admin / 123456');
    } catch (error) {
      console.error('Error al crear usuarios por defecto:', error);
      throw error;
    }
  }
}
