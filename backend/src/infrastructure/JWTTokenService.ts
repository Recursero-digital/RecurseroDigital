import jwt from 'jsonwebtoken';
import { TokenService } from '../core/infrastructure/TokenService';

export class JWTTokenService implements TokenService {
  private readonly secretKey: string;
  private readonly expiresIn: string;

  constructor(secretKey: string = 'your-secret-key', expiresIn: string = '1h') {
    this.secretKey = secretKey;
    this.expiresIn = expiresIn;
  }

  generate(payload: object): string {
    return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn } as jwt.SignOptions);
  }

  verify(token: string): object | null {
    try {
      return jwt.verify(token, this.secretKey) as object;
    } catch (error) {
      return null;
    }
  }
}
