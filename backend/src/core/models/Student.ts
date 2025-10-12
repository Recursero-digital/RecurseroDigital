import { User, UserRole } from './User';

export class Student {
    id: string;
    name: string;
    lastname: string;
    dni: string;
    user: User;

    constructor(
        id: string,
        name: string,
        lastname: string,
        dni: string,
        user: User
    ) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.dni = dni;
        this.user = user;
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
}
