import { User } from './User';

export class Student extends User {

    name: string;
    lastname: string;
    dni: String;

    constructor(
        id: string, 
        username: string,
        passwordHash: string,
        name: string,
        lastname: string,
        dni: String
    ) {
        super(id, username, passwordHash, 'STUDENT');
        this.name = name;
        this.lastname = lastname;
        this.dni = dni;
    }
}
