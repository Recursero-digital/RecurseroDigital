import { CourseRepository } from '../core/infrastructure/CourseRepository';
import {Course} from "@/core/models/Course";

export class InMemoryCourseRepository implements CourseRepository {
  private courses: Course[] = [];

  constructor() {
    // Curso de prueba:
    // this.courses = [
    //   {
    //       id: '1',
    //       name: 'A',
    //       teacher_id: '$2b$10$pxoWnWCOR5f5tWmjlemzSuye0zX3R8BNFv4n80.F.0nh7hYKWMFYni', // Hash de 'abcd1234'
    //       students: ['1']
    //   }
    // ];
  }

  async findByCourseName(courseName: string): Promise<Course | null> {
    const course = this.courses.find(c => c.name === courseName);
    return course || null;
  }

  async addCourse(user: Course): Promise<void> {
    this.courses.push(user);
  }

  async getAllCourses(): Promise<Course[]> {
    return [...this.courses];
  }

  async clearCourses(): Promise<void> {
    this.courses = [];
  }
}
