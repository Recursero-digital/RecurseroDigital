import {Course} from "@/core/models/Course";

export interface CourseRepository {
    findByCourseName(courseName: string): Promise<Course | null>;
    addCourse(courseData: Course): Promise<void>;
}