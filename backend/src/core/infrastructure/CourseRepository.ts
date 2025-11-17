import { Course } from '../models/Course';
import { CourseGame } from '../models/CourseGame';


export interface CourseRepository {
    findByCourseName(courseName: string): Promise<Course | null>;
    addCourse(courseData: Course): Promise<void>;
    getAllCourses(): Promise<Course[]>;
    findById(id: string): Promise<Course | null>;
    getEnabledGamesByCourseId(courseId: string): Promise<CourseGame[]>;
    addGameToCourse(courseGameId: string, courseId: string, gameId: string): Promise<void>;
    createCourse(name: string, teacherId?: string): Promise<Course>;
    assignTeacherToCourse(teacherId: string, courseId: string): Promise<void>;
    getCoursesByTeacherId(teacherId: string): Promise<Course[]>;
    updateCourse(course: Course): Promise<void>;
    deleteCourse(id: string): Promise<void>;
}