import { Pool, PoolClient } from 'pg';
import { databaseConfig } from '../config/database';
import { spawn } from 'child_process';
import path from 'path';

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

  private async runMigrations(): Promise<void> {
    return new Promise((resolve, reject) => {
      const databaseUrl = `postgresql://${databaseConfig.user}:${databaseConfig.password}@${databaseConfig.host}:${databaseConfig.port}/${databaseConfig.database}`;
      
      const migrateProcess = spawn('npx', [
        'node-pg-migrate',
        'up',
        '-m',
        path.join(__dirname, '../../migrations'),
        '--database-url-var',
        'DATABASE_URL'
      ], {
        env: { ...process.env, DATABASE_URL: databaseUrl },
        shell: true
      });

      let output = '';
      migrateProcess.stdout?.on('data', (data) => {
        output += data.toString();
        console.log(data.toString());
      });

      migrateProcess.stderr?.on('data', (data) => {
        output += data.toString();
        console.error(data.toString());
      });

      migrateProcess.on('close', (code) => {
        if (code === 0) {
          console.log('Migraciones ejecutadas correctamente');
          resolve();
        } else {
          reject(new Error(`Error al ejecutar migraciones. Código: ${code}\n${output}`));
        }
      });
    });
  }

  public async initializeTables(): Promise<void> {
    try {
      await this.waitForDatabase();

      console.log('Ejecutando migraciones...');
      await this.runMigrations();

      console.log('Creando datos por defecto...');
      await this.createDefaultUsers();
      await this.createDefaultCourses();

      console.log('Tablas inicializadas correctamente en PostgreSQL');
    } catch (error) {
      console.error('Error al inicializar las tablas:', error);
      throw error;
    }
  }

  private async createDefaultUsers(): Promise<void> {
    try {
      console.log('Creando usuarios por defecto...');

      const existingUsers = await this.query('SELECT COUNT(*) as count FROM users');
      
      if (existingUsers.rows[0].count > 0) {
        console.log('Usuarios por defecto ya existen, omitiendo creación...');
        return;
      }

      await this.query(`
        INSERT INTO users (id, username, password_hash, role) 
        VALUES ($1, $2, $3, $4)
      `, ['default-user-teacher-1', 'docente@email.com', '$2b$10$Zfjew4nsyIgb/5obd3xeGuLjlp9MtWYfAyYCnlyfVgXk3CRYo2X5K', 'TEACHER']);

      await this.query(`
        INSERT INTO teachers (id, user_id, name, surname, email) 
        VALUES ($1, $2, $3, $4, $5)
      `, ['default-teacher-1', 'default-user-teacher-1', 'Docente', 'Por Defecto', 'docente@email.com']);

      await this.query(`
        INSERT INTO users (id, username, password_hash, role) 
        VALUES ($1, $2, $3, $4)
      `, ['default-user-student-1', 'alumno@email.com', '$2b$10$Zfjew4nsyIgb/5obd3xeGuLjlp9MtWYfAyYCnlyfVgXk3CRYo2X5K', 'STUDENT']);

      await this.query(`
        INSERT INTO students (id, user_id, name, lastname, dni) 
        VALUES ($1, $2, $3, $4, $5)
      `, ['default-student-1', 'default-user-student-1', 'Alumno', 'Por Defecto', '12345678']);

      await this.query(`
        INSERT INTO users (id, username, password_hash, role) 
        VALUES ($1, $2, $3, $4)
      `, ['default-user-admin-1', 'admin@email.com', '$2b$10$Zfjew4nsyIgb/5obd3xeGuLjlp9MtWYfAyYCnlyfVgXk3CRYo2X5K', 'ADMIN']);

      await this.query(`
        INSERT INTO admins (id, user_id, nivel_acceso, permisos) 
        VALUES ($1, $2, $3, $4)
      `, ['default-admin-1', 'default-user-admin-1', 1, '{all}']);

      console.log('Usuarios por defecto creados:');
      console.log('   docente@email.com / 123456');
      console.log('   alumno@email.com / 123456');
      console.log('   admin@email.com / 123456');
    } catch (error) {
      console.error('Error al crear usuarios por defecto:', error);
      throw error;
    }
  }

    private async createDefaultCourses(): Promise<void> {
        try {
            console.log('Creando cursos por defecto...');

            const existingCourses = await this.query('SELECT COUNT(*) as count FROM courses');
            
            if (existingCourses.rows[0].count > 0) {
                console.log('Cursos por defecto ya existen, omitiendo creación...');
                return;
            }

            await this.query(`
                INSERT INTO courses (id, name, teacher_id) 
                VALUES ($1, $2, $3)
            `, ['default-course-1', 'Curso A', 'default-teacher-1']);

            await this.query(`
                UPDATE students
                SET course_id = $1
                WHERE id = $2
            `, ['default-course-1', 'default-student-1']);

            console.log('Cursos por defecto creados:');
        } catch (error) {
            console.error('Error al crear cursos por defecto:', error);
            throw error;
        }
    }




}
