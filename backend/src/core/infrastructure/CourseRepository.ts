import {Course} from "@/core/models/Course";
import {CourseGame} from "@/core/models/CourseGame";


export interface CourseRepository {
    findByCourseName(courseName: string): Promise<Course | null>;
    addCourse(courseData: Course): Promise<void>;
    getAllCourses(): Promise<Course[]>;
    findById(id: string): Promise<Course | null>;
    getEnabledGamesByCourseId(courseId: string): Promise<CourseGame[]>;
    addGameToCourse(courseId: string, gameId: string): Promise<void>;
    createCourse(name: string, teacherId?: string): Promise<Course>;
}