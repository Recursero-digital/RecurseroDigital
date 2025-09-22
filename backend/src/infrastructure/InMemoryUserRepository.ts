import { UserRepository, User } from '../core/infrastructure/UserRepository';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  constructor() {
    // Usuario de prueba: admin con password abcd1234
    this.users = [
      {
        id: '1',
        username: 'admin',
        password: '$2b$10$pxoWnWCOR5f5tWmjLemzSuyeDzx3R8NFv4n80.F.Onh7hYKWMFYni', // hash de 'abcd1234'
        role: 'admin'
      }
    ];
  }

  async findByUserName(userName: string): Promise<User | null> {
    const user = this.users.find(u => u.username === userName);
    return user || null;
  }

  // Métodos auxiliares para testing y administración
  async addUser(user: User): Promise<void> {
    this.users.push(user);
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }

  async clearUsers(): Promise<void> {
    this.users = [];
  }
}
