export interface User {
    id: string;
    username: string;
    password: string;
    dni: string;
    role: string;
}

export interface StudentData {
    id: string;
    username: string;
    password: string;
    name: string;
    lastname: string;
    dni: string;
    role: string
}

export interface StudentRepository {
    findByUserName(userName: string): Promise<User | null>;
    addStudent(studentData: StudentData): Promise<void>;
}