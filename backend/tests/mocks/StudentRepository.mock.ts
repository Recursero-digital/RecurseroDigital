import { StudentRepository } from '../../src/core/infrastructure/StudentRepository';
import {Student} from "../../src/core/models/Student";
import {StudentEntity} from "../../src/infrastructure/entities/StudentEntity";
import { User, UserRole } from '../../src/core/models/User';

export class MockStudentRepository implements StudentRepository {
  private students: StudentEntity[];

  constructor(students: StudentEntity[] = []) {
    this.students = students;
  }

  async findByUserName(userName: string): Promise<Student | null> {
      const student = this.students.find(u => u.username === userName);
      if(student) {
          const user = new User(
              student.userId,
              student.username,
              student.passwordHash,
              UserRole.STUDENT
          );
          return new Student(
              student.id,
              student.name,
              student.lastname,
              student.dni,
              user
          );
      }
      return null;
  }

  async addStudent(studentData: Student): Promise<void> {
      const studentEntity = new StudentEntity(
          studentData.id,
          studentData.user.id,
          studentData.user.username,
          studentData.user.passwordHash,
          studentData.name,
          studentData.lastname,
          studentData.dni
      );
      this.students.push(studentEntity);
  }

  async getAllStudents(): Promise<Student[]> {
    return this.students.map(student => {
      const user = new User(
        student.userId,
        student.username,
        student.passwordHash,
        UserRole.STUDENT
      );
      return new Student(
        student.id,
        student.name,
        student.lastname,
        student.dni,
        user
      );
    });
  }

  async findById(id: string): Promise<Student | null> {
    const student = this.students.find(s => s.id === id);
    if (student) {
      const user = new User(
        student.userId,
        student.username,
        student.passwordHash,
        UserRole.STUDENT
      );
      return new Student(
        student.id,
        student.name,
        student.lastname,
        student.dni,
        user
      );
    }
    return null;
  }

  async updateStudent(studentData: Student): Promise<void> {
    const index = this.students.findIndex(s => s.id === studentData.id);
    if (index !== -1) {
      this.students[index] = new StudentEntity(
        studentData.id,
        studentData.user.id,
        studentData.user.username,
        studentData.user.passwordHash,
        studentData.name,
        studentData.lastname,
        studentData.dni
      );
    }
  }

  async deleteStudent(id: string): Promise<void> {
    const index = this.students.findIndex(s => s.id === id);
    if (index !== -1) {
      this.students.splice(index, 1);
    }
  }

  clearStudents(): void {
    this.students = [];
  }

  addUser(user: User): void {
    const studentEntity = new StudentEntity(
      '1',
      user.id,
      user.username,
      user.passwordHash,
      'Test',
      'User',
      '12345678'
    );
    this.students.push(studentEntity);
  }
}
