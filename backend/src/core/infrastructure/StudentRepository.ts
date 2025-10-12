import {Student} from "../models/Student";

export interface StudentRepository {
    findByUserName(userName: string): Promise<Student | null>;
    addStudent(studentData: Student): Promise<void>;
    getAllStudents(): Promise<Student[]>;
    findById(id: string): Promise<Student | null>;
    updateStudent(studentData: Student): Promise<void>;
    deleteStudent(id: string): Promise<void>;
}