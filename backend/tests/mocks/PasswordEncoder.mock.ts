import { PasswordEncoder } from '../../src/core/infrastructure/PasswordEncoder';

export class MockPasswordEncoder implements PasswordEncoder {
  private passwordMap: Map<string, string> = new Map();

  async encode(password: string): Promise<string> {
    const hashedPassword = `hashed_${password}`;
    this.passwordMap.set(password, hashedPassword);
    return hashedPassword;
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    // Simular comparación de contraseñas
    const expectedHash = this.passwordMap.get(password);
    return expectedHash === hashedPassword;
  }

  // Métodos auxiliares para testing
  setPasswordMatch(password: string, hashedPassword: string): void {
    this.passwordMap.set(password, hashedPassword);
  }

  clearPasswords(): void {
    this.passwordMap.clear();
  }
}
