import { Usuario } from './Usuario';

export class Admin extends Usuario {
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
