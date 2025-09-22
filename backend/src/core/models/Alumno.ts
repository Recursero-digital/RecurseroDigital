import { Usuario } from './Usuario';

export class Alumno extends Usuario {
    matricula: string;
    carrera: string;
    semestre: number;

    constructor(
        id: string, 
        nombre: string, 
        email: string, 
        passwordHash: string,
        matricula: string,
        carrera: string,
        semestre: number
    ) {
        super(id, nombre, email, passwordHash);
        this.matricula = matricula;
        this.carrera = carrera;
        this.semestre = semestre;
    }
}
