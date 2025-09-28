import { StudentRepository, User, StudentData } from '../core/infrastructure/StudentRepository';

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

  async addStudent(studentData: StudentData): Promise<void> {
    this.students.push({
      id: studentData.id,
      username: studentData.username,
      password: studentData.password,
      role: 'STUDENT'
    });
  }
}
