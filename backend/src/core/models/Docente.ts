import { Usuario } from './Usuario';

export class Docente extends Usuario {

    constructor(
        id: string, 
        name: string,
        email: string, 
        passwordHash: string
    ) {
        super(id, name, email, passwordHash);

    }
}
