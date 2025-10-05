import { User } from './User';

export class Teacher extends User {
    name: string;
    surname: string;
    email: string;

    constructor(
        id: string, 
        userName: string,
        email: string, 
        passwordHash: string,
        name: string,
        surname: string
    ) {
        super(id, userName, passwordHash, 'TEACHER');
        this.name = name;
        this.surname = surname;
        this.email = email;
    }
}
