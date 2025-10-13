import { StudentRepository } from '../core/infrastructure/StudentRepository';
import { StudentEntity } from './entities/StudentEntity';
import {Student} from "../core/models/Student";
import {User, UserRole} from "../core/models/User";

export class InMemoryStudentRepository implements StudentRepository {
  private students: StudentEntity[] = [];

  constructor() {
    this.students = [
        new StudentEntity(
            '1',
            '1', // user_id
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

  async clearStudents(): Promise<void> {
    this.students = [];
  }
}
