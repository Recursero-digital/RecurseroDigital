export class Usuario {
    id: string;
    nombre: string;
    email: string;
    passwordHash: string;

    constructor(id: string, nombre: string, email: string, passwordHash: string) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.passwordHash = passwordHash;
    }
}