import { InvalidCredentials } from '../models/exceptions/InvalidCredentials';
import { UserRepository, User } from '../infrastructure/UserRepository';
import { PasswordEncoder } from '../infrastructure/PasswordEncoder';
import { TokenService } from '../infrastructure/TokenService';

export class LoginUseCase {
    private userRepository: UserRepository;
    private passwordEncoder: PasswordEncoder;
    private tokenService: TokenService;

    constructor(
        userRepository: UserRepository,
        passwordEncoder: PasswordEncoder,
        tokenService: TokenService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    async execute(userName: string, password: string): Promise<string> {
        const user = await this.userRepository.findByUserName(userName);
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