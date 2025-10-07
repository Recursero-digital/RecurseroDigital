import { StudentRepository } from '../../src/core/infrastructure/StudentRepository';
import {Student} from "../../src/core/models/Student";
import {StudentEntity} from "../../src/infrastructure/entities/StudentEntity";
import { User } from '../../src/core/models/User';

export class MockStudentRepository implements StudentRepository {
  private students: StudentEntity[];

  constructor(students: StudentEntity[] = []) {
    this.students = students;
  }

  async findByUserName(userName: string): Promise<Student | null> {
      const student = this.students.find(u => u.username === userName);
      if(student) {
          return new Student(
              student.id,
              student.username,
              student.passwordHash,
              student.name,
              student.lastname,
              student.dni
          );
      }
      return null;
  }

  async addStudent(studentData: Student): Promise<void> {
      const studentEntity = new StudentEntity(
          studentData.id,
          studentData.username,
          studentData.passwordHash,
          studentData.name,
          studentData.lastname,
          studentData.dni
      );
      this.students.push(studentEntity);
  }

  clearStudents(): void {
    this.students = [];
  }

  addUser(user: User): void {
    const studentEntity = new StudentEntity(
      user.id,
      user.username,
      user.passwordHash,
      'Test',
      'User',
      '12345678'
    );
    this.students.push(studentEntity);
  }

  getAllStudents(): Student[] {
    return this.students.map(student => new Student(
        student.id,
        student.username,
        student.passwordHash,
        student.name,
        student.lastname,
        student.dni
    ));
  }
}
