import { UserRepository, User } from '../../src/core/infrastructure/UserRepository';

export class MockUserRepository implements UserRepository {
  private users: User[] = [];

  constructor(users: User[] = []) {
    this.users = users;
  }

  async findByUserName(userName: string): Promise<User | null> {
    const user = this.users.find(u => u.username === userName);
    return user || null;
  }

  // Métodos auxiliares para testing
  addUser(user: User): void {
    this.users.push(user);
  }

  clearUsers(): void {
    this.users = [];
  }

  getAllUsers(): User[] {
    return [...this.users];
  }
}
