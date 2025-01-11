import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly configService: ConfigService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authorizationHeader = request.headers['authorization'];

        if (!authorizationHeader) {
            throw new UnauthorizedException('Authorization header missing');
        }

        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Token missing');
        }

        const secret = this.configService.get<string>('JWT_SECRET');
        if (!secret) {
            throw new UnauthorizedException('JWT secret not configured');
        }

        if (token !== secret) {
            console.error('JWT verification error: Token does not match the configured secret');
            throw new UnauthorizedException('Invalid token');
        }

        return true;
    }
}
