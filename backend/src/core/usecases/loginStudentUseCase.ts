import { InvalidCredentials } from '../models/exceptions/InvalidCredentials';
import { StudentRepository, User } from '../infrastructure/StudentRepository';
import { PasswordEncoder } from '../infrastructure/PasswordEncoder';
import { TokenService } from '../infrastructure/TokenService';

export class LoginStudentUseCase {
    private studentRepository: StudentRepository;
    private passwordEncoder: PasswordEncoder;
    private tokenService: TokenService;

    constructor(
        studentRepository: StudentRepository,
        passwordEncoder: PasswordEncoder,
        tokenService: TokenService
    ) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    async execute(userName: string, password: string): Promise<string> {
        const user = await this.studentRepository.findByUserName(userName);
        if (!user || !(await this.passwordEncoder.compare(password, user.password))) {
            throw new InvalidCredentials();
        }
        return this.tokenService.generate({
            id: user.id,
            username: user.username,
            role: user.role
        });
    }
}