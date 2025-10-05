import { StudentRepository, User, StudentData } from '../../src/core/infrastructure/StudentRepository';

export class MockStudentRepository implements StudentRepository {
  private users: User[] = [];
  private students: StudentData[] = [];

  constructor(users: User[] = []) {
    this.users = users;
  }

  async findByUserName(userName: string): Promise<User | null> {
    const user = this.users.find(u => u.username === userName);
    return user || null;
  }

  async addStudent(studentData: StudentData): Promise<void> {
    this.students.push(studentData);
    this.users.push({
      id: studentData.id,
      username: studentData.username,
      password: studentData.password,
      dni: studentData.dni,
      role: 'STUDENT'
    });
  }

  addUser(user: User): void {
    this.users.push(user);
  }

  clearUsers(): void {
    this.users = [];
    this.students = [];
  }

  getAllStudents(): StudentData[] {
    return [...this.students];
  }
}
