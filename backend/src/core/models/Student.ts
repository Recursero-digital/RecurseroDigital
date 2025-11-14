import { User, UserRole } from './User';

export class Student {
    id: string;
    name: string;
    lastname: string;
    dni: string;
    courseId: string | null;
    user: User;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: string,
        name: string,
        lastname: string,
        dni: string,
        courseId: string | null,
        user: User,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.dni = dni;
        this.courseId = courseId;
        this.user = user;
        this.createdAt = createdAt ?? new Date();
        this.updatedAt = updatedAt ?? new Date();
    }

    getUsername(): string {
        return this.user.username;
    }

    getPasswordHash(): string {
        return this.user.passwordHash;
    }

    getRole(): UserRole {
        return this.user.role;
    }

    getCourseId(): string | null {
        return this.courseId;
    }
}
