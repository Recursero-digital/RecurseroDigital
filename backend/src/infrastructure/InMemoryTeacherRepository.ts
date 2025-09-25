import { TeacherRepository, User } from '../core/infrastructure/TeacherRepository';

export class InMemoryTeacherRepository implements TeacherRepository {
  private teachers: User[] = [];

  constructor() {
    // Usuario de prueba: admin con password abcd1234
    this.teachers = [
      {
        id: '1',
        username: 'Mariana',
        password: '$2b$10$pxoWnWCOR5f5tWmjLemzSuyeDzx3R8NFv4n80.F.Onh7hYKWMFYni', // hash de 'abcd1234'
        role: 'docente'
      }
    ];
  }

  async findByUserName(userName: string): Promise<User | null> {
    const user = this.teachers.find(u => u.username === userName);
    return user || null;
  }

  // Métodos auxiliares para testing y administración
  async addUser(user: User): Promise<void> {
    this.teachers.push(user);
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.teachers];
  }

  async clearUsers(): Promise<void> {
    this.teachers = [];
  }
}
