import { CourseRepository } from '../core/infrastructure/CourseRepository';
import {Course} from "@/core/models/Course";
import { CourseGame } from '../core/models/CourseGame';

export class InMemoryCourseRepository implements CourseRepository {
  private courses: Course[] = [];
  private courseGames: { [courseId: string]: Set<string> } = {};

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

  async findById(id: string): Promise<Course | null> {
    const course = this.courses.find(c => c.id === id);
    return course || null;
  }

  //TO-DO: VER CON TIN
  async getEnabledGamesByCourseId(courseId: string): Promise<CourseGame[]> {
    // Para el repositorio en memoria, retornamos un array vacío por ahora
    // En un entorno real, aquí tendríamos datos mock o una estructura diferente
    return [];
  }

  async addGameToCourse(courseId: string, gameId: string): Promise<void> {
    if (!this.courseGames[courseId]) {
      this.courseGames[courseId] = new Set<string>();
    }
    this.courseGames[courseId].add(gameId);
  }

}
