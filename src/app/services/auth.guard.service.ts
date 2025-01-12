import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { logger } from '../communs/logger.winston';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private configService: ConfigService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authorizationHeader = request.headers['authorization'];

        if (!authorizationHeader) {
            logger.error(`Authorization header missing: ${JSON.stringify(authorizationHeader)}`);
            throw new UnauthorizedException('Authorization header missing');
        }

        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            logger.error(`Token missing: ${JSON.stringify(token)}`);
            throw new UnauthorizedException('Token missing');
        }

        const secret = this.configService.get<string>('JWT_SECRET');
        if (!secret) {
            logger.error(`JWT secret not configured: ${JSON.stringify(secret)}`);
            throw new UnauthorizedException('JWT secret not configured');
        }

        if (token !== secret) {
            console.error('JWT verification error: Token does not match the configured secret');
            logger.error(`Token does not match the configured secretr: ${JSON.stringify(token)}, secret: ${JSON.stringify(secret)}`);
            throw new UnauthorizedException('Invalid token');
        }

        return true;
    }
}
