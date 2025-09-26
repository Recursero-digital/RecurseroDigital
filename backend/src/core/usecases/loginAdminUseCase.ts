import { InvalidCredentials } from '../models/exceptions/InvalidCredentials';
import { AdminRepository, User } from '../infrastructure/AdminRepository';
import { PasswordEncoder } from '../infrastructure/PasswordEncoder';
import { TokenService } from '../infrastructure/TokenService';

export class LoginAdminUseCase {
    private adminRepository: AdminRepository;
    private passwordEncoder: PasswordEncoder;
    private tokenService: TokenService;

    constructor(
        adminRepository: AdminRepository,
        passwordEncoder: PasswordEncoder,
        tokenService: TokenService
    ) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    async execute(userName: string, password: string): Promise<string> {
        const user = await this.adminRepository.findByUserName(userName);
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