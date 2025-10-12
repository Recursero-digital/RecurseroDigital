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
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(255) PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.query('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)');
      await this.query('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');

      await this.query(`
        CREATE TABLE IF NOT EXISTS students (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          lastname VARCHAR(255) NOT NULL,
          dni VARCHAR(20) UNIQUE NOT NULL,
          course_id VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.query('CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id)');
      await this.query('CREATE INDEX IF NOT EXISTS idx_students_dni ON students(dni)');

      await this.query(`
        CREATE TABLE IF NOT EXISTS teachers (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          surname VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.query('CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON teachers(user_id)');
      await this.query('CREATE INDEX IF NOT EXISTS idx_teachers_email ON teachers(email)');

      await this.query(`
        CREATE TABLE IF NOT EXISTS admins (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          nivel_acceso INTEGER NOT NULL DEFAULT 1,
          permisos TEXT[] DEFAULT '{}',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.query('CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id)');

      await this.query(`
        CREATE TABLE IF NOT EXISTS courses (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL,
          teacher_id VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.query('CREATE INDEX IF NOT EXISTS idx_courses_name ON courses(name)');
      await this.query('CREATE INDEX IF NOT EXISTS idx_courses_teacher_id ON courses(teacher_id)');


      await this.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'fk_students_user'
          ) THEN
            ALTER TABLE students
            ADD CONSTRAINT fk_students_user
            FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE;
          END IF;
        END $$;
      `);

      await this.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'fk_teachers_user'
          ) THEN
            ALTER TABLE teachers
            ADD CONSTRAINT fk_teachers_user
            FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE;
          END IF;
        END $$;
      `);

      await this.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'fk_admins_user'
          ) THEN
            ALTER TABLE admins
            ADD CONSTRAINT fk_admins_user
            FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE;
          END IF;
        END $$;
      `);

      await this.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'fk_courses_teacher'
          ) THEN
            ALTER TABLE courses
            ADD CONSTRAINT fk_courses_teacher
            FOREIGN KEY (teacher_id)
            REFERENCES teachers(id)
            ON DELETE SET NULL;
          END IF;
        END $$;
      `);

      await this.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'fk_students_course'
          ) THEN
            ALTER TABLE students
            ADD CONSTRAINT fk_students_course
            FOREIGN KEY (course_id)
            REFERENCES courses(id)
            ON DELETE SET NULL;
          END IF;
        END $$;
      `);

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

      await this.query(`
        INSERT INTO users (id, username, password_hash, role) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (username) DO NOTHING
      `, ['default-user-teacher-1', 'docente@email.com', '$2b$10$Zfjew4nsyIgb/5obd3xeGuLjlp9MtWYfAyYCnlyfVgXk3CRYo2X5K', 'TEACHER']);

      await this.query(`
        INSERT INTO teachers (id, user_id, name, surname, email) 
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO NOTHING
      `, ['default-teacher-1', 'default-user-teacher-1', 'Docente', 'Por Defecto', 'docente@email.com']);

      await this.query(`
        INSERT INTO users (id, username, password_hash, role) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (username) DO NOTHING
      `, ['default-user-student-1', 'alumno@email.com', '$2b$10$Zfjew4nsyIgb/5obd3xeGuLjlp9MtWYfAyYCnlyfVgXk3CRYo2X5K', 'STUDENT']);

      await this.query(`
        INSERT INTO students (id, user_id, name, lastname, dni) 
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (dni) DO NOTHING
      `, ['default-student-1', 'default-user-student-1', 'Alumno', 'Por Defecto', '12345678']);

      await this.query(`
        INSERT INTO users (id, username, password_hash, role) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (username) DO NOTHING
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

            await this.query(`
                INSERT INTO courses (id, name, teacher_id) 
                VALUES ($1, $2, $3)
                ON CONFLICT (name) DO NOTHING
            `, ['default-course-1', 'Curso A', 'default-teacher-1']);

            //Asignar alumno al curso
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
