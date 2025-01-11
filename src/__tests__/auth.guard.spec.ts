import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../app/services/auth.guard.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('@nestjs/config', () => ({
    ConfigService: jest.fn().mockImplementation(() => ({
        get: jest.fn(),
    })),
}));

describe('AuthGuard', () => {
    let guard: AuthGuard;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthGuard, ConfigService],
        }).compile();

        guard = module.get<AuthGuard>(AuthGuard);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should allow access if token matches secret', async () => {
        // Mock do retorno do segredo configurado
        jest.spyOn(configService, 'get').mockReturnValue('testsecret');
        const mockExecutionContext = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({
                    headers: { authorization: 'Bearer testsecret' },
                }),
            }),
        };

        const result = await guard.canActivate(mockExecutionContext as any);

        // Assegura que a resposta seja permitida
        expect(result).toBeTruthy();
    });

    it('should deny access if token does not match secret', async () => {
        jest.spyOn(configService, 'get').mockReturnValue('testsecret');
        const mockExecutionContext = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({
                    headers: { authorization: 'Bearer wrongtoken' },
                }),
            }),
        };

        // Verifica que uma exceção é lançada quando o token não corresponde ao segredo
        await expect(guard.canActivate(mockExecutionContext as any)).rejects.toThrow(UnauthorizedException);
    });

    it('should deny access if no token is provided', async () => {
        const mockExecutionContext = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({ headers: {} }), // Nenhum header 'authorization'
            }),
        };

        // Verifica que uma exceção é lançada quando não há token
        await expect(guard.canActivate(mockExecutionContext as any)).rejects.toThrow(UnauthorizedException);
    });
});
