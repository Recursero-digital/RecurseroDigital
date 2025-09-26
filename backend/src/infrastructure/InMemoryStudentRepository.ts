import { StudentRepository, User } from '../core/infrastructure/StudentRepository';

export class InMemoryStudentRepository implements StudentRepository {
  private students: User[] = [];

  constructor() {
    // Usuario de prueba: alumno con password abcd1234
    this.students = [
        {
            id: '1',
            username: 'nico@gmail.com',
            password: '$2b$10$T9xOluqoDwlRMZ/LeIdsL.MUagpZUkBOtq.ZR95Bp98tbYCr/yKr6', // hash de 'Recursero2025!'
            role: 'alumno'
        }
    ];
  }

  async findByUserName(userName: string): Promise<User | null> {
    const user = this.students.find(u => u.username === userName);
    return user || null;
  }

  // Métodos auxiliares para testing y administración
  async addUser(user: User): Promise<void> {
    this.students.push(user);
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.students];
  }

  async clearUsers(): Promise<void> {
    this.students = [];
  }
}
