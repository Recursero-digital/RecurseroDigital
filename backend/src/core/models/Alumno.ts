import { Usuario } from './Usuario';

export class Alumno extends Usuario {

    constructor(
        id: string, 
        name: string,
        email: string, 
        passwordHash: string
    ) {
        super(id, name, email, passwordHash);
    }
}
