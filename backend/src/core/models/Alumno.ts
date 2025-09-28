import { Usuario } from './Usuario';

export class Alumno extends Usuario {

    name: string;
    surname: string;

    constructor(
        id: string, 
        username: string,
        passwordHash: string,
        name: string,
        surname: string
    ) {
        super(id, username, passwordHash, 'STUDENT');
        this.name = name;
        this.surname = surname;
    }
}
