import { LoginTeacherUseCase } from '../../../src/core/usecases/./loginTeacherUseCase';
import { InvalidCredentials } from '../../../src/core/models/exceptions/InvalidCredentials';
import { MockUserRepository } from '../../mocks/UserRepository.mock';
import { MockPasswordEncoder } from '../../mocks/PasswordEncoder.mock';
import { MockTokenService } from '../../mocks/TokenService.mock';
import { User } from '../../../src/core/infrastructure/TeacherRepository';

describe('LoginTeacherUseCase', () => {
  let loginUseCase: LoginTeacherUseCase;
  let mockUserRepository: MockUserRepository;
  let mockPasswordEncoder: MockPasswordEncoder;
  let mockTokenService: MockTokenService;

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    mockPasswordEncoder = new MockPasswordEncoder();
    mockTokenService = new MockTokenService();
    
    loginUseCase = new LoginTeacherUseCase(
      mockUserRepository,
      mockPasswordEncoder,
      mockTokenService
    );
  });

  afterEach(() => {
    mockUserRepository.clearUsers();
    mockPasswordEncoder.clearPasswords();
    mockTokenService.reset();
  });

  describe('execute', () => {
    it('debe lanzar InvalidCredentials cuando no encuentra usuario en la DB', async () => {
      const userName = 'usuario_inexistente';
      const password = 'password123';

      await expect(loginUseCase.execute(userName, password))
        .rejects
        .toThrow(InvalidCredentials);
    });

    it('debe lanzar InvalidCredentials cuando encuentra usuario pero la contraseña no coincide', async () => {
      // Arrange
      const user: User = {
        id: '1',
        username: 'testuser',
        password: 'hashed_correct_password',
        role: 'user'
      };
      
      mockUserRepository.addUser(user);
      mockPasswordEncoder.setPasswordMatch('correct_password', 'hashed_correct_password');
      
      const userName = 'testuser';
      const wrongPassword = 'wrong_password';

      await expect(loginUseCase.execute(userName, wrongPassword))
        .rejects
        .toThrow(InvalidCredentials);
    });

    it('debe retornar un token cuando encuentra usuario y la contraseña coincide', async () => {
      const user: User = {
        id: '1',
        username: 'testuser',
        password: 'hashed_correct_password',
        role: 'user'
      };
      
      mockUserRepository.addUser(user);
      mockPasswordEncoder.setPasswordMatch('correct_password', 'hashed_correct_password');
      
      const userName = 'testuser';
      const password = 'correct_password';

      const result = await loginUseCase.execute(userName, password);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('mock_token_');
    });
  });
});
