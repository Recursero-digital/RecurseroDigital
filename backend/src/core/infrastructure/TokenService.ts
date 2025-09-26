export interface TokenService {
    generate(payload: object): string;
    verify(token: string): object | null;
}