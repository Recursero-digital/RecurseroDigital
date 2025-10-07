import { StudentRepository } from '../core/infrastructure/StudentRepository';
import { StudentEntity } from './entities/StudentEntity';
import {Student} from "../core/models/Student";

export class InMemoryStudentRepository implements StudentRepository {
  private students: StudentEntity[] = [];

  constructor() {
    this.students = [
        new StudentEntity(
            '1',
            'nico@gmail.com',
            '$2b$10$T9xOluqoDwlRMZ/LeIdsL.MUagpZUkBOtq.ZR95Bp98tbYCr/yKr6', // hash de 'Recursero2025!'
            'Nicolás',
            'García',
            '12345678'
        )
    ];
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

  async clearStudents(): Promise<void> {
    this.students = [];
  }
}
