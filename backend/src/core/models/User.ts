export class User {
    id: string;
    username: string;
    role: string;
    passwordHash: string;

    constructor(id: string, username: string, passwordHash: string, role: string) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.passwordHash = passwordHash;
    }
}