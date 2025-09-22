import { Usuario } from './Usuario';

export class Docente extends Usuario {
    especialidad: string;
    departamento: string;

    constructor(
        id: string, 
        nombre: string, 
        email: string, 
        passwordHash: string,
        especialidad: string,
        departamento: string
    ) {
        super(id, nombre, email, passwordHash);
        this.especialidad = especialidad;
        this.departamento = departamento;
    }
}
