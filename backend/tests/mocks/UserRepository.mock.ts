import { TeacherRepository } from '../../src/core/infrastructure/TeacherRepository';
import { Teacher } from '../../src/core/models/Teacher';
import { User } from '../../src/core/models/User';

export class MockUserRepository implements TeacherRepository {
  private teachers: Teacher[] = [];

  constructor(teachers: Teacher[] = []) {
    this.teachers = teachers;
  }

  async findByUserName(userName: string): Promise<Teacher | null> {
    const teacher = this.teachers.find(t => t.user.username === userName);
    return teacher || null;
  }

  async addTeacher(teacherData: Teacher): Promise<void> {
    this.teachers.push(teacherData);
  }

  async getAllTeachers(): Promise<Teacher[]> {
    return [...this.teachers];
  }

  async findById(id: string): Promise<Teacher | null> {
    const teacher = this.teachers.find(t => t.id === id);
    return teacher || null;
  }

  async updateTeacher(teacherData: Teacher): Promise<void> {
    const index = this.teachers.findIndex(t => t.id === teacherData.id);
    if (index !== -1) {
      this.teachers[index] = teacherData;
    }
  }

  async deleteTeacher(id: string): Promise<void> {
    const index = this.teachers.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Profesor no encontrado');
    }
    // En memoria simplemente removemos (comportamiento legacy para tests)
    this.teachers.splice(index, 1);
  }

  async enableTeacher(id: string): Promise<void> {
    const index = this.teachers.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Profesor no encontrado');
    }
    // En memoria no hay columna enable, por lo que no hacemos nada adicional
  }

  addUser(user: User): void {
    const teacher = new Teacher('1', 'Test', 'Teacher', user.username, user);
    this.teachers.push(teacher);
  }

  clearTeachers(): void {
    this.teachers = [];
  }
}
