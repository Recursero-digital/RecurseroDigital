export interface User {
    id: string;
    username: string;
    password: string;
    role: string;
}

export interface StudentRepository {
    findByUserName(userName: string): Promise<User | null>;
}