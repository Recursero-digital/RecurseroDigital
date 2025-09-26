import { AdminRepository, User } from '../core/infrastructure/AdminRepository';

export class InMemoryAdminRepository implements AdminRepository {
  private admins: User[] = [];

  constructor() {
    // Usuario de prueba: admin con password abcd1234
    this.admins = [
        {
            id: '2',
            username: 'julian',
            password: '$2b$10$T9xOluqoDwlRMZ/LeIdsL.MUagpZUkBOtq.ZR95Bp98tbYCr/yKr6', // hash de 'Recursero2025!'
            role: 'admin'
        }
    ];
  }

  async findByUserName(userName: string): Promise<User | null> {
    const user = this.admins.find(u => u.username === userName);
    return user || null;
  }

  // Métodos auxiliares para testing y administración
  async addUser(user: User): Promise<void> {
    this.admins.push(user);
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.admins];
  }

  async clearUsers(): Promise<void> {
    this.admins = [];
  }
}
