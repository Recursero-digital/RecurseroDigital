import {Teacher} from "../models/Teacher";

export interface TeacherRepository {
    findByUserName(userName: string): Promise<Teacher | null>;
    addTeacher(teacherData: Teacher): Promise<void>;
    getAllTeachers(): Promise<Teacher[]>;
    findById(id: string): Promise<Teacher | null>;
    updateTeacher(teacherData: Teacher): Promise<void>;
    deleteTeacher(id: string): Promise<void>; // Baja lógica: marca enable = false
    enableTeacher(id: string): Promise<void>; // Reactiva: marca enable = true
}