
export class StudentEntity {
    id: string;
    userId: string;
    username: string;
    passwordHash: string;
    name: string;
    lastname: string;
    dni: String;

    constructor(
        id: string,
        userId: string,
        username: string,
        passwordHash: string,
        name: string,
        lastname: string,
        dni: String
    ) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.lastname = lastname;
        this.dni = dni;
        this.username = username;
        this.passwordHash = passwordHash;
    }
}
