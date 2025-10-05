import { User } from './User';

export class Admin extends User {
    nivelAcceso: number;
    permisos: string[];

    constructor(
        id: string, 
        nombre: string, 
        email: string, 
        passwordHash: string,
        nivelAcceso: number,
        permisos: string[] = []
    ) {
        super(id, nombre, email, passwordHash);
        this.nivelAcceso = nivelAcceso;
        this.permisos = permisos;
    }
}
