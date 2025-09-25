import { InvalidCredentials } from '../models/exceptions/InvalidCredentials';
import { TeacherRepository, User } from '../infrastructure/TeacherRepository';
import { PasswordEncoder } from '../infrastructure/PasswordEncoder';
import { TokenService } from '../infrastructure/TokenService';

export class LoginTeacherUseCase {
    private teacherRepository: TeacherRepository;
    private passwordEncoder: PasswordEncoder;
    private tokenService: TokenService;

    constructor(
        teacherRepository: TeacherRepository,
        passwordEncoder: PasswordEncoder,
        tokenService: TokenService
    ) {
        this.teacherRepository = teacherRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    async execute(userName: string, password: string): Promise<string> {
        const user = await this.teacherRepository.findByUserName(userName);
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