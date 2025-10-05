import {Student} from "../models/Student";

export interface StudentRepository {
    findByUserName(userName: string): Promise<Student | null>;
    addStudent(studentData: Student): Promise<void>;
}