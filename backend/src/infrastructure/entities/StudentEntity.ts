
export class StudentEntity {
    id: string;
    userId: string;
    username: string;
    passwordHash: string;
    name: string;
    lastname: string;
    dni: string;
    courseId: string | null;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: string,
        userId: string,
        username: string,
        passwordHash: string,
        name: string,
        lastname: string,
        dni: string,
        courseId: string | null = null,
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.lastname = lastname;
        this.dni = dni;
        this.username = username;
        this.passwordHash = passwordHash;
        this.courseId = courseId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
